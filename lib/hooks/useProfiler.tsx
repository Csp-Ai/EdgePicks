import { Profiler, ProfilerOnRenderCallback, ReactNode } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - module may not have type declarations
import log from '../telemetry/logger';

export default function useProfiler(id: string, enabled = false) {
  const onRender: ProfilerOnRenderCallback = (
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime,
  ) => {
    log({ id, phase, actualDuration, baseDuration, startTime, commitTime });
  };

  const Wrapper = ({ children }: { children: ReactNode }) =>
    enabled ? (
      <Profiler id={id} onRender={onRender}>
        {children}
      </Profiler>
    ) : (
      <>{children}</>
    );

  return Wrapper;
}
