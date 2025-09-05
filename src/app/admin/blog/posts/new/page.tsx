"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Save, Eye, Plus, X, FileText, Settings, Search, Calendar, User, Tag, Image, Globe } from "lucide-react";
import Link from "next/link";
import UnifiedImageUpload from "@/components/admin/UnifiedImageUpload";
import BlogEditor from "@/components/admin/BlogEditor";

export default function NewBlogPostPage() {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    status: "draft",
    category: "",
    tags: [] as string[],
    featuredImage: "",
    metaDescription: "",
    metaKeywords: "",
    author: "Admin",
    publishedAt: "",
    readingTime: ""
  });
  const [newTag, setNewTag] = useState("");
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Array<{id: string, name: string, slug: string}>>([]);
  const [activeTab, setActiveTab] = useState("content");
  const [origin, setOrigin] = useState('');
  const [mounted, setMounted] = useState(false);

  // Fetch categories from API
  useEffect(() => {
    fetchCategories();
  }, []);

  // Set origin for SEO preview
  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.items || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Auto-generate slug from title
    if (field === "title") {
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

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Here you would typically send the data to your API
      console.log("Creating blog post:", formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirect to blog posts list
      window.location.href = "/admin/blog";
    } catch (error) {
      console.error("Error creating blog post:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/admin/blog">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Blog
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">New Blog Post</h1>
                <p className="text-sm text-gray-500">Create and publish your content</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {saving ? "Saving..." : "Save Post"}
                <Save className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Editor */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="content" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Content
                </TabsTrigger>
                <TabsTrigger value="seo" className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  SEO
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </TabsTrigger>
              </TabsList>

              {/* Content Tab */}
              <TabsContent value="content" className="space-y-6">
                <Card>
                  <CardContent className="space-y-6 pb-8">
                    <div className="space-y-6 pt-8">
                      {/* Title */}
                      <div>
                        <Label htmlFor="title" className="text-base font-medium">Title *</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => handleInputChange("title", e.target.value)}
                          placeholder="Enter your blog post title..."
                          className="text-lg font-medium mt-2"
                          required
                        />
                      </div>

                      {/* Slug */}
                      <div>
                        <Label htmlFor="slug" className="text-base font-medium">URL Slug *</Label>
                        <Input
                          id="slug"
                          value={formData.slug}
                          onChange={(e) => handleInputChange("slug", e.target.value)}
                          placeholder="url-friendly-slug"
                          className="mt-2"
                          required
                        />
                      </div>

                      {/* Excerpt */}
                      <div>
                        <Label htmlFor="excerpt" className="text-base font-medium">Excerpt</Label>
                        <Textarea
                          id="excerpt"
                          value={formData.excerpt}
                          onChange={(e) => handleInputChange("excerpt", e.target.value)}
                          placeholder="Write a brief description of your blog post..."
                          rows={3}
                          className="mt-2"
                        />
                      </div>

                      {/* Content Editor */}
                      <div>
                        <Label className="text-base font-medium">Content *</Label>
                        <div className="mt-2">
                          <BlogEditor
                            content={formData.content}
                            onChange={(content) => handleInputChange("content", content)}
                            placeholder="Start writing your blog post content..."
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* SEO Tab */}
              <TabsContent value="seo" className="space-y-6">
                <Card>
                  <CardHeader className="pt-8">
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      SEO Settings  
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 pb-8">
                    <div>
                      <Label htmlFor="metaDescription" className="text-base font-medium">Meta Description</Label>
                      <Textarea
                        id="metaDescription"
                        value={formData.metaDescription}
                        onChange={(e) => handleInputChange("metaDescription", e.target.value)}
                        placeholder="Brief description for search engines (150-160 characters)"
                        rows={3}
                        className="mt-2"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        {formData.metaDescription.length}/160 characters
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="metaKeywords" className="text-base font-medium">Meta Keywords</Label>
                      <Input
                        id="metaKeywords"
                        value={formData.metaKeywords}
                        onChange={(e) => handleInputChange("metaKeywords", e.target.value)}
                        placeholder="keyword1, keyword2, keyword3"
                        className="mt-2"
                      />
                    </div>

                    {/* SEO Preview */}
                    <div>
                      <Label className="text-base font-medium">Search Preview</Label>
                      <div className="mt-2 p-4 border border-gray-200 rounded-lg bg-gray-50">
                        <div className="text-blue-600 text-sm font-medium">
                          {formData.title || "Your blog post title"}
                        </div>
                        <div className="text-green-600 text-xs mt-1">
                          {mounted ? `${origin}/blog/${formData.slug || "your-slug"}` : "Loading..."}
                        </div>
                        <div className="text-gray-600 text-sm mt-1">
                          {formData.metaDescription || formData.excerpt || "Your blog post description will appear here..."}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="space-y-6">
                <Card>
                  <CardHeader className="pt-8">
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Post Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 pb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="status" className="text-base font-medium">Status</Label>
                        <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                          <SelectTrigger className="mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="category" className="text-base font-medium">Category</Label>
                        <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.name}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="author" className="text-base font-medium">Author</Label>
                        <Input
                          id="author"
                          value={formData.author}
                          onChange={(e) => handleInputChange("author", e.target.value)}
                          placeholder="Author name"
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label htmlFor="publishedAt" className="text-base font-medium">Publish Date</Label>
                        <Input
                          id="publishedAt"
                          type="datetime-local"
                          value={formData.publishedAt}
                          onChange={(e) => handleInputChange("publishedAt", e.target.value)}
                          className="mt-2"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Featured Image */}
            <Card>
              <CardHeader className="pt-8">
                <CardTitle className="flex items-center gap-2">
                  <Image className="h-5 w-5" />
                  Featured Image
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pb-8">
                <UnifiedImageUpload
                  label="Featured Image"
                  value={formData.featuredImage}
                  onChange={(value) => handleInputChange("featuredImage", value)}
                />
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader className="pt-8">
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Tags
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pb-8">
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add tag"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Post Stats */}
            <Card>
              <CardHeader className="pt-8">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Post Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Words:</span>
                  <span className="font-medium">{formData.content.split(' ').filter(word => word.length > 0).length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Characters:</span>
                  <span className="font-medium">{formData.content.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Reading Time:</span>
                  <span className="font-medium">{Math.ceil(formData.content.split(' ').length / 200)} min</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
