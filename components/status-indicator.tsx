import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";

const statusVariants = cva("flex-none rounded-full p-1", {
  variants: {
    variant: {
      online: "text-green-400 bg-green-400/10",
      offline: "text-rose-400 bg-rose-400/10",
    },
  },
  defaultVariants: {
    variant: "offline",
  },
});

type StatusProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof statusVariants>;

export default function StatusIndicator({
  className,
  variant,
  ...props
}: StatusProps) {
  return (
    <div className={cn(statusVariants({ variant }), className)} {...props}>
      <div className="h-1.5 w-1.5 rounded-full bg-current" />
    </div>
  );
}
