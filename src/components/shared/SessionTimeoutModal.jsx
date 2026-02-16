import { useEffect, useState } from 'react';
import { AlertTriangle, Clock } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

const SessionTimeoutModal = ({
    isOpen,
    secondsRemaining,
    onExtendSession,
    onLogout
}) => {
    const [countdown, setCountdown] = useState(secondsRemaining);

    useEffect(() => {
        setCountdown(secondsRemaining);
    }, [secondsRemaining]);

    useEffect(() => {
        if (!isOpen) return;

        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    onLogout();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isOpen, onLogout]);

    if (!isOpen) return null;

    const minutes = Math.floor(countdown / 60);
    const seconds = countdown % 60;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <Card className="w-full max-w-md mx-4 shadow-2xl border-yellow-200 bg-yellow-50/95">
                <div className="p-6">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-yellow-100 rounded-full">
                            <AlertTriangle className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Session Timeout Warning
                            </h3>
                            <p className="text-sm text-gray-700 mb-4">
                                Your session will expire due to inactivity. You will be automatically logged out in:
                            </p>

                            <div className="flex items-center gap-3 mb-6 p-4 bg-white rounded-lg border border-yellow-200">
                                <Clock className="w-5 h-5 text-yellow-600" />
                                <div className="text-3xl font-bold text-yellow-600 tabular-nums">
                                    {minutes}:{seconds.toString().padStart(2, '0')}
                                </div>
                            </div>

                            <p className="text-xs text-gray-600 mb-4">
                                This is required for HIPAA compliance and data security.
                            </p>

                            <div className="flex gap-3">
                                <Button
                                    onClick={onExtendSession}
                                    className="flex-1 bg-black text-white hover:bg-gray-900"
                                >
                                    Continue Session
                                </Button>
                                <Button
                                    onClick={onLogout}
                                    variant="outline"
                                    className="flex-1"
                                >
                                    Logout Now
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default SessionTimeoutModal;
