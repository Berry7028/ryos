import React, { useState, useCallback, ReactNode } from 'react';
import { LockScreenContext, LockScreenContextType } from './LockScreenContext';

export const LockScreenProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLocked, setIsLocked] = useState<boolean>(() => {
    // Always show lock screen on first load
    return true;
  });

  const lock = useCallback(() => {
    setIsLocked(true);
    localStorage.setItem('lockScreen:isLocked', 'true');
  }, []);

  const unlock = useCallback(() => {
    setIsLocked(false);
    localStorage.setItem('lockScreen:isLocked', 'false');
  }, []);

  const value: LockScreenContextType = {
    isLocked,
    lock,
    unlock,
  };

  return (
    <LockScreenContext.Provider value={value}>
      {children}
    </LockScreenContext.Provider>
  );
};
