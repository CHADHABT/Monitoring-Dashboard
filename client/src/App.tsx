import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useState, useEffect } from "react";
import Dashboard from "@/pages/Dashboard";
import Documents from "@/pages/Documents";
import Settings from "@/pages/Settings";
import Connections from "@/pages/Connections";
import NotFound from "@/pages/not-found";
import type { Connection } from "@shared/schema";
import { TenantContext } from "@/contexts/TenantContext";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/documents" component={Documents} />
      <Route path="/connections" component={Connections} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const { data: connections = [], isLoading } = useQuery<Connection[]>({
    queryKey: ['/api/connections'],
  });

  const [selectedTenant, setSelectedTenant] = useState<string>('');

  useEffect(() => {
    const saved = localStorage.getItem('selectedTenant');
    if (saved && connections.find(c => c.id === saved)) {
      setSelectedTenant(saved);
    } else if (connections.length > 0 && !selectedTenant) {
      setSelectedTenant(connections[0].id);
    }
  }, [connections]);

  useEffect(() => {
    if (selectedTenant) {
      localStorage.setItem('selectedTenant', selectedTenant);
    }
  }, [selectedTenant]);

  const tenants = connections.map(c => ({
    id: c.id,
    name: c.name,
    status: c.status as "connected" | "disconnected",
  }));

  const style = {
    "--sidebar-width": "16rem",
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <TenantContext.Provider value={{ selectedTenant }}>
      <SidebarProvider style={style as React.CSSProperties}>
        <div className="flex h-screen w-full">
          <AppSidebar 
            tenants={tenants}
            selectedTenant={selectedTenant}
            onTenantChange={setSelectedTenant}
          />
          <div className="flex flex-col flex-1 overflow-hidden">
            <header className="flex items-center justify-between p-4 border-b">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
            </header>
            <main className="flex-1 overflow-auto p-6">
              <Router />
            </main>
          </div>
        </div>
      </SidebarProvider>
    </TenantContext.Provider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppContent />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
