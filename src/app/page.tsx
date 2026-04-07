import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Building2, Calculator, MessageSquare, TrendingUp } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold">Hommie</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost">התחבר</Button>
            </Link>
            <Link href="/signup">
              <Button>הרשמה</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-4 py-20 text-center">
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            הדרך החכמה
            <br />
            <span className="text-primary">לקנות דירה</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            מערכת AI שמבינה את המצב הפיננסי שלך, ממליצה מה נכון לך,
            ומלווה אותך עד סגירת העסקה — הכל במקום אחד.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="text-base">
                התחל בחינם
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="text-base">
                כבר יש לי חשבון
              </Button>
            </Link>
          </div>
        </section>

        <section className="border-t bg-muted/30 py-20">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="mb-12 text-center text-2xl font-bold">מה Hommie עושה בשבילך?</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <FeatureCard
                icon={<Calculator className="h-8 w-8" />}
                title="תמונה פיננסית מלאה"
                description="בניית פרופיל פיננסי מעמיק שמבין את כל מקורות ההון שלך"
              />
              <FeatureCard
                icon={<TrendingUp className="h-8 w-8" />}
                title="ניתוח נכסים חכם"
                description="תחשיב אמיתי כולל מיסוי, תזרים, משכנתא ותשואה"
              />
              <FeatureCard
                icon={<MessageSquare className="h-8 w-8" />}
                title="יועץ AI אישי"
                description="שאל כל שאלה וקבל תשובה מקצועית בזמן אמת"
              />
              <FeatureCard
                icon={<Building2 className="h-8 w-8" />}
                title="השוואת תרחישים"
                description="השווה בין נכסים שונים וקבל המלצה מבוססת נתונים"
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <p>המידע המוצג הינו לצרכי מידע בלבד ואינו מהווה ייעוץ משפטי, מיסויי או פיננסי.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="rounded-xl border bg-card p-6 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-primary/5 text-primary">
        {icon}
      </div>
      <h3 className="mb-2 font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
