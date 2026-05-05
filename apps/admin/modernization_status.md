# Big Bazar Admin Dashboard Modernization

## Objective
Modernize the admin dashboard with a minimalist, proportional design (13px base), replace technical jargon with business language, and optimize the architecture for production readiness.

## Progress Tracking

### Core Interface
- [x] Sidebar Navigation (Removed Brands, Simplified Icons)
- [x] Top Navigation / Global Layout
- [x] Main Dashboard (Analytics & KPIs)
- [x] **Sign Out functionality** (NextAuth integration)

### Management Sections
- [x] Products List (Clean table, category filters)
- [x] Add/Edit Product (Two-column layout)
- [x] Categories List
- [x] Add/Edit Category
- [x] Order List
- [x] Order Details (Receipt-style)
- [x] Customer List
- [x] Customer Details (Two-column overview)
- [x] Inventory Management (High-density table)
- [x] Coupons List (**React Query + Mock API**)
- [x] Banners List

### Security & Architecture
- [x] **Route Protection**: Implemented Next.js Middleware.
- [x] **Authentication**: Integrated NextAuth correctly with Login/Logout flows.
- [x] **Data Fetching**: Integrated TanStack Query (React Query) for state management.
- [x] **Global Feedback**: Added Toaster for success/error notifications.
- [x] **API Layer**: Created initial API routes with a `MockDB` service.

## Production Gap Analysis (Remaining Tasks)
1.  **Database Migration**: Replace `lib/mock-db.ts` with Prisma/PostgreSQL.
2.  **Real API Routes**: Implement API routes for Products, Orders, and Customers.
3.  **File Management**: Fully integrate Cloudinary for real image uploads.
4.  **Error Boundaries**: Add global error boundaries to prevent app crashes on API failure.
5.  **Performance**: Add skeleton loaders for all table views.
6.  **Environment Setup**: Configure production environment variables.

## Terminology Mapping
| Legacy Term | New Term |
| :--- | :--- |
| Logistics Ledger | Orders |
| Entity Distribution | Categories |
| Manifest | Order / Banner / Item |
| Operational Directives | Manage |
| Remittance Nodes | Payments |
| Intelligence Hub | Reports |
| Manifest Quantum | Stock Level |
