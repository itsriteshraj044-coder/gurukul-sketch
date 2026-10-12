import { createContext, useContext, useState, type ReactNode } from 'react';

type ReadyState = { ready: boolean; setReady: (v: boolean) => void };

const ReadyContext = createContext<ReadyState>({ ready: true, setReady: () => undefined });

/** `ready` flips to true once the preloader has finished, so the hero can start its entrance. */
export function AppReadyProvider({ children, initial }: { children: ReactNode; initial: boolean }) {
  const [ready, setReady] = useState(initial);
  return <ReadyContext.Provider value={{ ready, setReady }}>{children}</ReadyContext.Provider>;
}

export const useAppReady = () => useContext(ReadyContext);
