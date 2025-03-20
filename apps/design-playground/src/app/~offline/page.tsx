import { BoltVerticalOffIcon } from "@workingco/icons";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Offline",
};

export default function Page() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-y-6 p-8 md:p-16">
      <div className="mx-auto grid size-10 place-items-center rounded-full bg-gray-3 text-gray-10" aria-hidden>
        <BoltVerticalOffIcon className="size-4" />
      </div>
      <div className="flex flex-col gap-y-1.5 text-center">
        <h1 className="font-medium text-[21px] text-gray-a12 leading-7">You&apos;re offline</h1>
        <p className="text-[15px] text-gray-a11 leading-6">When offline, any page route will fallback to this page</p>
      </div>
    </div>
  );
}
