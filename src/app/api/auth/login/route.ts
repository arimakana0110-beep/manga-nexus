import { NextResponse } from 'next/server';
import { db } from '@/lib/tidb';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = (rows as any[])[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Set a safe, local HTTP-only session cookie mock for frontend verification
    const response = NextResponse.json({ success: true, email: user.email });
    response.cookies.set('mangalume_session', user.email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/'
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
