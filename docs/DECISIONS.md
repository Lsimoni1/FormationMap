# Technical Decisions

A log of key architectural and design decisions with reasoning.

---

## Template

### [Decision Title]
**Date:** YYYY-MM-DD
**Status:** Decided / Revisiting / Superseded

**Context:**
What situation prompted this decision?

**Options Considered:**
1. Option A - pros/cons
2. Option B - pros/cons

**Decision:**
What we chose and why.

**Consequences:**
What this means going forward.

---

## Decisions

---
### THEME PREFERENCE STORAGE
**Date:** 2026-03-02
**Status:** Decided

**Context:**
Necessary to store a theme preference for the application for a user.

**Options Considered:**
1. localStorage - lightweight and easy for a simple property. Will not synchronize across multiple devices.
2. Supabase - requires a fetch to grab light/dark mode preference, which could be considered inconsequential. Storing
            this information allows synchronization across devices for a user.

**Decision:**
Went with LocalStorage in order to keep the application simple for now, it is unnecessary to consider
users accessing the application on multiple devices at this point in development.

**Consequences:**
If it becomes a user-desired feature, it could become necessary to transition storage of theme preference to supabase. This
would be a low-effort solution, but unnecessary at the moment.