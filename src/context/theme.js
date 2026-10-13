import { createContext, useContext } from "react";

export const ThemeContext = createContext({ theme: "light", toggleTheme: () => {} });

export const useTheme = () => useContext(ThemeContext);

export const THEME_STORAGE_KEY = "ml-lab-theme";
