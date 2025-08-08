import { Component, ErrorInfo, ReactNode } from 'react';

export type FallbackRender = (error: Error, reset: () => void) => ReactNode;

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode | FallbackRender;
  onError?: (error: Error, info: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  error: Error | null;
}

export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.props.onError?.(error, info);
  }

  reset = () => {
    this.setState({ error: null });
  };

  render() {
    const { error } = this.state;
    if (error) {
      if (typeof this.props.fallback === 'function') {
        return (this.props.fallback as FallbackRender)(error, this.reset);
      }
      return this.props.fallback ?? null;
    }
    return this.props.children;
  }
}

