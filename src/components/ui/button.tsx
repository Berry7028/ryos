import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { useSound, Sounds } from "@/hooks/useSound";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover-lift",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 modern-shadow",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 modern-shadow",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground modern-shadow",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 modern-shadow",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        modern: "bg-primary text-primary-foreground hover:bg-primary/90 modern-shadow-md hover:modern-shadow-lg",
        glass: "glass-effect text-foreground hover:bg-white/20 dark:hover:bg-black/30",
        retro:
          "border-[5px] border-solid border-transparent [border-image:url('/button.svg')_30_stretch] active:[border-image:url('/button-default.svg')_60_stretch] focus:[border-image:url('/button-default.svg')_60_stretch] shadow-none focus:outline-none focus:ring-0",
        player:
          "text-[9px] flex items-center justify-center focus:outline-none relative min-w-[45px] h-[20px] border border-solid border-transparent [border-image:url('/assets/videos/switch.png')_1_fill] [border-image-slice:1] bg-none font-geneva-12 text-black hover:brightness-90 active:brightness-50 [&[data-state=on]]:brightness-60",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3 text-xs rounded-md",
        lg: "h-11 px-8 rounded-lg",
        icon: "h-9 w-9",
        xs: "h-7 px-2 text-xs rounded-md",
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
  asChild?: boolean;
  soundDisabled?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, soundDisabled = false, ...props }, ref) => {
    const { play: playClick } = useSound(Sounds.BUTTON_CLICK, 0.3);
    const Comp = asChild ? Slot : "button";

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!soundDisabled) {
        playClick();
      }
      if (props.onClick) {
        props.onClick(e);
      }
    };

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
        onClick={handleClick}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
