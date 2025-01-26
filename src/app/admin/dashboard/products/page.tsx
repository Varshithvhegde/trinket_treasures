import ProductForm from '@/components/admin/ProductForm';
import ProductList from '@/components/admin/ProductList';

export default function ProductDashboard() {
  return (
    <div className="space-y-8 p-6">
      <h1 className="text-2xl font-bold">Product Management</h1>
      <ProductForm />
      <ProductList />
    </div>
  );
}
