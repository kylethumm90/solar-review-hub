import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { companyTypes } from '@/constants/companyTypes';

const AddVendorForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
    type: '',
  });
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  // Handle company type selection
  const handleTypeSelect = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      type: value,
    }));
  };

  // Handle logo file selection
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setLogoFile(file);
    
    // Create preview URL for the selected image
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setLogoPreview(null);
    }
  };
  
  // Toggle owner status
  const handleOwnershipChange = (checked: boolean) => {
    setIsOwner(checked);
  };

  // Normalize website URL - updated to be more flexible
  const normalizeUrl = (input: string) => {
    if (!input) return "";
    
    // Remove any leading/trailing whitespace
    let url = input.trim();
    
    // If URL already has a protocol, return it as is
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    
    // If URL starts with "www.", add https:// prefix
    if (url.startsWith("www.")) {
      return `https://${url}`;
    }
    
    // Otherwise, add both https:// and ensure www. is not duplicated
    return `https://${url}`;
  };
  
  // Submit form data to Supabase
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.type || !formData.website) {
      toast.error("Please fill in all required fields.");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Normalize the website URL before saving
      const normalizedWebsite = normalizeUrl(formData.website);
      
      // Upload logo if provided and user is owner
      let logoUrl = null;
      if (isOwner && logoFile) {
        const fileExt = logoFile.name.split(".").pop();
        const filePath = `logos/${Date.now()}.${fileExt}`;
        
        const { error: uploadError, data: fileData } = await supabase.storage
          .from("company-logos")
          .upload(filePath, logoFile);
          
        if (uploadError) {
          console.error("Logo upload error:", uploadError);
          toast.error("Failed to upload company logo.");
          setIsSubmitting(false);
          return;
        }
        
        const { data: { publicUrl } } = supabase.storage
          .from("company-logos")
          .getPublicUrl(filePath);
          
        logoUrl = publicUrl;
      }

      // Set a default description if not provided by an owner
      const companyDescription = isOwner && formData.description.trim() 
        ? formData.description 
        : "No description provided";

      // Insert new company into the database
      const { data: company, error } = await supabase
        .from('companies')
        .insert({
          name: formData.name,
          description: companyDescription,
          website: normalizedWebsite,
          type: formData.type,
          logo_url: logoUrl,
          is_verified: false, // New companies are not verified by default
        })
        .select('id')
        .single();
      
      if (error) {
        console.error('Error detail:', error);
        throw error;
      }
      
      // If user is owner, create a claim request
      if (isOwner && user && company?.id) {
        const { error: claimError } = await supabase
          .from('claims')
          .insert({
            user_id: user.id,
            company_id: company.id,
            full_name: user.user_metadata?.full_name || '',
            job_title: 'Owner/Representative', // Default job title
            company_email: user.email,
            status: 'pending'
          });
          
        if (claimError) {
          console.error('Error creating claim:', claimError);
          toast.error("Company added but ownership claim failed. Please try claiming it later.");
        } else {
          toast.success("Your company was added and your ownership claim is pending review.");
        }
      } else {
        toast.success("Company submitted for review. It will appear in the directory once approved.");
      }
      
      // Navigate to the newly created company page
      navigate(`/vendors/${company.id}`);
    } catch (error) {
      console.error('Error adding company:', error);
      toast.error("Failed to add company. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Redirect if user is not logged in
  if (!user) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-semibold mb-4">Authentication Required</h2>
        <p className="mb-6">You must be logged in to submit a new company.</p>
        <Button onClick={() => navigate('/login')}>Log In</Button>
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div className="space-y-2">
        <Label htmlFor="name">Company Name <span className="text-red-500">*</span></Label>
        <Input
          id="name"
          name="name"
          placeholder="Enter company name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="type">Company Type <span className="text-red-500">*</span></Label>
        <Select value={formData.type} onValueChange={handleTypeSelect} required>
          <SelectTrigger>
            <SelectValue placeholder="Select company type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Company Types</SelectLabel>
              {companyTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="website">Website <span className="text-red-500">*</span></Label>
        <Input
          id="website"
          name="website"
          type="text" 
          placeholder="example.com or https://example.com"
          value={formData.website}
          onChange={handleChange}
          required
        />
        <p className="text-xs text-gray-500">
          Enter your website with or without http/https - we'll format it correctly.
        </p>
      </div>
      
      {/* Ownership Checkbox */}
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="ownership" 
          checked={isOwner}
          onCheckedChange={handleOwnershipChange}
        />
        <label
          htmlFor="ownership"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          I am the owner or authorized representative of this company
        </label>
      </div>
      
      {/* Description Field - Only show when isOwner is true */}
      {isOwner && (
        <div className="space-y-2">
          <Label htmlFor="description">
            Company Description
          </Label>
          <Textarea
            id="description"
            name="description"
            rows={4}
            className="w-full resize-none"
            placeholder="Provide a brief description of the company and their services"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
      )}
      
      {/* Logo Upload - Only for owners */}
      {isOwner && (
        <div className="space-y-2">
          <Label htmlFor="logo">Company Logo</Label>
          <Input
            id="logo"
            name="logo"
            type="file"
            accept="image/*"
            onChange={handleLogoChange}
            className="cursor-pointer"
          />
          
          {logoPreview && (
            <div className="mt-2">
              <p className="text-sm text-gray-500 mb-1">Preview:</p>
              <img 
                src={logoPreview} 
                alt="Logo preview" 
                className="h-20 w-auto object-contain border rounded"
              />
            </div>
          )}
        </div>
      )}
      
      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Adding...' : 'Add Company'}
        </Button>
        <Button type="button" variant="outline" onClick={() => navigate('/vendors')}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default AddVendorForm;
