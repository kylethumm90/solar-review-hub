
import React, { useState } from 'react';
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
import { 
  type CompanyData, 
  type CompanyFormValues, 
  useCompanyUpdate
} from '@/hooks/useCompanyUpdate';
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { 
  Command, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem 
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

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
    onSubmit,
    US_STATES,
    showStatesField
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
        
        {showStatesField && (
          <FormField
            control={form.control}
            name="operating_states"
            render={({ field }) => (
              <FormItem>
                <FormLabel>States You Operate In</FormLabel>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-between",
                          !(field.value?.length) && "text-muted-foreground"
                        )}
                      >
                        {field.value?.length
                          ? `${field.value.length} states selected`
                          : "Select states"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Search states..." />
                        <CommandEmpty>No state found.</CommandEmpty>
                        <ScrollArea className="h-64">
                          <CommandGroup>
                            {US_STATES.map((state) => {
                              const isSelected = field.value?.includes(state.value);
                              return (
                                <CommandItem
                                  key={state.value}
                                  onSelect={() => {
                                    // Ensure field.value is always an array before operating on it
                                    const currentValues = field.value || [];
                                    const updatedValues = isSelected
                                      ? currentValues.filter(
                                          (value) => value !== state.value
                                        )
                                      : [...currentValues, state.value];
                                    form.setValue("operating_states", updatedValues);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      isSelected ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {state.label}
                                </CommandItem>
                              );
                            })}
                          </CommandGroup>
                        </ScrollArea>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <div className="flex flex-wrap gap-1 mt-2">
                  {(field.value || []).map((state) => {
                    const stateObj = US_STATES.find((s) => s.value === state);
                    return (
                      <Badge key={state} variant="secondary" className="flex items-center gap-1">
                        {stateObj?.label}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => {
                            const updatedValues = (field.value || []).filter(
                              (value) => value !== state
                            );
                            form.setValue("operating_states", updatedValues);
                          }}
                        />
                      </Badge>
                    );
                  })}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Used to power regional search and filtering. Select all states where your company operates.
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
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
