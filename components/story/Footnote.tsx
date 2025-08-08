import React, { PropsWithChildren } from 'react';
import { useFootnotes } from './StoryLayout';

export function Footnote({ children }: PropsWithChildren) {
  const { addFootnote } = useFootnotes();
  const index = addFootnote(children);
  return <sup className="text-sm align-super">[{index}]</sup>;
}

