import React, { createContext, useContext } from 'react';
import { tokens } from '../constants/design';

const DesignContext = createContext(tokens);

export const DesignProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <DesignContext.Provider value={tokens}>
      {children}
    </DesignContext.Provider>
  );
};

export const useDesign = () => {
  return useContext(DesignContext);
};
