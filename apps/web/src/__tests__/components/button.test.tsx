import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/button';

/**
 * Component tests for the Button UI component.
 * Tests rendering, variants, click handling, disabled state, and asChild.
 */
describe('Button Component', () => {
    it('should render with default props', () => {
        render(<Button>Click me</Button>);
        const button = screen.getByRole('button', { name: /click me/i });
        expect(button).toBeInTheDocument();
    });

    it('should handle click events', () => {
        const onClick = vi.fn();
        render(<Button onClick={onClick}>Click</Button>);

        fireEvent.click(screen.getByRole('button'));
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should be disabled when disabled prop is true', () => {
        const onClick = vi.fn();
        render(<Button disabled onClick={onClick}>Disabled</Button>);

        const button = screen.getByRole('button');
        expect(button).toBeDisabled();

        fireEvent.click(button);
        expect(onClick).not.toHaveBeenCalled();
    });

    it('should render different variants', () => {
        const { rerender } = render(<Button variant="outline">Outline</Button>);
        expect(screen.getByRole('button')).toBeInTheDocument();

        rerender(<Button variant="destructive">Destructive</Button>);
        expect(screen.getByRole('button')).toBeInTheDocument();

        rerender(<Button variant="ghost">Ghost</Button>);
        expect(screen.getByRole('button')).toBeInTheDocument();

        rerender(<Button variant="secondary">Secondary</Button>);
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render different sizes', () => {
        const { rerender } = render(<Button size="sm">Small</Button>);
        expect(screen.getByRole('button')).toBeInTheDocument();

        rerender(<Button size="lg">Large</Button>);
        expect(screen.getByRole('button')).toBeInTheDocument();

        rerender(<Button size="icon">I</Button>);
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render as child element with asChild', () => {
        render(
            <Button asChild>
                <a href="/test">Link Button</a>
            </Button>,
        );
        const link = screen.getByRole('link', { name: /link button/i });
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', '/test');
    });

    it('should apply custom className', () => {
        render(<Button className="custom-class">Styled</Button>);
        const button = screen.getByRole('button');
        expect(button.className).toContain('custom-class');
    });
});
