interface SkipLinkProps {
  href?: string;
  text?: string;
}

export default function SkipLink({ href = '#main', text = 'Skip to content' }: SkipLinkProps) {
  return (
    <a
      href={href}
      className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:p-4 focus:bg-white focus:text-blue-600"
    >
      {text}
    </a>
  );
}
