import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ThemeContext = createContext();

// Default theme
const DEFAULT_THEME = {
  name: "Dark",
  primary: "#4CAF50",
  background: "#0a0a0a",
  card: "#1a1a1a",
  text: "#ffffff",
  border: "#333333",
  notification: "#ff3b30",
};

const THEME_STORAGE_KEY = "@krakenballs_theme";

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(DEFAULT_THEME);
  const [isLoading, setIsLoading] = useState(true);

  // Load theme from storage on app start
  useEffect(() => {
    loadThemeFromStorage();
  }, []);

  const loadThemeFromStorage = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme) {
        const parsedTheme = JSON.parse(savedTheme);
        setThemeState(parsedTheme);
      }
    } catch (error) {
      console.error("Error loading theme from storage:", error);
      // If there's an error, we'll just use the default theme
    } finally {
      setIsLoading(false);
    }
  };

  const setTheme = async (newTheme) => {
    try {
      // Update state immediately for responsive UI
      setThemeState(newTheme);

      // Save to AsyncStorage
      await AsyncStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(newTheme));
    } catch (error) {
      console.error("Error saving theme to storage:", error);
      // Even if saving fails, we keep the theme change in memory
    }
  };

  const resetTheme = async () => {
    try {
      await AsyncStorage.removeItem(THEME_STORAGE_KEY);
      setThemeState(DEFAULT_THEME);
    } catch (error) {
      console.error("Error resetting theme:", error);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        resetTheme,
        isLoading,
        defaultTheme: DEFAULT_THEME,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
