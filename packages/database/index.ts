import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

if (!process.env.DATABASE_URL) {
  console.warn("⚠️ DATABASE_URL is not set. Using placeholder for build/dev.");
  process.env.DATABASE_URL = "mysql://placeholder_user:placeholder_pass@localhost:3306/placeholder_db";
}

const globalForPrisma = globalThis as unknown as { prisma: ReturnType<typeof createClient> | undefined };

function createClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  }).$extends(withAccelerate());
}

export const prisma = globalForPrisma.prisma ?? createClient();

// Alias for backwards compatibility
export const db = prisma;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export interface ProductImage {
  url: string;
  isFeatured?: boolean;
  displayOrder?: number;
}

export function parseProductImages(imagesJson: any): ProductImage[] {
  if (!imagesJson) return [];
  try {
    const parsed = typeof imagesJson === 'string' ? JSON.parse(imagesJson) : imagesJson;
    if (Array.isArray(parsed)) {
      const result: ProductImage[] = [];
      for (const img of parsed) {
        if (typeof img === 'string') {
          result.push({ url: img, isFeatured: false, displayOrder: 0 });
        } else if (img && typeof img === 'object' && typeof img.url === 'string') {
          result.push({
            url: img.url,
            isFeatured: !!img.isFeatured,
            displayOrder: typeof img.displayOrder === 'number' ? img.displayOrder : 0,
          });
        }
      }
      return result;
    }
  } catch (error) {
    console.error('Error parsing product images JSON:', error);
  }
  return [];
}

export * from '@prisma/client';
