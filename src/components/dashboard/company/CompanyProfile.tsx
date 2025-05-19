
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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
  };
}

const CompanyProfile = ({ company }: CompanyProfileProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      name: company?.name || "",
      description: company?.description || "",
      website: company?.website || "",
      type: company?.type || "",
    },
  });

  const onSubmit = async (values: CompanyFormValues) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("companies")
        .update({
          name: values.name,
          description: values.description,
          website: values.website,
          type: values.type,
        })
        .eq("id", company.id);

      if (error) {
        throw error;
      }

      toast.success("Company profile updated successfully");
      setDialogOpen(false);
      // We could refresh the company data here if needed
    } catch (error) {
      console.error("Error updating company profile:", error);
      toast.error("Failed to update company profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Company Profile</CardTitle>
          <CardDescription>Manage your company's public information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-1">Company Name</h3>
              <p>{company.name}</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-medium mb-1">Description</h3>
              <p>{company.description || 'No description provided'}</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-medium mb-1">Website</h3>
              <p>{company.website || 'No website provided'}</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-medium mb-1">Type</h3>
              <p>{company.type}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={() => setDialogOpen(true)}>Edit Profile</Button>
        </CardFooter>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Company Profile</DialogTitle>
            <DialogDescription>
              Update your company's information. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                      <Input placeholder="e.g., Installer, Distributor" {...field} />
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
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CompanyProfile;
