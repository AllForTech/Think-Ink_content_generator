'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { db } from '@/db';
import { contents } from '@/drizzle/schema';
import { and, eq } from 'drizzle-orm';
import axios from 'axios';

export async function deleteContent(contentId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'User not authenticated' };
  }

  try {
    // With 'onDelete: cascade' in the schema, Drizzle will handle deleting related 'user_contents'.
    // We only need to delete the master record from the 'contents' table.
    const result = await db
      .delete(contents)
      .where(and(eq(contents.contentId, contentId), eq(contents.authorId, user.id)))
      .returning();

    if (result.length === 0) {
      return { error: 'Content not found or you do not have permission to delete it.' };
    }

    revalidatePath('/dashboard');
    return { success: 'Content deleted successfully.' };
  } catch (error) {
    console.error('Error deleting content with Drizzle:', error);
    return { error: 'Failed to delete content.' };
  }
}

export async function updateContent(contentId: string, newContent: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'User not authenticated' };
  }

  try {
    // Update the 'content' field in the 'contents' table where the ID and author match.
    const result = await db
      .update(contents)
      .set({
        content: newContent,
      })
      .where(and(eq(contents.contentId, contentId), eq(contents.authorId, user.id)))
      .returning();

    if (result.length === 0) {
      return { error: 'Content not found or you are not authorized to update it.' };
    }

    revalidatePath(`/dashboard/content/${contentId}`);
    revalidatePath('/dashboard');

    return { success: 'Content updated successfully.' };
  } catch (error) {
    console.error('Error updating content with Drizzle:', error);
    return { error: 'Failed to update content.' };
  }
}

export async function makeRequest(url: string, options: never) {

  try {
    return await axios.post(url, options);
  }catch (e) {
    console.log(e);
    throw e;
  }
}

