import { ConnectionCard } from '../ConnectionCard';
import type { Connection } from '@shared/schema';

export default function ConnectionCardExample() {
  const sampleConnections: Connection[] = [
    {
      id: "1",
      name: "Production EU",
      uri: "mongodb+srv://...",
      database: "yooz_production",
      collection: "YOOZ_TRANSFORMED_ITEMS_DOCUMENTS",
      status: "connected"
    },
    {
      id: "2",
      name: "Staging US",
      uri: "mongodb+srv://...",
      database: "yooz_staging",
      collection: "YOOZ_TRANSFORMED_ITEMS_DOCUMENTS",
      status: "disconnected"
    }
  ];

  const handleTest = (id: string) => {
    console.log('Testing connection:', id);
  };

  const handleDelete = (id: string) => {
    console.log('Deleting connection:', id);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
      {sampleConnections.map((conn) => (
        <ConnectionCard
          key={conn.id}
          connection={conn}
          onTest={handleTest}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}
