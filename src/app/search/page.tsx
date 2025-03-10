// src/app/search/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Product from "@/components/Product";

interface Product {
  id: string;
  name: string;
  price: string;
  imageURL: string;
  description: string;
  featured: boolean;
  inStock: boolean;
  collections: string; // Collection ID
  category?: string;
}

interface Collection {
  id: string;
  name: string;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const collectionParam = searchParams.get("collection");

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [collectionsMap, setCollectionsMap] = useState<Map<string, string>>(
    new Map()
  );
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCollections, setSelectedCollections] = useState<string[]>(
    collectionParam ? [collectionParam] : []
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("name_asc");

  // Fetch products from API endpoint
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch both products and collections
        const [productsRes, collectionsRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/collections/getAllCollectionsList"),
        ]);

        if (!productsRes.ok || !collectionsRes.ok)
          throw new Error("Failed to fetch data");

        const productsData = (await productsRes.json()) as Product[];
        const collectionsData = (await collectionsRes.json()) as Collection[];

        // Create collections mapping
        const collectionsMapping = new Map<string, string>();
        collectionsData.forEach((collection) => {
          collectionsMapping.set(collection.id, collection.name);
        });

        // Get unique categories from products
        const categoriesSet = new Set<string>();
        productsData.forEach((product) => {
          if (product.category) categoriesSet.add(product.category);
        });

        setCollectionsMap(collectionsMapping);
        setProducts(productsData);
        setFilteredProducts(productsData);
        setCollections(collectionsData.map((c) => c.name));
        setCategories(Array.from(categoriesSet));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Apply filters
  useEffect(() => {
    let result = [...products];

    // Filter by collections using the mapping
    if (selectedCollections.length > 0) {
      result = result.filter((product) => {
        const collectionName = collectionsMap.get(product.collections);
        return collectionName && selectedCollections.includes(collectionName);
      });
    }

    // Keep existing filters
    if (searchQuery) {
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategories.length > 0) {
      result = result.filter(
        (product) =>
          product.category && selectedCategories.includes(product.category)
      );
    }

    // Filter by price range
    result = result.filter((product) => {
      const price = parseInt(product.price.replace(/[^0-9]/g, ""));
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Filter by stock status
    if (inStockOnly) {
      result = result.filter((product) => product.inStock);
    }

    // Apply sorting
    result = sortProducts(result, sortBy);

    setFilteredProducts(result);
  }, [
    products,
    searchQuery,
    selectedCollections,
    selectedCategories,
    priceRange,
    inStockOnly,
    sortBy,
    collectionParam,
    collectionsMap,
  ]);

  // Sort products
  const sortProducts = (products: Product[], sortOption: string) => {
    const sortedProducts = [...products];

    switch (sortOption) {
      case "name_asc":
        return sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
      case "name_desc":
        return sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
      case "price_asc":
        return sortedProducts.sort(
          (a, b) =>
            parseInt(a.price.replace(/[^0-9]/g, "")) -
            parseInt(b.price.replace(/[^0-9]/g, ""))
        );
      case "price_desc":
        return sortedProducts.sort(
          (a, b) =>
            parseInt(b.price.replace(/[^0-9]/g, "")) -
            parseInt(a.price.replace(/[^0-9]/g, ""))
        );
      default:
        return sortedProducts;
    }
  };

  // Toggle collection filter
  const toggleCollection = (collection: string) => {
    setSelectedCollections((prev) =>
      prev.includes(collection)
        ? prev.filter((c) => c !== collection)
        : [...prev, collection]
    );
  };

  // Toggle category filter
  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCollections([]);
    setSelectedCategories([]);
    setPriceRange([0, 10000]);
    setInStockOnly(false);
    setSortBy("name_asc");
  };

  return (
    <main className="min-h-screen bg-neutral-50">
      <Navbar />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-light text-center mb-8 text-neutral-900">
          Search Our Products
        </h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="md:w-64 w-full">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Filters</h2>
                <Button variant="ghost" size="sm" onClick={resetFilters}>
                  Reset
                </Button>
              </div>

              <div className="space-y-6">
                {/* Collections filter */}
                <Accordion type="single" collapsible defaultValue="collections">
                  <AccordionItem value="collections">
                    <AccordionTrigger>Collections</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        {collections.map((collection) => (
                          <div
                            key={collection}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`collection-${collection}`}
                              checked={selectedCollections.includes(collection)}
                              onCheckedChange={() =>
                                toggleCollection(collection)
                              }
                            />
                            <label
                              htmlFor={`collection-${collection}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {collection}
                            </label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {/* Categories filter */}
                {categories.length > 0 && (
                  <Accordion
                    type="single"
                    collapsible
                    defaultValue="categories"
                  >
                    <AccordionItem value="categories">
                      <AccordionTrigger>Categories</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          {categories.map((category) => (
                            <div
                              key={category}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={`category-${category}`}
                                checked={selectedCategories.includes(category)}
                                onCheckedChange={() => toggleCategory(category)}
                              />
                              <label
                                htmlFor={`category-${category}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {category}
                              </label>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                )}

                {/* Price range filter */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Price Range</h3>
                  <Slider
                    defaultValue={[0, 10000]}
                    max={10000}
                    step={100}
                    value={priceRange}
                    onValueChange={setPriceRange}
                  />
                  <div className="flex justify-between text-sm text-neutral-500">
                    <span>₹{priceRange[0]}</span>
                    <span>₹{priceRange[1]}</span>
                  </div>
                </div>

                {/* In stock filter */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="in-stock"
                    checked={inStockOnly}
                    onCheckedChange={(checked) =>
                      setInStockOnly(checked as boolean)
                    }
                  />
                  <label
                    htmlFor="in-stock"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    In Stock Only
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Products grid */}
          <div className="flex-1">
            {/* Search bar and sorting */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name_asc">Name (A-Z)</SelectItem>
                  <SelectItem value="name_desc">Name (Z-A)</SelectItem>
                  <SelectItem value="price_asc">Price (Low to High)</SelectItem>
                  <SelectItem value="price_desc">
                    Price (High to Low)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Results count */}
            <div className="mb-6">
              <p className="text-neutral-600">
                {filteredProducts.length}{" "}
                {filteredProducts.length === 1 ? "product" : "products"} found
              </p>
            </div>

            {/* Products grid */}
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <p>Loading products...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white p-8 rounded-xl shadow-md text-center">
                <h3 className="text-lg font-medium mb-2">No products found</h3>
                <p className="text-neutral-600">
                  Try adjusting your filters or search query
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <Product
                    key={product.id}
                    product={{
                      ...product,
                      collection:
                        collectionsMap.get(product.collections) ||
                        "Unknown Collection",
                    }}
                    showCollectionInfo={true}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
