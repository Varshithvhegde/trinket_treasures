// Admin Dashboard - Collections Page
"use client"
import React, { useState, useEffect, useRef } from 'react';
import { Plus, Loader2, Search, Filter, MoreVertical, Edit, Trash2, Upload } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { storage } from '@/lib/firebase-client';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const CollectionForm = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState(initialData);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(initialData.imageURL);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    
    try {
      let imageURL = formData.imageURL;
      
      if (imageFile) {
        const fileName = `collections/${Date.now()}-${imageFile.name}`;
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Collection Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Collection Image</Label>
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
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={uploading}>
        {uploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {initialData.id ? 'Updating Collection...' : 'Adding Collection...'}
          </>
        ) : (
          initialData.id ? 'Update Collection' : 'Add Collection'
        )}
      </Button>
    </form>
  );
};

const CollectionsDashboard = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const defaultCollection = {
    name: '',
    description: '',
    imageURL: '',
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const response = await fetch('/api/collections');
      const data = await response.json();
      setCollections(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching collections:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    const method = editingCollection ? 'PUT' : 'POST';
    const body = editingCollection 
      ? { id: editingCollection.id, ...formData }
      : { ...formData, createdAt: new Date().toISOString() };

    try {
      await fetch('/api/collections', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      fetchCollections();
      setIsDialogOpen(false);
      setEditingCollection(null);
    } catch (error) {
      console.error('Error saving collection:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch('/api/collections', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      fetchCollections();
    } catch (error) {
      console.error('Error deleting collection:', error);
    }
  };

  const handleEdit = (collection) => {
    setEditingCollection(collection);
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingCollection(null);
    setIsDialogOpen(true);
  };

  const filteredCollections = collections.filter(collection =>
    collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    collection.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Collection Management</h1>
          <p className="text-gray-500">Manage your product collections</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew} className="flex items-center gap-2">
              <Plus size={20} />
              Add Collection
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {editingCollection ? 'Edit Collection' : 'Add New Collection'}
              </DialogTitle>
            </DialogHeader>
            <CollectionForm 
              onSubmit={handleSubmit}
              initialData={editingCollection || defaultCollection}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Collections</CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search collections..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-gray-50">
                  <tr>
                    <th className="px-6 py-3">Collection</th>
                    <th className="px-6 py-3">Description</th>
                    <th className="px-6 py-3">Created At</th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCollections.map((collection) => (
                    <tr key={collection.id} className="border-b">
                      <td className="px-6 py-4 flex items-center gap-3">
                        <img
                          src={collection.imageURL || "/api/placeholder/40/40"}
                          alt={collection.name}
                          className="w-10 h-10 rounded object-cover"
                        />
                        <div className="font-medium">{collection.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-500">{collection.description.substring(0, 100)}...</div>
                      </td>
                      <td className="px-6 py-4">
                        {new Date(collection.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(collection)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleDelete(collection.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CollectionsDashboard;