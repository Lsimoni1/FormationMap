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

## 2026-05-17

- Hooked up Supabase relation db:
  - created projects(id, user_id, name, created_at) and formations(id, project_id, order_index, created_at, dancers) tables
  - created SELECT, INSERT, and DELETE RLS policies for both tables, as well as UPDATE policy for projects
    - policies create rules for how users are able to interact with the database, and each interaction has a slightly different structure. For our rules,
      we ensured that users can only INSERT, SELECT, and DELETE on their own projects
  - hooked up "New Project" modal with db, allowing for insert on projects table with new project creation
  - dashboard now fetches projects within the database to display (SELECT) and a spinner animation plays during the fetch
  - created onDelete and onUpdate functions that allowed the user to rename (inline) or delete projects using the delete/rename drop down menu on project
  card
to do next:
  - start figuring out how to save formations and give that jsonb information to the db 
## 2026-02-26

- started working on the settings page, but asking claude to force me to write more code myself:
  - working on a light/dark mode for a preferences setting. Started with a themeContext and wrote ThemeProvider
    - things to remember:
      - useEffect -> a function that runs once per mount, and again for every time a value within the dependency array
                    is changed (if no value included in the dependency array '[]' the useEffect function will only run once per 
                    mount). a return statement may be added as a cleanup function, which means that when a new useEffect
                    is triggered by a dependency change, the previous useEffect instance is destroyed and its return statement 
                    is run. This allows any values that need to be reset to be reset before the new useEffect instance runs.

                    useEffect( (#parameters) => {
                      #function code

                      return () => {
                        #return function
                      }
                    }, [#dependency array])
      - element.classList.toggle(value, boolean statement) -> allows a CSS class to be included or removed from an element based
                                                              on the value of the boolean statement included
                                                        

---

## 2026-03-02 && 2026-02-27

 - Continued work on the settings page, wrote a lot of the CSS myself which is difficult for me
 - Things to remember for CSS:
    - thought process around layout and parent-child structure of components (box-drawing exercise)
    - tailwind and CSS are different
    - cn() -> allows conditional selection of Tailwind className attributes. 

              className = {cn('regular attributes for className', conditional statement ? 'additional attributes' : '')}

              this structure allows the developer to include additional attributes to a className depending on whether a 
              conditional statement is met.
    - Typescript 'as' keyword -> allows a value of a broad type to be affirmed by the developer to conform to the rules of 
                                a more specific type. Here's an example from the codebase in ThemeContext.tsx:

                                let tempTheme = localStorage.getItem('theme')
                                if(tempTheme === null) {localStorage.setItem('theme', theme)}
                                else {setTheme(tempTheme as Theme)}

 - nothing super significant learned in this session, just don't forget where {} will be needed for jsx in react, 
  passing into onClick needs to make sure to include () =>. Small lapses in existing knowledge


---

## 2026-03-05

- Worked on a bug with the light preference to where refresh would reset the preference selection:
- code before:

  useEffect(() => {
    let tempTheme = localStorage.getItem('theme')
    if(tempTheme === null) {localStorage.setItem('theme', theme)}
    else {setTheme(tempTheme as Theme)}
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === 'dark')
    localStorage.setItem("theme", theme)
  }, [theme])

- code after:

  const hasMounted = useRef(false);

  useEffect(() => {
    let tempTheme = localStorage.getItem('theme')
    if(tempTheme === null) {localStorage.setItem('theme', theme)}
    else {setTheme(tempTheme as Theme)}
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === 'dark')
    if(!hasMounted.current) {
      hasMounted.current = true
      return
    }
    localStorage.setItem("theme", theme)
  }, [theme])

- the issue came from an issue in the way the code was running upon mount. Before, the application would
always reset to light mode upon refresh and here's why:
    - on mount:
    
      The first useEffect runs. If light, theme is queued to be set to light. If dark, theme is queued to be set to dark. 
      The second useEffect runs. Since the first useEffect state change hasn't run yet (queued for after the code block), the 
      theme will be default to light and the document.documentElement.classList.toggle("dark", false) will always run. Then,
      the second useEffect will change the theme in localStorage to be set to light. So after mount, the first useEffect
      queue will set the theme state to "dark", and then the second useEffect code will reassign it in localStorage to "light". 
      Then, when the first useEffect reads localStorage again it will read it as light and the theme will be reset.

- the solution to this issue ended up being to manually ensure that the second useEffect does not run on mount, therefore 
never reassigning localStorage to "light" after the first useEffect's queued code runs. Now, the second useEffect will only be run
upon theme changing.

- reminder: state changes are asynchronous, useEffect code is not inherently asynchronous

---




<!--
TIP: Keep entries dated and append-only.
Don't worry about polish here - this is your thinking space.
Example entries:
  - Debugging auth flow, suspect token refresh issue
  - Idea: add haptic feedback on swipe gestures
  - TODO: revisit canvas performance after MVP
-->
