
import * as React from "react";
import { toast as sonnerToast } from "sonner";

type ToastProps = {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
  duration?: number;
};

// Create a wrapper function for sonner that accepts shadcn toast props
const toast = {
  // Basic toast with title and description support to match shadcn API
  toast: ({ title, description, variant, duration }: ToastProps) => {
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
  },
  
  // Add the custom method back for backward compatibility
  custom: ({ title, description, ...props }: ToastProps) => {
    return sonnerToast(title || "", { 
      description, 
      ...props 
    });
  },
  
  // Standard sonner methods
  message: sonnerToast,
  success: sonnerToast.success,
  error: sonnerToast.error,
  warning: sonnerToast.warning,
  info: sonnerToast.info,
  dismiss: sonnerToast.dismiss
};

// Mock for compatibility with shadcn/ui toast
const useToast = () => {
  const [toasts] = React.useState<any[]>([]);

  return {
    toast: toast,
    dismiss: sonnerToast.dismiss,
    toasts
  };
};

// Export the base toast function directly to be used without the hook
export { useToast, sonnerToast as toast };
