"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import PriceRangeSlider from "@/components/PriceRangeSelector";

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

interface Category {
  id: string;
  name: string;
}

export default function SearchPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Get initial values from URL params
  const queryParam = searchParams.get("q") || "";
  const collectionParam = searchParams.get("collection")?.split(",") || [];
  const categoryParam = searchParams.get("category")?.split(",") || [];
  const minPriceParam = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : 0;
  const maxPriceParam = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : 10000;
  const inStockParam = searchParams.get("inStock") === "true";
  const sortParam = searchParams.get("sort") || "name_asc";

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [collectionsMap, setCollectionsMap] = useState<Map<string, string>>(
    new Map()
  );
  const [collectionsReverseMap, setCollectionsReverseMap] = useState<Map<string, string>>(
    new Map()
  );
  
  // Filter states - initialize from URL params
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [selectedCollections, setSelectedCollections] = useState<string[]>(collectionParam);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(categoryParam);
  const [priceRange, setPriceRange] = useState<[number, number]>([minPriceParam, maxPriceParam]);
  const [inStockOnly, setInStockOnly] = useState(inStockParam);
  const [sortBy, setSortBy] = useState(sortParam);
  const [categoriesMap, setCategoriesMap] = useState<Map<string, string>>(
    new Map()
  );
  const [categoriesReverseMap, setCategoriesReverseMap] = useState<Map<string, string>>(
    new Map()
  );

  // Debounce function for URL updates
  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  // Update URL with current filters
  const updateURL = debounce(() => {
    const params = new URLSearchParams();
    
    if (searchQuery) params.set("q", searchQuery);
    if (selectedCollections.length > 0) params.set("collection", selectedCollections.join(","));
    if (selectedCategories.length > 0) params.set("category", selectedCategories.join(","));
    if (priceRange[0] > 0) params.set("minPrice", priceRange[0].toString());
    if (priceRange[1] < 10000) params.set("maxPrice", priceRange[1].toString());
    if (inStockOnly) params.set("inStock", "true");
    if (sortBy !== "name_asc") params.set("sort", sortBy);
    
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, 300);

  // Fetch products from API endpoint
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch products, collections, and categories
        const [productsRes, collectionsRes, categoriesRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/collections/getAllCollectionsList"),
          fetch("/api/categories"),
        ]);

        if (!productsRes.ok || !collectionsRes.ok || !categoriesRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const productsData = await productsRes.json();
        const collectionsData = await collectionsRes.json();
        const categoriesData = await categoriesRes.json();

        // Create collections mapping
        const collectionsMapping = new Map<string, string>();
        const collectionsReverseMapping = new Map<string, string>();
        collectionsData.forEach((collection: Collection) => {
          collectionsMapping.set(collection.id, collection.name);
          collectionsReverseMapping.set(collection.name, collection.id);
        });

        // Create categories mapping
        const categoriesMapping = new Map<string, string>();
        const categoriesReverseMapping = new Map<string, string>();
        categoriesData.forEach((category: Category) => {
          categoriesMapping.set(category.id, category.name);
          categoriesReverseMapping.set(category.name, category.id);
        });

        setCollectionsMap(collectionsMapping);
        setCollectionsReverseMap(collectionsReverseMapping);
        setCategoriesMap(categoriesMapping);
        setCategoriesReverseMap(categoriesReverseMapping);
        setProducts(productsData);
        setFilteredProducts(productsData);
        setCollections(collectionsData.map((c: Collection) => c.name));
        setCategories(categoriesData);
        
        // Process URL params after loading data
        processUrlParams(collectionsMapping, categoriesMapping);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Process URL parameters after data is loaded
  const processUrlParams = (collectionsMap: Map<string, string>, categoriesMap: Map<string, string>) => {
    // Handle collection parameter which might be names or IDs
    if (collectionParam.length > 0) {
      const processedCollections = collectionParam.map(param => {
        // Check if param is an ID that exists in our map
        for (const [id, name] of collectionsMap.entries()) {
          if (id === param) return name;
        }
        // Otherwise, assume it's already a name
        return param;
      });
      setSelectedCollections(processedCollections);
    }

    // Handle category parameter which might be names or IDs
    if (categoryParam.length > 0) {
      setSelectedCategories(categoryParam);
    }
  };

  // Apply filters
  useEffect(() => {
    let result = [...products];

    // Filter by collections
    if (selectedCollections.length > 0) {
      result = result.filter((product) => {
        const collectionName = collectionsMap.get(product.collections);
        return selectedCollections.includes(collectionName || "");
      });
    }

    // Filter by search query
    if (searchQuery) {
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by categories
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
    
    // Update URL with current filters
    if (!isLoading) {
      updateURL();
    }
  }, [
    products,
    searchQuery,
    selectedCollections,
    selectedCategories,
    priceRange,
    inStockOnly,
    sortBy,
    isLoading
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
    router.push(pathname, { scroll: false });
  };

  return (
    <main className="min-h-screen bg-neutral-50">
      <Navbar />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
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
                              key={category.id}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={`category-${category.id}`}
                                checked={selectedCategories.includes(
                                  category.id
                                )}
                                onCheckedChange={() =>
                                  toggleCategory(category.id)
                                }
                              />
                              <label
                                htmlFor={`category-${category.id}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {category.name}
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
                  <PriceRangeSlider
                    min={0}
                    max={10000}
                    step={100}
                    value={priceRange}
                    onChange={setPriceRange}
                    currency="₹"
                  />
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
                      categoryName: product.category
                        ? categoriesMap.get(product.category) ||
                          "Unknown Category"
                        : undefined,
                    }}
                    showCollectionInfo={true}
                    showCategoryInfo={true}
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