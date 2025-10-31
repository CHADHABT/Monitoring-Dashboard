import { useState } from "react";
import { DocumentsTable, Document } from "@/components/DocumentsTable";
import { DocumentFilters } from "@/components/DocumentFilters";
import { DateRangeFilter } from "@/components/DateRangeFilter";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useTenant } from "@/contexts/TenantContext";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Documents() {
  const { selectedTenant } = useTenant();
  const { toast } = useToast();
  
  const [filters, setFilters] = useState({
    types: [] as string[],
    statuses: [] as string[],
    searchQuery: '',
  });
  const [dateFrom, setDateFrom] = useState<string>();
  const [dateTo, setDateTo] = useState<string>();

  const { data: documents = [], isLoading, refetch } = useQuery<Document[]>({
    queryKey: ['/api/documents', selectedTenant, filters, dateFrom, dateTo],
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

      if (dateFrom) {
        params.append('dateFrom', dateFrom);
      }

      if (dateTo) {
        params.append('dateTo', dateTo);
      }

      const response = await fetch(`/api/documents?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch documents');
      }
      return response.json();
    },
  });

  const updatePayloadMutation = useMutation({
    mutationFn: async ({ documentId, payload }: { documentId: string; payload: any }) => {
      await apiRequest('PATCH', `/api/documents/${documentId}`, {
        connectionId: selectedTenant,
        payload
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/documents'] });
      toast({
        title: "Success",
        description: "Document payload updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update document",
        variant: "destructive",
      });
    }
  });

  const handlePayloadUpdate = async (documentId: string, newPayload: any) => {
    await updatePayloadMutation.mutateAsync({ documentId, payload: newPayload });
  };

  const handleDateFilterChange = (from?: string, to?: string) => {
    setDateFrom(from);
    setDateTo(to);
  };

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
        <aside className="w-64 flex-shrink-0 space-y-4">
          <DocumentFilters filters={filters} onFilterChange={setFilters} />
          <DateRangeFilter onFilterChange={handleDateFilterChange} />
        </aside>

        <div className="flex-1 min-w-0">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading documents...</div>
          ) : (
            <>
              <div className="mb-4 text-sm text-muted-foreground">
                Showing {documents.length} documents
              </div>
              <DocumentsTable documents={documents} onPayloadUpdate={handlePayloadUpdate} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
