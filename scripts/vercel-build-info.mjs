#!/usr/bin/env node
/** Prints in Vercel build logs so you can confirm which Git commit was built. */
const sha = process.env.VERCEL_GIT_COMMIT_SHA;
const ref = process.env.VERCEL_GIT_COMMIT_REF;
console.log('\n========== Hommie build identity ==========');
console.log('VERCEL_GIT_COMMIT_SHA:', sha ?? '(missing — not a Vercel Git build?)');
console.log('VERCEL_GIT_COMMIT_REF:', ref ?? '(missing)');
console.log('Expected new UI: body uses app-mesh-bg + DM Sans, not Geist.');
console.log('==========================================\n');
