# Development Notes

A running log of thoughts, ideas, bugs, and progress.

---

## 2026-02-22

- Started documentation setup
  - developed some of overview file, problem statement, solution, and intended users
  - will need to fill in technical tradeoffs and decisions + what is learned over time/later

---

## 2026-02-24

- Completed dashboard page:
  - project cards that include number of formations, last edited, project name
  - option menus for each project card that includes options to rename, delete
  - number of cards/projects displayed on each page determined by window size, and scrollable
    using side arrows/number carousel
  - new project button allows a new project name to be entered, will be hooked up to database
    later to create new projects (names cannot be empty)
  - profile picture in the corner includes a menu with a sign out button
- key patterns learned: lifted state for "one open at a time" menus, pure pagination functions, React state updates are async (store trimmed value in local var before checking)
- to do next: Settings page:
  - create basic structure of a settings page, navigable through profile picture menu
  - allows basic account settings, light/dark mode?, will be able to be added to as app is scaled

---



<!--
TIP: Keep entries dated and append-only.
Don't worry about polish here - this is your thinking space.
Example entries:
  - Debugging auth flow, suspect token refresh issue
  - Idea: add haptic feedback on swipe gestures
  - TODO: revisit canvas performance after MVP
-->
