// components/ui/Button.tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils"; // Utility to combine class names

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium " +
    "transition-colors duration-200 ease-in-out " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-blue-500 focus-visible:ring-offset-2 " +
    "disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-white shadow-custom-md hover:bg-primary-dark active:scale-[0.98]",
        outline:
          "border border-primary text-primary bg-background hover:bg-sky-blue-50 active:scale-[0.98]",
        secondary:
          "bg-sky-blue-100 text-sky-blue-700 hover:bg-sky-blue-200 active:scale-[0.98]",
        ghost: "hover:bg-sky-blue-50 hover:text-sky-blue-700",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8 text-base",
        xl: "h-12 px-10 text-lg", // Extra large for hero button
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean; // Allows rendering a different component (e.g., Link) as a button
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? "span" : "button"; // Render as span if asChild is true
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
