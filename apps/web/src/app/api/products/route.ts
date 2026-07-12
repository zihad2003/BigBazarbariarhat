import { NextRequest, NextResponse } from 'next/server';
import { prisma, type Prisma } from '@bigbazar/db';
import { productVariantsJsonSchema } from '@bigbazar/validation';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categorySlug = searchParams.get('category');
    const subcategorySlug = searchParams.get('subcategory');
    const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
    const query = searchParams.get('q') || searchParams.get('search') || '';
    const sort = searchParams.get('sort') || searchParams.get('sortBy') || 'newest';
    const page = Math.max(1, Number(searchParams.get('page')) || 1);
    const limit = Math.min(50, Math.max(1, Number(searchParams.get('limit')) || 12));
    const skip = (page - 1) * limit;

    // Build Prisma filters with proper types — use AND to combine independent filters
    const where: Prisma.ProductWhereInput = {
      isActive: true,
    };

    const conditions: Prisma.ProductWhereInput[] = [];

    if (query) {
      conditions.push({
        OR: [
          { name: { contains: query } },
          { description: { contains: query } },
          { sku: { contains: query } },
        ]
      });
    }

    if (subcategorySlug) {
      // Subcategory takes precedence — filter by exact subcategory slug
      conditions.push({
        category: { slug: subcategorySlug }
      });
    } else if (categorySlug) {
      // Parent category — include both direct matches and children
      conditions.push({
        OR: [
          { category: { slug: categorySlug } },
          { category: { parent: { slug: categorySlug } } },
        ]
      });
    }

    if (conditions.length > 0) {
      where.AND = conditions;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {
        ...(minPrice !== undefined && { gte: minPrice }),
        ...(maxPrice !== undefined && { lte: maxPrice }),
      };
    }

    // Handle sorting with proper types
    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };
    if (sort === 'price_asc') orderBy = { price: 'asc' };
    else if (sort === 'price_desc') orderBy = { price: 'desc' };
    else if (sort === 'popular') orderBy = { orderItems: { _count: 'desc' } };

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

    const mappedProducts = products.map((p) => ({
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
      },
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
    const userRole = (session?.user as any)?.role;
    if (!session || !['ADMIN', 'SUPER_ADMIN'].includes(userRole)) {
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

    // Basic validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ success: false, message: 'Product name is required.' }, { status: 400 });
    }
    if (!regularPrice || isNaN(Number(regularPrice))) {
      return NextResponse.json({ success: false, message: 'Valid price is required.' }, { status: 400 });
    }

    if (variants !== undefined && variants !== null) {
      const parsedVariants = productVariantsJsonSchema.safeParse(variants);
      if (!parsedVariants.success) {
        return NextResponse.json({ success: false, message: 'Invalid product variants format.' }, { status: 400 });
      }
    }

    // Resolve categoryId
    let category = await prisma.category.findFirst({
      where: {
        OR: [
          { name: { equals: categoryName } },
          { id: { equals: categoryName } },
          { name: { contains: categoryName } },
        ],
      },
    });

    if (!category) {
      category = await prisma.category.findFirst();
      if (!category) {
        return NextResponse.json({ success: false, message: 'No categories exist. Please create one first.' }, { status: 400 });
      }
    }

    const finalSlug =
      slug ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const newProduct = await prisma.product.create({
      data: {
        name: name.trim(),
        slug: finalSlug,
        description: fullDescription || shortDescription || '',
        price: Number(regularPrice),
        salePrice: salePrice ? Number(salePrice) : null,
        sku: sku || `SKU-${globalThis.crypto.randomUUID().slice(0, 8).toUpperCase()}`,
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
      },
    });

    return NextResponse.json({ success: true, data: newProduct });
  } catch (error: any) {
    console.error('Product POST Error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to create product.' }, { status: 500 });
  }
}
