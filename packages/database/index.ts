import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';

const PLACEHOLDER_URL = "mysql://placeholder_user:placeholder_pass@localhost:3306/placeholder_db";

const isBuildPhase =
  process.env.NEXT_PHASE === 'phase-production-build' ||
  process.env.BUILDING === 'true' ||
  process.env.NODE_ENV === 'test';

// During build, always force the placeholder so PrismaClient is never instantiated
// at static-page-generation time (even if .env.local provides a real DATABASE_URL).
if (isBuildPhase) {
  process.env.DATABASE_URL = PLACEHOLDER_URL;
}


// Use a lazy getter so PrismaClient is only instantiated on first request,
// never at module-evaluation time during the build phase.
const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createClient> | undefined;
};

function createClient() {
  const url = process.env.DATABASE_URL;
  if (!url || url === PLACEHOLDER_URL) {
    throw new Error(
      "DATABASE_URL is not configured — set it in Cloudflare Pages → Settings → Environment variables."
    );
  }

  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  }).$extends(withAccelerate());
}

// Lazy proxy: createClient() is called only when the client is first used (at request time),
// not when this module is imported (which happens during build).
let _prisma: ReturnType<typeof createClient> | undefined;

function getPrisma() {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;
  if (!_prisma) {
    _prisma = createClient();
    if (process.env.NODE_ENV !== 'production') {
      globalForPrisma.prisma = _prisma;
    }
  }
  return _prisma;
}

export const prisma = new Proxy({} as ReturnType<typeof createClient>, {
  get(_target, prop) {
    return (getPrisma() as any)[prop];
  },
});

// Alias for backwards compatibility
export const db = prisma;

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
