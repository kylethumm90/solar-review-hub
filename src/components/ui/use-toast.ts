
import { toast as sonnerToast } from "sonner";

// Define toast types for better TypeScript integration
type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  duration?: number;
};

// Export a wrapper for sonner toast that accepts the same parameters as shadcn toast
export const toast = {
  // Standard toast with title and description
  ...sonnerToast,
  
  // Custom method that matches shadcn toast API
  toast: (props: ToastProps) => {
    if (props.variant === "destructive") {
      return sonnerToast.error(props.title, {
        description: props.description,
        duration: props.duration
      });
    }
    
    return sonnerToast(props.title, {
      description: props.description,
      duration: props.duration
    });
  }
};

export default toast;
