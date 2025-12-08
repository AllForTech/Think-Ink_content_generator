import {
  pgTable,
  text,
  timestamp,
  jsonb,
  primaryKey,
  uuid,
  pgSchema,
  boolean,
} from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';

const authSchema = pgSchema('auth');
export const users = authSchema.table('users', {
  // We only need the ID column to create the foreign key reference
  id: uuid('id').primaryKey(),
  // You do not need to define all columns here, just the primary key!
});

export const contents = pgTable('contents', {
  // contentId: Primary key, UUID generated client-side
  contentId: text('content_id').notNull().primaryKey(),

  // author_id: Foreign key linking to the user who created the content (from Supabase Auth)
  authorId: text('author_id').notNull(),

  // created_at: Automatically tracks when the master record was first created
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),

  // content & prompt: The most recent version of the content and the prompt that generated it.
  // This is for quick display on the dashboard.
  content: text('content'),
  prompt: text('prompt'),
});

export const userSchedules = pgTable(
  'user_schedules',
  {
    jobId: text('job_id').notNull(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    cronSchedule: text('cron_schedule').notNull(),
    jobType: text('job_type').default('content_generation').notNull(),
    isActive: boolean('is_active').default(true),
    lastRunAt: timestamp('last_run_at', { withTimezone: true }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.jobType, t.jobId] }),
  }),
);

// Relations for 'contents'
// Establishes a one-to-many relationship: one master 'contents' record can have many 'userContents' versions.
export const contentsRelations = relations(contents, ({ many }) => ({
  versions: many(userContents),
}));

// --- 2. User Contents Table (Content Versions/History) ---
// This table holds the actual large data blobs, prompts, and specific versions of the content.
// It acts as a historical log of each generation session.
export const userContents = pgTable(
  'user_contents',
  {
    // sessionId: A unique identifier for a specific generation event.
    sessionId: text('session_id').notNull(),

    // content_id: Foreign key linking back to the 'contents' master record.
    contentId: text('content_id')
      .notNull()
      .references(() => contents.contentId, { onDelete: 'cascade' }), // Cascade deletion ensures versions are cleaned up.

    // author_id: User who created this specific version.
    authorId: text('author_id').notNull(),

    // created_at: Timestamp for when this specific version/session was created.
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),

    // The final generated content for this specific version.
    content: text('content'),

    // The prompt used to generate this version.
    prompt: text('prompt'),

    // Flexible storage for metadata captured during this generation session.
    attachedFile: jsonb('attached_file'),
    scrapedData: jsonb('scraped_data'),
    searchResults: jsonb('search_results'),
    images: jsonb('images'),
  },
  (table) => {
    // Composite primary key to uniquely identify a version by session, content, and author.
    return {
      pk: primaryKey({ columns: [table.sessionId, table.contentId, table.authorId] }),
    };
  },
);

export const apiKeys = pgTable("api_keys", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  
  // Storing the HASH of the API key (MANDATORY for security)
  keyHash: text("key_hash").notNull().unique(), 
  
  // Link back to the user who owns this key
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }), // Link to the user
  
  name: text("name").notNull(), // E.g., "Integration Key for Mobile App"
  isActive: boolean("is_active").default(true).notNull(),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastUsed: timestamp("last_used"),
});


// Relations for 'userContents'
export const userContentsRelations = relations(userContents, ({ one }) => ({
  // Defines the 'one' master content record this version belongs to.
  masterContent: one(contents, {
    fields: [userContents.contentId],
    references: [contents.contentId],
  }),
}));

export const apiKeysRelations = relations(apiKeys, ({ one }) => ({
  owner: one(users, {
    fields: [apiKeys.userId],
    references: [users.id],
  }),
}));
