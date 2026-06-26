import React, { createContext, useContext } from 'react';
import { tokens } from '../constants/design';

const ThemeContext = createContext(tokens);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeContext.Provider value={tokens}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => {
  return useContext(ThemeContext);
};
