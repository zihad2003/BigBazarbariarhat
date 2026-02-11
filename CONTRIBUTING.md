# Contributing to Big Bazar Bariarhat

Thank you for your interest in contributing! This document outlines our development guidelines and best practices.

---

## 🏁 Getting Started

1. **Fork the repository** and clone it locally.
2. Install dependencies: `npm install`
3. Create a branch from `main`: `git checkout -b feature/your-feature`
4. Make your changes.
5. Run checks before committing (handled by Husky pre-commit hooks):
   - `npm run lint` — ESLint
   - `npm run format:check` — Prettier
   - `npm run type-check` — TypeScript
   - `npm run test` — Vitest
6. Commit your changes following our conventions.
7. Push and open a Pull Request.

---

## 📏 Code Style

### TypeScript
- **Strict mode** is enabled (`tsconfig.json: "strict": true`).
- Use `type` imports when importing types only: `import type { Product } from '@bigbazar/shared'`.
- Avoid `any` for new code. When necessary, add a `// eslint-disable-next-line` comment explaining why.
- All function parameters and return types should be typed.

### React Components
- Use **functional components** with hooks.
- Prefer **named exports** for components.
- Use the `'use client'` directive only where required (state, effects, event handlers).
- Keep components **small and focused** (< 200 lines ideally).

### File Naming
| Type         | Convention            | Example                   |
|--------------|-----------------------|---------------------------|
| Component    | PascalCase            | `ProductCard.tsx`         |
| Page         | lowercase             | `page.tsx`                |
| Hook         | camelCase with `use`  | `useProducts.ts`          |
| Store        | kebab-case            | `cart-store.ts`           |
| Type file    | kebab-case            | `product.types.ts`        |
| Test file    | `*.test.ts(x)`        | `cart-store.test.ts`      |
| Utility      | kebab-case            | `api-client.ts`           |

### CSS / Styling
- Use **Tailwind CSS** utility classes.
- Use `cn()` (from `@/lib/utils`) for conditional class merging.
- Avoid inline `style` props unless absolutely necessary.
- Component-specific styles should use Tailwind, not separate CSS files.

---

## 📂 Project Organization

### Where does my code go?

| Code Type           | Location                                |
|--------------------|-----------------------------------------|
| Page component     | `apps/web/src/app/<route>/page.tsx`      |
| API route          | `apps/web/src/app/api/<endpoint>/route.ts` |
| UI component       | `apps/web/src/components/ui/`            |
| Shop component     | `apps/web/src/components/shop/`          |
| Admin component    | `apps/web/src/components/admin/`         |
| Shared types       | `packages/shared/src/types/`             |
| Shared services    | `packages/shared/src/api/`               |
| State store        | `apps/web/src/lib/stores/`               |
| Utility function   | `apps/web/src/lib/`                      |
| Tests              | `apps/web/src/__tests__/`                |

### Adding Shared Types
1. Define the type in `packages/shared/src/types/`.
2. Export it from `packages/shared/src/index.ts` with an **explicit export** (not `export *`).
3. Import in consuming code: `import type { Product } from '@bigbazar/shared'`.

---

## 🧪 Testing Guidelines

### Running Tests
```bash
npm run test           # Run all tests once
npm run test:watch     # Watch mode
npm run test:coverage  # With coverage report
```

### Test Organization
```
src/__tests__/
├── components/    # Component tests (Testing Library)
├── stores/        # Store unit tests
├── api/           # API integration tests
└── setup.ts       # Global test setup
```

### Writing Tests
- **Unit tests**: Focus on individual functions, stores, and utilities.
- **Component tests**: Use Testing Library. Test behavior, not implementation details.
- **Integration tests**: Test API routes and data flows.
- Name test files: `<name>.test.ts` or `<name>.test.tsx`.
- Use `describe/it/expect` pattern.
- Mock external dependencies (Supabase, Clerk, Stripe).

### Example Component Test
```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/button';

it('should handle click events', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
});
```

---

## 🔀 Git Workflow

### Branch Naming
- `feature/` — New features (`feature/add-wishlist`)
- `fix/` — Bug fixes (`fix/cart-total-calculation`)
- `refactor/` — Code refactoring (`refactor/migrate-prisma-to-supabase`)
- `docs/` — Documentation (`docs/api-documentation`)
- `chore/` — Maintenance (`chore/update-dependencies`)

### Commit Messages
Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]
```

| Type       | Description                |
|------------|----------------------------|
| `feat`     | New feature                |
| `fix`      | Bug fix                    |
| `docs`     | Documentation              |
| `style`    | Formatting (no logic)      |
| `refactor` | Code refactoring           |
| `test`     | Adding tests               |
| `chore`    | Build/config changes       |
| `perf`     | Performance improvement    |

**Examples:**
```bash
feat(cart): add coupon code support
fix(checkout): handle Stripe webhook signature verification
docs(api): add product endpoint documentation
test(stores): add cart store unit tests
```

### Pre-commit Hooks
Husky runs lint-staged before each commit:
- **Formats** staged `.ts`, `.tsx`, `.json`, `.css`, `.md` files with Prettier.
- **Lints** staged `.ts`, `.tsx` files with ESLint (zero warnings allowed).

If the hooks fail, fix the issues before committing.

---

## 🚀 Pull Request Guidelines

1. **Title**: Use the same format as commit messages.
2. **Description**: Explain what changed and why.
3. **Testing**: Describe how to test the changes.
4. **Screenshots**: Include for UI changes.
5. **Breaking changes**: Clearly mention if any.
6. Keep PRs **focused and small** (< 400 lines changed ideally).

---

## 📞 Questions?

Open an issue or reach out to the maintainers.
