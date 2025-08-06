require('ts-node').register({ transpileOnly: true, compilerOptions: { module: 'CommonJS' } });
const assert = require('assert');
const React = require('react');
const renderer = require('react-test-renderer');
const { act } = renderer;
const nextAuth = require('next-auth/react');

function renderHookWithSession(session) {
  nextAuth.useSession = () => ({ data: session });
  const result = {};
  function TestComponent() {
    result.current = require('./usePredictionReveal').default();
    return null;
  }
  act(() => {
    renderer.create(React.createElement(TestComponent));
  });
  return result;
}

// Test unauthenticated: should show modal
let result = renderHookWithSession(null);
assert.deepStrictEqual(result.current.revealed, {});
act(() => {
  result.current.handleReveal(1);
});
assert.strictEqual(result.current.showModal, true);

// Test authenticated: should reveal index
result = renderHookWithSession({ user: { name: 'Test' } });
act(() => {
  result.current.handleReveal(2);
});
assert.strictEqual(result.current.revealed[2], true);
assert.strictEqual(result.current.showModal, false);

console.log('usePredictionReveal tests passed');
