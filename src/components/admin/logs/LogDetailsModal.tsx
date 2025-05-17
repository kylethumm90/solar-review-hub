
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AdminLog } from '@/types/admin';

type LogDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  log: AdminLog | null;
};

export default function LogDetailsModal({ isOpen, onClose, log }: LogDetailsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Log Details</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {log && log.details ? (
            <pre className="text-xs whitespace-pre-wrap bg-muted p-4 rounded-md overflow-auto">
              {JSON.stringify(log.details, null, 2)}
            </pre>
          ) : (
            <p className="text-muted-foreground">No details available for this log.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
