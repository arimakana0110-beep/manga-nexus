import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/tidb';

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const session = cookieStore.get('mangalume_session');
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { commentId, voteType } = await request.json(); // voteType: 'like' | 'dislike'

  const [uRows] = await db.query('SELECT id FROM users WHERE email = ?', [session.value]);
  const userId = (uRows as any[])[0]?.id;

  await db.query(
    `INSERT INTO comment_votes (comment_id, user_id, vote_type) VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE vote_type = ?`,
    [commentId, userId, voteType, voteType]
  );
  return NextResponse.json({ success: true });
}
