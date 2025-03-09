// /api/products/route.ts
import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase';

export async function GET() {
  try {
    const productsSnapshot = await adminDb.collection('products').get();
    const products = productsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log(products);
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    // If there's an existing product with this image, you might want to delete the old image from storage
    const docRef = await adminDb.collection('products').add({
      ...data,
      createdAt: new Date().toISOString(),
    });
    return NextResponse.json({ id: docRef.id, ...data });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add product' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { id, ...data } = await request.json();
  try {
    // If updating image, you might want to delete the old image from storage
    await adminDb.collection('products').doc(id).update({
      ...data,
      updatedAt: new Date().toISOString(),
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  try {
    await adminDb.collection('products').doc(id).delete();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
