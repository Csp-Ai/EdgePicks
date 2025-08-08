import React, { createContext, useContext, useState, ReactNode, PropsWithChildren } from 'react';

interface FootnoteContextValue {
  addFootnote: (content: ReactNode) => number;
  footnotes: ReactNode[];
}

const FootnoteContext = createContext<FootnoteContextValue | undefined>(undefined);

export const useFootnotes = () => {
  const ctx = useContext(FootnoteContext);
  if (!ctx) {
    throw new Error('useFootnotes must be used within a StoryLayout');
  }
  return ctx;
};

export function StoryLayout({ children }: PropsWithChildren) {
  const [footnotes, setFootnotes] = useState<ReactNode[]>([]);

  const addFootnote = (content: ReactNode) => {
    let index = 0;
    setFootnotes((prev) => {
      index = prev.length + 1;
      return [...prev, content];
    });
    return index;
  };

  const allChildren = React.Children.toArray(children);
  const summary = allChildren.filter(
    (child) => React.isValidElement(child) && child.type === 'p'
  ).slice(0, 2);

  return (
    <FootnoteContext.Provider value={{ addFootnote, footnotes }}>
      <article className="prose prose-lg mx-auto">
        {summary.length > 0 && (
          <aside className="mb-8 p-4 border rounded bg-gray-50">
            <h2 className="m-0">TL;DR</h2>
            {summary}
          </aside>
        )}
        {allChildren}
        {footnotes.length > 0 && (
          <section className="mt-8">
            <h3>Footnotes</h3>
            <ol className="list-decimal pl-5">
              {footnotes.map((fn, idx) => (
                <li key={idx}>{fn}</li>
              ))}
            </ol>
          </section>
        )}
      </article>
    </FootnoteContext.Provider>
  );
}

