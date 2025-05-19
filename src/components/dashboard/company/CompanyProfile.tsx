
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Edit, Upload } from "lucide-react";

const companyFormSchema = z.object({
  name: z.string().min(1, "Company name is required"),
  description: z.string().optional(),
  website: z.string().url("Please enter a valid URL").or(z.string().length(0)),
  type: z.string().min(1, "Company type is required"),
});

type CompanyFormValues = z.infer<typeof companyFormSchema>;

interface CompanyProfileProps {
  company: {
    id: string;
    name: string;
    description?: string;
    website?: string;
    type?: string;
    logo_url?: string;
  };
}

const CompanyProfile = ({ company }: CompanyProfileProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(company?.logo_url || null);
  
  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      name: company?.name || "",
      description: company?.description || "",
      website: company?.website || "",
      type: company?.type || "",
    },
  });

  // Define company types
  const companyTypes = [
    { value: "epc", label: "EPC (Engineering, Procurement, Construction)" },
    { value: "sales_org", label: "Sales Organization" },
    { value: "lead_gen", label: "Lead Generation" },
    { value: "software", label: "Software" },
    { value: "other", label: "Other" }
  ];

  // Helper function to format company type for display
  const formatCompanyType = (type: string): string => {
    const foundType = companyTypes.find(t => t.value === type);
    return foundType ? foundType.label : type
      .replace("_", " ")
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
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
    }
  };

  const onSubmit = async (values: CompanyFormValues) => {
    setIsSubmitting(true);
    try {
      let logoUrl = company.logo_url;
      
      // Upload new logo if provided
      if (logoFile) {
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

      const { error } = await supabase
        .from("companies")
        .update({
          name: values.name,
          description: values.description,
          website: values.website,
          type: values.type,
          logo_url: logoUrl
        })
        .eq("id", company.id);

      if (error) {
        throw error;
      }

      toast.success("Company profile updated successfully");
      setDialogOpen(false);
      
      // Refresh page to show updated info
      window.location.reload();
    } catch (error) {
      console.error("Error updating company profile:", error);
      toast.error("Failed to update company profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Company Profile</CardTitle>
        <CardDescription>Manage your company's public information</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-start mb-6">
          {/* Logo Display */}
          <div className="mr-6">
            {company.logo_url || logoPreview ? (
              <img 
                src={logoPreview || company.logo_url} 
                alt={`${company.name} logo`}
                className="w-24 h-24 object-contain border rounded-md"
              />
            ) : (
              <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded-md">
                <span className="text-3xl text-gray-400">{company.name?.charAt(0)}</span>
              </div>
            )}
          </div>
          
          {/* Company Info */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{company.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {formatCompanyType(company.type || '')}
            </p>
            {company.website && (
              <a href={company.website} target="_blank" rel="noopener noreferrer" 
                className="text-primary hover:underline text-sm mt-1 inline-block">
                {company.website}
              </a>
            )}
          </div>
        </div>
        
        <Separator className="my-4" />
        
        {/* Description */}
        <div className="mt-4">
          <h3 className="font-medium mb-2">Description</h3>
          <p className="text-gray-700 dark:text-gray-300">
            {company.description || 'No description provided'}
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={() => setDialogOpen(true)} className="w-full">
          <Edit className="h-4 w-4 mr-2" /> Edit Company Profile
        </Button>
      </CardFooter>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Company Profile</DialogTitle>
            <DialogDescription>
              Update your company's information and logo. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Logo Upload Section */}
              <div className="flex items-center space-x-4 mb-4">
                <div>
                  {logoPreview ? (
                    <img 
                      src={logoPreview} 
                      alt="Logo preview" 
                      className="h-20 w-20 object-contain border rounded"
                    />
                  ) : (
                    <div className="h-20 w-20 bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded">
                      <span className="text-3xl text-gray-400">
                        {company.name?.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <FormLabel>Company Logo</FormLabel>
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="cursor-pointer mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Recommended size: 200x200 pixels
                  </p>
                </div>
              </div>
              
              <FormField
                control={form.control}
                name="name"
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
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input placeholder="https://yourcompany.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Type</FormLabel>
                    <FormControl>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select company type" />
                        </SelectTrigger>
                        <SelectContent>
                          {companyTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your company" 
                        className="resize-none" 
                        rows={4}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin mr-2">⟳</span> Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default CompanyProfile;
