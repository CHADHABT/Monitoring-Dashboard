import { DocumentsTable } from '../DocumentsTable';
import type { Document } from '@shared/schema';

export default function DocumentsTableExample() {
  const sampleDocuments: Document[] = [
    {
      _id: "1",
      YoozDocNum: "69",
      Type: "PurchaseCreditNotes",
      Status: "OPEN",
      Payload: {
        CardCode: "SFR000038",
        DocTotal: "5231.47"
      },
      Last_updated: "2025-10-31T09:16:37.453676Z"
    },
    {
      _id: "2",
      YoozDocNum: "70",
      Type: "PurchaseInvoices",
      Status: "LOADED",
      Payload: {
        CardCode: "SFR000039",
        DocTotal: "1234.56"
      },
      Last_updated: "2025-10-30T14:22:15.123456Z"
    },
    {
      _id: "3",
      YoozDocNum: "71",
      Type: "PurchaseInvoices",
      Status: "FAILED",
      Payload: {
        CardCode: "SFR000040",
        DocTotal: "789.12"
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
