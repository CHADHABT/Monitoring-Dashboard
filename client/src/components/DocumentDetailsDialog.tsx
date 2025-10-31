import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, FileText, Package } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import type { Document } from "@shared/schema";

interface DocumentDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: Document | null;
}

export function DocumentDetailsDialog({
  open,
  onOpenChange,
  document,
}: DocumentDetailsDialogProps) {
  if (!document) return null;

  const documentLines = document.Payload?.DocumentLines || [];
  const hasError = document.Status === "FAILED" && document.Error;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Document Details
          </DialogTitle>
          <DialogDescription>
            {document.YoozDocNum} • {document.Type === "PurchaseInvoices" ? "Invoice" : "Credit Note"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4">
          {/* Document Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Document Number</p>
                  <p className="font-mono text-sm font-medium" data-testid="detail-doc-number">
                    {document.YoozDocNum}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <div className="mt-1">
                    <StatusBadge status={document.Status} />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">File Name</p>
                  <p className="text-sm font-medium" data-testid="detail-filename">
                    {document.FileName || document.RefDoc || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Card Code</p>
                  <p className="font-mono text-sm font-medium" data-testid="detail-card-code">
                    {document.Payload?.CardCode || "-"}
                  </p>
                </div>
                {document.Payload?.DocDate && (
                  <div>
                    <p className="text-sm text-muted-foreground">Document Date</p>
                    <p className="text-sm font-medium" data-testid="detail-doc-date">
                      {document.Payload.DocDate}
                    </p>
                  </div>
                )}
                {document.Payload?.DocTotal && (
                  <div>
                    <p className="text-sm text-muted-foreground">Total Amount</p>
                    <p className="text-sm font-medium" data-testid="detail-doc-total">
                      {document.Payload.DocTotal}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Error Information */}
          {hasError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error Details</AlertTitle>
              <AlertDescription>
                <pre className="mt-2 text-xs whitespace-pre-wrap font-mono" data-testid="detail-error">
                  {document.Error}
                </pre>
              </AlertDescription>
            </Alert>
          )}

          {/* Document Lines */}
          {documentLines.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Document Lines
                </CardTitle>
                <Badge variant="secondary">
                  {documentLines.length} {documentLines.length === 1 ? "line" : "lines"}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-medium text-muted-foreground">Item Code</TableHead>
                        <TableHead className="font-medium text-muted-foreground">Description</TableHead>
                        <TableHead className="font-medium text-muted-foreground text-right">Quantity</TableHead>
                        <TableHead className="font-medium text-muted-foreground text-right">Line Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {documentLines.map((line: any, index: number) => (
                        <TableRow key={index} data-testid={`row-line-${index}`}>
                          <TableCell className="font-mono text-sm" data-testid="text-item-code">
                            {line.ItemCode || "-"}
                          </TableCell>
                          <TableCell className="text-sm" data-testid="text-item-description">
                            {line.ItemDescription || line.Dscription || "-"}
                          </TableCell>
                          <TableCell className="text-sm text-right" data-testid="text-quantity">
                            {line.Quantity || "-"}
                          </TableCell>
                          <TableCell className="text-sm text-right font-medium" data-testid="text-line-total">
                            {line.LineTotal || "-"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Raw Payload (for debugging) */}
          {documentLines.length === 0 && !hasError && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Payload Data</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-xs bg-muted p-4 rounded-md overflow-x-auto">
                  {JSON.stringify(document.Payload, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
