import React, { useState, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StatCard from './components/StatCard';
import FocusNotes from './components/FocusNotes';
import SearchBar from './components/SearchBar';
import FilterTabs from './components/FilterTabs';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import { sampleTasks } from './data/sampleTasks';
import { useLocalStorage } from './hooks/useLocalStorage';

export default function App() {
  // Persistence via custom localStorage hook
  const [tasks, setTasks] = useLocalStorage('focusboard_tasks', sampleTasks);

  // UI & Navigation State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');

  // Derive Statistics Dynamically (never hardcoded)
  const stats = useMemo(() => {
    const total = tasks.length;
    const inProgress = tasks.filter((t) => t.status === 'In progress').length;
    const completed = tasks.filter((t) => t.status === 'Completed').length;
    const toTodo = tasks.filter((t) => t.status === 'To do').length;
    const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);

    return { total, inProgress, completed, toTodo, completionRate };
  }, [tasks]);

  // Status Counts for Filter Tabs
  const statusCounts = useMemo(() => {
    return {
      all: tasks.length,
      toDo: tasks.filter((t) => t.status === 'To do').length,
      inProgress: tasks.filter((t) => t.status === 'In progress').length,
      completed: tasks.filter((t) => t.status === 'Completed').length,
    };
  }, [tasks]);

  // Combined Filtering: Search AND Status AND Priority
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // 1. Search Query Filter (case-insensitive title match)
      const matchesSearch = searchQuery.trim() === '' || 
        task.title.toLowerCase().includes(searchQuery.toLowerCase().trim());

      // 2. Status Filter
      const matchesStatus = selectedStatus === 'All' || task.status === selectedStatus;

      // 3. Priority Filter
      const matchesPriority = selectedPriority === 'All' || task.priority === selectedPriority;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, searchQuery, selectedStatus, selectedPriority]);

  const isFiltered = searchQuery.trim() !== '' || selectedStatus !== 'All' || selectedPriority !== 'All';

  // CRUD Operations
  const handleCreateOrUpdateTask = (formData) => {
    if (taskToEdit) {
      // Update existing task
      setTasks((prev) =>
        prev.map((t) => (t.id === taskToEdit.id ? { ...t, ...formData } : t))
      );
    } else {
      // Create new task with unique ID
      const newTask = {
        ...formData,
        id: `TASK-${Date.now().toString().slice(-4)}`
      };
      setTasks((prev) => [newTask, ...prev]);
    }
    setTaskToEdit(null);
  };

  const handleOpenCreateModal = () => {
    setTaskToEdit(null);
    setIsFormOpen(true);
  };

  const handleOpenEditModal = (task) => {
    setTaskToEdit(task);
    setIsFormOpen(true);
  };

  const handleOpenDeleteModal = (task) => {
    setTaskToDelete(task);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = (taskId) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    setIsDeleteModalOpen(false);
    setTaskToDelete(null);
  };

  const handleStatusChange = (taskId, newStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedStatus('All');
    setSelectedPriority('All');
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      {/* Sidebar Navigation */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header 
          onOpenSidebar={() => setIsSidebarOpen(true)}
          onOpenCreateTask={handleOpenCreateModal}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* Section 1: Dashboard Statistics Cards */}
          <StatCard stats={stats} />

          {/* Section 2: 3-Slide Focus Notes Carousel */}
          <FocusNotes />

          {/* Section 3: Search & Multi-Criteria Filters */}
          <section aria-label="Task Management Controls" className="space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                  Tasks Overview
                </h3>
                <p className="text-xs text-slate-500">
                  Manage, filter, and track project tasks in real time
                </p>
              </div>

              {/* Search Bar */}
              <SearchBar 
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            </div>

            {/* Filter Tabs & Priority Filter */}
            <FilterTabs 
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
              selectedPriority={selectedPriority}
              setSelectedPriority={setSelectedPriority}
              statusCounts={statusCounts}
              onResetFilters={handleResetFilters}
              isFiltered={isFiltered}
            />
          </section>

          {/* Section 4: Task List Grid */}
          <section aria-label="Task Cards List">
            <TaskList
              tasks={filteredTasks}
              totalTasksCount={tasks.length}
              onEdit={handleOpenEditModal}
              onDelete={handleOpenDeleteModal}
              onStatusChange={handleStatusChange}
              onOpenCreateTask={handleOpenCreateModal}
              onResetFilters={handleResetFilters}
            />
          </section>
        </main>
      </div>

      {/* Create / Edit Task Modal */}
      <TaskForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setTaskToEdit(null);
        }}
        onSubmit={handleCreateOrUpdateTask}
        taskToEdit={taskToEdit}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setTaskToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        task={taskToDelete}
      />
    </div>
  );
}
