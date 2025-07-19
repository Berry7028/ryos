import { createContext } from 'react';

export interface LockScreenContextType {
  isLocked: boolean;
  lock: () => void;
  unlock: () => void;
}

export const LockScreenContext = createContext<LockScreenContextType | undefined>(
  undefined
);
