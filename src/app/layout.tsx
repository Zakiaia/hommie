import type { Metadata } from 'next';
import { DM_Sans, Fraunces } from 'next/font/google';
import { SessionProvider } from '@/components/shared/session-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import './globals.css';

const dmSans = DM_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const fraunces = Fraunces({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Hommie — הדרך החכמה לקנות דירה',
  description: 'מערכת AI שמלווה אותך בתהליך קניית דירה מקצה לקצה',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const deploySha = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? '';

  return (
    <html lang="he" dir="rtl" className="dark" suppressHydrationWarning data-app-sha={deploySha || undefined}>
      <body className={`${dmSans.variable} ${fraunces.variable} app-mesh-bg min-h-screen font-sans`}>
        <SessionProvider>
          <TooltipProvider>
            {children}
          </TooltipProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
