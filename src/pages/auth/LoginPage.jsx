import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/layout/AuthLayout';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent } from '../../components/ui/Card';
import { User, Activity, Stethoscope, ArrowRight, Eye, EyeOff } from 'lucide-react';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

const LoginPage = ({ mode = 'patient' }) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const { login: authLogin, user } = useAuth();

    useEffect(() => {
        if (user?.role) {
            navigate(user.role === 'doctor' ? '/dashboard/doctor' : '/dashboard/patient', { replace: true });
        }
    }, [user, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const ensureDemoUsersSeed = async () => {
            const demoEmail = 'kojoben29@gmail.com';
            const demoPatientPassword = '123456';
            const demoDoctorPassword = '12345678';

            // Only seed if the email matches
            if (email !== demoEmail) return;

            try {
                // If the user tries to login as patient with patient password
                if (mode === 'patient' && password === demoPatientPassword) {
                    await api.post('/auth/register', {
                        email: demoEmail,
                        password: demoPatientPassword,
                        fullName: 'Demo Patient',
                        role: 'patient',
                    });
                }
                // If the user tries to login as doctor with doctor password
                else if (mode === 'doctor' && password === demoDoctorPassword) {
                    await api.post('/auth/register', {
                        email: demoEmail,
                        password: demoDoctorPassword,
                        fullName: 'Dr. Kojoben',
                        role: 'doctor',
                    });
                }
            } catch (err) {
                // If user already exists, ignore; otherwise surface the error
                const status = err?.response?.status;
                if (status && status !== 401 && status !== 409) {
                    throw err;
                }
            }
        };

        try {
            await ensureDemoUsersSeed();

            const response = await api.post('/auth/login', {
                email,
                password,
                otp: mode === 'doctor' ? otp : undefined,
            });

            console.log('Login successful:', response.data);

            authLogin(response.data.access_token, response.data.user);

            const destination = response.data.user.role === 'doctor' ? '/dashboard/doctor' : '/dashboard/patient';
            navigate(destination, { replace: true });
        } catch (err) {
            console.error('Login failed:', err);
            setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout
            title={`Welcome back, ${mode === 'patient' ? 'Patient' : 'Doctor'}.`}
            subtitle="Enter your credentials to access your secure workspace."
        >
            <Card className="border-0 shadow-none bg-transparent">
                <CardContent className="p-0">
                    <form onSubmit={handleLogin} className="space-y-4">
                        <motion.div
                            key={mode}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-4"
                        >
                            {mode === 'patient' ? (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            Email or Phone
                                        </label>
                                        <Input
                                            placeholder="Enter your email or phone number"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            Password
                                        </label>
                                        <div className="relative">
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                className="pr-10"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                aria-label={showPassword ? "Hide password" : "Show password"}
                                            >
                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            Hospital ID or Email
                                        </label>
                                        <Input
                                            placeholder="referral@hospital.org"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            Password
                                        </label>
                                        <div className="relative">
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                className="pr-10"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                aria-label={showPassword ? "Hide password" : "Show password"}
                                            >
                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            Two-Factor Code (Optional)
                                        </label>
                                        <Input
                                            placeholder="123 456"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                        />
                                    </div>
                                </>
                            )}
                        </motion.div>

                        {error && (
                            <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                                {error}
                            </div>
                        )}

                        <div className="pt-4">
                            <Button type="submit" className="w-full h-11 text-base bg-black text-white hover:bg-gray-900" isLoading={isLoading}>
                                {isLoading ? 'Authenticating...' : 'Sign In'}
                                {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
                            </Button>
                        </div>
                    </form>

                    {mode === 'patient' && (
                        <div className="mt-6 text-center text-sm">
                            <p className="text-[var(--color-text-secondary)]">
                                Don't have an account?{' '}
                                <a href="/signup" className="font-semibold text-black hover:underline">
                                    Create Digital Health Card
                                </a>
                            </p>
                        </div>
                    )}

                    {mode === 'doctor' && (
                        <div className="mt-6 text-center text-sm">
                            <p className="text-[var(--color-text-secondary)]">
                                Having trouble accessing?{' '}
                                <span className="font-semibold text-black cursor-pointer hover:underline">
                                    Contact System Admin
                                </span>
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {mode === 'patient' && (
                <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-100 flex items-start gap-3">
                    <Activity className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="text-xs text-[var(--color-text-secondary)]">
                        <strong className="block text-[var(--color-text-primary)] mb-1">Emergency Mode Available</strong>
                        In case of emergency, use the mobile app to access critical health data offline without logging in.
                    </div>
                </div>
            )}
        </AuthLayout>
    );
};

export default LoginPage;
