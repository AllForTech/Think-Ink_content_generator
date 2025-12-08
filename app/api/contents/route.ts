import { NextRequest, NextResponse } from 'next/server';
import { fetchContentsFromDB } from '@/lib/db/content';

// 1. Define a secure API key (In production, store this in .env.local)
// Example .env: EXTERNAL_PLATFORM_API_KEY="sk_prod_12345..."
const API_KEY = process.env.EXTERNAL_PLATFORM_API_KEY;

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
    const limit = parseInt(searchParams.get('limit') || '10');
    
    const contentData = await fetchContentsFromDB(limit); 

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