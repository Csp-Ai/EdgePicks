import { describe, it, expect, jest } from "@jest/globals";

jest.mock("next/dynamic", () => (fn: any) => fn());
jest.mock("react-force-graph-2d", () => () => null);

import AgentFlowVisualizer from "@/components/AgentFlowVisualizer";

describe("AgentFlowVisualizer compile", () => {
  it("exports a component", () => {
    expect(typeof AgentFlowVisualizer).toBe("function");
  });
});

