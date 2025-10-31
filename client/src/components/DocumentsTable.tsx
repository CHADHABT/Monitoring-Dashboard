import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { PayloadEditorDialog } from "./PayloadEditorDialog";
import { format } from "date-fns";
import type { Document } from "@shared/schema";

interface DocumentsTableProps {
  documents: Document[];
  onPayloadUpdate?: (documentId: string, newPayload: any) => Promise<void>;
}

export function DocumentsTable({ documents, onPayloadUpdate }: DocumentsTableProps) {
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);

  const handleSavePayload = async (newPayload: any) => {
    if (editingDocument && onPayloadUpdate) {
      await onPayloadUpdate(editingDocument._id, newPayload);
    }
  };

  return (
    <>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-medium text-muted-foreground">Document #</TableHead>
              <TableHead className="font-medium text-muted-foreground">Type</TableHead>
              <TableHead className="font-medium text-muted-foreground">Status</TableHead>
              <TableHead className="font-medium text-muted-foreground">Card Code</TableHead>
              <TableHead className="font-medium text-muted-foreground">Last Updated</TableHead>
              <TableHead className="font-medium text-muted-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No documents found
                </TableCell>
              </TableRow>
            ) : (
              documents.map((doc) => (
                <TableRow key={doc._id} className="hover:bg-muted/50" data-testid={`row-document-${doc._id}`}>
                  <TableCell className="font-mono text-sm" data-testid="text-doc-number">
                    {doc.YoozDocNum}
                  </TableCell>
                  <TableCell className="text-sm" data-testid="text-doc-type">
                    {doc.Type === "PurchaseInvoices" ? "Invoice" : "Credit Note"}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={doc.Status} />
                  </TableCell>
                  <TableCell className="font-mono text-sm" data-testid="text-card-code">
                    {doc.Payload?.CardCode || "-"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground" data-testid="text-last-updated">
                    {doc.Last_updated
                      ? format(new Date(doc.Last_updated), "MMM d, yyyy HH:mm")
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setEditingDocument(doc)}
                      data-testid={`button-edit-${doc._id}`}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {editingDocument && (
        <PayloadEditorDialog
          open={!!editingDocument}
          onOpenChange={(open) => !open && setEditingDocument(null)}
          originalPayload={editingDocument.Payload}
          onSave={handleSavePayload}
          documentId={editingDocument._id}
        />
      )}
    </>
  );
}

export type { Document };
