import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get('mangalume_session');

  if (!session) return NextResponse.json({ authenticated: false });
  return NextResponse.json({ authenticated: true, email: session.value });
}
