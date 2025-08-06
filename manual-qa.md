# Manual QA - AgentCard Tooltip Accessibility

Steps to validate:
1. Render an `AgentCard` with a populated `result`.
2. Hover over the agent name – the rationale from `result.reason` should appear in a tooltip.
3. Tab to the agent name and observe that the same rationale tooltip appears on focus.
4. Move the mouse away or tab out – the tooltip should disappear.
