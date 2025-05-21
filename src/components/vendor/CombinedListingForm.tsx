
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { COMPANY_TYPES } from '@/types/company';
import { toast } from 'sonner';
import { useLogoUpload } from '@/hooks/useLogoUpload';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

// Form schema based on user authentication status
const authenticatedFormSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  companyType: z.string().min(1, "Please select a company type"),
  website: z.string().url("Please enter a valid URL").or(z.string().length(0)),
  description: z.string().optional(),
  isClaiming: z.boolean().default(false),
});

const unauthenticatedFormSchema = authenticatedFormSchema.extend({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type AuthenticatedFormValues = z.infer<typeof authenticatedFormSchema>;
type UnauthenticatedFormValues = z.infer<typeof unauthenticatedFormSchema>;

interface CombinedListingFormProps {
  onSuccess: () => void;
}

export const CombinedListingForm = ({ onSuccess }: CombinedListingFormProps) => {
  const { user, signUp } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { logoFile, logoPreview, handleLogoChange } = useLogoUpload();

  // Initialize the appropriate form based on authentication status
  const form = useForm<AuthenticatedFormValues | UnauthenticatedFormValues>({
    resolver: zodResolver(user ? authenticatedFormSchema : unauthenticatedFormSchema),
    defaultValues: {
      companyName: '',
      companyType: '',
      website: '',
      description: '',
      isClaiming: true, // Default to claiming the company
      ...(user ? {} : { fullName: '', email: '', password: '' }),
    },
  });

  const handleSubmit = async (values: AuthenticatedFormValues | UnauthenticatedFormValues) => {
    try {
      setIsSubmitting(true);
      
      let userId = user?.id;
      
      // If user is not authenticated, create a new account first
      if (!user) {
        const unauthValues = values as UnauthenticatedFormValues;
        
        const { error, data } = await signUp(
          unauthValues.email,
          unauthValues.password,
          unauthValues.fullName
        );
        
        if (error) {
          toast.error(error.message || "Failed to create account");
          setIsSubmitting(false);
          return;
        }
        
        // Get the new user ID
        userId = data?.user?.id;
        
        if (!userId) {
          toast.error("User account created but user ID not available. Please log in and create your listing.");
          setIsSubmitting(false);
          return;
        }
      }
      
      // Upload logo if provided
      let logoUrl = null;
      if (logoFile) {
        const fileExt = logoFile.name.split('.').pop();
        const filePath = `company-logos/${Math.random().toString(36).substring(2)}.${fileExt}`;
        
        const { error: uploadError, data: uploadData } = await supabase.storage
          .from('logos')
          .upload(filePath, logoFile);
        
        if (uploadError) {
          console.error("Error uploading logo:", uploadError);
          toast.error("Failed to upload company logo");
        } else {
          const { data } = supabase.storage.from('logos').getPublicUrl(filePath);
          logoUrl = data.publicUrl;
        }
      }
      
      // Create company record
      const { error: companyError, data: companyData } = await supabase
        .from('companies')
        .insert({
          name: values.companyName,
          type: values.companyType,
          website: values.website || null,
          description: values.description || '',
          logo_url: logoUrl,
          is_verified: false,
          status: 'unclaimed',
        })
        .select('id')
        .single();
      
      if (companyError) {
        toast.error("Failed to create company listing");
        console.error(companyError);
        setIsSubmitting(false);
        return;
      }
      
      // If user wants to claim the company, create a claim record
      if (values.isClaiming && userId && companyData?.id) {
        const { error: claimError } = await supabase
          .from('claims')
          .insert({
            user_id: userId,
            company_id: companyData.id,
            full_name: user?.user_metadata?.full_name || (values as any).fullName || 'Company Representative',
            job_title: 'Company Representative',
            company_email: user?.email || (values as any).email,
            status: 'pending', // Set as pending for admin review
          });
          
        if (claimError) {
          toast.error("Company created but failed to submit ownership claim");
          console.error(claimError);
        }
      }
      
      toast.success("Your listing has been submitted successfully!");
      onSuccess();
      
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {!user && (
            <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-md mb-6">
              <h3 className="text-lg font-semibold mb-2">Create Your Account</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                You'll need an account to manage your company listing.
              </p>
              
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Work Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="your@company.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormDescription>
                        Must be at least 8 characters
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Company Information</h3>
            
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter company name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="companyType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select company type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {COMPANY_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Website</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://example.com" 
                        {...field} 
                        onChange={(e) => {
                          let value = e.target.value;
                          // Add https:// if not present and user has entered something
                          if (value && !value.startsWith('http://') && !value.startsWith('https://')) {
                            value = `https://${value}`;
                          }
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter the full URL including https://
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Briefly describe what your company does" 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="space-y-2">
                <FormLabel>Company Logo (Optional)</FormLabel>
                <div className="flex items-center gap-4">
                  {logoPreview && (
                    <div className="w-16 h-16 border rounded-md overflow-hidden flex items-center justify-center bg-white">
                      <img 
                        src={logoPreview} 
                        alt="Logo preview" 
                        className="max-w-full max-h-full object-contain" 
                      />
                    </div>
                  )}
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="max-w-md"
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Recommended: Square image in PNG or JPG format, minimum 200x200px
                </p>
              </div>
              
              <FormField
                control={form.control}
                name="isClaiming"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 mt-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="flex items-center gap-1">
                        I am an authorized representative of this company
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info size={14} className="cursor-help text-gray-500" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            By checking this box, you're claiming ownership of this company profile. 
                            You'll have admin access to manage the profile and respond to reviews once approved.
                          </TooltipContent>
                        </Tooltip>
                      </FormLabel>
                      <FormDescription>
                        This will submit a claim request for review.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Company Listing"}
          </Button>
        </form>
      </Form>
    </div>
  );
};
