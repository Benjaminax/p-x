import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/layout/AuthLayout';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent } from '../../components/ui/Card';
import { ArrowLeft, ArrowRight, Check, Eye, EyeOff } from 'lucide-react';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

const SignupPage = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState(null);
    const { login: authLogin } = useAuth();

    const handleNext = (e) => {
        e.preventDefault();
        setError(null);

        if (step === 1 && (!firstName || !lastName || !email || !password || !confirmPassword)) {
            setError('Please complete all required account fields.');
            return;
        }

        if (step === 1 && password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (step === 1 && password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }

        if (step < 3) {
            setStep(step + 1);
            return;
        }

        handleSignup();
    };

    const handleSignup = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.post('/auth/register', {
                email,
                password,
                fullName: `${firstName} ${lastName}`.trim(),
                role: 'patient',
            });

            authLogin(response.data.access_token, response.data.user);
            navigate('/dashboard/patient', { replace: true });
        } catch (err) {
            console.error('Signup failed', err);
            setError(err.response?.data?.message || 'Could not create your account. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Create Digital Health Card"
            subtitle="Join the network to access intelligent care instantly."
        >
            <Card className="border-0 shadow-none bg-transparent">
                <CardContent className="p-0">
                    {/* Progress Steps */}
                    <div className="flex items-center gap-2 mb-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex-1 h-1 rounded-full bg-gray-100 overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: step >= i ? '100%' : '0%' }}
                                    className="h-full bg-black"
                                    transition={{ duration: 0.3 }}
                                />
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleNext} className="space-y-6">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {step === 1 && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">Account Essentials</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">First Name</label>
                                            <Input
                                                placeholder="Jane"
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Last Name</label>
                                            <Input
                                                placeholder="Doe"
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Email Address</label>
                                        <Input
                                            type="email"
                                            placeholder="jane@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Password</label>
                                        <div className="relative">
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Create a strong password"
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
                                        <p className="text-xs text-gray-500">Must be at least 6 characters</p>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Confirm Password</label>
                                        <div className="relative">
                                            <Input
                                                type={showConfirmPassword ? "text" : "password"}
                                                placeholder="Re-enter your password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                required
                                                className="pr-10"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                            >
                                                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">Health Basics</h3>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Date of Birth</label>
                                        <Input type="date" required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Genotype (Optional)</label>
                                        <Input placeholder="e.g., AA, AS" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Blood Group (Optional)</label>
                                        <Input placeholder="e.g., O+" />
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">Critical Information</h3>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Known Allergies</label>
                                        <Input placeholder="e.g., Penicillin, Peanuts (Comma separated)" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Chronic Conditions</label>
                                        <Input placeholder="e.g., Asthma, Diabetes" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Emergency Contact</label>
                                        <Input placeholder="+1 (555) 000-0000" />
                                    </div>
                                </div>
                            )}
                        </motion.div>

                        {error && (
                            <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                                {error}
                            </div>
                        )}

                        <div className="flex gap-4 pt-4">
                            {step > 1 && (
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => setStep(step - 1)}
                                    className="w-1/3"
                                >
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back
                                </Button>
                            )}
                            <Button
                                type="submit"
                                className={`flex-1 bg-black text-white hover:bg-gray-900 ${step === 1 ? 'w-full' : ''}`}
                                isLoading={isLoading}
                            >
                                {step === 3 ? (isLoading ? 'Creating Health Card...' : 'Complete Registration') : 'Continue'}
                                {!isLoading && step < 3 && <ArrowRight className="w-4 h-4 ml-2" />}
                                {!isLoading && step === 3 && <Check className="w-4 h-4 ml-2" />}
                            </Button>
                        </div>
                    </form>

                    <div className="mt-6 text-center text-sm">
                        <p className="text-[var(--color-text-secondary)]">
                            Already have an account?{' '}
                            <a href="/login" className="font-semibold text-black hover:underline">
                                Sign in
                            </a>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </AuthLayout>
    );
};

export default SignupPage;
