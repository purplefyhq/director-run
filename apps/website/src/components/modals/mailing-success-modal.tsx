"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useMailingModal } from "@/hooks/use-mailing-modal";

export function MailingSuccessModal() {
  const { open, setOpen } = useMailingModal();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="prose">
        <DialogHeader>
          <DialogTitle>You&apos;re on the list.</DialogTitle>
        </DialogHeader>
        <p className="text-paragraph--large">Don&apos;t worry, we only send emails when we have something exciting to share, so no spamming from us.</p>
        <p className="text-paragraph--large">Talk soon.</p>
      </DialogContent>
    </Dialog>
  );
}
