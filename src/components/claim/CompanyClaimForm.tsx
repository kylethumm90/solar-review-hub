
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

const formSchema = z.object({
  companyName: z.string().min(2, { message: "Company name must be at least 2 characters." }),
  companyType: z.string().min(1, { message: "Please select a company type." }),
  website: z.string().url({ message: "Please enter a valid URL." }).or(z.literal('')),
  fullName: z.string().min(2, { message: "Please enter your full name." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  isAuthorized: z.boolean().refine(val => val === true, {
    message: "You must confirm that you are authorized to claim this company."
  })
});

interface CompanyClaimFormProps {
  onSuccess: () => void;
}

const CompanyClaimForm = ({ onSuccess }: CompanyClaimFormProps) => {
  const { user, signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: '',
      companyType: '',
      website: '',
      fullName: user?.user_metadata?.full_name || '',
      email: user?.email || '',
      password: '',
      isAuthorized: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    
    try {
      let userId = user?.id;
      
      // If not logged in, create a new user
      if (!userId) {
        const { data, error } = await signUp(
          values.email,
          values.password,
          values.fullName
        );
        
        if (error) {
          throw new Error(error.message);
        }
        
        userId = data?.user?.id;
        
        if (!userId) {
          throw new Error("Failed to create user account");
        }
      }
      
      // Create or find the company
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .insert({
          name: values.companyName,
          type: values.companyType,
          website: values.website || null,
          description: `${values.companyName} is a ${values.companyType} company.`,
          status: 'unclaimed',
        })
        .select('id')
        .single();
      
      if (companyError) {
        throw new Error(companyError.message);
      }
      
      // Create claim request
      const { error: claimError } = await supabase
        .from('claims')
        .insert({
          user_id: userId,
          company_id: companyData.id,
          full_name: values.fullName,
          job_title: 'Company Representative',
          company_email: values.email,
          status: 'pending'
        });
      
      if (claimError) {
        throw new Error(claimError.message);
      }
      
      toast.success("Claim submitted successfully!");
      onSuccess();
    } catch (error: any) {
      console.error('Error submitting claim:', error);
      toast.error(error.message || "Failed to submit claim. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const isLoggedIn = !!user;

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">Claim Your Company</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                      <SelectItem value="installer">Installer</SelectItem>
                      <SelectItem value="epc">EPC</SelectItem>
                      <SelectItem value="sales_org">Sales Organization</SelectItem>
                      <SelectItem value="manufacturer">Manufacturer</SelectItem>
                      <SelectItem value="distributor">Distributor</SelectItem>
                      <SelectItem value="financier">Financier</SelectItem>
                      <SelectItem value="software">Software Provider</SelectItem>
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
                  <FormLabel>Website <span className="text-muted-foreground text-sm">(Optional)</span></FormLabel>
                  <FormControl>
                    <Input placeholder="https://yourcompany.com" {...field} />
                  </FormControl>
                  <FormDescription>
                    Include the full URL with http:// or https://
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!isLoggedIn && (
              <>
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your name" {...field} />
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
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="you@yourcompany.com" {...field} />
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
                        <Input type="password" placeholder="Create a password" {...field} />
                      </FormControl>
                      <FormDescription>
                        At least 6 characters
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <FormField
              control={form.control}
              name="isAuthorized"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      I am an owner or authorized representative of this company
                    </FormLabel>
                    <FormDescription>
                      By checking this box, you confirm that you're authorized to claim this listing.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit Claim Request"}
          </Button>
        </form>
      </Form>
    </Card>
  );
};

export default CompanyClaimForm;
