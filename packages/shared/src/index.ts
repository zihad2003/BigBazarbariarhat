// Product types
export type {
    Category,
    ProductImage,
    ProductVariant,
    Brand,
    Product,
    ProductFilter,
} from './types/product.types';

// Order types
export type {
    OrderStatus,
    PaymentStatus,
    PaymentMethod,
    Order,
    OrderItem,
    OrderFilters,
    CreateOrderInput,
    UpdateOrderStatusInput,
} from './types/order.types';

// User types
export type {
    UserRole,
    User,
    Customer,
    Address,
    UserFilters,
} from './types/user.types';

// Marketing types
export type {
    DiscountType,
    Coupon,
    CreateCouponInput,
} from './types/marketing.types';

// API types
export * from './types/api.types';

// Services
export * from './api/products.service';
export * from './api/orders.service';
export * from './api/customers.service';
export * from './api/categories.service';
export * from './api/marketing.service';
export * from './api/payments.service';

// Hooks
export { useAuth } from './hooks/use-auth';
export { useProducts } from './hooks/use-products';

// Store
export { useCartStore } from './store/cart.store';
export type { CartItem } from './store/cart.store';
export { useLanguageStore, useTranslation, translations } from './store/language.store';
export type { Language } from './store/language.store';
