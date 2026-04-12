'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2 } from 'lucide-react';
import { he } from '@/lib/i18n/he';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await signIn('credentials', {
      email,
      password: 'demo',
      redirect: false,
    });

    if (result?.error) {
      setError('שגיאה בהתחברות');
    } else {
      router.push('/onboarding');
    }
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="glass-panel w-full max-w-md rounded-3xl p-8 shadow-2xl shadow-black/40 md:p-10">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-primary ring-1 ring-white/15">
            <Building2 className="h-7 w-7" />
          </div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight md:text-3xl">{he.auth.loginTitle}</h1>
          <p className="mt-2 text-sm text-muted-foreground">הזן את כתובת האימייל שלך כדי להתחבר</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">{he.auth.emailLabel}</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              dir="ltr"
              className="glass-input h-11 rounded-xl border-white/10"
            />
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <Button type="submit" className="h-11 w-full rounded-full text-base shadow-lg shadow-black/20" disabled={loading}>
            {loading ? he.common.loading : he.auth.loginButton}
          </Button>
        </form>
      </div>
    </div>
  );
}
