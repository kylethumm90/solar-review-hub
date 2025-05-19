
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface AnonymousReviewSectionProps {
  isAnonymous: boolean;
  attachment: File | null;
  setAttachment: React.Dispatch<React.SetStateAction<File | null>>;
  fileError: string | null;
  setFileError: React.Dispatch<React.SetStateAction<string | null>>;
}

const AnonymousReviewSection: React.FC<AnonymousReviewSectionProps> = ({
  isAnonymous,
  attachment,
  setAttachment,
  fileError,
  setFileError,
}) => {
  if (!isAnonymous) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFileError(null);
    
    if (file) {
      // Check file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        setFileError('Invalid file type. Please upload a PDF, JPG, or PNG file.');
        setAttachment(null);
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setFileError('File is too large. Maximum size is 5MB.');
        setAttachment(null);
        return;
      }
      
      setAttachment(file);
    } else {
      setAttachment(null);
    }
  };

  return (
    <div>
      <Label htmlFor="attachment" className="font-semibold mb-2 block">
        Upload documentation to verify your review
      </Label>
      <Input
        id="attachment"
        type="file"
        onChange={handleFileChange}
        accept=".pdf,.jpg,.jpeg,.png"
        className="mt-1"
      />
      {fileError && (
        <Alert variant="destructive" className="mt-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{fileError}</AlertDescription>
        </Alert>
      )}
      <p className="text-sm text-muted-foreground mt-2">
        <strong>Accepted examples:</strong><br />
        • Signed contract or proposal<br />
        • Invoice or receipt from the company<br />
        • Screenshot of an email or text exchange<br />
        • Photo of installed equipment with branding
      </p>
    </div>
  );
};

export default AnonymousReviewSection;
