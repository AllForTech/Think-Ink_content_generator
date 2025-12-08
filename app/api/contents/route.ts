import { NextRequest, NextResponse } from 'next/server';
import { fetchContentsFromDB } from '@/lib/db/content';

export const runtime = 'nodejs';


const API_KEY = process.env.EXTERNAL_API_KEY;

export async function GET(request: NextRequest) {
  try {
    const apiKey = request.headers.get('x-api-key');

    // if (!API_KEY || apiKey !== API_KEY) {
    //   return NextResponse.json(
    //     { error: 'Unauthorized: Invalid or missing API Key' },
    //     { status: 401 }
    //   );
    // }


    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit'));
    const versions = parseInt(searchParams.get('versions'));
    const authorID = searchParams.get('author_id');

    // Ensure limit is a positive number
    const safeLimit = Math.max(1, limit);
    // Ensure versions is a non-negative number
    const safeVersions = Math.max(0, versions);
    
    const contentData = await fetchContentsFromDB(safeLimit, safeVersions, authorID); 

    return NextResponse.json({
      success: true,
      count: contentData.length,
      data: contentData,
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}