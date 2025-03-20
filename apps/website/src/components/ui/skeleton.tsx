import { cn } from "@/lib/cn";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse rounded-sm bg-muted text-transparent", className)} {...props} />;
}

export { Skeleton };
