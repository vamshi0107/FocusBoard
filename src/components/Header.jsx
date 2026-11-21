import React from 'react';
import { Menu, Plus, Bell, Calendar as CalendarIcon } from 'lucide-react';

export default function Header({ onOpenSidebar, onOpenCreateTask }) {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left: Mobile Toggle & Page Greeting */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label="Open sidebar navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-800 leading-tight">
            Tasks Dashboard
          </h2>
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
            <span>{today}</span>
          </div>
        </div>
      </div>

      {/* Right: Actions & Create Task Button */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors relative"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white"></span>
        </button>

        <button
          type="button"
          onClick={onOpenCreateTask}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 text-white text-xs sm:text-sm font-semibold hover:bg-indigo-700 active:scale-98 transition-all shadow-sm shadow-indigo-600/25"
          aria-label="Create new task"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>
    </header>
  );
}
