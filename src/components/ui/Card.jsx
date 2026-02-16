import { forwardRef } from 'react';
import { cn } from "../../lib/utils";

const Card = forwardRef(({ className, children, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "rounded-xl glass-card text-[var(--color-text-primary)] transition-all duration-300 border border-white/40 shadow-sm",
            className
        )}
        {...props}
    >
        {children}
    </div>
));
Card.displayName = "Card";

const CardHeader = forwardRef(({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pb-2", className)} {...props}>
        {children}
    </div>
));
CardHeader.displayName = "CardHeader";

const CardTitle = forwardRef(({ className, children, ...props }, ref) => (
    <h3 ref={ref} className={cn("font-semibold text-lg leading-none tracking-tight", className)} {...props}>
        {children}
    </h3>
));
CardTitle.displayName = "CardTitle";

const CardDescription = forwardRef(({ className, children, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-[var(--color-text-muted)] mt-1.5", className)} {...props}>
        {children}
    </p>
));
CardDescription.displayName = "CardDescription";

const CardContent = forwardRef(({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-2", className)} {...props}>
        {children}
    </div>
));
CardContent.displayName = "CardContent";

const CardFooter = forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex items-center p-6 pt-0", className)}
        {...props}
    />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
