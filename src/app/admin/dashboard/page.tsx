// app/admin/dashboard/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function AdminDashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  

  return (
    <ProtectedRoute>
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-indigo-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold">Total Products</h3>
          <p className="text-3xl font-bold">0</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold">Total Collections</h3>
          <p className="text-3xl font-bold">0</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold">Featured Items</h3>
          <p className="text-3xl font-bold">0</p>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}