import { useState, useEffect } from 'react';

export default function useTheme() {
    // Read theme from local storage or default to dark
    const [theme, setTheme] = useState(
        () => localStorage.getItem('theme') || 'dark'
    );

    useEffect(() => {
        const root = window.document.documentElement;

        root.classList.remove('light', 'dark');
        root.classList.add(theme);

        // For index.css .light class usage
        if (theme === 'light') {
            document.body.parentElement.classList.add('light');
        } else {
            document.body.parentElement.classList.remove('light');
        }

        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
    };

    return { theme, toggleTheme };
}
