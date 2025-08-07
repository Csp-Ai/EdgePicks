import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-16 py-6 text-center text-sm text-gray-500">
      <div className="space-x-4">
        <Link href="/terms">Terms</Link>
        <a href="https://github.com" target="_blank" rel="noreferrer">GitHub</a>
        <a href="https://discord.com" target="_blank" rel="noreferrer">Discord</a>
      </div>
    </footer>
  );
}
