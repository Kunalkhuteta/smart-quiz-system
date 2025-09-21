import React from "react";
import { useTheme } from "../context/ThemeContext";

const ThemedButton = ({ children, onClick, type = "button", variant = "default", className = "" }) => {
  const { mode } = useTheme();

  // Dark/Light theme button styles with proper text colors
  const themeStyles =
    mode === "dark"
      ? {
          default:
            "bg-gradient-to-br from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-gray-100 shadow-lg hover:shadow-xl",
          generate:
            "bg-gradient-to-br from-indigo-800 to-indigo-600 hover:from-indigo-700 hover:to-indigo-500 text-white shadow-lg hover:shadow-xl",
          view:
            "bg-gradient-to-br from-green-700 to-green-600 hover:from-green-600 hover:to-green-500 text-white shadow-lg hover:shadow-xl",
          admin:
            "bg-gradient-to-br from-yellow-700 to-yellow-600 hover:from-yellow-600 hover:to-yellow-500 text-gray-900 shadow-lg hover:shadow-xl",
        }
      : {
          default:
            "bg-gradient-to-br from-gray-300 to-gray-200 hover:from-gray-200 hover:to-gray-100 text-white shadow-md hover:shadow-lg",
          generate:
            "bg-gradient-to-br from-indigo-500 to-indigo-400 hover:from-indigo-400 hover:to-indigo-300 text-white shadow-md hover:shadow-lg",
          view:
            "bg-gradient-to-br from-green-500 to-green-400 hover:from-green-400 hover:to-green-300 text-white shadow-md hover:shadow-lg",
          admin:
            "bg-gradient-to-br from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-300 text-white shadow-md hover:shadow-lg",
        };

  const appliedStyle = themeStyles[variant || "default"];

  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-5 py-2 rounded-2xl font-semibold transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none ${appliedStyle} ${className}`}
    >
      {children}
    </button>
  );
};

export default ThemedButton;
