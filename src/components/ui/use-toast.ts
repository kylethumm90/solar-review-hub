
// Import the consistent toast implementation from our hooks
import { toastFn, useToast, toast } from "@/hooks/use-toast";

// Re-export to maintain compatibility with existing imports
export { toast, useToast, toastFn };

// Export a default object for module imports
export default toastFn;
