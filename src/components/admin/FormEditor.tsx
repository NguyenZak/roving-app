"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, Edit3, Eye, RotateCcw } from "lucide-react";

interface FormContent {
  title: string;
  subtitle: string;
  fullNameLabel: string;
  fullNamePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  whatsappLabel: string;
  whatsappPlaceholder: string;
  quantityLabel: string;
  quantityPlaceholder: string;
  dateLabel: string;
  messageLabel: string;
  messagePlaceholder: string;
  submitButton: string;
  sendingText: string;
  successTitle: string;
  successMessage: string;
  sendAnotherButton: string;
}

const defaultFormContent: FormContent = {
  title: "Get In Touch With Us",
  subtitle: "Tell us about your dream vacation",
  fullNameLabel: "Full Name *",
  fullNamePlaceholder: "Enter your full name",
  emailLabel: "Email Address *",
  emailPlaceholder: "email@example.com",
  whatsappLabel: "WhatsApp",
  whatsappPlaceholder: "+84 123 456 789",
  quantityLabel: "Number of People *",
  quantityPlaceholder: "Number of participants",
  dateLabel: "Preferred Date *",
  messageLabel: "Message",
  messagePlaceholder: "Tell us about your dream vacation, destinations you want to explore, or any special requirements... (optional)",
  submitButton: "Send Message",
  sendingText: "Sending...",
  successTitle: "Message Sent Successfully!",
  successMessage: "Thank you for contacting us. We will respond as soon as possible within 24 hours.",
  sendAnotherButton: "Send Another Message"
};

export default function FormEditor() {
  const [formContent, setFormContent] = useState<FormContent>(defaultFormContent);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Load saved form content from localStorage or API
    const saved = localStorage.getItem('contactFormContent');
    if (saved) {
      try {
        setFormContent(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading saved form content:', error);
      }
    }
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Save to localStorage (you can also save to API/database)
      localStorage.setItem('contactFormContent', JSON.stringify(formContent));
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsEditing(false);
      alert('Form content saved successfully!');
    } catch (error) {
      console.error('Error saving form content:', error);
      alert('Error saving form content');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset to default content?')) {
      setFormContent(defaultFormContent);
      localStorage.removeItem('contactFormContent');
    }
  };

  const handleInputChange = (field: keyof FormContent, value: string) => {
    setFormContent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Contact Form Editor</h2>
          <p className="text-gray-600">Customize the content and labels of your contact form</p>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} className="flex items-center gap-2">
              <Edit3 className="h-4 w-4" />
              Edit Form
            </Button>
          ) : (
            <>
              <Button 
                onClick={handleSave} 
                disabled={isSaving}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              >
                <Save className="h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </>
          )}
          <Button 
            variant="outline" 
            onClick={handleReset}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset to Default
          </Button>
        </div>
      </div>

      {/* Form Content Editor */}
      <Card className="border-2 border-gray-100 shadow-sm pt-8 pb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit3 className="h-5 w-5" />
            Form Content Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Header Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Header Section</h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="title">Form Title</Label>
                <Input
                  id="title"
                  value={formContent.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Enter form title"
                />
              </div>
              
              <div>
                <Label htmlFor="subtitle">Form Subtitle</Label>
                <Input
                  id="subtitle"
                  value={formContent.subtitle}
                  onChange={(e) => handleInputChange('subtitle', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Enter form subtitle"
                />
              </div>
            </div>
          </div>

          {/* Form Fields Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Form Fields</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullNameLabel">Full Name Label</Label>
                <Input
                  id="fullNameLabel"
                  value={formContent.fullNameLabel}
                  onChange={(e) => handleInputChange('fullNameLabel', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Full Name *"
                />
              </div>
              
              <div>
                <Label htmlFor="fullNamePlaceholder">Full Name Placeholder</Label>
                <Input
                  id="fullNamePlaceholder"
                  value={formContent.fullNamePlaceholder}
                  onChange={(e) => handleInputChange('fullNamePlaceholder', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <Label htmlFor="emailLabel">Email Label</Label>
                <Input
                  id="emailLabel"
                  value={formContent.emailLabel}
                  onChange={(e) => handleInputChange('emailLabel', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Email Address *"
                />
              </div>
              
              <div>
                <Label htmlFor="emailPlaceholder">Email Placeholder</Label>
                <Input
                  id="emailPlaceholder"
                  value={formContent.emailPlaceholder}
                  onChange={(e) => handleInputChange('emailPlaceholder', e.target.value)}
                  disabled={!isEditing}
                  placeholder="email@example.com"
                />
              </div>
              
              <div>
                <Label htmlFor="whatsappLabel">WhatsApp Label</Label>
                <Input
                  id="whatsappLabel"
                  value={formContent.whatsappLabel}
                  onChange={(e) => handleInputChange('whatsappLabel', e.target.value)}
                  disabled={!isEditing}
                  placeholder="WhatsApp"
                />
              </div>
              
              <div>
                <Label htmlFor="whatsappPlaceholder">WhatsApp Placeholder</Label>
                <Input
                  id="whatsappPlaceholder"
                  value={formContent.whatsappPlaceholder}
                  onChange={(e) => handleInputChange('whatsappPlaceholder', e.target.value)}
                  disabled={!isEditing}
                  placeholder="+84 123 456 789"
                />
              </div>
              
              <div>
                <Label htmlFor="quantityLabel">Quantity Label</Label>
                <Input
                  id="quantityLabel"
                  value={formContent.quantityLabel}
                  onChange={(e) => handleInputChange('quantityLabel', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Number of People *"
                />
              </div>
              
              <div>
                <Label htmlFor="quantityPlaceholder">Quantity Placeholder</Label>
                <Input
                  id="quantityPlaceholder"
                  value={formContent.quantityPlaceholder}
                  onChange={(e) => handleInputChange('quantityPlaceholder', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Number of participants"
                />
              </div>
              
              <div>
                <Label htmlFor="dateLabel">Date Label</Label>
                <Input
                  id="dateLabel"
                  value={formContent.dateLabel}
                  onChange={(e) => handleInputChange('dateLabel', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Preferred Date *"
                />
              </div>
              
              <div>
                <Label htmlFor="messageLabel">Message Label</Label>
                <Input
                  id="messageLabel"
                  value={formContent.messageLabel}
                  onChange={(e) => handleInputChange('messageLabel', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Message"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="messagePlaceholder">Message Placeholder</Label>
              <Textarea
                id="messagePlaceholder"
                value={formContent.messagePlaceholder}
                onChange={(e) => handleInputChange('messagePlaceholder', e.target.value)}
                disabled={!isEditing}
                rows={3}
                placeholder="Enter message placeholder text"
              />
            </div>
          </div>

          {/* Buttons Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Buttons & Messages</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="submitButton">Submit Button Text</Label>
                <Input
                  id="submitButton"
                  value={formContent.submitButton}
                  onChange={(e) => handleInputChange('submitButton', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Send Message"
                />
              </div>
              
              <div>
                <Label htmlFor="sendingText">Sending Text</Label>
                <Input
                  id="sendingText"
                  value={formContent.sendingText}
                  onChange={(e) => handleInputChange('sendingText', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Sending..."
                />
              </div>
              
              <div>
                <Label htmlFor="successTitle">Success Title</Label>
                <Input
                  id="successTitle"
                  value={formContent.successTitle}
                  onChange={(e) => handleInputChange('successTitle', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Message Sent Successfully!"
                />
              </div>
              
              <div>
                <Label htmlFor="sendAnotherButton">Send Another Button</Label>
                <Input
                  id="sendAnotherButton"
                  value={formContent.sendAnotherButton}
                  onChange={(e) => handleInputChange('sendAnotherButton', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Send Another Message"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="successMessage">Success Message</Label>
              <Textarea
                id="successMessage"
                value={formContent.successMessage}
                onChange={(e) => handleInputChange('successMessage', e.target.value)}
                disabled={!isEditing}
                rows={3}
                placeholder="Enter success message"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview Section */}
      <Card className="border-2 border-gray-100 shadow-sm pt-8 pb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Form Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-6 rounded-lg border">
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">{formContent.title}</h3>
              <p className="text-gray-600">{formContent.subtitle}</p>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="font-medium">{formContent.fullNameLabel}:</span>
                <span className="text-gray-500">[Input field]</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">{formContent.emailLabel}:</span>
                <span className="text-gray-500">[Input field]</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">{formContent.whatsappLabel}:</span>
                <span className="text-gray-500">[Input field]</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">{formContent.quantityLabel}:</span>
                <span className="text-gray-500">[Input field]</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">{formContent.dateLabel}:</span>
                <span className="text-gray-500">[Input field]</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">{formContent.messageLabel}:</span>
                <span className="text-gray-500">[Textarea field]</span>
              </div>
              <div className="text-center pt-3">
                <span className="bg-blue-600 text-white px-4 py-2 rounded">[{formContent.submitButton}]</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
