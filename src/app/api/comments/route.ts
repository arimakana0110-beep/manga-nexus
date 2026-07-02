import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/tidb';

// Fetch all comments and metrics for a manga
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const mangaId = searchParams.get('mangaId');
    if (!mangaId) return NextResponse.json({ error: 'Missing mangaId' }, { status: 400 });

    // Identify who is looking at the comment section to fetch their individual reaction state
    const cookieStore = await cookies();
    const session = cookieStore.get('mangalume_session');
    let activeUserId = 0;

    if (session) {
      const [userRows] = await db.query('SELECT id FROM users WHERE email = ?', [session.value]);
      activeUserId = (userRows as any[])[0]?.id || 0;
    }

    const query = `
      SELECT 
        c.id, 
        c.manga_id as mangaId, 
        c.user_id as userId, 
        c.parent_id as parent_id, 
        c.content, 
        c.created_at as created_at,
        u.display_name, 
        u.email,
        (SELECT COUNT(*) FROM comment_votes WHERE comment_id = c.id AND vote_type = 'like') as likes,
        (SELECT COUNT(*) FROM comment_votes WHERE comment_id = c.id AND vote_type = 'dislike') as dislikes,
        (SELECT vote_type FROM comment_votes WHERE comment_id = c.id AND user_id = ?) as userVote
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.manga_id = ?
      ORDER BY c.created_at DESC
    `;

    const [rows] = await db.query(query, [activeUserId, mangaId]);
    return NextResponse.json(rows);
  } catch (error: any) {
    console.error("Failed pulling rich discussion stream:", error);
    return NextResponse.json({ error: 'Database mismatch' }, { status: 500 });
  }
}

// Post a comment or reply
export async function POST(request: Request) {
  const cookieStore = await cookies();
  const session = cookieStore.get('mangalume_session');
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { mangaId, content, parentId } = await request.json();
  
  const [uRows] = await db.query('SELECT id FROM users WHERE email = ?', [session.value]);
  const userId = (uRows as any[])[0]?.id;

  const [res] = await db.query(
    'INSERT INTO comments (manga_id, user_id, parent_id, content) VALUES (?, ?, ?, ?)',
    [mangaId, userId, parentId || null, content]
  );
  return NextResponse.json({ success: true, commentId: (res as any).insertId });
}
