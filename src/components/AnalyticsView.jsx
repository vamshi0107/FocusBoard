import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  BarChart3, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Calendar, 
  Tag, 
  Trash2,
  PieChart,
  Layers,
  Activity
} from 'lucide-react';

export default function AnalyticsView({
  tasks,
  deletedTasks = [],
  stats,
  onBackToDashboard
}) {
  const [filterType, setFilterType] = useState('All'); // 'All' | 'Active' | 'Completed' | 'Deleted'

  // Combine active tasks and deleted tasks for comprehensive per-task analytics
  const allTasksCombined = useMemo(() => {
    const activeFormatted = tasks.map(t => ({ ...t, isDeleted: false }));
    const deletedFormatted = deletedTasks.map(t => ({ ...t, isDeleted: true }));
    return [...activeFormatted, ...deletedFormatted];
  }, [tasks, deletedTasks]);

  // Filter tasks for the per-task graph list
  const filteredTaskList = useMemo(() => {
    if (filterType === 'Active') return allTasksCombined.filter(t => !t.isDeleted && t.status !== 'Completed');
    if (filterType === 'Completed') return allTasksCombined.filter(t => !t.isDeleted && t.status === 'Completed');
    if (filterType === 'Deleted') return allTasksCombined.filter(t => t.isDeleted);
    return allTasksCombined;
  }, [allTasksCombined, filterType]);

  // Calculate dynamic distributions
  const totalActive = tasks.length;
  const inProgressCount = tasks.filter(t => t.status === 'In progress').length;
  const completedCount = tasks.filter(t => t.status === 'Completed').length;
  const toDoCount = tasks.filter(t => t.status === 'To do').length;
  const deletedCount = deletedTasks.length;

  const highPriorityCount = tasks.filter(t => t.priority === 'High').length;
  const mediumPriorityCount = tasks.filter(t => t.priority === 'Medium').length;
  const lowPriorityCount = tasks.filter(t => t.priority === 'Low').length;

  // Percentage calculations
  const inProgressPct = totalActive > 0 ? Math.round((inProgressCount / totalActive) * 100) : 0;
  const completedPct = totalActive > 0 ? Math.round((completedCount / totalActive) * 100) : 0;
  const toDoPct = totalActive > 0 ? Math.round((toDoCount / totalActive) * 100) : 0;

  // Helper to compute days under progress & progress percentage for each task
  const getTaskAnalytics = (task) => {
    const createdDate = task.createdAt ? new Date(task.createdAt) : new Date(task.dueDate || new Date());
    const now = new Date();

    if (task.isDeleted) {
      const deletedDate = task.deletedAt ? new Date(task.deletedAt) : now;
      const diffTime = Math.abs(deletedDate - createdDate);
      const days = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
      return {
        progressPct: 0,
        daysLabel: `Active ${days} days before deletion`,
        statusBadge: 'Deleted',
        badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
        barColor: 'bg-rose-500',
        dateLabel: `Deleted: ${task.deletedAt ? new Date(task.deletedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'}`
      };
    }

    if (task.status === 'Completed') {
      const completedDate = task.completedAt ? new Date(task.completedAt) : now;
      const diffTime = Math.abs(completedDate - createdDate);
      const days = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
      return {
        progressPct: 100,
        daysLabel: `Completed in ${days} ${days === 1 ? 'day' : 'days'}`,
        statusBadge: 'Completed',
        badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        barColor: 'bg-emerald-500',
        dateLabel: `Completed: ${task.completedAt ? new Date(task.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently'}`
      };
    }

    if (task.status === 'In progress') {
      const diffTime = Math.abs(now - createdDate);
      const days = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
      return {
        progressPct: 65,
        daysLabel: `${days} ${days === 1 ? 'day' : 'days'} under progress`,
        statusBadge: 'In Progress',
        badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        barColor: 'bg-indigo-600',
        dateLabel: `Created: ${task.createdAt ? new Date(task.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Active'}`
      };
    }

    // 'To do'
    return {
      progressPct: 15,
      daysLabel: 'Pending start (0 days active)',
      statusBadge: 'To Do',
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
      barColor: 'bg-slate-400',
      dateLabel: `Due: ${task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Pending'}`
    };
  };

  const priorityStyles = {
    High: 'bg-rose-50 text-rose-700 border-rose-200',
    Medium: 'bg-amber-50 text-amber-700 border-amber-200',
    Low: 'bg-sky-50 text-sky-700 border-sky-200'
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner Navigation */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={onBackToDashboard}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors mb-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </button>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-indigo-600" />
            <span>Task Analytics & Progress Breakdown</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time visual distribution, status progress graphs, and active lifecycle duration
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-2 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-600" />
            <div className="text-left">
              <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider">Completion</p>
              <p className="text-sm font-extrabold text-indigo-900 leading-none">{stats.completionRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Overview Analytics Graphs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Graph 1: Completion Rate Gauge Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Completion Rate
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>

          <div className="my-4 flex items-center gap-4">
            <div className="text-3xl sm:text-4xl font-black text-slate-900">
              {stats.completionRate}%
            </div>
            <div className="flex-1">
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full transition-all duration-700"
                  style={{ width: `${stats.completionRate}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1 font-medium">
                {completedCount} of {totalActive} tasks finished
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-between text-xs text-slate-500">
            <span>Target: 100% Sprint Goal</span>
            <span className="font-semibold text-emerald-600">On Track</span>
          </div>
        </div>

        {/* Graph 2: Status Distribution Bar Graph */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Status Distribution Graph
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>

          {/* Graphical Bars */}
          <div className="space-y-2.5 my-1">
            {/* Completed Bar */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>Completed</span>
                </span>
                <span>{completedCount} ({completedPct}%)</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${completedPct}%` }} />
              </div>
            </div>

            {/* In Progress Bar */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                  <span>In Progress</span>
                </span>
                <span>{inProgressCount} ({inProgressPct}%)</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full transition-all duration-500" style={{ width: `${inProgressPct}%` }} />
              </div>
            </div>

            {/* To Do Bar */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                  <span>To Do</span>
                </span>
                <span>{toDoCount} ({toDoPct}%)</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-slate-400 rounded-full transition-all duration-500" style={{ width: `${toDoPct}%` }} />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-xs text-slate-400 flex justify-between">
            <span>Total Active Tasks:</span>
            <span className="font-bold text-slate-700">{totalActive}</span>
          </div>
        </div>

        {/* Graph 3: Priority Breakdown Graph */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Priority Allocation Graph
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <PieChart className="w-4 h-4" />
            </div>
          </div>

          {/* Priority Bars */}
          <div className="space-y-2.5 my-1">
            {/* High Priority */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  <span>High Priority</span>
                </span>
                <span>{highPriorityCount} tasks</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full transition-all duration-500" style={{ width: `${totalActive > 0 ? (highPriorityCount / totalActive) * 100 : 0}%` }} />
              </div>
            </div>

            {/* Medium Priority */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span>Medium Priority</span>
                </span>
                <span>{mediumPriorityCount} tasks</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${totalActive > 0 ? (mediumPriorityCount / totalActive) * 100 : 0}%` }} />
              </div>
            </div>

            {/* Low Priority */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                  <span>Low Priority</span>
                </span>
                <span>{lowPriorityCount} tasks</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-sky-500 rounded-full transition-all duration-500" style={{ width: `${totalActive > 0 ? (lowPriorityCount / totalActive) * 100 : 0}%` }} />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-xs text-slate-400 flex justify-between">
            <span>Archived / Deleted:</span>
            <span className="font-bold text-rose-600">{deletedCount}</span>
          </div>
        </div>
      </div>

      {/* Individual Per-Task Progress & Velocity Section */}
      <section className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Individual Task Progress & Lifecycle Graphs
            </h3>
            <p className="text-xs text-slate-500">
              Individual progress graph, duration under progress, priority, and completion/deletion milestones
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {['All', 'Active', 'Completed', 'Deleted'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilterType(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  filterType === tab
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab === 'All' ? `All (${allTasksCombined.length})` : tab}
              </button>
            ))}
          </div>
        </div>

        {/* Per-Task Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTaskList.map((task) => {
            const analytics = getTaskAnalytics(task);

            return (
              <div
                key={`${task.id}-${task.isDeleted ? 'del' : 'act'}`}
                className={`rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                  task.isDeleted
                    ? 'bg-rose-50/20 border-rose-200/70'
                    : 'bg-white border-slate-200/90 hover:border-indigo-200 hover:shadow-xs'
                }`}
              >
                {/* Top Row: Category, Priority, Status */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {task.category && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                          {task.category}
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${priorityStyles[task.priority] || priorityStyles.Medium}`}>
                        {task.priority} Priority
                      </span>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide border ${analytics.badgeColor}`}>
                      {analytics.statusBadge}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 leading-snug">
                    {task.title}
                  </h4>
                  {task.description && (
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {task.description}
                    </p>
                  )}
                </div>

                {/* Progress Graph for This Specific Task */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700 flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Task Progress</span>
                    </span>
                    <span className="font-extrabold text-slate-900">
                      {analytics.progressPct}%
                    </span>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${analytics.barColor} rounded-full transition-all duration-500`}
                      style={{ width: `${analytics.progressPct}%` }}
                    />
                  </div>

                  {/* Lifecycle Durations & Dates */}
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1.5 text-slate-600">
                    {/* Days Under Progress */}
                    <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                      <Clock className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span>{analytics.daysLabel}</span>
                    </div>

                    {/* Milestone Date (Completed / Deleted / Due) */}
                    <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{analytics.dateLabel}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
