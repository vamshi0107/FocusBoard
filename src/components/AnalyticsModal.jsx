import React, { useState, useMemo, useEffect } from 'react';
import { 
  X, 
  BarChart3, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  Layers, 
  PieChart 
} from 'lucide-react';

export default function AnalyticsModal({ 
  isOpen, 
  onClose, 
  tasks = [], 
  stats = { completionRate: 0, completed: 0, total: 0 } 
}) {
  const [filterType, setFilterType] = useState('All');

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

  const total = tasks.length;
  const inProgress = tasks.filter((t) => t.status === 'In progress').length;
  const completed = tasks.filter((t) => t.status === 'Completed').length;
  const toDo = tasks.filter((t) => t.status === 'To do').length;

  const highPriority = tasks.filter((t) => t.priority === 'High').length;
  const medPriority = tasks.filter((t) => t.priority === 'Medium').length;
  const lowPriority = tasks.filter((t) => t.priority === 'Low').length;

  const inProgressPct = total > 0 ? Math.round((inProgress / total) * 100) : 0;
  const completedPct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const toDoPct = total > 0 ? Math.round((toDo / total) * 100) : 0;

  // Filter task list
  const filteredTasks = tasks.filter((t) => {
    if (filterType === 'In progress') return t.status === 'In progress';
    if (filterType === 'Completed') return t.status === 'Completed';
    if (filterType === 'To do') return t.status === 'To do';
    return true;
  });

  const getTaskVelocity = (task) => {
    const created = task.createdAt ? new Date(task.createdAt) : new Date(task.dueDate || new Date());
    const now = new Date();

    if (task.status === 'Completed') {
      const comp = task.completedAt ? new Date(task.completedAt) : now;
      const days = Math.max(1, Math.ceil(Math.abs(comp - created) / (1000 * 60 * 60 * 24)));
      return {
        progress: 100,
        daysText: `Completed in ${days} ${days === 1 ? 'day' : 'days'}`,
        color: 'bg-emerald-500'
      };
    }

    if (task.status === 'In progress') {
      const days = Math.max(1, Math.ceil(Math.abs(now - created) / (1000 * 60 * 60 * 24)));
      return {
        progress: 65,
        daysText: `${days} ${days === 1 ? 'day' : 'days'} under progress`,
        color: 'bg-indigo-600'
      };
    }

    return {
      progress: 10,
      daysText: 'Pending start (0 days)',
      color: 'bg-slate-400'
    };
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="analytics-modal-title"
    >
      <div 
        className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h3 id="analytics-modal-title" className="text-base font-bold text-slate-900 leading-tight">
                Sprint Analytics & Velocity
              </h3>
              <p className="text-[11px] text-slate-500">
                Visual progress breakdown and duration tracking per task
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

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Top 3 Metric Cards with Visual Bars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Completion Meter */}
            <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/40 space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-indigo-900">
                <span>Completion Rate</span>
                <span className="text-base font-extrabold text-indigo-600">{stats.completionRate}%</span>
              </div>
              <div className="w-full h-2 bg-indigo-200/60 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full transition-all duration-500" style={{ width: `${stats.completionRate}%` }} />
              </div>
              <p className="text-[10px] text-indigo-600/80 font-medium">{stats.completed} of {stats.total} finished</p>
            </div>

            {/* Status Breakdown Bar */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
              <div className="flex justify-between items-center text-xs font-bold text-slate-800">
                <span>Status Allocation</span>
                <span className="text-xs font-semibold text-slate-500">{total} total</span>
              </div>
              <div className="flex h-2 rounded-full overflow-hidden gap-0.5 bg-slate-200">
                <div style={{ width: `${completedPct}%` }} className="bg-emerald-500" title={`Completed: ${completed}`} />
                <div style={{ width: `${inProgressPct}%` }} className="bg-indigo-600" title={`In Progress: ${inProgress}`} />
                <div style={{ width: `${toDoPct}%` }} className="bg-slate-400" title={`To Do: ${toDo}`} />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 font-semibold pt-0.5">
                <span className="text-emerald-600">{completed} Done</span>
                <span className="text-indigo-600">{inProgress} In Prog</span>
                <span className="text-slate-600">{toDo} To Do</span>
              </div>
            </div>

            {/* Priority Allocation */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
              <div className="flex justify-between items-center text-xs font-bold text-slate-800">
                <span>Priority Allocation</span>
                <span className="text-xs font-semibold text-rose-600">{highPriority} High</span>
              </div>
              <div className="flex h-2 rounded-full overflow-hidden gap-0.5 bg-slate-200">
                <div style={{ width: `${total > 0 ? (highPriority / total) * 100 : 0}%` }} className="bg-rose-500" />
                <div style={{ width: `${total > 0 ? (medPriority / total) * 100 : 0}%` }} className="bg-amber-500" />
                <div style={{ width: `${total > 0 ? (lowPriority / total) * 100 : 0}%` }} className="bg-sky-500" />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 font-semibold pt-0.5">
                <span className="text-rose-600">{highPriority} High</span>
                <span className="text-amber-600">{medPriority} Med</span>
                <span className="text-sky-600">{lowPriority} Low</span>
              </div>
            </div>
          </div>

          {/* Individual Tasks Progress List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Individual Task Progress & Days Under Progress
              </h4>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1">
                {['All', 'In progress', 'Completed', 'To do'].map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setFilterType(status)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                      filterType === status
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Task Progress Cards */}
            <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
              {filteredTasks.length === 0 ? (
                <p className="text-center py-6 text-xs text-slate-400">No tasks in this category</p>
              ) : (
                filteredTasks.map((task) => {
                  const velocity = getTaskVelocity(task);

                  return (
                    <div
                      key={task.id}
                      className="p-3.5 rounded-xl border border-slate-200/80 hover:border-indigo-200 transition-all bg-white space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-bold text-slate-900 truncate">{task.title}</span>
                          {task.category && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                              {task.category}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] font-extrabold text-slate-700 shrink-0">{velocity.progress}%</span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${velocity.color} rounded-full transition-all duration-500`}
                          style={{ width: `${velocity.progress}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span className="flex items-center gap-1 font-semibold text-slate-700">
                          <Clock className="w-3 h-3 text-indigo-500" />
                          <span>{velocity.daysText}</span>
                        </span>
                        <span className="font-medium text-slate-400">Priority: {task.priority}</span>
                      </div>
                    </div>
                  );
                })
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
            Close Analytics
          </button>
        </div>
      </div>
    </div>
  );
}
