import '@testing-library/jest-dom/vitest';

// Mock Next.js router
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: vi.fn(),
        replace: vi.fn(),
        back: vi.fn(),
        forward: vi.fn(),
        refresh: vi.fn(),
        prefetch: vi.fn(),
    }),
    usePathname: () => '/',
    useSearchParams: () => new URLSearchParams(),
    useParams: () => ({}),
}));

// Mock Next.js Image
vi.mock('next/image', () => ({
    default: ({ src, alt, ...props }: any) => {
        // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
        return <img src={ src } alt = { alt } {...props
} />;
    },
}));

// Mock Next.js Link
vi.mock('next/link', () => ({
    default: ({ children, href, ...props }: any) => {
        return <a href={ href } {...props
} > { children } </a>;
    },
}));

// Global test utilities
beforeAll(() => {
    // Suppress console.error in tests unless explicitly needed
    vi.spyOn(console, 'error').mockImplementation(() => { });
});

afterAll(() => {
    vi.restoreAllMocks();
});
