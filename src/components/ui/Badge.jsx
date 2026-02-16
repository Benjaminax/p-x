import { cn } from "../../lib/utils";

function Badge({ className, variant = "default", ...props }) {
    const variants = {
        default: "bg-slate-100 text-slate-900",
        secondary: "bg-slate-100 text-slate-800",
        destructive: "bg-rose-500 text-white",
        outline: "text-slate-900 border border-slate-200",
        success: "bg-emerald-500 text-white",
        warning: "bg-amber-500 text-white",
    };

    return (
        <div
            className={cn(
                "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                variants[variant] || variants.default,
                className
            )}
            {...props}
        />
    );
}

export { Badge };
