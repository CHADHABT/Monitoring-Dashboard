import { StatsCard } from '../StatsCard';
import { FileText, CheckCircle2, XCircle, TrendingUp } from "lucide-react";

export default function StatsCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
      <StatsCard title="Total Documents" value="1,234" icon={FileText} />
      <StatsCard title="Loaded" value="1,156" icon={CheckCircle2} />
      <StatsCard title="Failed" value="45" icon={XCircle} />
      <StatsCard title="Success Rate" value="93.7%" icon={TrendingUp} />
    </div>
  );
}
