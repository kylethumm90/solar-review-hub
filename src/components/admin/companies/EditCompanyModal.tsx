
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Company } from "@/types";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface EditCompanyModalProps {
  company: Company;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const EditCompanyModal = ({
  company,
  isOpen,
  onClose,
  onSave,
}: EditCompanyModalProps) => {
  const [formData, setFormData] = useState({
    name: company.name,
    type: company.type,
    website: company.website,
    description: company.description,
    grade: company.grade || "",
    logo_url: company.logo_url || ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const companyTypes = ["epc", "sales_org", "lead_gen", "software", "other"];
  const grades = ["A", "B", "C", "D", "F", ""];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("companies")
        .update({
          name: formData.name,
          type: formData.type,
          website: formData.website,
          description: formData.description,
          grade: formData.grade || null,
          logo_url: formData.logo_url || null
        })
        .eq("id", company.id);

      if (error) {
        throw error;
      }

      toast.success("Company updated successfully");
      onSave();
    } catch (error: any) {
      toast.error(`Error: ${error.message || "Failed to update company"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Company</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="name">Company Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Company Type</Label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 bg-background"
              required
            >
              {companyTypes.map((type) => (
                <option key={type} value={type}>
                  {type.replace("_", " ").charAt(0).toUpperCase() + type.replace("_", " ").slice(1)}
                </option>
              ))}
            </select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              name="website"
              type="url"
              value={formData.website}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="grade">Grade</Label>
              <select
                id="grade"
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 bg-background"
              >
                <option value="">No Grade</option>
                {grades.filter(g => g !== "").map((grade) => (
                  <option key={grade} value={grade}>
                    Grade {grade}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="logo_url">Logo URL</Label>
              <Input
                id="logo_url"
                name="logo_url"
                value={formData.logo_url}
                onChange={handleChange}
                placeholder="Optional"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCompanyModal;
