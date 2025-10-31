import { StatusBadge } from '../StatusBadge';

export default function StatusBadgeExample() {
  return (
    <div className="flex gap-4 p-6">
      <StatusBadge status="LOADED" />
      <StatusBadge status="OPEN" />
      <StatusBadge status="FAILED" />
    </div>
  );
}
