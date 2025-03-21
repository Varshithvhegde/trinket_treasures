import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase';

export async function GET() {
  try {
    const categoriesSnapshot = await adminDb.collection('categories').get();
    const categories = categoriesSnapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name
    }));
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name } = await request.json();
    const docRef = await adminDb.collection('categories').add({
      name,
      createdAt: new Date().toISOString()
    });
    return NextResponse.json({ id: docRef.id, name });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
