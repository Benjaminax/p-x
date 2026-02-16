import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { forwardRef } from 'react';

const GlassCard = forwardRef(({
    className,
    children,
    hoverEffect = false,
    ...props
}, ref) => {
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={hoverEffect ? { y: -4, shadow: "0 20px 40px -5px rgba(0, 0, 0, 0.05)" } : undefined}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
                "rounded-2xl border backdrop-blur-xl transition-all duration-300",
                "bg-[var(--color-surface-glass)] border-[var(--color-border)] text-[var(--color-text-primary)] shadow-[var(--shadow-md)]",
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
});

GlassCard.displayName = "GlassCard";

export default GlassCard;
