import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const profileId = req.nextUrl.searchParams.get('profileId');
  const where: { userId: string; conversationScope: 'ONBOARDING'; scopeId?: string | null } = {
    userId: session.user.id,
    conversationScope: 'ONBOARDING',
  };
  if (profileId) where.scopeId = profileId;

  const messages = await prisma.chatMessage.findMany({
    where,
    orderBy: { createdAt: 'asc' },
    take: 100,
  });

  return NextResponse.json({ messages });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = (await req.json()) as { profileId?: string; content?: string };
  const content = body.content?.trim();
  if (!content) {
    return NextResponse.json({ error: 'Empty' }, { status: 400 });
  }

  const profileId = body.profileId;
  if (profileId) {
    const ok = await prisma.financialProfile.findFirst({
      where: { id: profileId, userId: session.user.id },
    });
    if (!ok) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  await prisma.chatMessage.create({
    data: {
      userId: session.user.id,
      conversationScope: 'ONBOARDING',
      scopeId: profileId ?? null,
      role: 'USER',
      content,
    },
  });

  await prisma.chatMessage.create({
    data: {
      userId: session.user.id,
      conversationScope: 'ONBOARDING',
      scopeId: profileId ?? null,
      role: 'ASSISTANT',
      content:
        'תודה ששיתפת. המידע נשמר לצד הפרופיל. המשך בשאלות למעלה — ככל שתפרטו יותר, נוכל לדייק את ההמלצות והתחשיבים.',
    },
  });

  return NextResponse.json({ ok: true });
}
