
import React from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { type CompanyData, type CompanyFormValues, useCompanyUpdate } from '@/hooks/useCompanyUpdate';

interface CompanyProfileFormProps {
  company: CompanyData;
  onCancel: () => void;
}

const CompanyProfileForm: React.FC<CompanyProfileFormProps> = ({ company, onCancel }) => {
  const { 
    form, 
    isSubmitting, 
    logoPreview, 
    companyTypes, 
    handleLogoChange, 
    onSubmit 
  } = useCompanyUpdate(company);

  return (
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
        
        <div className="flex justify-end space-x-2 pt-2">
          <Button type="button" variant="outline" onClick={onCancel}>
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
        </div>
      </form>
    </Form>
  );
};

export default CompanyProfileForm;
