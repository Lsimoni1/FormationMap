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



<!--
TIP: Keep entries dated and append-only.
Don't worry about polish here - this is your thinking space.
Example entries:
  - Debugging auth flow, suspect token refresh issue
  - Idea: add haptic feedback on swipe gestures
  - TODO: revisit canvas performance after MVP
-->
