// src/app/api/collections/getAllcollectsList/route.ts
import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase';

export async function GET() {
  try {
    const collectionsSnapshot = await adminDb.collection('collections').get();
    //  return only list of name and id of collections
     const collections = collectionsSnapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name
    }));
    return NextResponse.json(collections);
}
catch (error) {
    return NextResponse.json({ error: 'Failed to fetch collections' }, { status: 500 });
  }
}

export const dynamic = 'force-static';