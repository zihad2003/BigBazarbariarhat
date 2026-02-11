import { NextRequest, NextResponse } from 'next/server';
import { MarketingService as DbMarketingService } from '@bigbazar/database';

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        await DbMarketingService.deleteCoupon(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete Coupon Error:', error);
        return NextResponse.json({ success: false, error: 'Termination failed' }, { status: 500 });
    }
}
