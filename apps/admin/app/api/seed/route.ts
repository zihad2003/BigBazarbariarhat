import { NextResponse } from 'next/server';
import { prisma } from '@bigbazar/db';

const categoriesToSeed = [
  {
    name: 'Men',
    slug: 'men',
    image: 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?q=80&w=800&auto=format&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1519234129322-2636a0d0d885?q=80&w=800&auto=format&fit=crop',
    subcategories: ['T-Shirts', 'Pants', 'Outerwear']
  },
  {
    name: 'Kids(Girls)',
    slug: 'kids-girls',
    image: 'https://images.unsplash.com/photo-1514316454349-f50db90e2270?q=80&w=800&auto=format&fit=crop',
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
    return NextResponse.json({ success: true, message: 'Categories seeded and updated successfully with default promo images' });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) });
  }
}
