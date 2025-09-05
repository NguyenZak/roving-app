"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
  Palette, 
  Type, 
  Layout, 
  Save, 
  Eye
} from "lucide-react";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";

type AppearanceSettings = {
  theme: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  fontSize: string;
  containerWidth: string;
  borderRadius: string;
  showHeader: boolean;
  showFooter: boolean;
  siteName: string;
  siteDescription: string;
  currency: string;
};

export default function AppearancePage() {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<AppearanceSettings>({
    theme: "light",
    primaryColor: "#3B82F6",
    secondaryColor: "#10B981",
    fontFamily: "Inter",
    fontSize: "16px",
    containerWidth: "1200px",
    borderRadius: "8px",
    showHeader: true,
    showFooter: true,
    siteName: "Roving Travel",
    siteDescription: "Discover amazing travel experiences",
    currency: "VND"
  });

  function handleSettingChange<K extends keyof AppearanceSettings>(key: K, value: AppearanceSettings[K]) {
    setSettings(prev => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
  }

  return (
    <AdminPageWrapper>
      {/* Page Header */}
      <div className="space-y-4 pb-6 border-b">
        <div>
          <h1 className="text-3xl font-inter-bold tracking-tight text-gray-900">Appearance</h1>
          <p className="mt-2 text-gray-600 font-inter-normal">Customize the look and feel of your website.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="font-inter-medium">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button onClick={handleSave} disabled={loading} className="font-inter-medium">
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Theme Settings */}
        <Card className="border-2 border-gray-100 shadow-sm">
          <CardHeader className="pt-8 pb-6 px-6 bg-gradient-to-r from-purple-50 to-violet-50 border-b border-gray-100">
            <CardTitle className="flex items-center gap-4 text-2xl font-inter-bold text-gray-900">
              <div className="p-3 bg-white rounded-xl shadow-sm border border-purple-100">
                <Palette className="h-7 w-7 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-inter-bold text-gray-900">Theme Settings</div>
                <div className="text-sm font-inter-normal text-gray-600 mt-1">Customize colors and theme</div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-3">
                <Label className="text-sm font-inter-medium text-gray-700">Theme Mode</Label>
                <Select value={settings.theme} onValueChange={(value) => handleSettingChange('theme', value)}>
                  <SelectTrigger className="h-11 font-inter-normal">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="auto">Auto</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-inter-medium text-gray-700">Primary Color</Label>
                <div className="flex items-center gap-3">
                  <Input
                    type="color"
                    value={settings.primaryColor}
                    onChange={(e) => handleSettingChange('primaryColor', e.target.value)}
                    className="w-16 h-11 p-1 border rounded-lg"
                  />
                  <Input
                    value={settings.primaryColor}
                    onChange={(e) => handleSettingChange('primaryColor', e.target.value)}
                    className="h-11 font-mono text-sm"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-inter-medium text-gray-700">Secondary Color</Label>
                <div className="flex items-center gap-3">
                  <Input
                    type="color"
                    value={settings.secondaryColor}
                    onChange={(e) => handleSettingChange('secondaryColor', e.target.value)}
                    className="w-16 h-11 p-1 border rounded-lg"
                  />
                  <Input
                    value={settings.secondaryColor}
                    onChange={(e) => handleSettingChange('secondaryColor', e.target.value)}
                    className="h-11 font-mono text-sm"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-inter-medium text-gray-700">Border Radius</Label>
                <Select value={settings.borderRadius} onValueChange={(value) => handleSettingChange('borderRadius', value)}>
                  <SelectTrigger className="h-11 font-inter-normal">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0px">None</SelectItem>
                    <SelectItem value="4px">Small</SelectItem>
                    <SelectItem value="8px">Medium</SelectItem>
                    <SelectItem value="12px">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Typography */}
        <Card className="border-2 border-gray-100 shadow-sm">
          <CardHeader className="pt-8 pb-6 px-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
            <CardTitle className="flex items-center gap-4 text-2xl font-inter-bold text-gray-900">
              <div className="p-3 bg-white rounded-xl shadow-sm border border-blue-100">
                <Type className="h-7 w-7 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-inter-bold text-gray-900">Typography</div>
                <div className="text-sm font-inter-normal text-gray-600 mt-1">Customize fonts and text styling</div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="text-sm font-inter-medium text-gray-700">Font Family</Label>
                <Select value={settings.fontFamily} onValueChange={(value) => handleSettingChange('fontFamily', value)}>
                  <SelectTrigger className="h-11 font-inter-normal">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Inter">Inter</SelectItem>
                    <SelectItem value="Roboto">Roboto</SelectItem>
                    <SelectItem value="Open Sans">Open Sans</SelectItem>
                    <SelectItem value="Poppins">Poppins</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-inter-medium text-gray-700">Font Size</Label>
                <Select value={settings.fontSize} onValueChange={(value) => handleSettingChange('fontSize', value)}>
                  <SelectTrigger className="h-11 font-inter-normal">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="14px">Small (14px)</SelectItem>
                    <SelectItem value="16px">Medium (16px)</SelectItem>
                    <SelectItem value="18px">Large (18px)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Layout Settings */}
        <Card className="border-2 border-gray-100 shadow-sm">
          <CardHeader className="pt-8 pb-6 px-6 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-100">
            <CardTitle className="flex items-center gap-4 text-2xl font-inter-bold text-gray-900">
              <div className="p-3 bg-white rounded-xl shadow-sm border border-green-100">
                <Layout className="h-7 w-7 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-inter-bold text-gray-900">Layout Settings</div>
                <div className="text-sm font-inter-normal text-gray-600 mt-1">Configure layout and spacing</div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="text-sm font-inter-medium text-gray-700">Container Width</Label>
                <Select value={settings.containerWidth} onValueChange={(value) => handleSettingChange('containerWidth', value)}>
                  <SelectTrigger className="h-11 font-inter-normal">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1000px">Narrow (1000px)</SelectItem>
                    <SelectItem value="1200px">Standard (1200px)</SelectItem>
                    <SelectItem value="1400px">Wide (1400px)</SelectItem>
                    <SelectItem value="100%">Full Width</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-inter-medium text-gray-700">Site Name</Label>
                <Input
                  value={settings.siteName}
                  onChange={(e) => handleSettingChange('siteName', e.target.value)}
                  className="h-11 font-inter-normal"
                  placeholder="Enter site name"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-inter-medium text-gray-700">Site Description</Label>
                <Input
                  value={settings.siteDescription}
                  onChange={(e) => handleSettingChange('siteDescription', e.target.value)}
                  className="h-11 font-inter-normal"
                  placeholder="Enter site description"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-inter-medium text-gray-700">Currency</Label>
                <Select value={settings.currency} onValueChange={(value) => handleSettingChange('currency', value)}>
                  <SelectTrigger className="h-11 font-inter-normal">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VND">VND (₫)</SelectItem>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-inter-medium text-gray-700">Show Header</Label>
                  <Switch
                    checked={settings.showHeader}
                    onCheckedChange={(checked) => handleSettingChange('showHeader', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-inter-medium text-gray-700">Show Footer</Label>
                  <Switch
                    checked={settings.showFooter}
                    onCheckedChange={(checked) => handleSettingChange('showFooter', checked)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminPageWrapper>
  );
}
