import React, { useState, useMemo, useEffect } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  PlusCircle, 
  CheckCircle2, 
  Trash2, 
  Clock, 
  Filter 
} from 'lucide-react';

export default function CalendarModal({ 
  isOpen, 
  onClose, 
  tasks, 
  deletedTasks = [] 
}) {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDateStr, setSelectedDateStr] = useState(() => new Date().toISOString().split('T')[0]);
  const [eventTypeFilter, setEventTypeFilter] = useState('All');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const toDateKey = (dateVal) => {
    if (!dateVal) return null;
    if (typeof dateVal === 'string') return dateVal.split('T')[0];
    try {
      return new Date(dateVal).toISOString().split('T')[0];
    } catch {
      return null;
    }
  };

  // Group events by YYYY-MM-DD
  const eventsByDate = useMemo(() => {
    const map = {};
    const addEvent = (dateKey, event) => {
      if (!dateKey) return;
      if (!map[dateKey]) map[dateKey] = [];
      map[dateKey].push(event);
    };

    tasks.forEach((t) => {
      const createdKey = toDateKey(t.createdAt || t.dueDate);
      if (createdKey) {
        addEvent(createdKey, {
          type: 'Created',
          title: t.title,
          category: t.category,
          priority: t.priority,
          status: t.status,
          id: t.id
        });
      }

      if (t.status === 'Completed' || t.completedAt) {
        const completedKey = toDateKey(t.completedAt || t.dueDate);
        if (completedKey) {
          addEvent(completedKey, {
            type: 'Completed',
            title: t.title,
            category: t.category,
            priority: t.priority,
            status: t.status,
            id: t.id
          });
        }
      }
    });

    deletedTasks.forEach((t) => {
      const deletedKey = toDateKey(t.deletedAt);
      if (deletedKey) {
        addEvent(deletedKey, {
          type: 'Deleted',
          title: t.title,
          category: t.category,
          priority: t.priority,
          status: 'Deleted',
          id: t.id
        });
      }
    });

    return map;
  }, [tasks, deletedTasks]);

  // Calendar grid math
  const { calendarDays } = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysCount = new Date(year, month + 1, 0).getDate();
    const prevMonthDaysCount = new Date(year, month, 0).getDate();
    const days = [];

    for (let i = firstDay - 1; i >= 0; i--) {
      const dayNum = prevMonthDaysCount - i;
      const prevDate = new Date(year, month - 1, dayNum);
      days.push({ dayNum, dateStr: prevDate.toISOString().split('T')[0], isCurrentMonth: false });
    }

    for (let d = 1; d <= daysCount; d++) {
      const mStr = String(month + 1).padStart(2, '0');
      const dStr = String(d).padStart(2, '0');
      days.push({ dayNum: d, dateStr: `${year}-${mStr}-${dStr}`, isCurrentMonth: true });
    }

    const remaining = (7 - (days.length % 7)) % 7;
    for (let n = 1; n <= remaining; n++) {
      const nextDate = new Date(year, month + 1, n);
      days.push({ dayNum: n, dateStr: nextDate.toISOString().split('T')[0], isCurrentMonth: false });
    }

    return { calendarDays: days };
  }, [year, month]);

  if (!isOpen) return null;

  const selectedDayEvents = (eventsByDate[selectedDateStr] || []).filter(
    (e) => eventTypeFilter === 'All' || e.type === eventTypeFilter
  );

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="calendar-modal-title"
    >
      <div 
        className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <CalendarIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 id="calendar-modal-title" className="text-base font-bold text-slate-900 leading-tight">
                Task Lifecycle Calendar
              </h3>
              <p className="text-[11px] text-slate-500">
                Track created, completed, and due dates directly on the calendar
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar & Filters */}
        <div className="px-5 py-3 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-white text-xs">
          {/* Month Navigation */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-slate-800">
              {monthNames[month]} {year}
            </span>
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg">
              <button
                type="button"
                onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
                className="p-1 rounded text-slate-600 hover:bg-white transition-all"
                aria-label="Previous month"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
                className="p-1 rounded text-slate-600 hover:bg-white transition-all"
                aria-label="Next month"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                const now = new Date();
                setCurrentDate(now);
                setSelectedDateStr(now.toISOString().split('T')[0]);
              }}
              className="px-2.5 py-1 rounded-lg border border-slate-200 text-[11px] font-semibold text-slate-600 hover:bg-slate-50"
            >
              Today
            </button>
          </div>

          {/* Activity Filter */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {['All', 'Created', 'Completed', 'Deleted'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setEventTypeFilter(type)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  eventTypeFilter === type
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Body Grid: Calendar & Day Timeline */}
        <div className="p-5 overflow-y-auto grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Calendar Grid (2 cols on md) */}
          <div className="md:col-span-2 rounded-xl border border-slate-200 overflow-hidden">
            <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-100 text-center py-1.5 text-[11px] font-bold text-slate-500 uppercase">
              <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
            </div>

            <div className="grid grid-cols-7 divide-x divide-y divide-slate-100">
              {calendarDays.map((item, idx) => {
                const dayEvents = eventsByDate[item.dateStr] || [];
                const isSelected = selectedDateStr === item.dateStr;
                const isToday = todayStr === item.dateStr;

                const hasCreated = dayEvents.some(e => e.type === 'Created');
                const hasCompleted = dayEvents.some(e => e.type === 'Completed');
                const hasDeleted = dayEvents.some(e => e.type === 'Deleted');

                return (
                  <div
                    key={`${item.dateStr}-${idx}`}
                    onClick={() => setSelectedDateStr(item.dateStr)}
                    className={`min-h-[64px] sm:min-h-[72px] p-1.5 flex flex-col justify-between cursor-pointer select-none transition-all ${
                      !item.isCurrentMonth ? 'bg-slate-50/50 text-slate-300' : 'hover:bg-slate-50/80'
                    } ${isSelected ? 'bg-indigo-50/50 ring-2 ring-indigo-500/50 z-10' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center ${
                        isToday ? 'bg-indigo-600 text-white' : isSelected ? 'bg-indigo-100 text-indigo-700' : 'text-slate-800'
                      }`}>
                        {item.dayNum}
                      </span>

                      {/* Event Dots */}
                      <div className="flex items-center gap-0.5">
                        {hasCreated && <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />}
                        {hasCompleted && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                        {hasDeleted && <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />}
                      </div>
                    </div>

                    {/* Event Pill Preview */}
                    <div className="space-y-0.5 mt-0.5">
                      {dayEvents.slice(0, 1).map((ev, i) => (
                        <div
                          key={i}
                          className={`text-[9px] px-1 py-0.2 rounded truncate font-medium ${
                            ev.type === 'Completed' ? 'bg-emerald-50 text-emerald-800' : 'bg-sky-50 text-sky-800'
                          }`}
                        >
                          {ev.title}
                        </div>
                      ))}
                      {dayEvents.length > 1 && (
                        <span className="text-[8px] text-slate-400 font-bold px-0.5">+{dayEvents.length - 1} more</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Date Timeline Details */}
          <div className="rounded-xl border border-slate-200 p-4 flex flex-col bg-slate-50/40">
            <div className="border-b border-slate-200/80 pb-2 mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">Selected Date</span>
              <p className="text-xs font-bold text-slate-900 mt-0.5">
                {new Date(selectedDateStr + 'T00:00:00').toLocaleDateString('en-US', {
                  month: 'short', day: 'numeric', year: 'numeric'
                })}
              </p>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 max-h-[260px] pr-1">
              {selectedDayEvents.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  <Clock className="w-6 h-6 mx-auto mb-1.5 opacity-50" />
                  <p>No activity for this date</p>
                </div>
              ) : (
                selectedDayEvents.map((ev, i) => (
                  <div
                    key={i}
                    className={`p-2.5 rounded-xl border text-xs ${
                      ev.type === 'Completed'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        : 'bg-sky-50 border-sky-200 text-sky-900'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        {ev.type}
                      </span>
                      {ev.priority && (
                        <span className="text-[9px] font-semibold text-slate-500">{ev.priority}</span>
                      )}
                    </div>
                    <p className="font-bold text-slate-900 leading-tight">{ev.title}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl text-xs font-bold bg-slate-800 text-white hover:bg-slate-900 transition-colors"
          >
            Close Calendar
          </button>
        </div>
      </div>
    </div>
  );
}
