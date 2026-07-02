import { NextResponse } from 'next/server';
import { db } from '@/lib/tidb';
import crypto from 'crypto';

export async function GET(request: Request) {
  try {
    // 1. Fetch user IP safely and mask it using a SHA-256 hash to respect privacy
    const rawIp = request.headers.get('x-forwarded-for') || 'anonymous_reader';
    const hashedUserId = crypto.createHash('sha256').update(rawIp).digest('hex');

    // 2. Perform an Upsert: Log or update this unique reader's live heartbeat record
    await db.query(
      `INSERT INTO user_presence (user_id, last_active) 
       VALUES (?, NOW()) 
       ON DUPLICATE KEY UPDATE last_active = NOW()`,
      [hashedUserId]
    );

    // 3. Clear out rows for users who haven't communicated with the server for over 15 seconds
    await db.query(`DELETE FROM user_presence WHERE last_active < NOW() - INTERVAL 15 SECOND`);

    // 4. Retrieve the exact cardinality of true active visitors currently reading manga
    const [rows] = await db.query(`SELECT COUNT(*) as activeCount FROM user_presence`);
    const activeReaders = (rows as any[])[0]?.activeCount || 1;

    return NextResponse.json({ readers: activeReaders });
  } catch (error) {
    console.error('TiDB Presence Synchronizer Error:', error);
    // Graceful baseline fallback so the client view component never blanks out
    return NextResponse.json({ readers: 1 });
  }
}
