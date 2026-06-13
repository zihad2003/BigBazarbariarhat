import { NextResponse } from 'next/server';
import { prisma } from '@bigbazar/db';

const categoriesToSeed = [
  {
    name: 'Men',
    slug: 'men',
    image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800&auto=format&fit=crop',
    subcategories: ['T-Shirts', 'Denim', 'Knitwear', 'Outerwear']
  },
  {
    name: 'Women',
    slug: 'women',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop',
    subcategories: ['Dresses', 'Blouses', 'Trousers', 'Skirts']
  },
  {
    name: 'Kids(Boys)',
    slug: 'kids-boys',
    image: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?q=80&w=800&auto=format&fit=crop',
    subcategories: ['T-Shirts', 'Pants', 'Outerwear']
  },
  {
    name: 'Kids(Girls)',
    slug: 'kids-girls',
    image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=800&auto=format&fit=crop',
    subcategories: ['Dresses', 'Tops', 'Skirts']
  },
  {
    name: 'Wedding Touch',
    slug: 'wedding-touch',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&auto=format&fit=crop',
    subcategories: ['Panjabi', 'Sherwani', 'Saree']
  }
];

export async function GET() {
  try {
    for (const group of categoriesToSeed) {
      let parent = await prisma.category.findUnique({ where: { slug: group.slug } });
      
      if (!parent) {
        parent = await prisma.category.create({
          data: {
            name: group.name,
            slug: group.slug,
            image: group.image
          }
        });
      } else {
        // Update name and image if they already exist to ensure database visual consistency
        parent = await prisma.category.update({
          where: { id: parent.id },
          data: {
            name: group.name,
            image: group.image
          }
        });
      }

      for (const sub of group.subcategories) {
        const subSlug = `${group.slug}-${sub.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
        
        const existingSub = await prisma.category.findUnique({ where: { slug: subSlug } });
        
        if (!existingSub) {
          await prisma.category.create({
            data: {
              name: sub,
              slug: subSlug,
              parent: { connect: { id: parent.id } }
            }
          });
        } else {
          // Keep active status updated
          await prisma.category.update({
            where: { id: existingSub.id },
            data: {
              parent: { connect: { id: parent.id } }
            }
          });
        }
      }
    }

    // --- Seed default banners ---
    const defaultBanners = [
      {
        title: "New Season Collection",
        subtitle: "Women's Fashion 2026",
        imageDesktop: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1800&auto=format&fit=crop",
        linkUrl: "/products?category=Women",
        linkText: "Shop Now",
        position: "HOME_HERO",
        displayOrder: 0,
        isActive: true,
      },
      {
        title: "Premium Menswear",
        subtitle: "Crafted for the Modern Man",
        imageDesktop: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=1800&auto=format&fit=crop",
        linkUrl: "/products?category=Men",
        linkText: "Explore",
        position: "HOME_HERO",
        displayOrder: 1,
        isActive: true,
      },
      {
        title: "Flash Sale",
        subtitle: "Up to 50% Off — Limited Time",
        imageDesktop: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1800&auto=format&fit=crop",
        linkUrl: "/products?sale=true",
        linkText: "Shop Now",
        position: "HOME_HERO",
        displayOrder: 2,
        isActive: true,
      },
      {
        title: "Summer Edit",
        subtitle: "New Arrival",
        imageDesktop: "https://images.unsplash.com/photo-1604671801908-6f0c6a092c05?q=80&w=800&auto=format&fit=crop",
        linkUrl: "/products?category=Men",
        linkText: "Shop Now",
        position: "HOME_SECONDARY",
        displayOrder: 0,
        isActive: true,
      },
      {
        title: "Flash Sale",
        subtitle: "50% Off",
        imageDesktop: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?q=80&w=800&auto=format&fit=crop",
        linkUrl: "/products?sale=true",
        linkText: "Shop Now",
        position: "HOME_SECONDARY",
        displayOrder: 1,
        isActive: true,
      }
    ];

    for (const b of defaultBanners) {
      const existing = await prisma.banner.findFirst({
        where: {
          title: b.title,
          position: b.position,
        }
      });
      if (!existing) {
        await prisma.banner.create({
          data: b
        });
      }
    }

    return NextResponse.json({ success: true, message: 'Categories and default banners seeded and updated successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) });
  }
}
