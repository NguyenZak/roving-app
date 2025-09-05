"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Tag } from "lucide-react";

interface BlogTag {
  id: string;
  name: string;
  slug: string;
  postCount: number;
  createdAt: string;
}

export default function BlogTagsPage() {
  const [tags, setTags] = useState<BlogTag[]>([
    {
      id: "1",
      name: "Hanoi",
      slug: "hanoi",
      postCount: 8,
      createdAt: "2024-01-01"
    },
    {
      id: "2",
      name: "Travel Guide",
      slug: "travel-guide",
      postCount: 12,
      createdAt: "2024-01-02"
    },
    {
      id: "3",
      name: "Vietnam",
      slug: "vietnam",
      postCount: 25,
      createdAt: "2024-01-03"
    },
    {
      id: "4",
      name: "Street Food",
      slug: "street-food",
      postCount: 6,
      createdAt: "2024-01-04"
    },
    {
      id: "5",
      name: "Ha Long Bay",
      slug: "ha-long-bay",
      postCount: 4,
      createdAt: "2024-01-05"
    },
    {
      id: "6",
      name: "Adventure",
      slug: "adventure",
      postCount: 7,
      createdAt: "2024-01-06"
    },
    {
      id: "7",
      name: "Culture",
      slug: "culture",
      postCount: 9,
      createdAt: "2024-01-07"
    },
    {
      id: "8",
      name: "Photography",
      slug: "photography",
      postCount: 5,
      createdAt: "2024-01-08"
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingTag, setEditingTag] = useState<BlogTag | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Auto-generate slug from name
    if (field === "name") {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      setFormData(prev => ({
        ...prev,
        slug: slug
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingTag) {
      // Update existing tag
      setTags(prev => prev.map(tag => 
        tag.id === editingTag.id 
          ? { ...tag, ...formData }
          : tag
      ));
    } else {
      // Add new tag
      const newTag: BlogTag = {
        id: Date.now().toString(),
        ...formData,
        postCount: 0,
        createdAt: new Date().toISOString()
      };
      setTags(prev => [...prev, newTag]);
    }

    // Reset form
    setFormData({ name: "", slug: "" });
    setShowForm(false);
    setEditingTag(null);
  };

  const handleEdit = (tag: BlogTag) => {
    setEditingTag(tag);
    setFormData({
      name: tag.name,
      slug: tag.slug
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this tag?")) {
      setTags(prev => prev.filter(tag => tag.id !== id));
    }
  };

  const handleCancel = () => {
    setFormData({ name: "", slug: "" });
    setShowForm(false);
    setEditingTag(null);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blog Tags</h1>
          <p className="text-gray-600 mt-1">Manage blog post tags</p>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Tag
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              {editingTag ? "Edit Tag" : "New Tag"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Tag name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => handleInputChange("slug", e.target.value)}
                  placeholder="tag-slug"
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  {editingTag ? "Update Tag" : "Create Tag"}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Tags Grid */}
      <Card>
        <CardHeader>
          <CardTitle>All Tags</CardTitle>
        </CardHeader>
        <CardContent>
          {tags.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-500 mb-4">No tags found</div>
              <Button onClick={() => setShowForm(true)}>
                Create Your First Tag
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tags.map((tag) => (
                <div
                  key={tag.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Tag className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {tag.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {tag.slug}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <Badge variant="outline">
                        {tag.postCount} posts
                      </Badge>
                      <span>
                        Created {new Date(tag.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEdit(tag)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDelete(tag.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
