
import * as React from "react";
import { toast as sonnerToast } from "sonner";

type ToastProps = {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  [key: string]: any;
};

// Create a wrapper function for sonnerToast that accepts title and description
const toast = {
  // Basic toast with title and description support
  custom: ({ title, description, ...props }: ToastProps) => {
    if (title && description) {
      return sonnerToast(title, { description, ...props });
    } else if (title) {
      return sonnerToast(title, props);
    }
    return sonnerToast("Notification", props);
  },
  
  // Basic toast
  message: (message: string, options?: any) => {
    return sonnerToast(message, options);
  },
  
  // Success toast
  success: (message: string, options?: any) => {
    return sonnerToast.success(message, options);
  },
  
  // Error toast
  error: (message: string, options?: any) => {
    return sonnerToast.error(message, options);
  },
  
  // Warning toast
  warning: (message: string, options?: any) => {
    return sonnerToast.warning(message, options);
  },
  
  // Info toast
  info: (message: string, options?: any) => {
    return sonnerToast.info(message, options);
  }
};

function useToast() {
  return {
    toast,
    dismiss: sonnerToast.dismiss
  };
}

export { useToast, toast };
