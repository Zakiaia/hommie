import { getOrCreateProfile } from './actions';
import { OnboardingWizard } from './wizard';

export default async function OnboardingPage() {
  const profile = await getOrCreateProfile();

  return (
    <div className="mx-auto max-w-3xl p-8">
      <OnboardingWizard profile={profile} />
    </div>
  );
}
