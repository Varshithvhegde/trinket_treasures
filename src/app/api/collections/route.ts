// app/api/collections/route.ts
import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase';

export async function GET() {
  try {
    const collectionsSnapshot = await adminDb.collection('collections').get();
    const collections = collectionsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return NextResponse.json(collections);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch collections' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const docRef = await adminDb.collection('collections').add(data);
    return NextResponse.json({ id: docRef.id, ...data });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add collection' }, { status: 500 });
  }
}