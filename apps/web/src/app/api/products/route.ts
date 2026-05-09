import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@bigbazar/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categorySlug = searchParams.get('category');
    const minPrice = Number(searchParams.get('minPrice')) || undefined;
    const maxPrice = Number(searchParams.get('maxPrice')) || undefined;
    const query = searchParams.get('q') || searchParams.get('search') || '';
    const sort = searchParams.get('sort') || searchParams.get('sortBy') || 'newest';
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 12;
    const skip = (page - 1) * limit;

    // Build Prisma filters
    const where: any = {
      isActive: true,
      OR: [
        { name: { contains: query } },
        { description: { contains: query } },
      ],
    };

    if (categorySlug) {
      where.category = { slug: categorySlug };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {
        gte: minPrice,
        lte: maxPrice,
      };
    }

    // Handle sorting
    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price_asc') orderBy = { price: 'asc' };
    if (sort === 'price_desc') orderBy = { price: 'desc' };
    if (sort === 'popular') orderBy = { orderItems: { _count: 'desc' } };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    const mappedProducts = products.map((p: any) => ({
      ...p,
      basePrice: Number(p.price),
      salePrice: p.salePrice ? Number(p.salePrice) : null,
    }));

    return NextResponse.json({
      success: true,
      data: mappedProducts,
      pagination: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
      }
    });
  } catch (error) {
    console.error('Products API Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch products.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { auth } = await import('@/auth');
    const session = await auth();
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ success: false, message: 'Admin access required.' }, { status: 403 });
    }

    const body = await req.json();
    const {
      name,
      slug,
      fullDescription,
      shortDescription,
      regularPrice,
      salePrice,
      sku,
      stock,
      images,
      instagramReelUrl,
      category: categoryName,
      isActive,
      featured,
      isSale,
      isHot,
      isNew,
      variants,
    } = body;

    // Resolve categoryId
    let category = await prisma.category.findFirst({
      where: {
        OR: [
          { name: { equals: categoryName } },
          { id: { equals: categoryName } },
          { name: { contains: categoryName } }
        ]
      }
    });

    if (!category) {
      category = await prisma.category.findFirst();
      if (!category) {
        return NextResponse.json({ success: false, message: 'No categories exist. Please create one first.' }, { status: 400 });
      }
    }

    const finalSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const newProduct = await prisma.product.create({
      data: {
        name,
        slug: finalSlug,
        description: fullDescription || shortDescription || '',
        price: Number(regularPrice) || 0,
        salePrice: salePrice ? Number(salePrice) : null,
        sku: sku || `SKU-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        stock: Number(stock) || 0,
        images: images || [],
        instagramReelUrl: instagramReelUrl || null,
        categoryId: category.id,
        isActive: isActive !== false,
        featured: featured || false,
        isSale: isSale || false,
        isHot: isHot || false,
        isNew: isNew || false,
        variants: variants || [],
      }
    });

    return NextResponse.json({ success: true, data: newProduct });
  } catch (error: any) {
    console.error('Product POST Error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to create product.' }, { status: 500 });
  }
}
