import { NextRequest, NextResponse } from 'next/server';
import { getSchedulesByRunSlot, saveNewContentFromSchedules } from '@/lib/db/content';
import { nanoid } from 'nanoid';

// --- Type Definitions ---
interface Context {
  params: {
    time: 'early' | 'later';
  };
}

const API_ENDPOINT = 'http://localhost:3000/api/schedule';

export async function GET(request: NextRequest, context: Context) {
  const { time } = await context.params;

  const authHeader = await request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  // if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
  //   return new NextResponse('Unauthorized: Invalid CRON_SECRET', { status: 401 });
  // }

  if (time !== 'early' && time !== 'later') {
    return new NextResponse(`Invalid time parameter: ${time}`, { status: 400 });
  }

  try {
    const schedulesToRun = await getSchedulesByRunSlot(time);

    if (schedulesToRun.length === 0) {
      return NextResponse.json({ success: true, message: `No tasks found for ${time}.` });
    }

    const results = [];

    for (const task of schedulesToRun) {
      try {
        const formData = new FormData();

        const content_id = nanoid();
        const sessionId = nanoid();

        formData.append('prompt', JSON.stringify(task.prompt));
        formData.append('tone', JSON.stringify(task.tone));
        formData.append('url', JSON.stringify(task.urls));
        formData.append('user_id', JSON.stringify(task.user_id));

        await saveNewContentFromSchedules(content_id, task.user_id, '', task.prompt);

        const response = await fetch(`${API_ENDPOINT}/${content_id}/${sessionId}`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
        }
      } catch (e) {
        // Handle individual task failure
        console.error(`Task ${task.id} failed:`, e);
        // await db.collection('schedules').doc(task.id).update({ status: 'failed', error: e.message });

        results.push({
          taskId: task.id,
          status: 'failed',
          error: e instanceof Error ? e.message : 'Unknown error',
        });
      }
    }

    return NextResponse.json(
      {
        success: true,
        timeSlot: time,
        processedCount: results.length,
        results: results,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(`Fatal error in GET handler for ${time}:`, error);
    return new NextResponse('Internal Server Error during processing.', { status: 500 });
  }
}
