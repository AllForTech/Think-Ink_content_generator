import React, { useState } from 'react';
import { Button } from '@/components/ui/button'; // Assuming you use a UI library
import { Input } from '@/components/ui/input';
import { SaveImageParameters } from '@mdxeditor/editor'; // The type for submitting data
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Images } from '../RightSidebarPanel';
import { ImagePlus } from 'lucide-react';

// Define the shape of the props the MDX editor will pass to your component
interface CustomImageDialogProps {
  // This is the function you MUST call to insert the image into the editor.
  onImageUpload: (image: SaveImageParameters) => void;
  // This is the function to close the dialog without inserting anything.
  onClose: () => void;
  // This prop contains the state if the user is editing an existing image (optional)
  // state: EditingImageDialogState | NewImageDialogState;
}

const CustomImageDialog = () => {
  const [url, setUrl] = useState('');
  const [altText, setAltText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // Function to handle the form submission
  const handleSubmit = async () => {
    if (loading) return;

    // CASE 1: Image URL provided
    if (url.trim()) {
    
      return;
    }

    // CASE 2: File upload
    if (file) {
      setLoading(true);
      try {
        // --- STEP A: Upload the File to your Backend ---
        // You would call your private API route here (e.g., /api/upload-image)
        const uploadedUrl = await uploadImageToServer(file);

    
      } catch (error) {
        console.error('Image upload failed:', error);
        alert('Failed to upload image. Check console for details.');
      } finally {
        setLoading(false);
      }
    }
  };

  // Placeholder function for your actual server upload logic
  const uploadImageToServer = async (file: File): Promise<string> => {
    // 1. Construct FormData
    const formData = new FormData();
    formData.append('image', file);

    // 2. Call your API route
    const response = await fetch('/api/upload-image', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Server error during upload');
    }

    const result = await response.json();
    // The server must return the public URL of the uploaded image
    return result.publicUrl;
  };

  return (
   <>
     <Dialog>
       <DialogTrigger asChild>
        <Button className="bg-transparent p-2! hover:bg-neutral-200">
         <ImagePlus className='text-black' size={15}/>
        </Button>
      </DialogTrigger>
      <DialogContent className='w-[500px] h-[500px] bg-white rounded-lg center'>
        <Images width={600}/>
      </DialogContent>
     </Dialog>
   </>
  );
};

export default CustomImageDialog;
