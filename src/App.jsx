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
import SettingsModal from './components/SettingsModal';
import CalendarView from './components/CalendarView';
import ProfileModal from './components/ProfileModal';
import { sampleTasks, sampleDeletedTasks } from './data/sampleTasks';
import { useLocalStorage } from './hooks/useLocalStorage';

export default function App() {
  // Persistence via custom localStorage hooks
  const [tasks, setTasks] = useLocalStorage('focusboard_tasks', sampleTasks);
  const [deletedTasks, setDeletedTasks] = useLocalStorage('focusboard_deleted_tasks', sampleDeletedTasks);

  // Navigation & UI State
  const [activeNav, setActiveNav] = useState('Dashboard'); // 'Dashboard' | 'My Tasks' | 'Analytics' | 'Calendar' | 'Settings'
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Candidate Profile State (Persisted in localStorage)
  const [candidateProfile, setCandidateProfile] = useLocalStorage('focusboard_candidate_profile', {
    name: 'Vamshi Raikanti',
    role: 'Frontend Engineer Candidate',
    email: 'rsaivamshi098@gmail.com',
    github: 'https://github.com/vamshi0107',
    portfolio: 'https://focusboard-kohl.vercel.app/',
    bio: 'Frontend developer passionate about building high-performance, accessible, and responsive web applications using React, modern JavaScript, and Tailwind CSS.',
    skills: ['React 19', 'JavaScript (ES6+)', 'Tailwind CSS v4', 'Vite', 'HTML5 & CSS3', 'Responsive UI/UX', 'LocalStorage API', 'Git & GitHub']
  });

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');

  // Derive Statistics Dynamically (never hardcoded)
  // Human engineering note: using useMemo here eliminates duplicate state and prevents desync bugs.
  // Edge case: division-by-zero is guarded so 0 tasks gracefully shows 0% instead of NaN.
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

  // Navigation Click Handler
  const handleNavClick = (navName) => {
    setActiveNav(navName);
    setIsSidebarOpen(false); // Close mobile drawer

    if (navName === 'Dashboard') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (navName === 'My Tasks') {
      const el = document.getElementById('tasks-section');
      el?.scrollIntoView({ behavior: 'smooth' });
    } else if (navName === 'Analytics') {
      const el = document.getElementById('analytics-section');
      el?.scrollIntoView({ behavior: 'smooth' });
    } else if (navName === 'Calendar') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (navName === 'Settings') {
      setIsSettingsOpen(true);
    }
  };

  // CRUD Operations with Lifecycle Tracking (Created, Completed, Deleted)
  const handleCreateOrUpdateTask = (formData) => {
    const nowIso = new Date().toISOString();

    if (taskToEdit) {
      // Update existing task
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id === taskToEdit.id) {
            const isNowCompleted = formData.status === 'Completed';
            const wasCompleted = t.status === 'Completed';
            return {
              ...t,
              ...formData,
              completedAt: isNowCompleted ? (t.completedAt || nowIso) : null
            };
          }
          return t;
        })
      );
    } else {
      // Create new task with unique ID & creation timestamp
      const isCompleted = formData.status === 'Completed';
      const newTask = {
        ...formData,
        id: `TASK-${Date.now().toString().slice(-4)}`,
        createdAt: nowIso,
        completedAt: isCompleted ? nowIso : null
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
    const targetTask = tasks.find((t) => t.id === taskId);
    if (targetTask) {
      // Record deleted task in lifecycle history
      const deletedRecord = {
        ...targetTask,
        deletedAt: new Date().toISOString()
      };
      setDeletedTasks((prev) => [deletedRecord, ...prev]);
    }

    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    setIsDeleteModalOpen(false);
    setTaskToDelete(null);
  };

  const handleStatusChange = (taskId, newStatus) => {
    const nowIso = new Date().toISOString();
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const isCompleted = newStatus === 'Completed';
          return {
            ...t,
            status: newStatus,
            completedAt: isCompleted ? (t.completedAt || nowIso) : null
          };
        }
        return t;
      })
    );
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedStatus('All');
    setSelectedPriority('All');
  };

  // Settings & Storage Presets
  const handleResetToSampleTasks = () => {
    setTasks(sampleTasks);
    setDeletedTasks(sampleDeletedTasks);
  };

  const handleClearAllTasks = () => {
    setTasks([]);
    setDeletedTasks([]);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      {/* Sidebar Navigation */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        activeNav={activeNav}
        onNavClick={handleNavClick}
        onOpenProfile={() => setIsProfileOpen(true)}
        profile={candidateProfile}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header 
          onOpenSidebar={() => setIsSidebarOpen(true)}
          onOpenCreateTask={handleOpenCreateModal}
          onOpenProfile={() => setIsProfileOpen(true)}
          profile={candidateProfile}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {activeNav === 'Calendar' ? (
            /* Calendar View */
            <CalendarView
              tasks={tasks}
              deletedTasks={deletedTasks}
              onBackToDashboard={() => setActiveNav('Dashboard')}
              onOpenCreateTask={handleOpenCreateModal}
            />
          ) : (
            /* Main Dashboard View */
            <>
              {/* Section 1: Dashboard Statistics Cards (Analytics Section) */}
              <div id="analytics-section">
                <StatCard stats={stats} />
              </div>

              {/* Section 2: 3-Slide Focus Notes Carousel */}
              <FocusNotes />

              {/* Section 3: Search, Multi-Criteria Filters & Task List */}
              <section id="tasks-section" aria-label="Task Management Controls" className="space-y-4 pt-2">
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

                {/* Section 4: Task List Grid */}
                <TaskList
                  tasks={filteredTasks}
                  totalTasksCount={tasks.length}
                  searchQuery={searchQuery}
                  onEdit={handleOpenEditModal}
                  onDelete={handleOpenDeleteModal}
                  onStatusChange={handleStatusChange}
                  onOpenCreateTask={handleOpenCreateModal}
                  onResetFilters={handleResetFilters}
                />
              </section>
            </>
          )}
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

      {/* Settings & LocalStorage Management Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => {
          setIsSettingsOpen(false);
          setActiveNav('Dashboard');
        }}
        onResetToSampleTasks={handleResetToSampleTasks}
        onClearAllTasks={handleClearAllTasks}
        totalTasks={tasks.length}
      />

      {/* Candidate Profile Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={candidateProfile}
        onSaveProfile={setCandidateProfile}
      />
    </div>
  );
}
