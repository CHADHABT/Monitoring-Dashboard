import { useState } from "react";
import { DocumentsTable, Document } from "@/components/DocumentsTable";
import { DocumentFilters } from "@/components/DocumentFilters";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useTenant } from "@/contexts/TenantContext";

export default function Documents() {
  const { selectedTenant } = useTenant();
  
  const [filters, setFilters] = useState({
    types: [] as string[],
    statuses: [] as string[],
    searchQuery: '',
  });

  const { data: documents = [], isLoading, refetch } = useQuery<Document[]>({
    queryKey: ['/api/documents', selectedTenant, filters],
    enabled: !!selectedTenant,
    queryFn: async () => {
      const params = new URLSearchParams({
        connectionId: selectedTenant,
      });
      
      if (filters.types.length > 0) {
        filters.types.forEach(type => params.append('type', type));
      }
      
      if (filters.statuses.length > 0) {
        filters.statuses.forEach(status => params.append('status', status));
      }
      
      if (filters.searchQuery) {
        params.append('search', filters.searchQuery);
      }

      const response = await fetch(`/api/documents?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch documents');
      }
      return response.json();
    },
  });

  const handleRefresh = () => {
    refetch();
  };

  if (!selectedTenant) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Documents</h1>
          <p className="text-sm text-muted-foreground mt-1">
            View and manage all processed documents
          </p>
        </div>
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground mb-2">No tenant selected</p>
          <p className="text-sm text-muted-foreground">Please select a tenant from the sidebar or add a connection</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Documents</h1>
          <p className="text-sm text-muted-foreground mt-1">
            View and manage all processed documents
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isLoading}
          data-testid="button-refresh"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="flex gap-6">
        <aside className="w-64 flex-shrink-0">
          <DocumentFilters filters={filters} onFilterChange={setFilters} />
        </aside>

        <div className="flex-1 min-w-0">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading documents...</div>
          ) : (
            <>
              <div className="mb-4 text-sm text-muted-foreground">
                Showing {documents.length} documents
              </div>
              <DocumentsTable documents={documents} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
