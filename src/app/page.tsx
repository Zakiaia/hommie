import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Building2, Calculator, MessageSquare, TrendingUp } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="glass-panel sticky top-0 z-10 border-b border-white/10">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-7 w-7 text-primary" />
            <span className="font-heading text-xl font-semibold tracking-tight">Hommie</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button className="rounded-full shadow-lg shadow-black/20">התחל</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-4 py-16 text-center md:py-24">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            מסלול חכם לקניית דירה
          </p>
          <h1 className="font-heading text-4xl font-semibold leading-tight tracking-tight text-balance md:text-6xl md:leading-[1.08]">
            הדרך החכמה
            <br />
            <span className="text-primary">לקנות דירה</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            מערכת AI שמבינה את המצב הפיננסי שלך, ממליצה מה נכון לך,
            ומלווה אותך עד סגירת העסקה — הכל במקום אחד.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/login">
              <Button size="lg" className="rounded-full px-8 text-base shadow-lg shadow-black/25">
                התחל בחינם
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-white/20 bg-white/5 px-8 text-base backdrop-blur-md hover:bg-white/10"
              >
                כבר יש לי חשבון
              </Button>
            </Link>
          </div>
        </section>

        <section className="border-t border-white/10 py-16 md:py-20">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="font-heading mb-3 text-center text-2xl font-semibold md:text-3xl">
              מה Hommie עושה בשבילך?
            </h2>
            <p className="mx-auto mb-12 max-w-xl text-center text-sm text-muted-foreground">
              כלים אחדים — פרופיל, ניתוח והמלצה — עם ממשק חדש וקריא יותר.
            </p>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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

      <footer className="border-t border-white/10 py-8 text-center text-sm text-muted-foreground">
        <p>המידע המוצג הינו לצרכי מידע בלבד ואינו מהווה ייעוץ משפטי, מיסויי או פיננסי.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="glass-panel group rounded-2xl p-6 text-center transition-all duration-300 hover:border-white/15 hover:shadow-xl hover:shadow-black/30">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-white/5 text-primary ring-1 ring-white/10 transition-colors group-hover:bg-white/10">
        {icon}
      </div>
      <h3 className="mb-2 font-semibold tracking-tight">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
    </div>
  );
}
