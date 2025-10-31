import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface DocumentFiltersProps {
  filters: {
    types: string[];
    statuses: string[];
    searchQuery: string;
  };
  onFilterChange: (filters: { types: string[]; statuses: string[]; searchQuery: string }) => void;
}

export function DocumentFilters({ filters, onFilterChange }: DocumentFiltersProps) {
  const handleTypeToggle = (type: string) => {
    const newTypes = filters.types.includes(type)
      ? filters.types.filter(t => t !== type)
      : [...filters.types, type];
    onFilterChange({ ...filters, types: newTypes });
  };

  const handleStatusToggle = (status: string) => {
    const newStatuses = filters.statuses.includes(status)
      ? filters.statuses.filter(s => s !== status)
      : [...filters.statuses, status];
    onFilterChange({ ...filters, statuses: newStatuses });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Doc #, File Name, Card Code..."
              value={filters.searchQuery}
              onChange={(e) => onFilterChange({ ...filters, searchQuery: e.target.value })}
              className="pl-9"
              data-testid="input-search-documents"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Search by Document #, File Name, or Card Code
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Document Type</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="type-invoices"
              checked={filters.types.includes("PurchaseInvoices")}
              onCheckedChange={() => handleTypeToggle("PurchaseInvoices")}
              data-testid="checkbox-type-invoices"
            />
            <Label htmlFor="type-invoices" className="text-sm cursor-pointer">
              Purchase Invoices
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="type-credit-notes"
              checked={filters.types.includes("PurchaseCreditNotes")}
              onCheckedChange={() => handleTypeToggle("PurchaseCreditNotes")}
              data-testid="checkbox-type-credit-notes"
            />
            <Label htmlFor="type-credit-notes" className="text-sm cursor-pointer">
              Purchase Credit Notes
            </Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="status-loaded"
              checked={filters.statuses.includes("LOADED")}
              onCheckedChange={() => handleStatusToggle("LOADED")}
              data-testid="checkbox-status-loaded"
            />
            <Label htmlFor="status-loaded" className="text-sm cursor-pointer">
              Loaded
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="status-open"
              checked={filters.statuses.includes("OPEN")}
              onCheckedChange={() => handleStatusToggle("OPEN")}
              data-testid="checkbox-status-open"
            />
            <Label htmlFor="status-open" className="text-sm cursor-pointer">
              Open
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="status-failed"
              checked={filters.statuses.includes("FAILED")}
              onCheckedChange={() => handleStatusToggle("FAILED")}
              data-testid="checkbox-status-failed"
            />
            <Label htmlFor="status-failed" className="text-sm cursor-pointer">
              Failed
            </Label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
