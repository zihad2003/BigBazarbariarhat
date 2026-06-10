'use client';

import dynamic from 'next/dynamic';

const DashboardCharts = dynamic(() => import('./dashboard-charts'), {
    ssr: false,
    loading: () => (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-3 bg-card border border-border rounded-xl p-5 h-[340px] animate-pulse flex items-center justify-center">
                <p className="text-[12px] text-muted-foreground">Loading sales performance...</p>
            </div>
            <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5 h-[340px] animate-pulse flex items-center justify-center">
                <p className="text-[12px] text-muted-foreground">Loading order volume...</p>
            </div>
        </div>
    )
});

interface ChartDataPoint {
    day: string;
    revenue: number;
    orders: number;
}

interface DashboardChartsWrapperProps {
    chartData: ChartDataPoint[];
}

export default function DashboardChartsWrapper({ chartData }: DashboardChartsWrapperProps) {
    return <DashboardCharts chartData={chartData} />;
}
