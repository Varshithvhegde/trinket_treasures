'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface CollectionFormProps {
  initialData?: {
    id?: string;
    name: string;
    description: string;
  };
  mode: 'create' | 'edit';
}

export default function CollectionForm({ initialData, mode }: CollectionFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = mode === 'create' 
        ? '/api/collections' 
        : `/api/collections/${initialData?.id}`;
      
      const method = mode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/admin/collections');
        router.refresh();
      }
    } catch (error) {
      console.error('Error saving collection:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Collection Name
        </label>
        <input
          type="text"
          title="Collection Name"
          placeholder="Enter collection name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          title="Description"
          placeholder="Enter collection description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm"
          rows={4}
          required
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        {mode === 'create' ? 'Create Collection' : 'Update Collection'}
      </button>
    </form>
  );
}