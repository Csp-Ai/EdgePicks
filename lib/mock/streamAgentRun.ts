import { AgentEvent, AgentRun, PredictionFinal } from '../events/agentEvents';

interface Callbacks {
  onEvent: (e: AgentEvent) => void;
  onDone: (final: PredictionFinal) => void;
}

export function streamAgentRun(run: AgentRun, callbacks: Callbacks) {
  let index = 0;
  let speed = 1;
  let timer: NodeJS.Timeout | null = null;

  const emitNext = () => {
    if (index >= run.events.length) {
      callbacks.onDone(run.final);
      return;
    }
    const evt = run.events[index];
    callbacks.onEvent(evt);
    index++;
    const nextTs = run.events[index]?.ts ?? evt.ts;
    const delay = (nextTs - evt.ts) / speed;
    timer = setTimeout(emitNext, delay);
  };

  return {
    start(s: number = 1) {
      speed = s;
      if (!timer) emitNext();
    },
    pause() {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    },
    reset() {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      index = 0;
    },
    setSpeed(s: number) {
      speed = s;
    },
  };
}
