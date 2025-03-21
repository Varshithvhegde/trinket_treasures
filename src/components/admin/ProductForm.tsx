"use client"
import React, { useState, useRef,useEffect } from 'react';
import { Loader2, Upload } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { storage } from '@/lib/firebase-client';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle } from 'lucide-react';
interface ProductFormProps {
  onSubmit: (formData: any) => void;
  initialData: {
    id?: string;
    name: string;
    price: string;
    collections: string;
    featured: boolean;
    description: string;
    inStock: boolean;
    imageURL: string;
    category?: string;
  };
  collections: { id: string; name: string }[];
}

const ProductForm: React.FC<ProductFormProps> = ({ onSubmit, initialData, collections }) => {
  const [formData, setFormData] = useState(initialData);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(initialData.imageURL);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [newCategory, setNewCategory] = useState('');
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
    // Add this with other state declarations at the top
  const [categoryError, setCategoryError] = useState('');
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Add new category handler
  const handleAddNewCategory = async () => {
    const trimmedCategory = newCategory.trim();
    if (!trimmedCategory) {
      setCategoryError('Category name cannot be empty');
      return;
    }
    
    // Check if category already exists (case-insensitive)
    const categoryExists = categories.some(
      category => category.name.toLowerCase() === trimmedCategory.toLowerCase()
    );
  
    if (categoryExists) {
      setCategoryError('This category already exists');
      return;
    }
    
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmedCategory })
      });
      
      const data = await response.json();
      setCategories(prev => [...prev, data]);
      handleChange('category', data.id);
      setNewCategory('');
      setCategoryError('');
      setShowNewCategoryInput(false);
    } catch (error) {
      console.error('Error adding new category:', error);
      setCategoryError('Failed to add category');
    }
  };

  // Add this before the return statement
  const renderCategorySelect = () => (
    <div className="space-y-2">
      <Label htmlFor="category">Category</Label>
      <div className="flex gap-2">
        {showNewCategoryInput ? (
          <div className="flex-1 flex gap-2 flex-col">
            <div className="flex gap-2">
              <Input
                value={newCategory}
                onChange={(e) => {
                  setNewCategory(e.target.value);
                  setCategoryError(''); // Clear error when user types
                }}
                placeholder="Enter new category"
                className={categoryError ? 'border-red-500 focus-visible:ring-red-500' : ''}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddNewCategory}
              >
                Add
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setShowNewCategoryInput(false);
                  setNewCategory('');
                  setCategoryError('');
                }}
              >
                Cancel
              </Button>
            </div>
            {categoryError && (
              <span className="text-sm text-red-500">{categoryError}</span>
            )}
          </div>
        ) : (
          <>
            <Select
              value={formData.category}
              onValueChange={(value) => handleChange('category', value)}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowNewCategoryInput(true)}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              New
            </Button>
          </>
        )}
      </div>
    </div>
  );

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setUploading(true);
    
    try {
      let imageURL: string = formData.imageURL;
      
      if (imageFile) {
        const fileName: string = `products/${Date.now()}-${imageFile.name}`;
        const storageRef = ref(storage, fileName);
        await uploadBytes(storageRef, imageFile);
        imageURL = await getDownloadURL(storageRef);
      }
      
      await onSubmit({ ...formData, imageURL });
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  interface FormData {
    name: string;
    price: string;
    collections: string;
    featured: boolean;
    description: string;
    inStock: boolean;
    imageURL: string;
  }

  const handleChange = (field: keyof FormData, value: any) => {
    setFormData((prev: FormData) => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* ...existing form JSX... */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            value={formData.price}
            onChange={(e) => handleChange('price', e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Product Image</Label>
        <div className="flex flex-col items-center p-4 border-2 border-dashed rounded-lg">
          {imagePreview ? (
            <div className="relative w-full max-w-xs">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-48 object-cover rounded"
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="absolute bottom-2 right-2"
                onClick={() => fileInputRef.current?.click()}
              >
                Change
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              className="w-full h-48 flex flex-col items-center justify-center gap-2"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-8 w-8" />
              <span>Click to upload image</span>
            </Button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="collections">Collection</Label>
        <select
          id="collections"
          className="w-full p-2 border rounded"
          value={formData.collections}
          onChange={(e) => handleChange('collections', e.target.value)}
          required
        >
          <option value="">Select Collection</option>
          {collections.map((collection) => (
            <option key={collection.id} value={collection.id}>
              {collection.name}
            </option>
          ))}
        </select>
      </div>

      {renderCategorySelect()}

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          required
        />
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="featured"
            checked={formData.featured}
            onCheckedChange={(checked) => handleChange('featured', checked)}
          />
          <Label htmlFor="featured">Featured</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="inStock"
            checked={formData.inStock}
            onCheckedChange={(checked) => handleChange('inStock', checked)}
          />
          <Label htmlFor="inStock">In Stock</Label>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={uploading}>
        {uploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {initialData.id ? 'Updating Product...' : 'Adding Product...'}
          </>
        ) : (
          initialData.id ? 'Update Product' : 'Add Product'
        )}
      </Button>
    </form>
  );
};

export default ProductForm;