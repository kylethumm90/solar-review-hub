
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

const AddVendorForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  // Normalize website URL
  const normalizeUrl = (input: string) => {
    if (!input) return "";
    if (input.startsWith("http://") || input.startsWith("https://")) return input;
    return `https://${input.replace(/^www\./, "")}`;
  };
  
  // Submit form data to Supabase
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.description || !formData.type || !formData.website) {
      toast.error("Please fill in all required fields.");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Normalize the website URL before saving
      const normalizedWebsite = normalizeUrl(formData.website);

      // Insert new company into the database
      const { data, error } = await supabase
        .from('companies')
        .insert({
          name: formData.name,
          description: formData.description,
          website: normalizedWebsite,
          type: formData.type,
          is_verified: false, // New companies are not verified by default
        })
        .select('id')
        .single();
      
      if (error) {
        console.error('Error detail:', error);
        throw error;
      }
      
      toast.success("Company added successfully!");
      // Navigate to the newly created company page
      navigate(`/vendors/${data.id}`);
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
              <SelectItem value="epc">EPC (Engineering, Procurement, Construction)</SelectItem>
              <SelectItem value="sales_org">Sales Organization</SelectItem>
              <SelectItem value="lead_gen">Lead Generation</SelectItem>
              <SelectItem value="software">Software</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="website">Website <span className="text-red-500">*</span></Label>
        <Input
          id="website"
          name="website"
          type="url"
          placeholder="https://example.com"
          value={formData.website}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
        <textarea
          id="description"
          name="description"
          rows={4}
          className="w-full p-2 border rounded-md bg-background resize-none"
          placeholder="Provide a brief description of the company and their services"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>
      
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
