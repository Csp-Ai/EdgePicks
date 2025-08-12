/**
 * Ensures the visualizer appends at least one edge while in simulation mode.
 */
import React from "react";
import { jest } from "@jest/globals";
import { render, screen, waitFor } from "@testing-library/react";
import AgentFlowVisualizer from "@/components/visuals/AgentFlowVisualizer";

describe("AgentFlowVisualizer (simulation fallback)", () => {
  beforeAll(() => {
    // Force simulation by removing EventSource
    // @ts-ignore
    delete (global as any).EventSource;
    jest.useFakeTimers();
  });
  afterAll(() => {
    jest.useRealTimers();
  });

  it("appends an edge under simulation", async () => {
    render(<AgentFlowVisualizer />);
    // Fast-forward enough ticks to create at least one edge
    jest.advanceTimersByTime(1200);
    await waitFor(() => {
      const list = screen.getByTestId("flow-edges");
      // In the lightweight UL fallback we render IDs; ensure at least one item exists
      // (we don't assert on exact ID because it's time-based)
      expect(list.querySelectorAll("li").length).toBeGreaterThan(0);
    });
  });
});

