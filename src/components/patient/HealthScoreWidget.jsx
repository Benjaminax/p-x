import { TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { cn } from '../../lib/utils';

const HealthScoreWidget = ({ score = 8.5, trend = 'up', className }) => {
    // Determine color based on score
    const getScoreColor = (score) => {
        if (score >= 8) return 'text-green-600';
        if (score >= 6) return 'text-blue-600';
        if (score >= 4) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getScoreBgColor = (score) => {
        if (score >= 8) return 'bg-green-50';
        if (score >= 6) return 'bg-blue-50';
        if (score >= 4) return 'bg-yellow-50';
        return 'bg-red-50';
    };

    const getScoreLabel = (score) => {
        if (score >= 8) return 'Excellent';
        if (score >= 6) return 'Good';
        if (score >= 4) return 'Fair';
        return 'Needs Attention';
    };

    const getTrendIcon = () => {
        switch (trend) {
            case 'up':
                return <TrendingUp className="w-4 h-4 text-green-600" />;
            case 'down':
                return <TrendingDown className="w-4 h-4 text-red-600" />;
            default:
                return <Minus className="w-4 h-4 text-gray-600" />;
        }
    };

    const getTrendLabel = () => {
        switch (trend) {
            case 'up':
                return 'Improving';
            case 'down':
                return 'Declining';
            default:
                return 'Stable';
        }
    };

    return (
        <Card className={cn('relative overflow-hidden', className)}>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold">Health Score</CardTitle>
                    <Info className="w-4 h-4 text-gray-400 cursor-help" title="AI-generated wellness rating based on your vitals, activity, and treatment progress" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                        <div className={cn('text-4xl font-bold', getScoreColor(score))}>
                            {score.toFixed(1)}
                        </div>
                        <div className="text-2xl text-gray-400 font-light">/10</div>
                    </div>
                    <div className={cn('px-3 py-1.5 rounded-full text-sm font-medium', getScoreBgColor(score), getScoreColor(score))}>
                        {getScoreLabel(score)}
                    </div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                    {getTrendIcon()}
                    <span className="text-sm font-medium text-gray-700">
                        Trending {getTrendLabel()}
                    </span>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                        Based on vitals, medication adherence, and activity levels
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};

export default HealthScoreWidget;
