import { describe, test, expect, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import CommandPalette from '../CommandPalette';

// Mock next/navigation router hook
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  usePathname: () => '/generator',
}));

describe('CommandPalette Component', () => {
  test('does not render dialog content initially', () => {
    render(<CommandPalette />);
    const input = screen.queryByPlaceholderText(/Search actions or type/i);
    expect(input).toBeNull();
  });

  test('toggles visibility on Ctrl+K keyboard trigger', async () => {
    render(<CommandPalette />);
    
    // Dispatch Cmd+K event inside act
    act(() => {
      const event = new KeyboardEvent('keydown', {
        key: 'k',
        ctrlKey: true,
        metaKey: false,
        bubbles: true,
      });
      window.dispatchEvent(event);
    });

    // Now input box should be visible asynchronously
    const input = await screen.findByPlaceholderText(/Search actions or type/i);
    expect(input).toBeDefined();
  });
});
