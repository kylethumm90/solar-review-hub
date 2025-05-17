import React from 'react';
import { Dialog } from '@headlessui/react';

type LogDetailsModalProps = {
  open: boolean;
  onClose: () => void;
  details: object | null;
};

export default function LogDetailsModal({ open, onClose, details }: LogDetailsModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 overflow-auto max-h-[80vh]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Log Details</h2>
          <button onClick={onClose} className="text-sm text-gray-500 hover:underline">Close</button>
        </div>
        <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(details, null, 2)}</pre>
      </div>
    </div>
  );
}
