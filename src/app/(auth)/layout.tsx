/** Fresh HTML on each request so auth entry pages are not stuck on an old CDN snapshot. */
export const dynamic = 'force-dynamic';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return children;
}
