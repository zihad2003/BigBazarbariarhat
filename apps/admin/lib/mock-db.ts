/**
 * Mock Database Service
 * In production, this would be replaced by Prisma/Drizzle.
 */

// Simulated storage
const storage = {
  coupons: [
    { id: '1', code: 'SUMMER50', description: '50% off summer items', discountType: 'PERCENTAGE', discountValue: 50, isActive: true, currentUsage: 45, usageLimit: 100, startDate: '2024-05-01', endDate: '2024-09-01' },
    { id: '2', code: 'WELCOME', description: 'New customer discount', discountType: 'FIXED_AMOUNT', discountValue: 500, isActive: true, currentUsage: 120, usageLimit: null, startDate: '2024-01-01', endDate: '2025-01-01' },
  ],
  banners: [
    { id: '1', title: 'Summer Collection', subtitle: 'New arrivals are here', imageDesktop: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b', position: 'HOME_HERO', isActive: true, displayOrder: 0 },
  ],
  products: [],
  categories: [],
  orders: [],
};

export const MockDB = {
  async getCoupons() {
    return storage.coupons;
  },
  async getCoupon(id: string) {
    return storage.coupons.find(c => c.id === id);
  },
  async createCoupon(data: any) {
    const newCoupon = { ...data, id: Math.random().toString(36).substr(2, 9), currentUsage: 0 };
    storage.coupons.push(newCoupon);
    return newCoupon;
  },
  async updateCoupon(id: string, data: any) {
    const index = storage.coupons.findIndex(c => c.id === id);
    if (index !== -1) {
      storage.coupons[index] = { ...storage.coupons[index], ...data };
      return storage.coupons[index];
    }
    return null;
  },
  async deleteCoupon(id: string) {
    storage.coupons = storage.coupons.filter(c => c.id !== id);
    return true;
  }
};
