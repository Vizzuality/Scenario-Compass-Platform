import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("custom-skeleton-pulse rounded-md bg-stone-200", className)}
      {...props}
    />
  );
}

export { Skeleton };
