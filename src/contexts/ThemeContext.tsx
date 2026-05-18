import { createContext, useContext, useState, useEffect, type ReactNode, useRef } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export const ThemeProvider = ({children} : {children: ReactNode}) => {
  const [theme, setTheme] = useState<Theme> ("light");
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

  const toggleTheme = () => {
    if(theme === 'light') {
      setTheme('dark')
    } else {
      setTheme('light')
    }
  }

  return(
    <ThemeContext.Provider value={{theme, toggleTheme}} >
      {children}
    </ThemeContext.Provider>
  ) 
}


export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider')
  return ctx
}
