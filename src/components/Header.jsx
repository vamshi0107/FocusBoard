import React from 'react';
import { Menu, Plus, Bell, Calendar as CalendarIcon, User } from 'lucide-react';

export default function Header({ 
  onOpenSidebar, 
  onOpenCreateTask, 
  onOpenProfile,
  profile 
}) {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const initials = profile?.name 
    ? profile.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'VR';

  // Dynamic real-time clock greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Good morning', icon: '☀️' };
    if (hour < 17) return { text: 'Good afternoon', icon: '🌤️' };
    return { text: 'Good evening', icon: '🌙' };
  };

  const greeting = getGreeting();
  const firstName = profile?.name ? profile.name.split(' ')[0] : 'Vamshi';

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
          <h2 className="text-base sm:text-lg font-bold text-slate-800 leading-tight flex items-center gap-1.5">
            <span>{greeting.text}, {firstName}!</span>
            <span className="text-sm">{greeting.icon}</span>
          </h2>
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
            <span>{today}</span>
            <span className="text-slate-300">·</span>
            <span>FocusBoard Dashboard</span>
          </div>
        </div>
      </div>

      {/* Right: Actions, Create Task & Candidate Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Notifications */}
        <button
          type="button"
          className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors relative"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white"></span>
        </button>

        {/* New Task Button */}
        <button
          type="button"
          onClick={onOpenCreateTask}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 text-white text-xs sm:text-sm font-semibold hover:bg-indigo-700 active:scale-98 transition-all shadow-sm shadow-indigo-600/25"
          aria-label="Create new task"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden xs:inline sm:inline">New Task</span>
        </button>

        {/* Candidate Profile Avatar Button */}
        <div className="pl-1 sm:pl-2 border-l border-slate-200 flex items-center">
          <button
            type="button"
            onClick={onOpenProfile}
            className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-xl hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all text-left group"
            aria-label="View Candidate Profile"
            title="View Candidate Profile"
          >
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center font-bold text-xs shadow-xs group-hover:scale-105 transition-transform">
                {initials}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>

            <div className="hidden md:block">
              <p className="text-xs font-bold text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors">
                {profile?.name || 'Vamshi Raikanti'}
              </p>
              <p className="text-[10px] text-slate-400 font-medium leading-none">
                Candidate
              </p>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
