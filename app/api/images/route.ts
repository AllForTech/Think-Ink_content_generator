import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { randomUUID } from 'crypto';

export async function POST(req: Request) {
  const supabase = await createClient();
  const formData = await req.formData();
  const file = formData.get('image') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'No image file uploaded.' }, { status: 400 });
  }

  // Convert File to Buffer/ArrayBuffer for storage
  const buffer = await file.arrayBuffer();
  const fileExtension = file.name.split('.').pop();
  const fileName = `${randomUUID()}.${fileExtension}`;

  try {
    // 1. Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('user_uploads') // Change to your actual bucket name
      .upload(fileName, buffer, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type,
      });

    if (error) {
      console.error(error);
      
      throw error;
    }

    // 2. Get the public URL
    const { data: publicUrlData } = await supabase.storage
      .from('user_uploads')
      .getPublicUrl(fileName);

      console.log('Public URL:', publicUrlData.publicUrl);

    return NextResponse.json({ publicUrl: publicUrlData.publicUrl }, { status: 200 });
  } catch (error) {
    console.error('Supabase upload error:', error);
    return NextResponse.json({ error: 'Failed to upload image to storage.' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { publicUrl } = await req.json();

    if (!publicUrl) {
      return NextResponse.json({ error: 'Public URL not provided' }, { status: 400 });
    }

    // Extract the file path from the public URL
    // Example publicUrl: https://<project_id>.supabase.co/storage/v1/object/public/user_uploads/filename.jpg
    // We need: user_uploads/filename.jpg
    const urlParts = publicUrl.split('user_uploads/');
    const filePathInBucket = urlParts.length > 1 ? urlParts[1] : null;

    if (!filePathInBucket) {
      return NextResponse.json({ error: 'Invalid public URL provided' }, { status: 400 });
    }

    const { error } = await supabase.storage.from('user_uploads').remove([filePathInBucket]);

    if (error) {
      console.error('Supabase delete error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Image deleted successfully' }, { status: 200 });
  } catch (e) {
    console.error('Server error:', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}