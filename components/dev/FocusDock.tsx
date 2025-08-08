import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';

interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

interface TimerState {
  running: boolean;
  endsAt: number | null;
  mode: 'work' | 'break' | null;
}

interface StashEntry {
  ts: number;
  note: string;
  route: string;
  branch: string;
}

interface FocusState {
  focusTitle: string;
  checklist: ChecklistItem[];
  timer: TimerState;
  stash: StashEntry[];
  context: { route: string; query: Record<string, any>; branch: string };
  dockPos: { x: number; y: number };
  open: boolean;
}

const STORAGE_KEY = 'edgepicks.dev.focusDock.v1';
const DEFAULT_CHECKLIST: ChecklistItem[] = Array.from({ length: 5 }, (_, i) => ({
  id: String(i + 1),
  text: '',
  done: false,
}));

const branch = process.env.NEXT_PUBLIC_GIT_BRANCH || 'unknown';

const initialState: FocusState = {
  focusTitle: '',
  checklist: DEFAULT_CHECKLIST,
  timer: { running: false, endsAt: null, mode: null },
  stash: [],
  context: { route: '', query: {}, branch },
  dockPos: { x: 20, y: 20 },
  open: false,
};

const formatTime = (ms: number) => {
  const total = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(total / 60)
    .toString()
    .padStart(2, '0');
  const s = (total % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

export const FocusDock: React.FC = () => {
  const router = useRouter();
  const [state, setState] = useState<FocusState>(initialState);
  const [tick, setTick] = useState(0);
  const interruptRef = useRef<HTMLTextAreaElement | null>(null);
  const origTitle = useRef('');

  // load
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setState((s) => ({ ...s, ...parsed }));
      } catch {
        /* ignore */
      }
    }
  }, []);

  // save & mirror
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      if (navigator.sendBeacon) {
        try {
          navigator.sendBeacon('/api/dev/focus-dock', JSON.stringify(state));
        } catch {
          /* ignore */
        }
      }
    } catch {
      /* ignore */
    }
  }, [state]);

  // tick every second
  useEffect(() => {
    const t = setInterval(() => setTick(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  // timer expiry
  useEffect(() => {
    if (state.timer.running && state.timer.endsAt && Date.now() >= state.timer.endsAt) {
      setState((s) => ({ ...s, timer: { running: false, endsAt: null, mode: null } }));
    }
  }, [tick, state.timer]);

  // document title
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (!origTitle.current) origTitle.current = document.title;
    if (state.timer.running) {
      document.title = `⏱ ${origTitle.current}`;
    } else {
      document.title = origTitle.current;
    }
  }, [state.timer.running]);

  // update context
  useEffect(() => {
    setState((s) => ({ ...s, context: { route: router.pathname, query: router.query, branch } }));
  }, [router.pathname, router.query]);

  // hotkeys
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const tag = target?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;
      const key = e.key.toLowerCase();
      if ((e.metaKey || e.ctrlKey) && !e.shiftKey && key === 'j') {
        e.preventDefault();
        setState((s) => ({ ...s, open: true }));
        setTimeout(() => interruptRef.current?.focus(), 0);
      }
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && key === 'k') {
        e.preventDefault();
        setState((s) => ({ ...s, open: !s.open }));
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [state.open]);

  // drag handling
  const dragRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = dragRef.current;
    if (!el) return;
    let startX = 0;
    let startY = 0;
    let startPos = { x: 0, y: 0 };
    const onMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      setState((s) => ({ ...s, dockPos: { x: startPos.x - dx, y: startPos.y - dy } }));
    };
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    const onMouseDown = (e: MouseEvent) => {
      startX = e.clientX;
      startY = e.clientY;
      startPos = state.dockPos;
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };
    el.addEventListener('mousedown', onMouseDown);
    return () => {
      el.removeEventListener('mousedown', onMouseDown);
    };
  }, [state.dockPos]);

  const startTimer = (mins: number, mode: 'work' | 'break') => {
    setState((s) => ({ ...s, timer: { running: true, endsAt: Date.now() + mins * 60000, mode } }));
  };

  const stopTimer = () => {
    setState((s) => ({ ...s, timer: { running: false, endsAt: null, mode: null } }));
  };

  const remaining = state.timer.running && state.timer.endsAt ? state.timer.endsAt - Date.now() : 0;
  const hasWip = state.timer.running || state.checklist.some((c) => c.text.trim() !== '');

  const resetFocus = () => {
    if (hasWip) return;
    setState((s) => ({ ...s, focusTitle: '', checklist: DEFAULT_CHECKLIST, timer: { running: false, endsAt: null, mode: null } }));
  };

  const updateChecklist = (index: number, patch: Partial<ChecklistItem>) => {
    setState((s) => {
      const list = [...s.checklist];
      list[index] = { ...list[index], ...patch };
      return { ...s, checklist: list };
    });
  };

  const moveItem = (index: number, dir: number) => {
    setState((s) => {
      const list = [...s.checklist];
      const newIndex = index + dir;
      if (newIndex < 0 || newIndex >= list.length) return s;
      const [item] = list.splice(index, 1);
      list.splice(newIndex, 0, item);
      return { ...s, checklist: list };
    });
  };

  const stashInterrupt = (note: string) => {
    if (!note.trim()) return;
    const entry: StashEntry = {
      ts: Date.now(),
      note,
      route: state.context.route,
      branch: state.context.branch,
    };
    setState((s) => ({ ...s, stash: [...s.stash, entry] }));
  };

  const [interruptNote, setInterruptNote] = useState('');

  return (
    <div
      className={`fixed bg-white shadow-lg rounded p-2 text-sm ${state.open ? 'w-64 h-96' : 'w-16 h-8'} overflow-hidden`}
      style={{ bottom: state.dockPos.y, right: state.dockPos.x, zIndex: 1000 }}
    >
      <div ref={dragRef} className="cursor-move text-center" onClick={() => setState((s) => ({ ...s, open: !s.open }))}>
        {state.open ? 'Focus Dock' : 'FD'}
      </div>
      {state.open && (
        <div className="mt-2 space-y-2">
          <div>
            <div className="flex items-center justify-between">
              <label className="font-semibold">Current Focus</label>
              <button
                className="text-xs text-blue-500 disabled:text-gray-400"
                title={hasWip ? 'Finish or park this first.' : ''}
                disabled={hasWip}
                onClick={resetFocus}
              >
                Start New Focus
              </button>
            </div>
            <input
              className="w-full border p-1 mt-1"
              value={state.focusTitle}
              onChange={(e) => setState((s) => ({ ...s, focusTitle: e.target.value }))}
            />
            <ul className="mt-1 space-y-1">
              {state.checklist.map((item, idx) => (
                <li key={item.id} className="flex items-center space-x-1">
                  <input
                    type="checkbox"
                    checked={item.done}
                    onChange={(e) => updateChecklist(idx, { done: e.target.checked })}
                  />
                  <input
                    className="flex-1 border p-0.5"
                    value={item.text}
                    onChange={(e) => updateChecklist(idx, { text: e.target.value })}
                  />
                  <div className="flex flex-col">
                    <button className="text-xs" onClick={() => moveItem(idx, -1)}>▲</button>
                    <button className="text-xs" onClick={() => moveItem(idx, 1)}>▼</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="font-semibold">Timer</div>
            <div className="flex items-center space-x-1 mt-1">
              <button className="text-xs border px-1" onClick={() => startTimer(25, 'work')}>
                25
              </button>
              <button className="text-xs border px-1" onClick={() => startTimer(50, 'work')}>
                50
              </button>
              <button className="text-xs border px-1" onClick={() => startTimer(5, 'break')}>
                Break
              </button>
              {state.timer.running ? (
                <button className="text-xs border px-1" onClick={stopTimer}>
                  Stop
                </button>
              ) : null}
              <span className="ml-auto font-mono">{formatTime(remaining)}</span>
            </div>
          </div>
          <div>
            <div className="font-semibold">Interrupt Capture</div>
            <textarea
              ref={interruptRef}
              className="w-full border mt-1 p-1"
              value={interruptNote}
              onChange={(e) => setInterruptNote(e.target.value)}
            />
            <button
              className="text-xs border px-2 mt-1"
              onClick={() => {
                stashInterrupt(interruptNote);
                setInterruptNote('');
              }}
            >
              Stash
            </button>
            <ul className="mt-1 max-h-16 overflow-auto">
              {state.stash.map((s) => (
                <li key={s.ts} className="text-xs">
                  {new Date(s.ts).toLocaleTimeString()} - {s.note}
                </li>
              ))}
            </ul>
          </div>
          <div className="text-xs text-gray-600">
            <div>Route: {state.context.route}</div>
            <div>Query: {JSON.stringify(state.context.query)}</div>
            <div>Branch: {state.context.branch}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FocusDock;
