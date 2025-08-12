import React, { Component, ComponentType, createElement } from "react";

export default function withBoundary<P>(Wrapped: ComponentType<P>) {
  return class Boundary extends Component<P, { hasError: boolean }> {
    state = { hasError: false };
    static getDerivedStateFromError() {
      return { hasError: true };
    }
    componentDidCatch() {}
    render() {
      if (this.state.hasError) return <div role="alert">Something went wrong.</div>;
      return createElement(Wrapped as ComponentType<any>, this.props);
    }
  };
}

