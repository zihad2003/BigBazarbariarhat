import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsService } from '@bigbazar/database';

export async function GET(request: NextRequest) {
    try {
        const data = await AnalyticsService.getDashboardStats();

        return NextResponse.json({
            success: true,
            data
        });
    } catch (error) {
        console.error('Admin Stats API Error:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to fetch dashboard stats'
        }, { status: 500 });
    }
}
