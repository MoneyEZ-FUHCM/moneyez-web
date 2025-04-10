import { cn } from "@/helpers/libs/utils";

function SkeletonCustom({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-black/10", className)}
      {...props}
    />
  );
}

export { SkeletonCustom };
