import { Card, CardContent } from "./ui/card";

interface ProductProps {
  product: {
    id: string;
    name: string;
    price: string;
    imageURL: string;
    description: string;
    inStock: boolean;
    collection?: string;
    categoryName?: string; // Add this line
  };
  showCollectionInfo?: boolean;
  showCategoryInfo?: boolean; // Add this line
}

export default function Product({
  product,
  showCollectionInfo = false,
  showCategoryInfo = false, // Add default value
}: ProductProps) {
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="relative overflow-hidden h-64">
        <img
          src={product.imageURL}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity"></div>
      </div>
      <CardContent className="p-5">
        <h3 className="text-lg font-medium text-neutral-800 mb-2">
          {product.name}
        </h3>
        <p className="text-neutral-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <p className="text-amber-700 font-semibold text-xl">
            ₹{product.price}
          </p>
          <span
            className={`text-sm ${
              product.inStock ? "text-green-600" : "text-red-600"
            }`}
          >
            {product.inStock ? "In Stock" : "Out of Stock"}
          </span>
        </div>
        {(showCollectionInfo || showCategoryInfo) && (
          <div className="mt-3 flex flex-wrap gap-2">
            {showCollectionInfo && product.collection && (
              <span className="inline-block px-2 py-1 text-xs bg-neutral-100 rounded-full text-neutral-700">
                {product.collection}
              </span>
            )}
            {showCategoryInfo && product.categoryName && (
              <span className="inline-block px-2 py-1 text-xs bg-neutral-100 rounded-full text-neutral-700">
                {product.categoryName}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
