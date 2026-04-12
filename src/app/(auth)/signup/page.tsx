import { redirect } from 'next/navigation';

/** Sign-up UI removed for now; all users enter via login → onboarding. */
export default function SignupRedirectPage() {
  redirect('/login');
}
