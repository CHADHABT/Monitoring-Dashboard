import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Database, Trash2, CheckCircle2, XCircle } from "lucide-react";
import type { Connection } from "@shared/schema";

interface ConnectionCardProps {
  connection: Connection;
  onTest: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ConnectionCard({ connection, onTest, onDelete }: ConnectionCardProps) {
  const isConnected = connection.status === "connected";

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-3">
        <div className="space-y-1 flex-1">
          <CardTitle className="text-base flex items-center gap-2">
            <Database className="h-4 w-4" />
            {connection.name}
          </CardTitle>
          <CardDescription className="text-xs">
            {connection.database}
          </CardDescription>
        </div>
        <Badge
          className={`${
            isConnected
              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
              : "bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-200"
          } gap-1`}
          data-testid={`badge-status-${connection.id}`}
        >
          {isConnected ? (
            <>
              <CheckCircle2 className="h-3 w-3" />
              Connected
            </>
          ) : (
            <>
              <XCircle className="h-3 w-3" />
              Disconnected
            </>
          )}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-xs text-muted-foreground">
          Collection: {connection.collection}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onTest(connection.id)}
            className="flex-1"
            data-testid={`button-test-${connection.id}`}
          >
            Test Connection
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(connection.id)}
            data-testid={`button-delete-${connection.id}`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
