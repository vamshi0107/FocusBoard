import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  PlusCircle, 
  CheckCircle2, 
  Trash2, 
  Clock, 
  ArrowLeft,
  Filter
} from 'lucide-react';

export default function CalendarView({ 
  tasks, 
  deletedTasks = [], 
  onBackToDashboard,
  onOpenCreateTask
}) {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDateStr, setSelectedDateStr] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [eventTypeFilter, setEventTypeFilter] = useState('All'); // 'All' | 'Created' | 'Completed' | 'Deleted'

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Helper to extract YYYY-MM-DD
  const toDateKey = (dateVal) => {
    if (!dateVal) return null;
    if (typeof dateVal === 'string') {
      return dateVal.split('T')[0];
    }
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

    // 1. Created Tasks
    tasks.forEach((t) => {
      const createdKey = toDateKey(t.createdAt || t.dueDate);
      if (createdKey) {
        addEvent(createdKey, {
          type: 'Created',
          title: t.title,
          category: t.category,
          priority: t.priority,
          status: t.status,
          id: t.id,
          task: t
        });
      }
    });

    // 2. Completed Tasks
    tasks.forEach((t) => {
      if (t.status === 'Completed' || t.completedAt) {
        const completedKey = toDateKey(t.completedAt || t.dueDate);
        if (completedKey) {
          addEvent(completedKey, {
            type: 'Completed',
            title: t.title,
            category: t.category,
            priority: t.priority,
            status: t.status,
            id: t.id,
            task: t
          });
        }
      }
    });

    // 3. Deleted Tasks
    deletedTasks.forEach((t) => {
      const deletedKey = toDateKey(t.deletedAt);
      if (deletedKey) {
        addEvent(deletedKey, {
          type: 'Deleted',
          title: t.title,
          category: t.category,
          priority: t.priority,
          status: 'Deleted',
          id: t.id,
          task: t
        });
      }
    });

    return map;
  }, [tasks, deletedTasks]);

  // Calendar days grid computation
  const { calendarDays, daysInMonth, firstDayIndex } = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay(); // 0 is Sunday
    const daysCount = new Date(year, month + 1, 0).getDate();
    const prevMonthDaysCount = new Date(year, month, 0).getDate();

    const days = [];

    // Previous month padding days
    for (let i = firstDay - 1; i >= 0; i--) {
      const dayNum = prevMonthDaysCount - i;
      const prevDate = new Date(year, month - 1, dayNum);
      const dateStr = prevDate.toISOString().split('T')[0];
      days.push({
        dayNum,
        dateStr,
        isCurrentMonth: false
      });
    }

    // Current month days
    for (let d = 1; d <= daysCount; d++) {
      const thisDate = new Date(year, month, d);
      // Format as YYYY-MM-DD
      const mStr = String(month + 1).padStart(2, '0');
      const dStr = String(d).padStart(2, '0');
      const dateStr = `${year}-${mStr}-${dStr}`;
      days.push({
        dayNum: d,
        dateStr,
        isCurrentMonth: true
      });
    }

    // Next month padding days to complete 35 or 42 grid cells
    const remaining = (7 - (days.length % 7)) % 7;
    for (let n = 1; n <= remaining; n++) {
      const nextDate = new Date(year, month + 1, n);
      const dateStr = nextDate.toISOString().split('T')[0];
      days.push({
        dayNum: n,
        dateStr,
        isCurrentMonth: false
      });
    }

    return { calendarDays: days, daysInMonth: daysCount, firstDayIndex: firstDay };
  }, [year, month]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDateStr(today.toISOString().split('T')[0]);
  };

  // Events for selected date
  const selectedDayEvents = useMemo(() => {
    const allForDate = eventsByDate[selectedDateStr] || [];
    if (eventTypeFilter === 'All') return allForDate;
    return allForDate.filter((e) => e.type === eventTypeFilter);
  }, [eventsByDate, selectedDateStr, eventTypeFilter]);

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner & Navigation Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onBackToDashboard}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Dashboard</span>
            </button>
            <span className="text-slate-300">|</span>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              Task Lifecycle Calendar
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1 flex items-center gap-2">
            <span>{monthNames[month]} {year}</span>
          </h2>
        </div>

        {/* Month Navigation & Today Button */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleToday}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Today
          </button>
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white transition-all shadow-xs"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white transition-all shadow-xs"
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <button
            type="button"
            onClick={onOpenCreateTask}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-all shadow-xs ml-auto sm:ml-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Filter Legend Bar */}
      <div className="bg-white px-4 py-3 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 text-slate-500 font-medium">
          <Filter className="w-3.5 h-3.5" />
          <span>Show Activity:</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setEventTypeFilter('All')}
            className={`px-3 py-1 rounded-lg font-semibold transition-all ${
              eventTypeFilter === 'All'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Activity
          </button>

          <button
            type="button"
            onClick={() => setEventTypeFilter('Created')}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold transition-all ${
              eventTypeFilter === 'Created'
                ? 'bg-sky-600 text-white'
                : 'bg-sky-50 text-sky-700 hover:bg-sky-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-sky-500 inline-block"></span>
            <span>Created</span>
          </button>

          <button
            type="button"
            onClick={() => setEventTypeFilter('Completed')}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold transition-all ${
              eventTypeFilter === 'Completed'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
            <span>Completed</span>
          </button>

          <button
            type="button"
            onClick={() => setEventTypeFilter('Deleted')}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold transition-all ${
              eventTypeFilter === 'Deleted'
                ? 'bg-rose-600 text-white'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500 inline-block"></span>
            <span>Deleted</span>
          </button>
        </div>
      </div>

      {/* Main Grid & Day Detail Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid (2 cols on lg) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50 text-center py-2.5 text-xs font-bold uppercase tracking-wider text-slate-500">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 divide-x divide-y divide-slate-100">
            {calendarDays.map((item, index) => {
              const allDayEvents = eventsByDate[item.dateStr] || [];
              const dayEvents = eventTypeFilter === 'All' 
                ? allDayEvents 
                : allDayEvents.filter((e) => e.type === eventTypeFilter);

              const isSelected = selectedDateStr === item.dateStr;
              const isToday = todayStr === item.dateStr;

              const createdCount = allDayEvents.filter(e => e.type === 'Created').length;
              const completedCount = allDayEvents.filter(e => e.type === 'Completed').length;
              const deletedCount = allDayEvents.filter(e => e.type === 'Deleted').length;

              return (
                <div
                  key={`${item.dateStr}-${index}`}
                  onClick={() => setSelectedDateStr(item.dateStr)}
                  className={`min-h-[90px] sm:min-h-[105px] p-2 flex flex-col justify-between transition-all cursor-pointer select-none ${
                    !item.isCurrentMonth
                      ? 'bg-slate-50/40 text-slate-300'
                      : 'hover:bg-slate-50/80'
                  } ${
                    isSelected 
                      ? 'bg-indigo-50/40 ring-2 ring-indigo-500/50 z-10' 
                      : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                        isToday
                          ? 'bg-indigo-600 text-white'
                          : isSelected
                          ? 'bg-indigo-100 text-indigo-700'
                          : item.isCurrentMonth
                          ? 'text-slate-800'
                          : 'text-slate-300'
                      }`}
                    >
                      {item.dayNum}
                    </span>

                    {/* Dot indicators */}
                    <div className="flex items-center gap-1">
                      {createdCount > 0 && (
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-500" title={`${createdCount} Created`} />
                      )}
                      {completedCount > 0 && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title={`${completedCount} Completed`} />
                      )}
                      {deletedCount > 0 && (
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" title={`${deletedCount} Deleted`} />
                      )}
                    </div>
                  </div>

                  {/* Preview Event Snippets */}
                  <div className="space-y-1 mt-1 overflow-hidden">
                    {dayEvents.slice(0, 2).map((ev, i) => (
                      <div
                        key={i}
                        className={`text-[10px] px-1.5 py-0.5 rounded truncate font-medium flex items-center gap-1 ${
                          ev.type === 'Completed'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-100'
                            : ev.type === 'Created'
                            ? 'bg-sky-50 text-sky-800 border border-sky-100'
                            : 'bg-rose-50 text-rose-800 border border-rose-100'
                        }`}
                      >
                        <span className="font-bold">
                          {ev.type === 'Completed' ? '✓' : ev.type === 'Created' ? '+' : '✕'}
                        </span>
                        <span className="truncate">{ev.title}</span>
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <p className="text-[9px] text-slate-400 font-semibold px-1">
                        +{dayEvents.length - 2} more
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Day Details Panel */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex flex-col">
          <div className="border-b border-slate-100 pb-3 mb-4">
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
              <CalendarIcon className="w-4 h-4" />
              <span>Selected Day Activity</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-1">
              {new Date(selectedDateStr + 'T00:00:00').toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {selectedDayEvents.length} recorded events for this date
            </p>
          </div>

          {/* Events List */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[480px]">
            {selectedDayEvents.length === 0 ? (
              <div className="text-center py-12 px-4">
                <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700">No events on this day</p>
                <p className="text-xs text-slate-400 mt-1">
                  Select another day or click "New Task" to schedule an item.
                </p>
              </div>
            ) : (
              selectedDayEvents.map((ev, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border transition-all ${
                    ev.type === 'Completed'
                      ? 'bg-emerald-50/50 border-emerald-200/80'
                      : ev.type === 'Created'
                      ? 'bg-sky-50/50 border-sky-200/80'
                      : 'bg-rose-50/50 border-rose-200/80'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        ev.type === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ev.type === 'Created'
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {ev.type === 'Completed' && <CheckCircle2 className="w-3 h-3" />}
                      {ev.type === 'Created' && <PlusCircle className="w-3 h-3" />}
                      {ev.type === 'Deleted' && <Trash2 className="w-3 h-3" />}
                      <span>Task {ev.type}</span>
                    </span>

                    {ev.priority && (
                      <span className="text-[10px] font-semibold text-slate-500">
                        {ev.priority} Priority
                      </span>
                    )}
                  </div>

                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                    {ev.title}
                  </h4>

                  {ev.category && (
                    <p className="text-[11px] text-slate-500 mt-1">
                      Category: <span className="font-medium text-slate-700">{ev.category}</span>
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
