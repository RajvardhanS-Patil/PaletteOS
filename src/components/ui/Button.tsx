import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/utils/cn';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-all focus-ring disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97] cursor-pointer',
          {
            // Variants
            'bg-brand-primary text-zinc-100 hover:opacity-90 shadow-sm': variant === 'primary',
            'bg-zinc-800 text-zinc-100 hover:bg-zinc-700': variant === 'secondary',
            'border border-zinc-700 bg-transparent text-zinc-100 hover:bg-zinc-800': variant === 'outline',
            'bg-transparent text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100': variant === 'ghost',
            'bg-red-500 text-zinc-100 hover:bg-red-600': variant === 'destructive',
            
            // Sizes
            'h-9 px-3 text-sm': size === 'sm',
            'h-10 px-4 text-base': size === 'md',
            'h-11 px-8 text-lg': size === 'lg',
            'h-10 w-10 p-0': size === 'icon',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };
