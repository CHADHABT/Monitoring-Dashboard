import { createContext, useContext } from 'react';

interface TenantContextType {
  selectedTenant: string;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function useTenant() {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within TenantProvider');
  }
  return context;
}

export { TenantContext };
