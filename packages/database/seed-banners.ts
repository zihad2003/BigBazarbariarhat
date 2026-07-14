import { prisma } from './index';

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

async function main() {
  console.log('Seeding default banners...');
  for (const b of defaultBanners) {
    const existing = await prisma.banner.findFirst({
      where: {
        title: b.title,
        position: b.position,
      }
    });
    if (!existing) {
      const created = await prisma.banner.create({
        data: b
      });
      console.log(`Created banner: ${created.title} at ${created.position}`);
    } else {
      console.log(`Banner already exists: ${existing.title} at ${existing.position}`);
    }
  }
  console.log('Banner seeding complete!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
