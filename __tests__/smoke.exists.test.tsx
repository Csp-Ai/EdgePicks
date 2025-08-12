import { render } from "@testing-library/react";
import "@testing-library/jest-dom";

function Ok() { return <div>ok</div>; }

describe("smoke", () => {
  it("renders", () => {
    const { getByText } = render(<Ok />);
    expect(getByText("ok")).toBeInTheDocument();
  });
});

