import { useState } from 'react';
import { DocumentFilters } from '../DocumentFilters';

export default function DocumentFiltersExample() {
  const [filters, setFilters] = useState({
    types: [] as string[],
    statuses: [] as string[],
    searchQuery: '',
  });

  return (
    <div className="w-64 p-6">
      <DocumentFilters filters={filters} onFilterChange={setFilters} />
    </div>
  );
}
