import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    // load saved theme from localStorage
    return localStorage.getItem("theme") || "dark";
  });

  useEffect(() => {
    localStorage.setItem("theme", mode);
    document.documentElement.classList.toggle("dark", mode === "dark");
  }, [mode]);

  const toggleTheme = () => {
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
