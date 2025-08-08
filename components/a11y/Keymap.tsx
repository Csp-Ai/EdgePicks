import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface ShortcutEntry {
  keys: string;
  description: string;
}

export default function Keymap() {
  const [open, setOpen] = useState(false);
  const [shortcuts, setShortcuts] = useState<ShortcutEntry[]>([]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isQuestionMark = e.key === '?' || (e.key === '/' && e.shiftKey);
      if (isQuestionMark) {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (!open) return;
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('[aria-keyshortcuts]'));
    const entries = nodes
      .map((el) => {
        const keys = el.getAttribute('aria-keyshortcuts') || '';
        const description =
          el.getAttribute('aria-label') ||
          el.getAttribute('title') ||
          el.textContent?.trim() ||
          '';
        return { keys, description };
      })
      .filter((e) => e.keys);
    setShortcuts(entries);
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 bg-black/50 p-4 text-gray-900">
      <div className="mx-auto max-w-md rounded bg-white p-4 shadow-lg">
        <h2 className="mb-2 text-lg font-bold">Keyboard Shortcuts</h2>
        {shortcuts.length ? (
          <ul className="space-y-1">
            {shortcuts.map((s, idx) => (
              <li key={idx} className="flex items-center justify-between">
                <kbd className="rounded bg-gray-200 px-2 py-1 font-mono">{s.keys}</kbd>
                <span className="ml-2">{s.description}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No shortcuts available.</p>
        )}
      </div>
    </div>,
    document.body
  );
}

