import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Home, FileText, Settings, Database } from "lucide-react";
import { Link, useLocation } from "wouter";

interface Tenant {
  id: string;
  name: string;
  status: "connected" | "disconnected";
}

interface AppSidebarProps {
  tenants: Tenant[];
  selectedTenant: string;
  onTenantChange: (tenantId: string) => void;
}

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Documents",
    url: "/documents",
    icon: FileText,
  },
  {
    title: "Connections",
    url: "/connections",
    icon: Database,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar({ tenants, selectedTenant, onTenantChange }: AppSidebarProps) {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Tenant</SidebarGroupLabel>
          <SidebarGroupContent className="px-2">
            <Select value={selectedTenant} onValueChange={onTenantChange}>
              <SelectTrigger data-testid="select-tenant">
                <SelectValue placeholder="Select tenant">
                  {selectedTenant && tenants.find(t => t.id === selectedTenant) && (
                    <div className="flex items-center gap-2">
                      <div 
                        className={`w-2 h-2 rounded-full ${
                          tenants.find(t => t.id === selectedTenant)?.status === 'connected' 
                            ? 'bg-green-500' 
                            : 'bg-gray-300'
                        }`}
                      />
                      <span>{tenants.find(t => t.id === selectedTenant)?.name}</span>
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {tenants.map((tenant) => (
                  <SelectItem key={tenant.id} value={tenant.id}>
                    <div className="flex items-center gap-2">
                      <div 
                        className={`w-2 h-2 rounded-full ${
                          tenant.status === 'connected' ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      />
                      <span>{tenant.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location === item.url}>
                    <Link href={item.url} data-testid={`link-${item.title.toLowerCase()}`}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
