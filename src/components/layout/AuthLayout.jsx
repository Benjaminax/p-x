import { motion } from 'framer-motion';

const AuthLayout = ({ children, title, subtitle }) => {
    return (
        <div className="flex min-h-screen w-full bg-[var(--color-bg)]">
            {/* Visual Side */}
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="hidden md:flex w-2/5 lg:w-1/2 flex-col justify-between p-6 md:p-12 relative overflow-hidden"
                style={{
                    background: 'radial-gradient(circle at 20% 20%, rgba(14,165,233,0.18), transparent 45%), radial-gradient(circle at 80% 10%, rgba(14,165,233,0.12), transparent 40%), linear-gradient(135deg, #0f172a 0%, #0b1220 100%)'
                }}
            >
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -left-24 top-16 w-72 h-72 bg-[#0ea5e9]/20 blur-[120px]" />
                    <div className="absolute right-0 bottom-12 w-80 h-80 bg-[#0ea5e9]/16 blur-[120px]" />
                    <div className="absolute inset-10 border border-white/5 rounded-3xl" />
                </div>

                <div className="relative z-10 flex items-center gap-3">
                    <div className="h-11 w-11 rounded-2xl bg-white text-[#0f172a] flex items-center justify-center font-semibold shadow-lg shadow-black/20">
                        PX
                    </div>
                    <div className="text-white text-2xl font-semibold tracking-tight">Project X</div>
                </div>

                <div className="relative z-10 max-w-lg space-y-6">
                    <motion.h1
                        initial={{ y: 16, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-5xl font-semibold text-white leading-tight tracking-tight"
                    >
                        A calmer clinical workspace with guided collaboration.
                    </motion.h1>
                    <motion.p
                        initial={{ y: 16, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-base text-white/80 leading-relaxed"
                    >
                        Secure by default, role-aware navigation, and fast actions for doctors and patients. Live session handoff and audit-ready access.
                    </motion.p>
                    <div className="flex items-center gap-3 text-sm text-white/70">
                        <span className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white/10 border border-white/15">MFA-ready</span>
                        <span className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white/10 border border-white/15">PHI Redaction</span>
                        <span className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white/10 border border-white/15">Audit Trails</span>
                    </div>
                </div>

                <div className="relative z-10 flex items-center justify-between text-xs text-white/60 font-medium uppercase tracking-[0.12em]">
                    <span>Secure Edge</span>
                    <span>© 2026 Project X</span>
                </div>
            </motion.div>

            {/* Form Side */}
            <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
                <div className="w-full max-w-md space-y-8 bg-white shadow-lg shadow-slate-900/5 border border-[var(--color-border)] rounded-2xl p-8">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-semibold text-[var(--color-text-primary)] tracking-tight">
                            {title}
                        </h2>
                        <p className="text-sm text-[var(--color-text-secondary)]">
                            {subtitle}
                        </p>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
