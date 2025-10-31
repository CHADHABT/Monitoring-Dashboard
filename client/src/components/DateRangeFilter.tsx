import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { format, subDays, startOfDay, endOfDay } from "date-fns";

interface DateRangeFilterProps {
  onFilterChange: (dateFrom?: string, dateTo?: string) => void;
}

export function DateRangeFilter({ onFilterChange }: DateRangeFilterProps) {
  const [selectedRange, setSelectedRange] = useState<"today" | "last7" | "custom" | null>(null);
  const [customDateFrom, setCustomDateFrom] = useState<Date>();
  const [customDateTo, setCustomDateTo] = useState<Date>();

  const handleQuickFilter = (range: "today" | "last7") => {
    setSelectedRange(range);
    const today = new Date();
    
    if (range === "today") {
      const dateFrom = startOfDay(today).toISOString();
      const dateTo = endOfDay(today).toISOString();
      onFilterChange(dateFrom, dateTo);
    } else if (range === "last7") {
      const dateFrom = startOfDay(subDays(today, 7)).toISOString();
      const dateTo = endOfDay(today).toISOString();
      onFilterChange(dateFrom, dateTo);
    }
  };

  const handleCustomRange = () => {
    if (customDateFrom && customDateTo) {
      setSelectedRange("custom");
      onFilterChange(
        startOfDay(customDateFrom).toISOString(),
        endOfDay(customDateTo).toISOString()
      );
    }
  };

  const handleClear = () => {
    setSelectedRange(null);
    setCustomDateFrom(undefined);
    setCustomDateTo(undefined);
    onFilterChange(undefined, undefined);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Date Range</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-2">
          <Button
            variant={selectedRange === "today" ? "default" : "outline"}
            size="sm"
            onClick={() => handleQuickFilter("today")}
            className="w-full justify-start"
            data-testid="button-filter-today"
          >
            Today
          </Button>
          <Button
            variant={selectedRange === "last7" ? "default" : "outline"}
            size="sm"
            onClick={() => handleQuickFilter("last7")}
            className="w-full justify-start"
            data-testid="button-filter-last7"
          >
            Last 7 Days
          </Button>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Custom Range</p>
          <div className="flex flex-col gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left font-normal"
                  data-testid="button-date-from"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {customDateFrom ? format(customDateFrom, "PP") : "From date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={customDateFrom}
                  onSelect={setCustomDateFrom}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left font-normal"
                  data-testid="button-date-to"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {customDateTo ? format(customDateTo, "PP") : "To date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={customDateTo}
                  onSelect={setCustomDateTo}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Button
              size="sm"
              onClick={handleCustomRange}
              disabled={!customDateFrom || !customDateTo}
              className="w-full"
              data-testid="button-apply-custom-range"
            >
              Apply Range
            </Button>
          </div>
        </div>

        {selectedRange && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleClear}
            className="w-full"
            data-testid="button-clear-date-filter"
          >
            Clear Filter
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
