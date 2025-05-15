
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
    toast,
    dismiss: sonnerToast.dismiss,
    toasts
  };
};

export { useToast, toast };
