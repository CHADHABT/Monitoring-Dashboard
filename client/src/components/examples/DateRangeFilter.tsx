import { DateRangeFilter } from '../DateRangeFilter';

export default function DateRangeFilterExample() {
  const handleFilterChange = (dateFrom?: string, dateTo?: string) => {
    console.log('Date filter changed:', { dateFrom, dateTo });
  };

  return (
    <div className="w-64 p-6">
      <DateRangeFilter onFilterChange={handleFilterChange} />
    </div>
  );
}
