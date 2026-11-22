import React, { useEffect } from 'react';
import { X, RotateCcw, Trash2, Database, Info, Check } from 'lucide-react';

export default function SettingsModal({
  isOpen,
  onClose,
  onResetToSampleTasks,
  onClearAllTasks,
  totalTasks
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
    >
      <div 
        className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 id="settings-title" className="text-lg font-bold text-slate-800">
              Board Settings & Storage
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage browser data persistence and testing presets
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Close settings dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Storage Info Card */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-2">
            <div className="flex items-center gap-2 text-slate-700 font-semibold text-xs">
              <Database className="w-4 h-4 text-indigo-600" />
              <span>Browser LocalStorage Status</span>
            </div>
            <div className="text-xs text-slate-500 space-y-1">
              <div className="flex justify-between">
                <span>Storage Key:</span>
                <code className="text-slate-700 font-mono text-[11px] bg-slate-200/60 px-1.5 py-0.5 rounded">focusboard_tasks</code>
              </div>
              <div className="flex justify-between">
                <span>Currently Stored Tasks:</span>
                <span className="font-semibold text-slate-800">{totalTasks} items</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Evaluation & Testing Presets
            </p>

            {/* Reset to 6 Sample Tasks */}
            <button
              type="button"
              onClick={() => {
                onResetToSampleTasks();
                onClose();
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-indigo-100 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-900 transition-all text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold">Reset to Initial 6 Sample Tasks</p>
                  <p className="text-[11px] text-indigo-600/80">Restores the default assignment tasks</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                Restore
              </span>
            </button>

            {/* Clear All Tasks (Test 0 tasks state) */}
            <button
              type="button"
              onClick={() => {
                onClearAllTasks();
                onClose();
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-rose-100 bg-rose-50/40 hover:bg-rose-50 text-rose-900 transition-all text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Trash2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold">Clear All Tasks</p>
                  <p className="text-[11px] text-rose-600/80">Tests the 0-tasks empty state & division by zero handling</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity">
                Clear
              </span>
            </button>
          </div>

          {/* App Info Footer */}
          <div className="pt-3 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-400">
            <Info className="w-3.5 h-3.5 shrink-0" />
            <span>FocusBoard Candidate Workspace · Version 1.0.0</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50/80 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 text-white hover:bg-slate-900 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
