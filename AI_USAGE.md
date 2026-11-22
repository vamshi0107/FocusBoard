# AI Usage Disclosure: FocusBoard

In accordance with Step 19 of the project guidelines, this document outlines developer tooling and minor AI assistance utilized during development.

---

## 1. Tools Used
- **Assistant:** GitHub Copilot / Gemini Code Assist (IDE autocomplete and syntax assistance)

---

## 2. Representative Queries & Inquiries
1. *"Tailwind CSS v4 media query syntax for custom responsive breakpoints"*
2. *"CSS grid column reflow behavior in responsive flex containers"*
3. *"Standard ISO date string formatting in modern JavaScript"*

---

## 3. Areas of Minor Assistance
- **Syntax Autocomplete:** Minor IDE boilerplate autocomplete for Tailwind utility class names.
- **Documentation Formatting:** Formatting markdown tables and structure for readability.

---

## 4. Reviewed Suggestions & Architectural Decisions
- Evaluated external carousel and state management suggestions; chose to implement custom vanilla React components (`useLocalStorage`, `useMemo`) to maintain full architectural ownership, zero bundle bloat, and no third-party package dependencies.
