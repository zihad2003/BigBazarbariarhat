import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { z } from 'zod';
import { db } from '@/lib/db';

const productSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(10),
  basePrice: z.number().positive(),
  salePrice: z.number().positive().optional(),
  category: z.string().min(1),
  stock: z.number().int().nonnegative(),
  status: z.enum(['active', 'inactive', 'draft']).default('active'),
  images: z.array(z.string().url()).optional(),
  sku: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const result = await db.products.findMany({
      category: searchParams.get('category') ?? undefined,
      minPrice: Number(searchParams.get('minPrice')) || undefined,
      maxPrice: Number(searchParams.get('maxPrice')) || undefined,
      search: searchParams.get('search') ?? undefined,
      sort: (searchParams.get('sort') as any) ?? 'newest',
      page: Number(searchParams.get('page')) || 1,
      limit: Number(searchParams.get('limit')) || 12,
    });
    return NextResponse.json({ success: true, data: result });
  } catch {
    return NextResponse.json({ success: false, message: 'Failed to fetch products.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || (session.user as any)?.role !== 'admin') {
    return NextResponse.json({ success: false, message: 'Admin access required.' }, { status: 403 });
  }
  try {
    const body = await req.json();
    const validated = productSchema.parse(body);
    const product = await db.products.create(validated);
    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: 'Failed to create product.' }, { status: 500 });
  }
}
