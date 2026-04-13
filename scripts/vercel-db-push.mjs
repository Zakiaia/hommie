#!/usr/bin/env node
/**
 * Production DB on Neon was created for the MVP schema; new Prisma fields
 * (e.g. onboardingLifestyleJson, preferredPlacesJson, ownership %) are missing
 * until migrated. On Vercel builds we push schema so /onboarding stops 500'ing.
 *
 * Opt out: set SKIP_VERCEL_DB_PUSH=1 on the Vercel project.
 */
import { execSync } from 'node:child_process';

const onVercel = process.env.VERCEL === '1';
const skip = process.env.SKIP_VERCEL_DB_PUSH === '1';

if (!onVercel || !process.env.DATABASE_URL || skip) {
  console.log('[hommie] Skipping prisma db push (local build, no DATABASE_URL, or SKIP_VERCEL_DB_PUSH=1).');
  process.exit(0);
}

console.log('[hommie] Vercel build: running prisma db push against DATABASE_URL…');
execSync('npx prisma db push', { stdio: 'inherit', env: process.env });
