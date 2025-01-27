import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const doc = await db.collection('collections').doc(params.id).get();
    
    if (!doc.exists) {
      return NextResponse.json(
        { error: 'Collection not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error('Error fetching collection:', error);
    return NextResponse.json(
      { error: 'Error fetching collection' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, description } = body;

    await db.collection('collections').doc(params.id).update({
      name,
      description,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ message: 'Collection updated successfully' });
  } catch (error) {
    console.error('Error updating collection:', error);
    return NextResponse.json(
      { error: 'Error updating collection' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // First, remove the collection reference from all products
    const productsSnapshot = await db
      .collection('products')
      .where('collections', 'array-contains', params.id)
      .get();

    const batch = db.batch();
    productsSnapshot.docs.forEach((doc) => {
      const productRef = db.collection('products').doc(doc.id);
      const collections = doc.data().collections.filter(
        (id: string) => id !== params.id
      );
      batch.update(productRef, { collections });
    });

    // Then delete the collection
    batch.delete(db.collection('collections').doc(params.id));
    await batch.commit();

    return NextResponse.json({ message: 'Collection deleted successfully' });
  } catch (error) {
    console.error('Error deleting collection:', error);
    return NextResponse.json(
      { error: 'Error deleting collection' },
      { status: 500 }
    );
  }
}