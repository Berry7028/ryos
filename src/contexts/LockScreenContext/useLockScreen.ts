import { useContext } from 'react';
import { LockScreenContext, LockScreenContextType } from './LockScreenContext';

export const useLockScreen = (): LockScreenContextType => {
  const context = useContext(LockScreenContext);
  if (context === undefined) {
    throw new Error('useLockScreen must be used within a LockScreenProvider');
  }
  return context;
};
