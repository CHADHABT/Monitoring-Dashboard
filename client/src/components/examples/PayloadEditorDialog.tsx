import { useState } from 'react';
import { PayloadEditorDialog } from '../PayloadEditorDialog';
import { Button } from "@/components/ui/button";

export default function PayloadEditorDialogExample() {
  const [open, setOpen] = useState(false);

  const samplePayload = {
    CardCode: "SFR000038",
    DocType: "dDocument_Items",
    DocDate: "20251031",
    DocTotal: "5231.47",
    DocumentLines: [
      {
        ItemCode: "PSE000003-003",
        LineTotal: "4359.56",
        ItemDescription: "Annual Rebates on goods"
      }
    ]
  };

  const handleSave = async (newPayload: any) => {
    console.log('Saving payload:', newPayload);
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  return (
    <div className="p-6">
      <Button onClick={() => setOpen(true)}>
        Open Payload Editor
      </Button>
      <PayloadEditorDialog
        open={open}
        onOpenChange={setOpen}
        originalPayload={samplePayload}
        onSave={handleSave}
        documentId="69047de52b9b5370b43ad69f"
      />
    </div>
  );
}
