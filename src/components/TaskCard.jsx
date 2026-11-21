import React from 'react';
import { 
  Calendar, 
  Pencil, 
  Trash2, 
  Tag,
  CheckCircle2,
  Clock,
  CircleDot
} from 'lucide-react';

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const { id, title, description, category, status, priority, dueDate } = task;

  const priorityStyles = {
    High: 'bg-rose-50 text-rose-700 border-rose-200/80',
    Medium: 'bg-amber-50 text-amber-700 border-amber-200/80',
    Low: 'bg-sky-50 text-sky-700 border-sky-200/80',
  };

  const statusStyles = {
    'Completed': {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: CheckCircle2,
      dot: 'bg-emerald-500'
    },
    'In progress': {
      bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      icon: Clock,
      dot: 'bg-indigo-500'
    },
    'To do': {
      bg: 'bg-slate-100 text-slate-700 border-slate-200',
      icon: CircleDot,
      dot: 'bg-slate-400'
    }
  };

  const currentStatusConfig = statusStyles[status] || statusStyles['To do'];
  const StatusIcon = currentStatusConfig.icon;

  const formattedDate = dueDate
    ? new Date(dueDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : 'No deadline';

  return (
    <article
      className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between group"
      aria-label={`Task: ${title}`}
    >
      <div>
        {/* Top Badges: Category, Priority, Action Buttons */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            {category && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                <Tag className="w-3 h-3 text-slate-400" />
                <span>{category}</span>
              </span>
            )}
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[11px] font-bold border ${
                priorityStyles[priority] || priorityStyles.Medium
              }`}
            >
              {priority}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={() => onEdit(task)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
              aria-label={`Edit task ${title}`}
              title="Edit Task"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(task)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              aria-label={`Delete task ${title}`}
              title="Delete Task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Task Title */}
        <h4 className="text-base font-bold text-slate-800 leading-snug line-clamp-2">
          {title}
        </h4>

        {/* Task Description */}
        {description && (
          <p className="text-xs sm:text-sm text-slate-500 mt-2 line-clamp-3 leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* Bottom Bar: Status Selector & Due Date */}
      <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
        {/* Quick Status Selector */}
        <div className="flex items-center gap-1.5">
          <label htmlFor={`status-${id}`} className="sr-only">Change status for {title}</label>
          <div className="relative inline-flex items-center">
            <select
              id={`status-${id}`}
              value={status}
              onChange={(e) => onStatusChange(id, e.target.value)}
              className={`text-xs font-semibold rounded-lg px-2.5 py-1 border appearance-none pr-6 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 ${currentStatusConfig.bg}`}
            >
              <option value="To do">To do</option>
              <option value="In progress">In progress</option>
              <option value="Completed">Completed</option>
            </select>
            <StatusIcon className="w-3.5 h-3.5 absolute right-1.5 pointer-events-none opacity-70" />
          </div>
        </div>

        {/* Due Date */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
          <Calendar className="w-3.5 h-3.5" />
          <span>{formattedDate}</span>
        </div>
      </div>
    </article>
  );
}
