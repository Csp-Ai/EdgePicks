import React from 'react';

interface FixSuggestionsChipProps {
  href?: string;
}

const FixSuggestionsChip: React.FC<FixSuggestionsChipProps> = ({
  href = '/.github/PULL_REQUEST_TEMPLATE.md',
}) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    className="mt-2 inline-block px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs"
  >
    Fix suggestions
  </a>
);

export default FixSuggestionsChip;
