'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { he } from '@/lib/i18n/he';
import { Loader2 } from 'lucide-react';
import { createAnalysis } from './actions';

export default function NewAnalysisPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [propertyType, setPropertyType] = useState('SECOND_HAND');
  const [intendedUse, setIntendedUse] = useState('RESIDENCE');

  const handlePropertyType = (v: string | null) => { if (v) setPropertyType(v); };
  const handleIntendedUse = (v: string | null) => { if (v) setIntendedUse(v); };

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    startTransition(async () => {
      const id = await createAnalysis({
        nickname: fd.get('nickname') as string,
        city: fd.get('city') as string,
        neighborhood: fd.get('neighborhood') as string,
        propertyPrice: Number(fd.get('propertyPrice')),
        propertyType: propertyType as 'NEW_PROJECT' | 'SECOND_HAND',
        intendedUse: intendedUse as 'RESIDENCE' | 'INVESTMENT',
        estimatedRent: Number(fd.get('estimatedRent')) || undefined,
        closingCosts: Number(fd.get('closingCosts')) || undefined,
        renovationCosts: Number(fd.get('renovationCosts')) || undefined,
        furnitureCosts: Number(fd.get('furnitureCosts')) || undefined,
        purchaseTaxEstimate: Number(fd.get('purchaseTaxEstimate')) || undefined,
        ltvPercent: Number(fd.get('ltvPercent')) || 70,
        interestRate: Number(fd.get('interestRate')) || 4.5,
        mortgageYears: Number(fd.get('mortgageYears')) || 30,
        maintenanceMonthly: Number(fd.get('maintenanceMonthly')) || 500,
        vacancyPercent: Number(fd.get('vacancyPercent')) || 5,
      });

      router.push(`/analysis/${id}`);
    });
  }

  const f = he.analysis.fields;

  return (
    <div className="mx-auto max-w-3xl p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{he.analysis.title}</h1>
        <p className="text-muted-foreground">{he.analysis.subtitle}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>פרטי הנכס</CardTitle>
            <CardDescription>הזן את הפרטים הבסיסיים של הנכס</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nickname">{f.nickname}</Label>
                <Input id="nickname" name="nickname" placeholder={f.nicknamePlaceholder} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">{f.city}</Label>
                <Input id="city" name="city" placeholder={f.cityPlaceholder} required />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="neighborhood">{f.neighborhood}</Label>
                <Input id="neighborhood" name="neighborhood" placeholder={f.neighborhoodPlaceholder} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="propertyPrice">{f.propertyPrice}</Label>
                <Input id="propertyPrice" name="propertyPrice" type="number" placeholder={f.propertyPricePlaceholder} required dir="ltr" className="text-left" />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>{f.propertyType}</Label>
                <input type="hidden" name="propertyType" value={propertyType} />
                <Select value={propertyType} onValueChange={handlePropertyType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NEW_PROJECT">{f.propertyTypes.NEW_PROJECT}</SelectItem>
                    <SelectItem value="SECOND_HAND">{f.propertyTypes.SECOND_HAND}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{f.intendedUse}</Label>
                <input type="hidden" name="intendedUse" value={intendedUse} />
                <Select value={intendedUse} onValueChange={handleIntendedUse}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="RESIDENCE">{f.intendedUses.RESIDENCE}</SelectItem>
                    <SelectItem value="INVESTMENT">{f.intendedUses.INVESTMENT}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {intendedUse === 'INVESTMENT' && (
              <div className="space-y-2">
                <Label htmlFor="estimatedRent">{f.estimatedRent}</Label>
                <Input id="estimatedRent" name="estimatedRent" type="number" placeholder={f.estimatedRentPlaceholder} dir="ltr" className="text-left" />
              </div>
            )}

            <div className="border-t pt-4">
              <h3 className="mb-4 font-semibold">עלויות נלוות</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="closingCosts">{f.closingCosts}</Label>
                  <Input id="closingCosts" name="closingCosts" type="number" placeholder={f.closingCostsPlaceholder} dir="ltr" className="text-left" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="renovationCosts">{f.renovationCosts}</Label>
                  <Input id="renovationCosts" name="renovationCosts" type="number" placeholder={f.renovationCostsPlaceholder} dir="ltr" className="text-left" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="furnitureCosts">{f.furnitureCosts}</Label>
                  <Input id="furnitureCosts" name="furnitureCosts" type="number" placeholder={f.furnitureCostsPlaceholder} dir="ltr" className="text-left" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="purchaseTaxEstimate">{f.purchaseTax}</Label>
                  <Input id="purchaseTaxEstimate" name="purchaseTaxEstimate" type="number" placeholder={f.purchaseTaxPlaceholder} dir="ltr" className="text-left" />
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="mb-4 font-semibold">פרמטרי משכנתא</h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <Label htmlFor="ltvPercent">{f.ltv}</Label>
                  <Input id="ltvPercent" name="ltvPercent" type="number" defaultValue={70} dir="ltr" className="text-left" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="interestRate">{f.interestRate}</Label>
                  <Input id="interestRate" name="interestRate" type="number" step="0.1" defaultValue={4.5} dir="ltr" className="text-left" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mortgageYears">{f.mortgageYears}</Label>
                  <Input id="mortgageYears" name="mortgageYears" type="number" defaultValue={30} dir="ltr" className="text-left" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maintenanceMonthly">{f.maintenance}</Label>
                  <Input id="maintenanceMonthly" name="maintenanceMonthly" type="number" defaultValue={500} dir="ltr" className="text-left" />
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <Label htmlFor="vacancyPercent">{f.vacancy}</Label>
                <Input id="vacancyPercent" name="vacancyPercent" type="number" defaultValue={5} dir="ltr" className="w-32 text-left" />
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={isPending}>
              {isPending && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
              {isPending ? he.analysis.analyzing : he.analysis.submit}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
