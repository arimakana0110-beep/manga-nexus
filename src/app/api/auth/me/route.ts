import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/tidb';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('mangalume_session');
    if (!session) return NextResponse.json({ authenticated: false });

    // This will error out if display_name column was not added to TiDB yet
    const [rows] = await db.query('SELECT id, email, display_name FROM users WHERE email = ?', [session.value]);
    const user = (rows as any[])[0];
    if (!user) return NextResponse.json({ authenticated: false });

    return NextResponse.json({ 
      authenticated: true, 
      id: user.id, 
      email: user.email, 
      displayName: user.display_name || null
    });
  } catch (error: any) {
    console.error("Critical error in /api/auth/me:", error);
    // Returns a valid JSON fallback format so the frontend doesn't break
    return NextResponse.json({ 
      authenticated: false, 
      error: 'Database connection or schema mismatch error' 
    }, { status: 500 });
  }
}
