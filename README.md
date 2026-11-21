# FocusBoard – Task Management Dashboard

FocusBoard is a responsive, accessible task management dashboard built with React, Vite, Tailwind CSS, and Lucide Icons based on the company's Figma design specifications.

---

## 🚀 Live Demo & Repository
- **Live Demo:** [Deploy to Vercel / Netlify](https://focusboard.vercel.app) *(Update with your deployed link)*
- **GitHub Repository:** [https://github.com/your-username/focusboard](https://github.com/your-username/focusboard) *(Update with your repo link)*

---

## 🛠️ Tech Stack
- **Framework & Bundler:** React 19 + Vite 8
- **Styling:** Tailwind CSS v4 + Semantic HTML5
- **Icons:** Lucide React
- **State & Storage:** React Hooks (`useState`, `useEffect`, `useMemo`) + Browser `localStorage`
- **Quality & Linting:** Oxlint / ES6+ standard

---

## ✨ Key Features & Functionality

1. **Responsive Multi-Device Layout:**
   - **Desktop (1440px):** Permanent navigation sidebar, multi-column statistics overview, integrated Focus Notes carousel, and responsive task grid.
   - **Tablet (768px):** Reflowed 2-column task layout, optimized filter bar, and touch-friendly targets.
   - **Mobile (390px):** Sliding navigation drawer with backdrop, stacked summary cards, and full-width touch modal.

2. **Dynamic Dashboard Statistics (No Hardcoding):**
   - **Total Tasks:** Real-time count across all categories.
   - **In Progress:** Live active task count.
   - **Completed:** Live finished count.
   - **Completion Percentage:** Computed dynamically as:
     $$\text{Completion Rate} = \frac{\text{Completed Tasks}}{\text{Total Tasks}} \times 100$$
     *(Safely handles edge cases like 0 tasks to avoid `NaN` or division by zero).*

3. **3-Slide Focus Notes Carousel:**
   - Structured carousel with manual Previous and Next controls.
   - Interactive dot indicators with direct jump navigation.
   - Visual counter badge (`FOCUS NOTES · X OF 3`).

4. **Task CRUD Operations:**
   - **Create Task:** Accessible modal form with input validation (whitespace trimming, required fields, date pickers).
   - **Read / View:** Card and list views with priority accents and category tags.
   - **Update / Edit:** Pre-populated form modal preserving original task IDs.
   - **Delete Task:** Safety confirmation dialog before irreversible removal.
   - **Quick Status Selector:** Instant dropdown on each card (`To do`, `In progress`, `Completed`) that recalibrates statistics in real time.

5. **Multi-Criteria Filter & Case-Insensitive Search:**
   - Search tasks by title with live partial matching and clear action.
   - Status tabs with real-time task counts (`All`, `To do`, `In progress`, `Completed`).
   - Priority filter dropdown (`All`, `High`, `Medium`, `Low`).
   - Combined with multiplicative **AND logic** (Search query ∩ Status ∩ Priority).

6. **Browser Data Persistence:**
   - Custom `useLocalStorage` hook with automatic serialization and deserialization.
   - On first launch, initializes with 6 diverse sample tasks.
   - Subsequent user updates, creates, edits, and deletions persist across page reloads without overwriting user data.

---

## 📁 Project Architecture & Folder Structure

```text
focusboard/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Sidebar.jsx            # Desktop sidebar & mobile drawer
│   │   ├── Header.jsx             # Top bar, greeting, date, new task trigger
│   │   ├── StatCard.jsx           # 4 dynamic overview metric cards
│   │   ├── FocusNotes.jsx         # 3-slide productivity carousel
│   │   ├── SearchBar.jsx          # Live title search input with clear trigger
│   │   ├── FilterTabs.jsx         # Multi-criteria status tabs & priority filter
│   │   ├── TaskList.jsx           # Responsive task cards grid & empty states
│   │   ├── TaskCard.jsx           # Individual card with quick status & actions
│   │   ├── TaskForm.jsx           # Unified Create & Edit modal with validation
│   │   └── DeleteConfirmModal.jsx # Delete confirmation dialog
│   ├── data/
│   │   └── sampleTasks.js         # Default 6 sample tasks schema
│   ├── hooks/
│   │   └── useLocalStorage.js    # Resilient localStorage sync hook
│   ├── App.jsx                    # Root state coordinator
│   ├── index.css                  # Tailwind CSS v4 styling & accessibility resets
│   └── main.jsx                   # React root mount
├── README.md                      # Comprehensive project documentation
├── AI_USAGE.md                    # Transparent AI usage disclosure
├── package.json
└── vite.config.js
```

---

## 🧠 State Management & Data Flow

- **Single Source of Truth:** Centralized in `App.jsx` using `useLocalStorage('focusboard_tasks', sampleTasks)`.
- **Derived State Optimization:** Metrics (`stats`, `statusCounts`, and `filteredTasks`) are calculated using `useMemo` hooks, guaranteeing zero unnecessary re-renders and preventing duplicate state desynchronization.
- **Combined Filter Logic:**
  ```javascript
  const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase().trim());
  const matchesStatus = selectedStatus === 'All' || task.status === selectedStatus;
  const matchesPriority = selectedPriority === 'All' || task.priority === selectedPriority;
  return matchesSearch && matchesStatus && matchesPriority;
  ```

---

## 🚀 Local Installation & Execution

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/focusboard.git
   cd focusboard
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start local development server:**
   ```bash
   npm run dev
   ```

4. **Create a production build:**
   ```bash
   npm run build
   npm run preview
   ```

---

## 🌐 Deployment to Vercel / Netlify

- **Framework:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`
