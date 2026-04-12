import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { getOrCreateProfile } from './actions';
import { OnboardingFlow } from './onboarding-flow';

export default async function OnboardingPage() {
  let profile = await getOrCreateProfile();
  if (profile.onboardingCompleted) {
    redirect('/dashboard');
  }
  if (!profile.onboardingCompleted && profile.currentStep <= 6) {
    await prisma.financialProfile.update({
      where: { id: profile.id },
      data: { currentStep: 1 },
    });
    profile = { ...profile, currentStep: 1 };
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 md:px-6">
      <OnboardingFlow profile={profile} />
    </div>
  );
}
