'use client';

import { useEffect, useState } from 'react';

export default function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    };

    fetchProducts();
  }, []);

  const deleteProduct = async (id: string) => {
    try {
      await fetch('/api/products', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      setProducts((prev) => prev.filter((product) => product.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <ul className="space-y-4">
      {products.map((product: any) => (
        <li key={product.id} className="flex justify-between items-center border p-4 rounded-md">
          <div>
            <h2 className="font-medium">{product.name}</h2>
            <p className="text-sm text-gray-600">{product.price}</p>
          </div>
          <button
            onClick={() => deleteProduct(product.id)}
            className="bg-red-600 text-white px-4 py-2 rounded-md"
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
