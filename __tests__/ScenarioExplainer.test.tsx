import { render, screen } from '@testing-library/react';
import ScenarioExplainer from '../components/agents/ScenarioExplainer';

describe('ScenarioExplainer', () => {
  it('renders explanations for injuries, weather, and line moves', () => {
    render(
      <ScenarioExplainer
        injuries={['QB ankle', 'RB out']}
        weather="Heavy rain expected"
        lineMove={{ from: -3.5, to: -5 }}
      />
    );
    const container = screen.getByTestId('scenario-explainer');
    expect(container).toHaveTextContent('Key injuries: QB ankle, RB out');
    expect(container).toHaveTextContent('Weather forecast: Heavy rain expected');
    expect(container).toHaveTextContent('Line fell from -3.5 to -5');
  });

  it('renders nothing when no factors provided', () => {
    const { container } = render(<ScenarioExplainer />);
    expect(container.firstChild).toBeNull();
  });
});

