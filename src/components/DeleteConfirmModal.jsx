import React, { useEffect } from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, task }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !task) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
    >
      <div 
        className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-100 p-6 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4 border border-rose-100">
          <Trash2 className="w-6 h-6" />
        </div>

        <h3 id="delete-dialog-title" className="text-lg font-bold text-slate-900">
          Delete Task?
        </h3>

        <p id="delete-dialog-description" className="text-sm text-slate-500 mt-2 leading-relaxed">
          Are you sure you want to delete <span className="font-semibold text-slate-800">"{task.title}"</span>? This action will remove it from your board and recalibrate your dashboard statistics.
        </p>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(task.id)}
            className="px-5 py-2.5 rounded-xl bg-rose-600 text-white text-sm font-semibold hover:bg-rose-700 active:scale-98 transition-all shadow-sm shadow-rose-600/30"
          >
            Yes, Delete Task
          </button>
        </div>
      </div>
    </div>
  );
}
