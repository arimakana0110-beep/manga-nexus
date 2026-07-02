import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/tidb';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('mangalume_session');
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { displayName } = await request.json();
    const cleanName = displayName?.trim();
    if (!cleanName || cleanName.length < 3) return NextResponse.json({ error: 'Name too short' }, { status: 400 });

    await db.query('UPDATE users SET display_name = ? WHERE email = ?', [cleanName, session.value]);
    return NextResponse.json({ success: true, displayName: cleanName });
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') return NextResponse.json({ error: 'Display name is already taken' }, { status: 400 });
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}
