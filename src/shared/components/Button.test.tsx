/**
 * Tests para Button component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button Component', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  it('handles click events', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);

    const button = screen.getByRole('button', { name: /click/i });
    await userEvent.click(button);

    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('disables when isLoading is true', () => {
    render(<Button isLoading={true}>Load</Button>);
    const button = screen.getByRole('button');

    expect(button).toBeDisabled();
  });

  it('applies correct variant styles', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    let button = screen.getByRole('button');
    expect(button).toHaveClass('bg-brand-600');

    rerender(<Button variant="danger">Danger</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('bg-red-600');
  });

  it('applies full width style when fullWidth is true', () => {
    render(<Button fullWidth>Full</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('w-full');
  });
});
