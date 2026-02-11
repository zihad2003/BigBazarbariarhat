import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: string | number;
    change: string;
    changeType: 'positive' | 'negative' | 'neutral';
    icon: any;
}

export function StatsCard({
    title,
    value,
    change,
    changeType,
    icon: Icon
}: StatsCardProps) {
    return (
        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm text-gray-400 font-black uppercase tracking-widest">{title}</p>
                    <p className="text-3xl font-black mt-3 text-gray-900">{value}</p>
                    <div className="flex items-center gap-2 mt-4">
                        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase whitespace-nowrap ${changeType === 'positive' ? 'bg-green-100 text-green-600' :
                            changeType === 'negative' ? 'bg-red-100 text-red-600' :
                                'bg-gray-100 text-gray-500'
                            }`}>
                            {changeType === 'positive' && <TrendingUp className="h-3 w-3" />}
                            {changeType === 'negative' && <TrendingDown className="h-3 w-3" />}
                            {change}
                        </div>
                        <span className="text-gray-300 text-[10px] font-bold uppercase">vs last month</span>
                    </div>
                </div>
                <div className={`p-4 rounded-[1.5rem] transition-transform group-hover:scale-110 ${changeType === 'positive' ? 'bg-green-50 text-green-600' :
                    changeType === 'negative' ? 'bg-red-50 text-red-600' :
                        'bg-indigo-50 text-indigo-600'
                    }`}>
                    <Icon className="h-8 w-8" />
                </div>
            </div>
        </div>
    );
}
