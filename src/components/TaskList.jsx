import React from 'react';
import TaskCard from './TaskCard';
import { ClipboardList, Plus, RotateCcw, SearchX } from 'lucide-react';

export default function TaskList({
  tasks,
  totalTasksCount,
  searchQuery,
  onEdit,
  onDelete,
  onStatusChange,
  onOpenCreateTask,
  onResetFilters
}) {
  if (tasks.length === 0) {
    const isSearching = Boolean(searchQuery && searchQuery.trim().length > 0);

    return (
      <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 sm:p-12 text-center flex flex-col items-center justify-center">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
          {isSearching ? <SearchX className="w-7 h-7 text-indigo-500" /> : <ClipboardList className="w-7 h-7" />}
        </div>

        {totalTasksCount === 0 ? (
          <>
            <h3 className="text-base sm:text-lg font-bold text-slate-800">
              No tasks yet
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mt-1 mb-5">
              Get started by creating your first task to track progress and statistics.
            </p>
            <button
              type="button"
              onClick={onOpenCreateTask}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs sm:text-sm font-semibold hover:bg-indigo-700 transition-all shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Create Task</span>
            </button>
          </>
        ) : isSearching ? (
          <>
            <h3 className="text-base sm:text-lg font-bold text-slate-800">
              No tasks matching "{searchQuery}"
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mt-1 mb-5">
              We couldn't find any tasks containing this keyword. Try searching with a different term or clear your search query.
            </p>
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs sm:text-sm font-semibold hover:bg-indigo-700 transition-all shadow-xs"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Clear Search</span>
            </button>
          </>
        ) : (
          <>
            <h3 className="text-base sm:text-lg font-bold text-slate-800">
              No matching tasks found
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mt-1 mb-5">
              We couldn't find any tasks matching your current status or priority filter combination.
            </p>
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 text-white text-xs sm:text-sm font-semibold hover:bg-slate-900 transition-all shadow-xs"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Clear Filters</span>
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
}
