'use client';

import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, BarChart, Bar,
} from 'recharts';

interface ChartDataPoint {
    day: string;
    revenue: number;
    orders: number;
}

interface DashboardChartsProps {
    chartData: ChartDataPoint[];
}

export default function DashboardCharts({ chartData }: DashboardChartsProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {/* Revenue Chart */}
            <div className="lg:col-span-3 bg-card border border-border rounded-xl p-5">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-sm font-semibold text-foreground">Sales Performance</h2>
                    <span className="text-[11px] text-muted-foreground">Last 7 days</span>
                </div>
                <div className="h-[260px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="hsl(234 89% 60%)" stopOpacity={0.15} />
                                    <stop offset="100%" stopColor="hsl(234 89% 60%)" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(220 13% 91%)" />
                            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(220 9% 46%)' }} dy={8} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(220 9% 46%)' }} width={45} />
                            <Tooltip
                                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid hsl(220 13% 91%)', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
                                cursor={{ stroke: 'hsl(234 89% 60%)', strokeWidth: 1, strokeDasharray: '4 4' }}
                            />
                            <Area type="monotone" dataKey="revenue" stroke="hsl(234 89% 60%)" strokeWidth={2} fill="url(#grad)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Orders Chart */}
            <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-sm font-semibold text-foreground">Order Volume</h2>
                    <span className="text-[11px] text-muted-foreground">Last 7 days</span>
                </div>
                <div className="h-[260px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(220 13% 91%)" />
                            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(220 9% 46%)' }} dy={8} />
                            <Tooltip
                                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid hsl(220 13% 91%)', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
                                cursor={{ fill: 'hsl(220 14% 96%)' }}
                            />
                            <Bar dataKey="orders" fill="hsl(234 89% 60%)" radius={[4, 4, 0, 0]} barSize={24} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
