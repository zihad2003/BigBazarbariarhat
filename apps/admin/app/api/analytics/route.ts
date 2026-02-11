import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsService } from '@bigbazar/database';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const range = searchParams.get('range') || '7d';

        // In a real app, we'd wrap this in React Cache or unstable_cache for server-side performance
        const data = await AnalyticsService.getOperationMatrix(range);

        return NextResponse.json({
            success: true,
            data
        });
    } catch (error) {
        console.error('Admin Analytics API Error:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to extract intelligence manifest'
        }, { status: 500 });
    }
}
