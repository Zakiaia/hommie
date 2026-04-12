'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function getOrCreateProfile() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Unauthorized');

  let profile = await prisma.financialProfile.findFirst({
    where: { userId: session.user.id },
    include: { capitalSources: true },
    orderBy: { createdAt: 'desc' },
  });

  if (!profile) {
    profile = await prisma.financialProfile.create({
      data: { userId: session.user.id },
      include: { capitalSources: true },
    });
  }

  return profile;
}
