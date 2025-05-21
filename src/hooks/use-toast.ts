
import * as React from "react";
import { toast as sonnerToast } from "sonner";

type ToastProps = {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
  duration?: number;
};

// Create a wrapper for sonner toast that directly calls the right function
export const toast = ({ title, description, variant, duration }: ToastProps) => {
  if (variant === "destructive") {
    return sonnerToast.error(title || "", { 
      description, 
      duration 
    });
  }
  return sonnerToast(title || "", { 
    description, 
    duration 
  });
};

// Add additional methods for more specific toast types
toast.success = (title: string, options?: { description?: string; duration?: number }) => {
  return sonnerToast.success(title, options);
};

toast.error = (title: string, options?: { description?: string; duration?: number }) => {
  return sonnerToast.error(title, options);
};

toast.warning = (title: string, options?: { description?: string; duration?: number }) => {
  return sonnerToast.warning(title, options);
};

toast.info = (title: string, options?: { description?: string; duration?: number }) => {
  return sonnerToast.info(title, options);
};

toast.dismiss = sonnerToast.dismiss;

// Mock for compatibility with shadcn/ui toast
const useToast = () => {
  const [toasts] = React.useState<any[]>([]);

  return {
    toast,
    dismiss: sonnerToast.dismiss,
    toasts
  };
};

export { useToast };
