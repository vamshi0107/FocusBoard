# FocusBoard – Task Management Dashboard

FocusBoard is a responsive, accessible task management dashboard built with React 19, Vite, Tailwind CSS v4, and Lucide Icons based on the company's Figma design specifications.

---

## 🌐 Live Demo & Repository
- **Live Hosted Application:** [https://focusboard-kohl.vercel.app/](https://focusboard-kohl.vercel.app/)
- **GitHub Repository:** [https://github.com/vamshi0107/FocusBoard](https://github.com/vamshi0107/FocusBoard)

---

## 📋 Project Overview & Objective

The primary objective of **FocusBoard** is to provide an intuitive, high-performance task management workspace for individual contributors and agile teams. Built from the ground up according to high-fidelity Figma specifications, the application demonstrates:
- Component-driven React architecture and clean unidirectional data flow.
- Seamless browser-side persistence with robust error handling.
- Real-time search and multi-criteria status & priority filtering.
- Dynamically derived metrics without state duplication.
- Cross-platform responsiveness across Desktop (1440px), Tablet (768px), and Mobile (390px) viewports.

---

## 🛠️ Technology Stack

| Technology | Purpose | Selection Justification |
| :--- | :--- | :--- |
| **React 19** | UI Library | Component-based view layer, declarative state hooks, and virtual DOM efficiency. |
| **Vite 8** | Build Tool & Dev Server | Instant Hot Module Replacement (HMR) and optimized Rollup production builds. |
| **JavaScript (ES6+)** | Core Logic | Modern ECMAScript features (destructuring, arrow functions, template literals, optional chaining). |
| **Tailwind CSS v4** | Utility-First Styling | Fast responsive breakpoint styling, zero runtime overhead, and clean typography. |
| **Lucide React** | Icons | Lightweight, tree-shakeable SVG icon components matching Figma mockups. |
| **localStorage API** | Client Persistence | Browser-native key-value store ensuring zero backend latency and offline capability. |

> **Note on Architecture Choice:** As recommended by the 24-hour assignment constraints, external state managers (e.g. Redux Toolkit, MobX), backend frameworks, and third-party UI component libraries were deliberately excluded. Native React Hooks and custom hooks were utilized to minimize bundle size, maintain full transparency over code logic, and avoid unnecessary architectural complexity.

---

## ✨ Key Features Implemented

1. **Responsive Multi-Viewport Dashboard:**
   - **Desktop (1440px):** Permanent navigation sidebar, 4 overview metric cards, productivity carousel, search & filter toolbar, and 3-column task grid.
   - **Tablet (768px):** Collapsible slide-over drawer navigation, 2×2 metrics grid, and 2-column task layout.
   - **Mobile (390px):** Full-screen touch drawer, single-column stacked cards, full-width touch-friendly form dialogs, and zero horizontal scrolling.

2. **Task CRUD Operations:**
   - **Create:** Accessible modal form with input validation (whitespace trimming, required fields, date limits).
   - **Read / View:** High-visibility task cards featuring category tags, priority accents, status badges, and deadline indicators.
   - **Update / Edit:** Pre-populated modal preserving original unique IDs and creation dates.
   - **Delete:** Two-step confirmation dialog preventing accidental task deletion.
   - **Quick Status Updates:** Direct on-card dropdown (`To do` $\leftrightarrow$ `In progress` $\leftrightarrow$ `Completed`) that triggers instantaneous metric recalculations.

3. **Multi-Criteria Filter & Case-Insensitive Search:**
   - **Live Keyword Search:** Substring matching on task titles as the user types, with a 1-click clear action.
   - **Status Tabs:** Filter by `All`, `To do`, `In progress`, or `Completed` with dynamic item count badges.
   - **Priority Filter:** Dropdown filtering by `All`, `High`, `Medium`, or `Low`.
   - **Multiplicative AND Logic:** Search query, status tabs, and priority filters work together simultaneously (`Search ∩ Status ∩ Priority`).

4. **3-Slide Focus Notes Productivity Carousel:**
   - Interactive carousel featuring circular Previous/Next navigation, active slide counter (`FOCUS NOTES · X OF 3`), and clickable dot indicators with direct slide jumping.

5. **Task Lifecycle Calendar View:**
   - Full monthly calendar tracking task creation (`createdAt`), completion (`completedAt`), and deletion history (`deletedAt`).
   - Interactive day selection with an activity timeline drawer.

6. **Browser Data Persistence (`localStorage`):**
   - Automatically initializes with 6 diverse sample tasks if storage is empty.
   - Persists all additions, edits, status toggles, and deletions across page reloads without overwriting user data.
   - Includes a **Settings Modal** to easily test the 0-tasks empty state or reset back to the initial 6 sample tasks.

---

## 📁 Project Architecture & Folder Structure

```text
focusboard/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Sidebar.jsx            # Desktop sidebar and mobile navigation drawer
│   │   ├── Header.jsx             # Top header, current date, and New Task trigger
│   │   ├── StatCard.jsx           # 4 dynamic overview cards (Total, In Progress, Completed, %)
│   │   ├── FocusNotes.jsx         # 3-slide productivity notes carousel
│   │   ├── SearchBar.jsx          # Reusable title search input with clear trigger
│   │   ├── FilterTabs.jsx         # Status tabs and priority filter dropdown
│   │   ├── TaskList.jsx           # Responsive task card grid and contextual empty states
│   │   ├── TaskCard.jsx           # Individual card with quick status dropdown and action triggers
│   │   ├── TaskForm.jsx           # Unified Create and Edit task modal with validation
│   │   ├── DeleteConfirmModal.jsx # Deletion safety confirmation dialog
│   │   ├── SettingsModal.jsx      # LocalStorage inspector, sample reset, and clear tools
│   │   └── CalendarView.jsx       # Task lifecycle calendar (Created, Completed, Deleted)
│   ├── data/
│   │   └── sampleTasks.js         # Default 6 sample tasks and archived task history
│   ├── hooks/
│   │   └── useLocalStorage.js    # Custom React hook for robust localStorage synchronization
│   ├── App.jsx                    # Root state coordinator and layout organizer
│   ├── index.css                  # Tailwind CSS v4 directives and accessibility resets
│   └── main.jsx                   # React 19 application entry mount
├── README.md                      # Comprehensive project documentation
├── AI_USAGE.md                    # Transparent disclosure of AI assistance
├── package.json
└── vite.config.js
```

---

## 🧠 State Management Explanation

### 1. Selected State-Management Approach
FocusBoard utilizes **Native React State & Custom Hooks** (`useState`, `useEffect`, `useMemo`, and `useLocalStorage`). 

**Why this approach was chosen:**
- **Zero Overhead & Bundle Economy:** Avoids bringing in heavy third-party state managers (Redux, MobX, Zustand) for an application that does not require cross-network synchronization or multi-tab pub/sub streaming.
- **Predictable Unidirectional Data Flow:** State is maintained in the root `App.jsx` component and flows down to child components via typed props, while user interactions trigger callbacks upward.
- **Derived State Efficiency:** Using `useMemo` guarantees that calculated values (such as completion percentages and filter results) are only recomputed when their exact dependencies change.

### 2. How Task Data is Maintained
Task data is maintained as an array of structured task objects in `App.jsx`:
```javascript
const [tasks, setTasks] = useLocalStorage('focusboard_tasks', sampleTasks);
```
Each task adheres to a strict schema:
- `id`: Unique identifier (e.g., `TASK-101`).
- `title`: String (validated, whitespace trimmed).
- `description`: String (optional supplementary notes).
- `category`: Category string (`Design`, `Development`, `Testing`, `Research`).
- `status`: Progress status (`To do`, `In progress`, `Completed`).
- `priority`: Urgency level (`Low`, `Medium`, `High`).
- `dueDate`: ISO date string (`YYYY-MM-DD`).
- `createdAt` & `completedAt`: ISO lifecycle timestamps.

### 3. How CRUD Operations Update State
All state mutations follow React immutable state update principles:
- **Create:** Newly created tasks are generated with a unique timestamp ID (`TASK-${Date.now()}`) and prepended to the array:
  ```javascript
  setTasks(prev => [newTask, ...prev]);
  ```
- **Read:** Displayed tasks are read from `filteredTasks` (the memoized output of search and active filters applied to `tasks`).
- **Update / Edit:** Updated tasks immutably replace the existing item by matching IDs while preserving the original creation date:
  ```javascript
  setTasks(prev => prev.map(t => t.id === updatedTask.id ? { ...t, ...updatedTask } : t));
  ```
- **Delete:** Tasks are removed by filtering out the target ID:
  ```javascript
  setTasks(prev => prev.filter(t => t.id !== taskId));
  ```
  *(Deleted tasks are automatically appended to `deletedTasks` for audit and calendar tracking).*
- **Quick Status Toggle:** Changing status from the card dropdown immutably maps over `tasks`, updates the status, sets or clears `completedAt`, and triggers recalculation of overview statistics.

### 4. How Derived Statistics & Filters are Calculated
To avoid redundant state variables and out-of-sync data bugs, all statistics are derived on the fly using `useMemo`:
```javascript
const stats = useMemo(() => {
  const total = tasks.length;
  const inProgress = tasks.filter(t => t.status === 'In progress').length;
  const completed = tasks.filter(t => t.status === 'Completed').length;
  const toTodo = tasks.filter(t => t.status === 'To do').length;
  const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);

  return { total, inProgress, completed, toTodo, completionRate };
}, [tasks]);
```
*(Division-by-zero is explicitly guarded: when `total === 0`, `completionRate` safely returns `0`)*.

**Combined Multi-Filter Calculation:**
Filters combine Search, Status Tabs, and Priority dropdown multiplicatively (AND condition):
```javascript
const filteredTasks = useMemo(() => {
  return tasks.filter(task => {
    const matchesSearch = searchQuery.trim() === '' || 
      task.title.toLowerCase().includes(searchQuery.toLowerCase().trim());
    const matchesStatus = selectedStatus === 'All' || task.status === selectedStatus;
    const matchesPriority = selectedPriority === 'All' || task.priority === selectedPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });
}, [tasks, searchQuery, selectedStatus, selectedPriority]);
```

### 5. How Carousel State is Maintained
The Focus Notes carousel state is encapsulated within [FocusNotes.jsx](file:///C:/Users/Harshini%20Raikanti/.gemini/antigravity/scratch/focusboard/src/components/FocusNotes.jsx):
- Active index is managed using `useState(0)`.
- **Previous Navigation:** `(prev === 0 ? slides.length - 1 : prev - 1)` (circular boundary jump).
- **Next Navigation:** `(prev === slides.length - 1 ? 0 : prev + 1)`.
- **Dot Indicators:** Directly update the index to `idx` upon click.

---

## 💾 LocalStorage Implementation & Synchronization

Persistence is managed via the custom hook [useLocalStorage.js](file:///C:/Users/Harshini%20Raikanti/.gemini/antigravity/scratch/focusboard/src/hooks/useLocalStorage.js):

```javascript
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) {
        const parsed = JSON.parse(item);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
    }
    return typeof initialValue === 'function' ? initialValue() : initialValue;
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, value]);

  return [value, setValue];
}
```

### Key Safety Mechanisms:
1. **Lazy Initialization:** `localStorage.getItem` is executed only once on mount inside the `useState` initializer callback, avoiding costly disk reads on subsequent component re-renders.
2. **Preservation of User Data:** If the user creates, modifies, or deletes tasks, these changes are stored under `focusboard_tasks`. On page reload, the application checks if data exists; default sample data is only loaded if the store is empty or uninitialized.
3. **Graceful Error Handling:** Wrapped in `try/catch` blocks to protect against private browsing quota exceptions or corrupted JSON strings.

---

## 🚀 Instructions to Install & Run Locally

### Prerequisites
- **Node.js:** v18.0.0 or higher
- **npm:** v9.0.0 or higher

### Installation Steps
1. **Clone the repository:**
   ```bash
   git clone https://github.com/vamshi0107/FocusBoard.git
   cd FocusBoard
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173`.

4. **Verify production build:**
   ```bash
   npm run build
   npm run preview
   ```

---

## 🌐 Deployment Instructions (Vercel & Netlify)

### Deploying to Vercel
1. Push your repository to your GitHub account.
2. Go to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Select the `focusboard` repository.
4. Framework Preset will auto-detect as **Vite**.
5. Build settings:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
6. Click **Deploy**.

---

## ⚠️ Known Limitations & Future Roadmap

1. **Drag-and-Drop Task Reordering:** Current tasks are sorted by newest first. A future enhancement could introduce drag-and-drop between columns.
2. **Multi-User Backend Sync:** Currently, data is browser-bound via `localStorage`. Integrating a lightweight REST or GraphQL backend with WebSockets would enable multi-user collaboration.
3. **Subtasks / Checklist Items:** Tasks currently consist of titles and descriptions; support for nested checklists can be added in version 2.
4. **Export / Import:** An export/import utility (JSON/CSV) could be added to transfer tasks between browsers.
