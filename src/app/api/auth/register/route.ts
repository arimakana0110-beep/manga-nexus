import { NextResponse } from 'next/server';
import { db } from '@/lib/tidb';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert into TiDB distributed database layer
    await db.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword]);
    
    return NextResponse.json({ success: true, message: 'User registered successfully!' });
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
