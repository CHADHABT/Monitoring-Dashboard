import { useState } from 'react';
import { AppSidebar } from '../AppSidebar';
import { SidebarProvider } from "@/components/ui/sidebar";

export default function AppSidebarExample() {
  const [selectedTenant, setSelectedTenant] = useState("1");

  const sampleTenants = [
    { id: "1", name: "Production EU", status: "connected" as const },
    { id: "2", name: "Staging US", status: "disconnected" as const }
  ];

  const style = {
    "--sidebar-width": "16rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar
          tenants={sampleTenants}
          selectedTenant={selectedTenant}
          onTenantChange={setSelectedTenant}
        />
        <div className="flex-1 p-6">
          <p className="text-sm text-muted-foreground">Main content area</p>
        </div>
      </div>
    </SidebarProvider>
  );
}
