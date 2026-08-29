import { createContext, PropsWithChildren, useContext, useMemo, useState } from 'react';

type SettingsContextValue = {
  open: boolean;
  openSettings: () => void;
  closeSettings: () => void;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: PropsWithChildren) {
  const [open, setOpen] = useState(false);

  const value = useMemo(
    () => ({
      open,
      openSettings: () => setOpen(true),
      closeSettings: () => setOpen(false),
    }),
    [open],
  );

  return (
    <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return ctx;
}
