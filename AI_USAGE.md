# AI Usage Disclosure: FocusBoard

In accordance with Step 19 of the assignment instructions, this document provides transparent disclosure of AI assistance utilized during the development of **FocusBoard**.

---

## 1. Tools Used
- **Assistant:** Google Antigravity (Powered by Gemini)

---

## 2. Representative Prompts Used During Development
1. *"Plan a modular folder structure for a React + Vite task dashboard that separates UI components, custom hooks, and initial mock data."*
2. *"Implement a custom useLocalStorage hook in React that safely deserializes stored task data without overwriting existing data with sample defaults on browser reload."*
3. *"Write a combined filtering function in React using useMemo that applies case-insensitive title search, status tab selection, and priority dropdown simultaneously using multiplicative AND logic."*
4. *"Create a 3-slide accessible carousel component with manual next/previous buttons, dot indicators, and keyboard accessibility."*

---

## 3. Key Areas of AI Assistance
- **Component Architecture:** Structuring reusable components (`TaskForm`, `TaskCard`, `StatCard`, `FocusNotes`, and `FilterTabs`) with distinct single responsibilities.
- **State Management & Memoization:** Formulating derived metrics and filter pipelines with React `useMemo` to prevent state duplication and excessive re-renders.
- **Accessibility & Keyboard Navigation:** Ensuring semantic HTML (`<main>`, `<aside>`, `<article>`, `<header>`), `aria-label` attributes on icon buttons, visible focus outlines, and ESC key handlers for modal dialogs.
- **Responsive Layout Design:** Configuring Tailwind CSS v4 breakpoints for 390px (mobile), 768px (tablet), and 1440px (desktop).

---

## 4. Reviewed, Corrected, or Rejected AI Suggestions
- **Suggestion:** An initial AI proposal recommended installing `swiper` or `embla-carousel` for the Focus Notes carousel, and `@reduxjs/toolkit` for task state.
- **Review & Decision:** **Rejected.** 
- **Reason:** The assignment specifically instructs candidates to avoid unnecessary third-party packages, heavy state management libraries, and backend dependencies to keep the project lightweight and easily maintainable within the 24-hour delivery target. Instead, a lightweight, native React component using vanilla `useState` and simple index transitions was implemented for the carousel, and React Hooks with `localStorage` were used for state management.
