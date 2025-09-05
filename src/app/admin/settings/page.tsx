"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { 
  Save, 
  Globe, 
  Mail, 
  Phone, 
  Settings as SettingsIcon,
  Palette,
  Shield
} from "lucide-react";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    // General Settings
    siteName: "Roving Vietnam Travel",
    siteDescription: "Discover the beauty of Vietnam with our authentic travel experiences",
    defaultLanguage: "en",
    timezone: "Asia/Ho_Chi_Minh",
    
    // Contact Information
    contactEmail: "info@roving.com",
    contactPhone: "+84 123 456 789",
    contactAddress: "123 Travel Street, Ho Chi Minh City, Vietnam",
    
    // Social Media
    facebookUrl: "https://facebook.com/rovingvietnam",
    instagramUrl: "https://instagram.com/rovingvietnam",
    twitterUrl: "https://twitter.com/rovingvietnam",
    
    // Email Settings
    smtpHost: "smtp.gmail.com",
    smtpPort: "587",
    smtpUser: "noreply@roving.com",
    smtpPassword: "",
    
    // Features
    enableBooking: true,
    enableReviews: true,
    enableNewsletter: true,
    enableMaintenance: false,
    
    // SEO
    googleAnalytics: "",
    metaTitle: "Roving Vietnam Travel - Authentic Vietnam Tours",
    metaDescription: "Discover Vietnam with our authentic travel experiences. Book tours to Ha Long Bay, Sapa, Hoi An and more.",
    
    // Security
    enableTwoFactor: false,
    sessionTimeout: "24",
    maxLoginAttempts: "5"
  });

  const handleInputChange = (key: string, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });
      
      if (response.ok) {
        alert('Settings saved successfully!');
      } else {
        alert('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings');
    }
  };

  return (
    <AdminPageWrapper className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between pb-6 border-b">
        <div>
          <h1 className="text-3xl font-inter-bold tracking-tight text-gray-900">Settings</h1>
          <p className="mt-2 text-gray-600 font-inter-normal">
            Manage your website configuration and preferences.
          </p>
        </div>
        <Button onClick={handleSave} className="px-6 py-3 font-inter-medium">
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* General Settings */}
        <Card className="border-2 border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl font-inter-semibold text-gray-900">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Globe className="h-6 w-6 text-blue-600" />
              </div>
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 px-6 pb-6">
            <div className="space-y-3">
              <Label htmlFor="siteName" className="text-sm font-inter-medium text-gray-700">Site Name</Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) => handleInputChange('siteName', e.target.value)}
                className="h-11 px-4 font-inter-normal border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="siteDescription" className="text-sm font-inter-medium text-gray-700">Site Description</Label>
              <Textarea
                id="siteDescription"
                value={settings.siteDescription}
                onChange={(e) => handleInputChange('siteDescription', e.target.value)}
                rows={3}
                className="px-4 py-3 font-inter-normal border-gray-200 focus:border-blue-500 focus:ring-blue-500 resize-none"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="defaultLanguage" className="text-sm font-inter-medium text-gray-700">Default Language</Label>
              <select
                id="defaultLanguage"
                value={settings.defaultLanguage}
                onChange={(e) => handleInputChange('defaultLanguage', e.target.value)}
                className="w-full h-11 px-4 py-2 border border-gray-200 rounded-md font-inter-normal focus:border-blue-500 focus:ring-blue-500 bg-white"
              >
                <option value="en">English</option>
                <option value="vi">Vietnamese</option>
              </select>
            </div>
            <div className="space-y-3">
              <Label htmlFor="timezone" className="text-sm font-inter-medium text-gray-700">Timezone</Label>
              <Input
                id="timezone"
                value={settings.timezone}
                onChange={(e) => handleInputChange('timezone', e.target.value)}
                className="h-11 px-4 font-inter-normal border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="border-2 border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl font-inter-semibold text-gray-900">
              <div className="p-2 bg-green-50 rounded-lg">
                <Phone className="h-6 w-6 text-green-600" />
              </div>
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 px-6 pb-6">
            <div className="space-y-3">
              <Label htmlFor="contactEmail" className="text-sm font-inter-medium text-gray-700">Contact Email</Label>
              <Input
                id="contactEmail"
                type="email"
                value={settings.contactEmail}
                onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                className="h-11 px-4 font-inter-normal border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="contactPhone" className="text-sm font-inter-medium text-gray-700">Contact Phone</Label>
              <Input
                id="contactPhone"
                value={settings.contactPhone}
                onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                className="h-11 px-4 font-inter-normal border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="contactAddress" className="text-sm font-inter-medium text-gray-700">Address</Label>
              <Textarea
                id="contactAddress"
                value={settings.contactAddress}
                onChange={(e) => handleInputChange('contactAddress', e.target.value)}
                rows={3}
                className="px-4 py-3 font-inter-normal border-gray-200 focus:border-blue-500 focus:ring-blue-500 resize-none"
              />
            </div>
          </CardContent>
        </Card>

        {/* Social Media */}
        <Card className="border-2 border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl font-inter-semibold text-gray-900">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Globe className="h-6 w-6 text-purple-600" />
              </div>
              Social Media
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 px-6 pb-6">
            <div className="space-y-3">
              <Label htmlFor="facebookUrl" className="text-sm font-inter-medium text-gray-700">Facebook URL</Label>
              <Input
                id="facebookUrl"
                value={settings.facebookUrl}
                onChange={(e) => handleInputChange('facebookUrl', e.target.value)}
                className="h-11 px-4 font-inter-normal border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="instagramUrl" className="text-sm font-inter-medium text-gray-700">Instagram URL</Label>
              <Input
                id="instagramUrl"
                value={settings.instagramUrl}
                onChange={(e) => handleInputChange('instagramUrl', e.target.value)}
                className="h-11 px-4 font-inter-normal border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="twitterUrl" className="text-sm font-inter-medium text-gray-700">Twitter URL</Label>
              <Input
                id="twitterUrl"
                value={settings.twitterUrl}
                onChange={(e) => handleInputChange('twitterUrl', e.target.value)}
                className="h-11 px-4 font-inter-normal border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </CardContent>
        </Card>

        {/* Email Settings */}
        <Card className="border-2 border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl font-inter-semibold text-gray-900">
              <div className="p-2 bg-orange-50 rounded-lg">
                <Mail className="h-6 w-6 text-orange-600" />
              </div>
              Email Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 px-6 pb-6">
            <div className="space-y-3">
              <Label htmlFor="smtpHost" className="text-sm font-inter-medium text-gray-700">SMTP Host</Label>
              <Input
                id="smtpHost"
                value={settings.smtpHost}
                onChange={(e) => handleInputChange('smtpHost', e.target.value)}
                className="h-11 px-4 font-inter-normal border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="smtpPort" className="text-sm font-inter-medium text-gray-700">SMTP Port</Label>
              <Input
                id="smtpPort"
                value={settings.smtpPort}
                onChange={(e) => handleInputChange('smtpPort', e.target.value)}
                className="h-11 px-4 font-inter-normal border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="smtpUser" className="text-sm font-inter-medium text-gray-700">SMTP Username</Label>
              <Input
                id="smtpUser"
                value={settings.smtpUser}
                onChange={(e) => handleInputChange('smtpUser', e.target.value)}
                className="h-11 px-4 font-inter-normal border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="smtpPassword" className="text-sm font-inter-medium text-gray-700">SMTP Password</Label>
              <Input
                id="smtpPassword"
                type="password"
                value={settings.smtpPassword}
                onChange={(e) => handleInputChange('smtpPassword', e.target.value)}
                className="h-11 px-4 font-inter-normal border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card className="border-2 border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl font-inter-semibold text-gray-900">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <SettingsIcon className="h-6 w-6 text-indigo-600" />
              </div>
              Features
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 px-6 pb-6">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <Label htmlFor="enableBooking" className="text-sm font-inter-medium text-gray-700">Enable Booking System</Label>
              <Switch
                id="enableBooking"
                checked={settings.enableBooking}
                onCheckedChange={(checked: boolean) => handleInputChange('enableBooking', checked)}
              />
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <Label htmlFor="enableReviews" className="text-sm font-inter-medium text-gray-700">Enable Reviews</Label>
              <Switch
                id="enableReviews"
                checked={settings.enableReviews}
                onCheckedChange={(checked: boolean) => handleInputChange('enableReviews', checked)}
              />
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <Label htmlFor="enableNewsletter" className="text-sm font-inter-medium text-gray-700">Enable Newsletter</Label>
              <Switch
                id="enableNewsletter"
                checked={settings.enableNewsletter}
                onCheckedChange={(checked: boolean) => handleInputChange('enableNewsletter', checked)}
              />
            </div>
            <div className="flex items-center justify-between py-3">
              <Label htmlFor="enableMaintenance" className="text-sm font-inter-medium text-gray-700">Maintenance Mode</Label>
              <Switch
                id="enableMaintenance"
                checked={settings.enableMaintenance}
                onCheckedChange={(checked: boolean) => handleInputChange('enableMaintenance', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* SEO Settings */}
        <Card className="border-2 border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl font-inter-semibold text-gray-900">
              <div className="p-2 bg-pink-50 rounded-lg">
                <Palette className="h-6 w-6 text-pink-600" />
              </div>
              SEO Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 px-6 pb-6">
            <div className="space-y-3">
              <Label htmlFor="googleAnalytics" className="text-sm font-inter-medium text-gray-700">Google Analytics ID</Label>
              <Input
                id="googleAnalytics"
                value={settings.googleAnalytics}
                onChange={(e) => handleInputChange('googleAnalytics', e.target.value)}
                placeholder="GA_MEASUREMENT_ID"
                className="h-11 px-4 font-inter-normal border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="metaTitle" className="text-sm font-inter-medium text-gray-700">Default Meta Title</Label>
              <Input
                id="metaTitle"
                value={settings.metaTitle}
                onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                className="h-11 px-4 font-inter-normal border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="metaDescription" className="text-sm font-inter-medium text-gray-700">Default Meta Description</Label>
              <Textarea
                id="metaDescription"
                value={settings.metaDescription}
                onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                rows={3}
                className="px-4 py-3 font-inter-normal border-gray-200 focus:border-blue-500 focus:ring-blue-500 resize-none"
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="border-2 border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl font-inter-semibold text-gray-900">
              <div className="p-2 bg-red-50 rounded-lg">
                <Shield className="h-6 w-6 text-red-600" />
              </div>
              Security Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 px-6 pb-6">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <Label htmlFor="enableTwoFactor" className="text-sm font-inter-medium text-gray-700">Enable Two-Factor Authentication</Label>
              <Switch
                id="enableTwoFactor"
                checked={settings.enableTwoFactor}
                onCheckedChange={(checked: boolean) => handleInputChange('enableTwoFactor', checked)}
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="sessionTimeout" className="text-sm font-inter-medium text-gray-700">Session Timeout (hours)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => handleInputChange('sessionTimeout', e.target.value)}
                className="h-11 px-4 font-inter-normal border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="maxLoginAttempts" className="text-sm font-inter-medium text-gray-700">Max Login Attempts</Label>
              <Input
                id="maxLoginAttempts"
                type="number"
                value={settings.maxLoginAttempts}
                onChange={(e) => handleInputChange('maxLoginAttempts', e.target.value)}
                className="h-11 px-4 font-inter-normal border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminPageWrapper>
  );
}
