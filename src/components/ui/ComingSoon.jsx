import { motion } from 'framer-motion';
import { Construction } from 'lucide-react';
import GlassCard from './GlassCard';
import { Button } from './Button';
import { useNavigate } from 'react-router-dom';

const ComingSoon = ({ title = "Coming Soon", description = "We are working hard to bring you this feature.", showHomeButton = true }) => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
            <GlassCard className="p-12 max-w-lg w-full text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-black to-transparent opacity-20"></div>

                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm"
                >
                    <Construction className="w-10 h-10 text-zinc-400" />
                </motion.div>

                <motion.h2
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-3xl font-bold mb-3 heading-text"
                >
                    {title}
                </motion.h2>

                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-zinc-500 mb-8"
                >
                    {description}
                </motion.p>

                {showHomeButton && (
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Button onClick={() => navigate(-1)} variant="outline">
                            Go Back
                        </Button>
                    </motion.div>
                )}
            </GlassCard>
        </div>
    );
};

export default ComingSoon;
