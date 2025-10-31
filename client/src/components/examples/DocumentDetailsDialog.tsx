import { useState } from 'react';
import { DocumentDetailsDialog } from '../DocumentDetailsDialog';
import { Button } from "@/components/ui/button";
import type { Document } from '@shared/schema';

export default function DocumentDetailsDialogExample() {
  const [open, setOpen] = useState(false);

  const sampleDocument: Document = {
    _id: "69047de52b9b5370b43ad69f",
    YoozDocNum: "69",
    Type: "PurchaseInvoices",
    Status: "LOADED",
    RefDoc: "invoice_2025_001.pdf",
    FileName: "invoice_2025_001.pdf",
    Payload: {
      CardCode: "SFR000038",
      DocType: "dDocument_Items",
      DocDate: "20251031",
      DocTotal: "5231.47",
      DocumentLines: [
        {
          ItemCode: "PSE000003-003",
          LineTotal: "4359.56",
          Quantity: "10",
          ItemDescription: "Annual Rebates on goods"
        },
        {
          ItemCode: "PSE000003-004",
          LineTotal: "871.91",
          Quantity: "5",
          ItemDescription: "Monthly subscription fees"
        }
      ]
    },
    Last_updated: "2025-10-31T09:16:37.453676Z"
  };

  const failedDocument: Document = {
    _id: "69047de52b9b5370b43ad69e",
    YoozDocNum: "70",
    Type: "PurchaseInvoices",
    Status: "FAILED",
    RefDoc: "invoice_2025_002.pdf",
    FileName: "invoice_2025_002.pdf",
    Error: "Failed to validate document: CardCode is required but was not found in the payload. Please check the source document.",
    Payload: {
      DocType: "dDocument_Items",
      DocDate: "20251031",
      DocumentLines: []
    },
    Last_updated: "2025-10-31T10:22:15.123456Z"
  };

  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

  return (
    <div className="p-6 space-y-4">
      <div className="flex gap-4">
        <Button onClick={() => { setSelectedDoc(sampleDocument); setOpen(true); }}>
          View Successful Document
        </Button>
        <Button onClick={() => { setSelectedDoc(failedDocument); setOpen(true); }} variant="destructive">
          View Failed Document
        </Button>
      </div>
      <DocumentDetailsDialog
        open={open}
        onOpenChange={setOpen}
        document={selectedDoc}
      />
    </div>
  );
}
