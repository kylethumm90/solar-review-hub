
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, Camera } from 'lucide-react';

interface AvatarUploadProps {
  onUploadComplete: (url: string) => void;
  existingUrl?: string;
}

const AvatarUpload = ({ onUploadComplete, existingUrl }: AvatarUploadProps) => {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(existingUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get user initials for the avatar fallback
  const getInitials = () => {
    if (!user?.user_metadata?.full_name) return 'U';
    return user.user_metadata.full_name
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload an image file (JPEG, PNG, GIF, or WEBP)');
      return;
    }

    // Validate file size (max 2MB)
    const maxSizeInBytes = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSizeInBytes) {
      toast.error('Image must be smaller than 2MB');
      return;
    }

    // Create a preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!fileInputRef.current?.files?.[0] || !user) return;
    
    setUploading(true);
    const file = fileInputRef.current.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;
    
    try {
      // Upload the file to Supabase storage
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          upsert: true,
        });
      
      if (error) {
        throw error;
      }
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);
      
      // Update the user's avatar_url in the users table
      const { error: updateDbError } = await supabase
        .from('users')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);
      
      if (updateDbError) {
        throw updateDbError;
      }
      
      // Update the user's metadata with the avatar_url
      const { error: updateUserError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      });
      
      if (updateUserError) {
        throw updateUserError;
      }
      
      toast.success('Profile picture uploaded successfully');
      onUploadComplete(publicUrl);
    } catch (error: any) {
      toast.error(`Error uploading image: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <input
        type="file"
        ref={fileInputRef}
        accept="image/jpeg, image/png, image/gif, image/webp"
        className="hidden"
        onChange={handleFileChange}
      />
      
      <Avatar className="w-32 h-32 cursor-pointer" onClick={triggerFileInput}>
        {previewUrl ? (
          <AvatarImage src={previewUrl} alt="Profile preview" />
        ) : (
          <AvatarFallback className="text-2xl bg-primary text-white">
            {getInitials()}
          </AvatarFallback>
        )}
      </Avatar>
      
      <div className="flex gap-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={triggerFileInput}
          className="flex items-center gap-2"
          disabled={uploading}
        >
          <Camera className="h-4 w-4" />
          Choose Image
        </Button>
        
        {previewUrl && previewUrl !== existingUrl && (
          <Button
            type="button"
            onClick={handleUpload}
            disabled={uploading}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default AvatarUpload;
