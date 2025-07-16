
import { createContext, useContext, useState, useEffect } from 'react';

const initialState = {
  theme: 'system',
  setTheme: () => null,
};

const ThemeProviderContext = createContext(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'train-tracker-theme',
  ...props
}) {
  const [theme, setTheme] = useState(
    () => localStorage.getItem(storageKey) || defaultTheme
  );

  useEffect(() => {
    const root = window.document.documentElement;
    
    root.classList.remove('light', 'dark', 'reading', 'high-contrast', 'sepia', 'night');
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme);
      return;
    }
    
    root.classList.add(theme);
    
    if (theme === 'reading') {
      document.body.style.backgroundColor = '#f8f7f1';
      document.body.style.color = '#333';
      document.body.style.fontFamily = 'Georgia, serif';
      document.body.style.lineHeight = '1.8';
    } else if (theme === 'high-contrast') {
      document.body.style.backgroundColor = '#000';
      document.body.style.color = '#fff';
      document.body.style.fontFamily = 'sans-serif';
      document.body.style.lineHeight = '1.5';
    } else if (theme === 'sepia') {
      document.body.style.backgroundColor = '#f4ecd8';
      document.body.style.color = '#5b4636';
      document.body.style.fontFamily = 'Georgia, serif';
      document.body.style.lineHeight = '1.6';
    } else if (theme === 'night') {
      document.body.style.backgroundColor = '#0d0d14';
      document.body.style.color = '#ccc';
      document.body.style.fontFamily = 'system-ui, sans-serif';
      document.body.style.lineHeight = '1.5';
    } else {
      document.body.style.backgroundColor = '';
      document.body.style.color = '';
      document.body.style.fontFamily = '';
      document.body.style.lineHeight = '';
    }
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};
