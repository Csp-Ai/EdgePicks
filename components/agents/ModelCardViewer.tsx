import dynamic from 'next/dynamic';
import { useMemo } from 'react';

interface ModelCardViewerProps {
  agent: string;
}

export default function ModelCardViewer({ agent }: ModelCardViewerProps) {
  const MDXContent = useMemo(
    () => dynamic(() => import(`../../docs/model-cards/${agent}.md`)),
    [agent]
  );

  return (
    <div className="prose">
      <MDXContent />
    </div>
  );
}
