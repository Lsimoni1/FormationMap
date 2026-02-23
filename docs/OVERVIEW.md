# Project Overview

## Problem Statement

Choreographers commonly use paper notes to keep track of choreography sets and transitions 
between locations on a stage or performance area. The transitions between these formations 
can be quite complex and different groups of performers tend to have different choreography 
at the same or similar times. When even a small change needs to be made, the choreographer
will need to manually revise their notes. With projects often spanning over timelines of weeks to months 
or longer, these iterations can lead to jumbled and confusing documentation. In addition, if a 
director/choreographer has an assistant, having unclear or difficult to revise notes can lead to 
communication issues and therefore inefficient use of time during rehearsals/meetings.

## Solution

Formation Map allows choreographers to create formations on a gridded canvas that will represent a stage
or performance area. The choreographer is able to modify the orientation of dancers, group dancers together,
add names for dancers, and use all of these features to save a snapshot of that moment in the performance.
From there, they can create a new formation from the previous one and track the intended transition
path of each dancer if necessary. This process can be repeated for the length of an entire performance, and these
saved formations can later be played or clicked through as a final animation of the whole project.

This application enables choreographers/directors to keep an easily revisable and digital copy of 
their notes for a project. They will be able to easily share this project with others, including assistants
and dancers participating in the performances. This will ultimately save time for directors with 
ease of organization and allow them to share and revise their ideas easily.

## Target Users

Primary users: Choreographers and Directors (create formations/projects), Choreography/Instructional Assistants 
(access/edit formations/projects)

Secondary users: Dancers/Performers (view formations/projects as informational reference)

## Key Features

- [x] Interactive canvas for dancer placement
- [x] Tool system: create, delete, move, rotate dancers
- [x] Grid snapping (25px cells) for precise positioning
- [x] Direction indicators on dancers (arrow shows facing)
- [x] User authentication (login/register via Supabase)
- [x] Protected routes for authenticated pages
- [x] Password validation with real-time feedback
- [ ] Home/landing page post-login
- [ ] Save formations to database
- [ ] Multiple formation sequences (timeline)
- [ ] Export/share functionality

## Tech Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| Frontend | React 19 + TypeScript | Modern React with strict typing for maintainability |
| Build Tool | Vite 7 | Fast HMR, minimal config, excellent DX |
| Styling | Tailwind CSS v4 + shadcn/ui + MUI v7 | Utility-first CSS with pre-built accessible components |
| Canvas | react-konva | HTML5 Canvas wrapper for interactive stage visualization |
| State | React Context API | Lightweight, no external dependencies needed for current scope |
| Routing | react-router-dom v7 | Standard React routing with protected route support |
| Backend/Auth | Supabase | BaaS with built-in auth, easy setup, generous free tier |
| Database | Supabase (PostgreSQL) | Planned for formation persistence |

## Architecture Overview

### Data Flow
```
ToolContext (global tool state)
       ↓
   ToolProvider
       ↓
  ┌────┴────┐
  ↓         ↓
StageDiagram ← FloatingToolbar
(canvas)       (UI controls)
  ↓
Dancer (rendered via react-konva)
```

### Authentication Flow
```
AuthProvider (wraps entire app)
       ↓
  AuthContext (user, session, loading, signIn, signUp, signOut)
       ↓
  ┌────┴────────────┐
  ↓                 ↓
ProtectedRoute    Login/Register pages
(guards /dashboard)  (public access)
```

### Key Patterns
- **Tool System:** Context-based tool selection (`create | delete | move | rotate | null`). FloatingToolbar sets the tool, StageDiagram responds to mouse events based on active tool.
- **Canvas Interaction:** StageDiagram manages dancer state locally. Mouse events handle preview positioning, tool actions execute with 25px grid snapping.
- **Dancer Component:** Konva Group containing Circle (body) + Arrow (direction). Factory function generates unique IDs via `crypto.randomUUID()`.

## Technical Decisions & Tradeoffs

<!--
Summarize key decisions (link to DECISIONS.md for details)
- Decision 1: Chose X over Y because...
- Decision 2: ...
-->

## Current Status

**Working:**
- Canvas-based formation editor (create, delete, move, rotate dancers)
- Authentication flow (Login, Register pages with Supabase)
- Routing with protected routes
- Password validation with visual feedback

**In Progress:**
- Dashboard page development

**Up Next:**
- Home page with sign-out functionality
- Settings page for user preferences
- Data persistence (save formations to Supabase)
- Testing setup (Vitest + React Testing Library)

## Lessons Learned

<!--
What have you learned building this? Technical and non-technical.
-->

## Future Considerations

- Data persistence: Save formations to Supabase database
- Timeline/sequence editor for multiple formations
- Export formations as images or video
- Collaboration features (share with team members)
- Mobile responsiveness for tablet use during rehearsals

## How to Run

```bash
npm install      # Install dependencies
npm run dev      # Start Vite dev server with HMR
npm run build    # TypeScript compile + Vite bundle
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

**Note:** Requires `.env.local` with Supabase credentials (not committed to repo).

## Project Structure

```
src/
├── components/           # React components
│   ├── ui/              # shadcn/ui primitives (Button, Input, etc.)
│   ├── StageDiagram.tsx # Main canvas component
│   ├── Dancer.tsx       # Individual dancer representation
│   └── FloatingToolbar.tsx # Tool selection UI
├── contexts/            # React Context providers
│   └── ToolContext.tsx  # Tool selection state
├── pages/               # Page-level components
│   ├── Login.tsx
│   ├── Register.tsx
│   └── Dashboard.tsx
├── lib/
│   └── utils.ts         # Utility functions (cn() for class merging)
├── App.tsx              # Root component with routing
└── main.tsx             # Entry point
```

**Path Alias:** `@/` maps to `src/` for cleaner imports.

---

*Last updated: 2026-02-22*
