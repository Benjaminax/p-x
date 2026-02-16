import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from './Button';

const PageHeader = ({ title, subtitle, action, showBack = false, onBack }) => {
    const navigate = useNavigate();

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            navigate(-1);
        }
    };

    return (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col gap-2"
            >
                {showBack && (
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-2 text-zinc-400 hover:text-black transition-colors text-sm font-bold uppercase tracking-widest group w-fit"
                    >
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        Go Back
                    </button>
                )}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900">{title}</h1>
                    {subtitle && <p className="text-zinc-500 mt-1 text-lg">{subtitle}</p>}
                </div>
            </motion.div>

            {action && (
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    {action}
                </motion.div>
            )}
        </div>
    );
};

export default PageHeader;
