import { StatsCard } from "@/components/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, CheckCircle2, XCircle, TrendingUp, CreditCard, FileInput, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useTenant } from "@/contexts/TenantContext";

interface Statistics {
  total: number;
  loaded: number;
  failed: number;
  open: number;
  successRate: string;
  invoices: {
    total: number;
    loaded: number;
    failed: number;
    open: number;
  };
  creditNotes: {
    total: number;
    loaded: number;
    failed: number;
    open: number;
  };
}

export default function Dashboard() {
  const { selectedTenant } = useTenant();
  
  const { data: stats, isLoading } = useQuery<Statistics>({
    queryKey: ['/api/statistics', selectedTenant],
    enabled: !!selectedTenant,
    queryFn: async () => {
      const response = await fetch(`/api/statistics?connectionId=${selectedTenant}`);
      if (!response.ok) {
        throw new Error('Failed to fetch statistics');
      }
      return response.json();
    },
  });

  if (!selectedTenant) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor document processing status across your tenants
          </p>
        </div>
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground mb-2">No tenant selected</p>
          <p className="text-sm text-muted-foreground">Please select a tenant from the sidebar or add a connection</p>
        </div>
      </div>
    );
  }

  if (isLoading || !stats) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor document processing status across your tenants
          </p>
        </div>
        <div className="text-center py-8 text-muted-foreground">Loading statistics...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Monitor document processing status across your tenants
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Documents"
          value={stats.total.toLocaleString()}
          icon={FileText}
        />
        <StatsCard
          title="Loaded"
          value={stats.loaded.toLocaleString()}
          icon={CheckCircle2}
        />
        <StatsCard
          title="Open"
          value={stats.open.toLocaleString()}
          icon={Clock}
        />
        <StatsCard
          title="Success Rate"
          value={`${stats.successRate}%`}
          icon={TrendingUp}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-3">
            <div className="space-y-1">
              <CardTitle className="text-base">Purchase Invoices</CardTitle>
              <p className="text-sm text-muted-foreground">
                {stats.invoices.total} total documents
              </p>
            </div>
            <FileInput className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Loaded</span>
                <span className="font-medium">{stats.invoices.loaded}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-chart-2"
                  style={{ width: stats.invoices.total > 0 ? `${(stats.invoices.loaded / stats.invoices.total) * 100}%` : '0%' }}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Open</span>
                <span className="font-medium">{stats.invoices.open}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500"
                  style={{ width: stats.invoices.total > 0 ? `${(stats.invoices.open / stats.invoices.total) * 100}%` : '0%' }}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Failed</span>
                <span className="font-medium">{stats.invoices.failed}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-destructive"
                  style={{ width: stats.invoices.total > 0 ? `${(stats.invoices.failed / stats.invoices.total) * 100}%` : '0%' }}
                />
              </div>
            </div>
            <Link href="/documents">
              <Button variant="outline" className="w-full" data-testid="button-view-invoices">
                View All Invoices
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-3">
            <div className="space-y-1">
              <CardTitle className="text-base">Purchase Credit Notes</CardTitle>
              <p className="text-sm text-muted-foreground">
                {stats.creditNotes.total} total documents
              </p>
            </div>
            <CreditCard className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Loaded</span>
                <span className="font-medium">{stats.creditNotes.loaded}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-chart-2"
                  style={{ width: stats.creditNotes.total > 0 ? `${(stats.creditNotes.loaded / stats.creditNotes.total) * 100}%` : '0%' }}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Open</span>
                <span className="font-medium">{stats.creditNotes.open}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500"
                  style={{ width: stats.creditNotes.total > 0 ? `${(stats.creditNotes.open / stats.creditNotes.total) * 100}%` : '0%' }}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Failed</span>
                <span className="font-medium">{stats.creditNotes.failed}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-destructive"
                  style={{ width: stats.creditNotes.total > 0 ? `${(stats.creditNotes.failed / stats.creditNotes.total) * 100}%` : '0%' }}
                />
              </div>
            </div>
            <Link href="/documents">
              <Button variant="outline" className="w-full" data-testid="button-view-credit-notes">
                View All Credit Notes
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
