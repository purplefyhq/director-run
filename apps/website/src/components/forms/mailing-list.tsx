"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useMailingModal } from "@/hooks/use-mailing-modal";
import { cn } from "@/lib/cn";
import { trpc } from "@/trpc/client";
import { EmailIcon } from "@/ui/icon";
import { zodResolver } from "@hookform/resolvers/zod";
import { track } from "@vercel/analytics";
import { useForm } from "react-hook-form";
import { z } from "zod";

const mailingListSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type MailingListSchema = z.infer<typeof mailingListSchema>;

const useMailingListForm = () => {
  return useForm<MailingListSchema>({
    resolver: zodResolver(mailingListSchema),
    defaultValues: {
      email: "",
    },
  });
};

export function MailingListFrom() {
  const form = useMailingListForm();
  const { setOpen } = useMailingModal();

  const subscribeMutation = trpc.mailingList.subscribe.useMutation({
    onSuccess: () => {
      track("mailing_list_subscribed");
      setOpen(true);
    },
  });

  async function onSubmit(values: MailingListSchema) {
    await subscribeMutation.mutateAsync(values);
    form.reset();
  }

  const isLoading = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form className="relative flex flex-col gap-3" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel visible={false}>Email address</FormLabel>
              <div className="relative">
                <EmailIcon className="absolute top-3 left-5 size-6 sm:top-3 sm:left-5.5 sm:size-8" />
                <FormControl>
                  <Input className="rounded-full bg-white pl-14 focus-visible:ring-offset-0 sm:pl-16.5" data-id="get-notified-email" disabled={isLoading} type="email" placeholder="Enter your email" {...field} />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading} className="relative h-12 w-full px-5 sm:h-14 sm:text-[17px]">
          <span className={cn(isLoading && "opacity-0")}>Subscribe</span>

          {isLoading && (
            <span className="absolute inset-0 flex items-center justify-center">
              <svg className="size-4 animate-spin" viewBox="0 0 24 24" fillRule="evenodd" clipRule="evenodd" fill="currentcolor">
                <path d="M4.59905 10.7851C4.50959 11.3301 3.99526 11.6994 3.45027 11.6099C2.90528 11.5205 2.536 11.0061 2.62547 10.4611C2.95375 8.4613 3.91296 6.61885 5.36295 5.20299C6.81293 3.78713 8.6777 2.87206 10.6848 2.59149C12.6919 2.31092 14.7361 2.67955 16.5188 3.64352C17.6834 4.27331 18.6966 5.13564 19.5 6.16905V3.50001C19.5 2.94773 19.9477 2.50001 20.5 2.50001C21.0523 2.50001 21.5 2.94773 21.5 3.50001V9.16668C21.5 9.71896 21.0523 10.1667 20.5 10.1667H14.8333C14.281 10.1667 13.8333 9.71896 13.8333 9.16668C13.8333 8.61439 14.281 8.16668 14.8333 8.16668H18.4464C17.7563 7.00612 16.763 6.04926 15.5674 5.40278C14.1601 4.64176 12.5462 4.35073 10.9617 4.57223C9.37713 4.79374 7.90495 5.51616 6.76022 6.63394C5.61549 7.75173 4.85822 9.20629 4.59905 10.7851ZM19.4009 13.2149C19.4904 12.6699 20.0047 12.3006 20.5497 12.3901C21.0947 12.4796 21.464 12.9939 21.3745 13.5389C21.0462 15.5387 20.087 17.3812 18.6371 18.797C17.1871 20.2129 15.3223 21.128 13.3152 21.4085C11.3081 21.6891 9.26391 21.3205 7.48125 20.3565C6.31659 19.7267 5.30345 18.8644 4.5 17.831V20.5C4.5 21.0523 4.05228 21.5 3.5 21.5C2.94772 21.5 2.5 21.0523 2.5 20.5V14.8333C2.5 14.2811 2.94772 13.8333 3.5 13.8333H9.16667C9.71895 13.8333 10.1667 14.2811 10.1667 14.8333C10.1667 15.3856 9.71895 15.8333 9.16667 15.8333H5.55363C6.24374 16.9939 7.23704 17.9508 8.43256 18.5972C9.83993 19.3583 11.4538 19.6493 13.0383 19.4278C14.6229 19.2063 16.0951 18.4839 17.2398 17.3661C18.3845 16.2483 19.1418 14.7937 19.4009 13.2149Z" />
              </svg>
            </span>
          )}
        </Button>
      </form>
    </Form>
  );
}

export function MailingListFormSkeleteon() {
  return (
    <div className="flex flex-col gap-2.5 sm:flex-row">
      <Skeleton className="h-10 w-full bg-primary/10" />
      <Skeleton className="pointer-events-none h-10 select-none bg-primary/10 px-3">Subscribe</Skeleton>
    </div>
  );
}
