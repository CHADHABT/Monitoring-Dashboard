import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface PayloadEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  originalPayload: any;
  onSave: (newPayload: any) => Promise<void>;
  documentId: string;
}

export function PayloadEditorDialog({
  open,
  onOpenChange,
  originalPayload,
  onSave,
  documentId
}: PayloadEditorDialogProps) {
  const [editedPayload, setEditedPayload] = useState(JSON.stringify(originalPayload, null, 2));
  const [isValid, setIsValid] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const validateJSON = (value: string) => {
    try {
      JSON.parse(value);
      setIsValid(true);
      return true;
    } catch {
      setIsValid(false);
      return false;
    }
  };

  const handleTextChange = (value: string) => {
    setEditedPayload(value);
    validateJSON(value);
  };

  const handleSaveClick = () => {
    if (validateJSON(editedPayload)) {
      setShowConfirm(true);
    }
  };

  const handleConfirmSave = async () => {
    setIsSaving(true);
    try {
      const parsed = JSON.parse(editedPayload);
      await onSave(parsed);
      setShowConfirm(false);
      onOpenChange(false);
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Edit Payload</DialogTitle>
            <DialogDescription>
              Document ID: {documentId}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 overflow-hidden">
            <div className="space-y-2 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Original</p>
              </div>
              <Textarea
                value={JSON.stringify(originalPayload, null, 2)}
                readOnly
                className="font-mono text-xs flex-1 resize-none"
                data-testid="textarea-original-payload"
              />
            </div>

            <div className="space-y-2 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Edited</p>
                <Badge
                  className={`${
                    isValid
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
                      : "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200"
                  } gap-1`}
                >
                  {isValid ? (
                    <>
                      <CheckCircle2 className="h-3 w-3" />
                      Valid JSON
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-3 w-3" />
                      Invalid JSON
                    </>
                  )}
                </Badge>
              </div>
              <Textarea
                value={editedPayload}
                onChange={(e) => handleTextChange(e.target.value)}
                className="font-mono text-xs flex-1 resize-none"
                data-testid="textarea-edited-payload"
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              data-testid="button-cancel-edit"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveClick}
              disabled={!isValid}
              data-testid="button-save-payload"
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Changes</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to update this document's payload? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSaving} data-testid="button-cancel-confirm">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmSave}
              disabled={isSaving}
              data-testid="button-confirm-save"
            >
              {isSaving ? "Saving..." : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
