# Testing Guide for UI Enhancements

## 1. Header & Mobile Menu
- [ ] **Desktop**: Verify that the Header navigation works and dropdowns appear on hover.
- [ ] **Mobile**: Resize browser to mobile width.
- [ ] Click the "Menu" icon (hamburger) on the right.
- [ ] **Mobile Menu**: Ensure the side drawer opens smoothly.
- [ ] Test the accordions (Men, Women, etc.) to see subcategories.
- [ ] Verify links in the mobile menu work.
- [ ] Check "My Account", "Wishlist", "Cart" links in the bottom of the drawer.

## 2. Search Functionality
- [ ] Click the "Search" icon in the Header (Desktop & Mobile).
- [ ] Verify the `SearchModal` opens fullscreen.
- [ ] Type a query and check if results appear.
- [ ] Press `Esc` or click `X` to close.

## 3. Cart Drawer
- [ ] Click the "Shopping Bag" icon in the Header.
- [ ] Verify the `CartDrawer` slides in from the right.
- [ ] Ensure it shows cart items or empty state.

## 4. My Orders Page
- [ ] Navigate to `/account/orders` (or click "My Account" -> "Orders").
- [ ] **UI Check**: Verify the page uses the "Luxury" theme (Gold/Black, Playfair fonts).
- [ ] **Order Cards**: Check if order cards display:
    - Order Number
    - Date
    - Status (with colored badge)
    - Total Amount
    - **Product Images**: Horizontal scroll of product thumbnails.
- [ ] **Responsiveness**: Check how cards look on mobile.

## 5. Deployment
- [ ] Run `npm run build` to ensure no TypeScript errors.
- [ ] Run `npm run dev` to verify locally.
