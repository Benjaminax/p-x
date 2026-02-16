import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './Button';
import { cn } from '../../lib/utils';

const AnimatedButton = React.forwardRef(({ className, children, variant, size, isLoading, ...props }, ref) => {
    return (
        <motion.div
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 22 }}
            className="inline-block"
        >
            <Button
                ref={ref}
                variant={variant}
                size={size}
                isLoading={isLoading}
                className={cn(className)}
                {...props}
            >
                {children}
            </Button>
        </motion.div>
    );
});

AnimatedButton.displayName = 'AnimatedButton';

export default AnimatedButton;
