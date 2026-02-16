import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const ThemeContext = createContext({ theme: 'light', setTheme: () => { } });

export const ThemeProvider = ({ children }) => {
	const [theme, setTheme] = useState('light');

	// Keep the document in sync so Tailwind or global styles can react to the theme class.
	useEffect(() => {
		const root = document.documentElement;
		root.classList.remove('light', 'dark');
		root.classList.add(theme);
	}, [theme]);

	const value = useMemo(() => ({ theme, setTheme }), [theme]);

	return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);

