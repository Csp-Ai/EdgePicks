import { ComponentType } from 'react';
import ErrorBoundary, { FallbackRender } from './ErrorBoundary';

export default function withBoundary<P>(
  WrappedComponent: ComponentType<P>,
  fallback?: React.ReactNode | FallbackRender
) {
  const ComponentWithBoundary = (props: P) => (
    <ErrorBoundary fallback={fallback}>
      <WrappedComponent {...props} />
    </ErrorBoundary>
  );

  const name = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  ComponentWithBoundary.displayName = `withBoundary(${name})`;

  return ComponentWithBoundary;
}

