import React from 'react';
import { CheckCircle2, Clock, ListTodo, TrendingUp } from 'lucide-react';

export default function StatCard({ stats }) {
  const { total, inProgress, completed, toTodo, completionRate } = stats;

  const cards = [
    {
      title: 'Total Tasks',
      value: total,
      subtext: 'Across all categories',
      icon: ListTodo,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
      progress: null
    },
    {
      title: 'In Progress',
      value: inProgress,
      subtext: 'Active workload',
      icon: Clock,
      color: 'text-amber-600 bg-amber-50 border-amber-100',
      progress: total > 0 ? (inProgress / total) * 100 : 0
    },
    {
      title: 'Completed',
      value: completed,
      subtext: `${toTodo} remaining to do`,
      icon: CheckCircle2,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
      progress: total > 0 ? (completed / total) * 100 : 0
    },
    {
      title: 'Completion Rate',
      value: `${completionRate}%`,
      subtext: `${completed} of ${total} finished`,
      icon: TrendingUp,
      color: 'text-violet-600 bg-violet-50 border-violet-100',
      progress: completionRate
    }
  ];

  return (
    <section aria-label="Task Statistics" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {card.title}
                </p>
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                  {card.value}
                </p>
              </div>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${card.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>{card.subtext}</span>
              {card.progress !== null && (
                <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(0, card.progress))}%` }}
                  />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </section>
  );
}
