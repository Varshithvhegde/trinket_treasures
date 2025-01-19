// app/api/featured/route.ts
import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase';

export async function GET() {
  try {
    const featuredSnapshot = await adminDb.collection('featured').get();
    const featured = featuredSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return NextResponse.json(featured);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch featured items '+error }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const docRef = await adminDb.collection('featured').add(data);
    return NextResponse.json({ id: docRef.id, ...data });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add featured item' }, { status: 500 });
  }
}