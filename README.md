# Kanban Clone - Personal Task Management Board

A modern Kanban-style task management application built with React, TypeScript, and TailwindCSS. Features drag-and-drop functionality, persistent state management, and mobile-responsive design.

## 📸 Live Demo
https://react-kanban-dnd.vercel.app/

![Kanban Board Screenshot](<img width="1612" height="895" alt="image" src="https://github.com/user-attachments/assets/1903fc71-9966-4d9f-b8a5-b26a8b0e8abb" />
)

*Live screenshot of the Kanban board showing task management interface with drag-and-drop functionality*

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation & Running

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd kanban-clone
   npm install
   ```

2. **Start development server**
   ```bash
   npm start
   ```
   Navigate to `http://localhost:3000`

3. **Run tests**
   ```bash
   npm test
   npm test -- --coverage
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 🏗️ Architecture

### Component Structure (Atomic Design)
```
src/
├── components/
│   ├── atoms/              # Button, Input, Card
│   ├── molecules/          # Task, TaskModal, HistoryLog
│   └── organisms/          # Board, Column
├── store/
│   └── boardStore.ts       # Zustand state management
├── utils/
│   ├── dateUtils.ts        # Date formatting utilities
│   └── dndBackend.ts       # Custom drag & drop backend
└── types/
    └── index.ts           # TypeScript definitions
```

### Key Technical Decisions

**State Management**: Went with Zustand over Redux for this project
- Much simpler setup and less boilerplate
- Built-in TypeScript support worked great
- The persistence middleware made localStorage integration seamless

**Drag & Drop**: Used react-dnd with a custom backend approach
- HTML5Backend handles desktop interactions perfectly
- Added mobile-drag-drop polyfill for touch devices since react-dnd-touch-backend was causing Jest issues
- This hybrid solution works well across all devices

**Styling**: TailwindCSS was the right choice here
- Rapid development without getting bogged down in custom CSS
- The responsive utilities made mobile layout straightforward
- Added some custom scrollbar styles for a nicer look

**Testing**: Jest + React Testing Library
- Mocked react-dnd to avoid the ES module issues in tests
- Focused on testing user interactions and store actions
- Ended up with solid coverage without over-engineering

## ⏱️ Development Time

**Total time**: Around 6-8 hours spread across a day
*(including setup, testing, and writing this README)*

| Phase | Time | What I worked on |
|--------|------|------------------|
| **Project Setup & Architecture** | ~45 min | Getting everything configured - TypeScript, Tailwind, and setting up the Zustand store structure |
| **Core Components Development** | ~1.5 hr | Building the main Board, Column, and Task components following atomic design principles |
| **Drag & Drop Implementation** | ~1.25 hr | Integrating react-dnd with a custom backend that works on both desktop and mobile |
| **State Persistence & Testing** | ~1.5 hr | Adding Zustand's persistence middleware and writing comprehensive unit/integration tests |
| **UI/UX Polish & Documentation** | ~45 min | Making it responsive, adding proper modals for CRUD actions, and final documentation |

The main focus was delivering a complete, stable MVP with good test coverage and solid mobile experience.

---

## ⚡ What I'd Do Differently Next Time

This project hits all the assignment requirements, but there are definitely some areas I'd enhance if I had more time or this was going to production:

### 🧱 Data Persistence
- Currently using localStorage which is perfect for an MVP
- In a real app, I'd probably add server sync or at least IndexedDB for better performance with larger datasets

### 🧩 Error Handling
- Right now it's pretty basic - just some try/catch blocks
- Would love to add proper error boundaries, toast notifications, and better retry logic

### ♿ Accessibility
- Got the basics covered with keyboard navigation
- Could definitely improve ARIA labels and screen reader support

### 📱 Mobile Drag & Drop
- The mobile-drag-drop polyfill works well, but it's not quite as smooth as native touch handling
- Might explore react-dnd-touch-backend more or look into other touch-optimized solutions

### 🧪 Testing
- Happy with the 70%+ coverage on critical paths
- Would add more edge case testing and maybe some E2E tests with Playwright

### 🎨 Design Polish
- Tailwind utilities got me to a clean, functional design quickly
- Would love to add dark mode, better animations, and maybe a proper design system

## ✅ Assignment Completion

### Core Requirements ✅
- ✅ Add new task (title + optional description)
- ✅ Drag and drop tasks within and across columns
- ✅ Edit a task's title inline
- ✅ Delete a task
- ✅ All changes persist on refresh using localStorage

### Stretch Goals ✅
- ✅ Filter tasks by keyword
- ✅ Task history log (last 5 actions)
- ✅ Auto-focus on new task input
- ✅ Mobile responsive layout

### Bonus Features I Added
- ✅ Comprehensive testing suite (131 tests)
- ✅ Mobile drag & drop support
- ✅ Custom delete confirmation modal (way better than browser alerts)
- ✅ Professional UI/UX design
- ✅ TypeScript throughout
- ✅ Date utilities and formatting

---

**Built with React, TypeScript, TailwindCSS, and a lot of coffee ☕**
