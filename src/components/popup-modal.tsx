"use client";

import PopupComponent from "./popup-component";
import { PopupViewProps } from "@/lib/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface PopupModalProps {
  props: PopupViewProps;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PopupModal({ props, open, onOpenChange }: PopupModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>Popup Preview</DialogTitle>
        </DialogHeader>
        <div className='flex justify-center py-4'>
          <PopupComponent {...props} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
