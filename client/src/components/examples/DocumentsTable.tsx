import { DocumentsTable } from '../DocumentsTable';
import type { Document } from '@shared/schema';

export default function DocumentsTableExample() {
  const sampleDocuments: Document[] = [
    {
      _id: "1",
      YoozDocNum: "69",
      Type: "PurchaseCreditNotes",
      Status: "OPEN",
      FileName: "credit_note_2025_001.pdf",
      RefDoc: "credit_note_2025_001.pdf",
      Payload: {
        CardCode: "SFR000038",
        DocTotal: "5231.47",
        DocumentLines: [
          {
            ItemCode: "PSE000003-003",
            LineTotal: "5231.47",
            Quantity: "15",
            ItemDescription: "Product return credit"
          }
        ]
      },
      Last_updated: "2025-10-31T09:16:37.453676Z"
    },
    {
      _id: "2",
      YoozDocNum: "70",
      Type: "PurchaseInvoices",
      Status: "LOADED",
      FileName: "invoice_2025_042.pdf",
      RefDoc: "invoice_2025_042.pdf",
      Payload: {
        CardCode: "SFR000039",
        DocTotal: "1234.56",
        DocumentLines: [
          {
            ItemCode: "PSE000004-001",
            LineTotal: "1234.56",
            Quantity: "8",
            ItemDescription: "Office supplies"
          }
        ]
      },
      Last_updated: "2025-10-30T14:22:15.123456Z"
    },
    {
      _id: "3",
      YoozDocNum: "71",
      Type: "PurchaseInvoices",
      Status: "FAILED",
      FileName: "invoice_2025_043.pdf",
      RefDoc: "invoice_2025_043.pdf",
      Error: "Validation error: CardCode is required but missing from document payload",
      Payload: {
        DocTotal: "789.12",
        DocumentLines: []
      },
      Last_updated: "2025-10-29T11:45:33.987654Z"
    }
  ];

  const handlePayloadUpdate = async (documentId: string, newPayload: any) => {
    console.log('Updating document:', documentId, 'with payload:', newPayload);
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  return (
    <div className="p-6">
      <DocumentsTable documents={sampleDocuments} onPayloadUpdate={handlePayloadUpdate} />
    </div>
  );
}
