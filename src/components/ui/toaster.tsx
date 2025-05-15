
import { toast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  // Since we're using Sonner underneath, we don't need the toasts from useToast
  // The Toaster component from Sonner handles its own state
  return (
    <ToastProvider>
      <ToastViewport />
    </ToastProvider>
  )
}
