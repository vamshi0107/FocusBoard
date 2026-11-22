import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';

export default function FilterTabs({
  selectedStatus,
  setSelectedStatus,
  selectedPriority,
  setSelectedPriority,
  statusCounts,
  onResetFilters,
  isFiltered
}) {
  const statusOptions = [
    { label: 'All', value: 'All', count: statusCounts.all },
    { label: 'To do', value: 'To do', count: statusCounts.toDo },
    { label: 'In progress', value: 'In progress', count: statusCounts.inProgress },
    { label: 'Completed', value: 'Completed', count: statusCounts.completed },
  ];

  const priorityOptions = ['All', 'High', 'Medium', 'Low'];

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs">
      {/* Status Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0" role="tablist" aria-label="Task Status Filters">
        {statusOptions.map((tab) => {
          const isActive = selectedStatus === tab.value;
          return (
            <button
              key={tab.value}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setSelectedStatus(tab.value)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive
                    ? 'bg-slate-700 text-slate-100'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Priority Dropdown & Reset */}
      <div className="flex items-center justify-between w-full md:w-auto gap-2">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span>Priority:</span>
        </div>

        <select
          value={selectedPriority}
          onChange={(e) => setSelectedPriority(e.target.value)}
          className="bg-slate-50 border border-slate-200 text-slate-700 text-xs sm:text-sm rounded-xl px-2.5 py-1.5 font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
          aria-label="Filter tasks by priority"
        >
          {priorityOptions.map((priority) => (
            <option key={priority} value={priority}>
              {priority === 'All' ? 'All Priorities' : priority}
            </option>
          ))}
        </select>

        {isFiltered && (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
            title="Reset all filters"
            aria-label="Reset all filters"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        )}
      </div>
    </div>
  );
}
