"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, Edit3, Eye, RotateCcw, Mail, Send } from "lucide-react";

interface EmailContent {
  // Confirmation Email
  confirmationSubject: string;
  confirmationGreeting: string;
  confirmationIntro: string;
  confirmationDetails: string;
  confirmationResponse: string;
  confirmationFooter: string;
  confirmationSignature: string;
  
  // Admin Notification Email
  adminSubject: string;
  adminGreeting: string;
  adminIntro: string;
  adminDetails: string;
  adminAction: string;
  adminFooter: string;
  adminSignature: string;
}

const defaultEmailContent: EmailContent = {
  // Confirmation Email
  confirmationSubject: "Thank you for contacting Roving Vietnam Travel!",
  confirmationGreeting: "Dear {fullName},",
  confirmationIntro: "Thank you for reaching out to us about your dream vacation in Vietnam. We have received your inquiry and are excited to help you plan an unforgettable journey.",
  confirmationDetails: "Here are the details of your request:\n\n• Number of People: {quantity}\n• Preferred Date: {date}\n• Message: {message}\n• Contact: {email}",
  confirmationResponse: "Our travel experts will review your request and get back to you within 24 hours with a personalized travel proposal. We'll work closely with you to create the perfect itinerary that matches your interests and preferences.",
  confirmationFooter: "If you have any urgent questions, feel free to contact us directly at +84 123 456 789 or reply to this email.",
  confirmationSignature: "Best regards,\nThe Roving Vietnam Travel Team\n\n🌏 Discover Vietnam - Live Fully in Every Journey",
  
  // Admin Notification Email
  adminSubject: "New Contact Form Submission - {fullName}",
  adminGreeting: "Hello Admin,",
  adminIntro: "A new contact form has been submitted through the website. Here are the details:",
  adminDetails: "Customer Information:\n\n• Full Name: {fullName}\n• Email: {email}\n• WhatsApp: {whatsapp}\n• Number of People: {quantity}\n• Preferred Date: {date}\n• Message: {message}",
  adminAction: "Please respond to this inquiry within 24 hours to provide excellent customer service and convert this lead into a booking opportunity.",
  adminFooter: "You can contact the customer directly or use our CRM system to manage this lead.",
  adminSignature: "Best regards,\nRoving Vietnam Travel System"
};

export default function EmailEditor() {
  const [emailContent, setEmailContent] = useState<EmailContent>(defaultEmailContent);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'confirmation' | 'admin'>('confirmation');

  useEffect(() => {
    // Load saved email content from localStorage
    const saved = localStorage.getItem('emailContent');
    if (saved) {
      try {
        setEmailContent(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading saved email content:', error);
      }
    }
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Save to localStorage (you can also save to API/database)
      localStorage.setItem('emailContent', JSON.stringify(emailContent));
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsEditing(false);
      alert('Email content saved successfully!');
    } catch (error) {
      console.error('Error saving email content:', error);
      alert('Error saving email content');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset to default email content?')) {
      setEmailContent(defaultEmailContent);
      localStorage.removeItem('emailContent');
    }
  };

  const handleInputChange = (field: keyof EmailContent, value: string) => {
    setEmailContent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const renderPreview = (type: 'confirmation' | 'admin') => {
    const sampleData = {
      fullName: "John Smith",
      email: "john.smith@example.com",
      whatsapp: "+84 123 456 789",
      quantity: 2,
      date: "2024-12-25",
      message: "I'm interested in a cultural tour of Northern Vietnam for my family."
    };

    let previewContent = "";
    let previewSubject = "";

    if (type === 'confirmation') {
      previewSubject = emailContent.confirmationSubject;
      previewContent = `
${emailContent.confirmationGreeting.replace('{fullName}', sampleData.fullName)}

${emailContent.confirmationIntro}

${emailContent.confirmationDetails.replace('{quantity}', sampleData.quantity.toString())
  .replace('{date}', sampleData.date)
  .replace('{message}', sampleData.message)
  .replace('{email}', sampleData.email)}

${emailContent.confirmationResponse}

${emailContent.confirmationFooter}

${emailContent.confirmationSignature}
      `.trim();
    } else {
      previewSubject = emailContent.adminSubject.replace('{fullName}', sampleData.fullName);
      previewContent = `
${emailContent.adminGreeting}

${emailContent.adminIntro}

${emailContent.adminDetails.replace('{fullName}', sampleData.fullName)
  .replace('{email}', sampleData.email)
  .replace('{whatsapp}', sampleData.whatsapp)
  .replace('{quantity}', sampleData.quantity.toString())
  .replace('{date}', sampleData.date)
  .replace('{message}', sampleData.message)}

${emailContent.adminAction}

${emailContent.adminFooter}

${emailContent.adminSignature}
      `.trim();
    }

    return (
      <div className="bg-gray-50 p-6 rounded-lg border">
        <div className="mb-4">
          <h4 className="font-semibold text-gray-900 mb-2">Subject:</h4>
          <p className="text-gray-700 bg-white p-3 rounded border">{previewSubject}</p>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Content:</h4>
          <div className="bg-white p-4 rounded border">
            <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">{previewContent}</pre>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Email Template Editor</h2>
          <p className="text-gray-600">Customize the content of your confirmation and admin notification emails</p>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} className="flex items-center gap-2">
              <Edit3 className="h-4 w-4" />
              Edit Templates
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

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('confirmation')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'confirmation'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Mail className="h-4 w-4" />
          Confirmation Email
        </button>
        <button
          onClick={() => setActiveTab('admin')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'admin'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Send className="h-4 w-4" />
          Admin Notification
        </button>
      </div>

      {/* Email Content Editor */}
      <Card className="border-2 border-gray-100 shadow-sm pt-8 pb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {activeTab === 'confirmation' ? (
              <>
                <Mail className="h-5 w-5" />
                Confirmation Email Template
              </>
            ) : (
              <>
                <Send className="h-5 w-5" />
                Admin Notification Email Template
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {activeTab === 'confirmation' ? (
            // Confirmation Email Fields
            <>
              <div>
                <Label htmlFor="confirmationSubject">Email Subject</Label>
                <Input
                  id="confirmationSubject"
                  value={emailContent.confirmationSubject}
                  onChange={(e) => handleInputChange('confirmationSubject', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Thank you for contacting us!"
                />
              </div>
              
              <div>
                <Label htmlFor="confirmationGreeting">Greeting</Label>
                <Input
                  id="confirmationGreeting"
                  value={emailContent.confirmationGreeting}
                  onChange={(e) => handleInputChange('confirmationGreeting', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Dear {fullName},"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Use {'{fullName}'} to include the customer's name
                </p>
              </div>
              
              <div>
                <Label htmlFor="confirmationIntro">Introduction</Label>
                <Textarea
                  id="confirmationIntro"
                  value={emailContent.confirmationIntro}
                  onChange={(e) => handleInputChange('confirmationIntro', e.target.value)}
                  disabled={!isEditing}
                  rows={3}
                  placeholder="Thank you for reaching out to us..."
                />
              </div>
              
              <div>
                <Label htmlFor="confirmationDetails">Request Details</Label>
                <Textarea
                  id="confirmationDetails"
                  value={emailContent.confirmationDetails}
                  onChange={(e) => handleInputChange('confirmationDetails', e.target.value)}
                  disabled={!isEditing}
                  rows={6}
                  placeholder="Here are the details of your request..."
                />
                <p className="text-sm text-gray-500 mt-1">
                  Available variables: {'{fullName}'}, {'{email}'}, {'{whatsapp}'}, {'{quantity}'}, {'{date}'}, {'{message}'}
                </p>
              </div>
              
              <div>
                <Label htmlFor="confirmationResponse">Response Promise</Label>
                <Textarea
                  id="confirmationResponse"
                  value={emailContent.confirmationResponse}
                  onChange={(e) => handleInputChange('confirmationResponse', e.target.value)}
                  disabled={!isEditing}
                  rows={4}
                  placeholder="Our travel experts will review your request..."
                />
              </div>
              
              <div>
                <Label htmlFor="confirmationFooter">Footer Information</Label>
                <Textarea
                  id="confirmationFooter"
                  value={emailContent.confirmationFooter}
                  onChange={(e) => handleInputChange('confirmationFooter', e.target.value)}
                  disabled={!isEditing}
                  rows={3}
                  placeholder="If you have any urgent questions..."
                />
              </div>
              
              <div>
                <Label htmlFor="confirmationSignature">Signature</Label>
                <Textarea
                  id="confirmationSignature"
                  value={emailContent.confirmationSignature}
                  onChange={(e) => handleInputChange('confirmationSignature', e.target.value)}
                  disabled={!isEditing}
                  rows={4}
                  placeholder="Best regards, The Team..."
                />
              </div>
            </>
          ) : (
            // Admin Notification Email Fields
            <>
              <div>
                <Label htmlFor="adminSubject">Email Subject</Label>
                <Input
                  id="adminSubject"
                  value={emailContent.adminSubject}
                  onChange={(e) => handleInputChange('adminSubject', e.target.value)}
                  disabled={!isEditing}
                  placeholder="New Contact Form Submission - {fullName}"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Use {'{fullName}'} to include the customer's name
                </p>
              </div>
              
              <div>
                <Label htmlFor="adminGreeting">Greeting</Label>
                <Input
                  id="adminGreeting"
                  value={emailContent.adminGreeting}
                  onChange={(e) => handleInputChange('adminGreeting', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Hello Admin,"
                />
              </div>
              
              <div>
                <Label htmlFor="adminIntro">Introduction</Label>
                <Textarea
                  id="adminIntro"
                  value={emailContent.adminIntro}
                  onChange={(e) => handleInputChange('adminIntro', e.target.value)}
                  disabled={!isEditing}
                  rows={2}
                  placeholder="A new contact form has been submitted..."
                />
              </div>
              
              <div>
                <Label htmlFor="adminDetails">Customer Details</Label>
                <Textarea
                  id="adminDetails"
                  value={emailContent.adminDetails}
                  onChange={(e) => handleInputChange('adminDetails', e.target.value)}
                  disabled={!isEditing}
                  rows={8}
                  placeholder="Customer Information..."
                />
                <p className="text-sm text-gray-500 mt-1">
                  Available variables: {'{fullName}'}, {'{email}'}, {'{whatsapp}'}, {'{quantity}'}, {'{date}'}, {'{message}'}
                </p>
              </div>
              
              <div>
                <Label htmlFor="adminAction">Action Required</Label>
                <Textarea
                  id="adminAction"
                  value={emailContent.adminAction}
                  onChange={(e) => handleInputChange('adminAction', e.target.value)}
                  disabled={!isEditing}
                  rows={3}
                  placeholder="Please respond to this inquiry..."
                />
              </div>
              
              <div>
                <Label htmlFor="adminFooter">Footer Information</Label>
                <Textarea
                  id="adminFooter"
                  value={emailContent.adminFooter}
                  onChange={(e) => handleInputChange('adminFooter', e.target.value)}
                  disabled={!isEditing}
                  rows={2}
                  placeholder="You can contact the customer directly..."
                />
              </div>
              
              <div>
                <Label htmlFor="adminSignature">Signature</Label>
                <Textarea
                  id="adminSignature"
                  value={emailContent.adminSignature}
                  onChange={(e) => handleInputChange('adminSignature', e.target.value)}
                  disabled={!isEditing}
                  rows={3}
                  placeholder="Best regards, System..."
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Preview Section */}
      <Card className="border-2 border-gray-100 shadow-sm pt-8 pb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Email Preview - {activeTab === 'confirmation' ? 'Confirmation Email' : 'Admin Notification'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderPreview(activeTab)}
        </CardContent>
      </Card>

      {/* Variables Reference */}
      <Card className="border-2 border-gray-100 shadow-sm pt-8 pb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Available Variables
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-gray-50 p-3 rounded border">
              <code className="text-blue-600 font-mono">{'{fullName}'}</code>
              <p className="text-gray-600 mt-1">Customer's full name</p>
            </div>
            <div className="bg-gray-50 p-3 rounded border">
              <code className="text-blue-600 font-mono">{'{email}'}</code>
              <p className="text-gray-600 mt-1">Customer's email address</p>
            </div>
            <div className="bg-gray-50 p-3 rounded border">
              <code className="text-blue-600 font-mono">{'{whatsapp}'}</code>
              <p className="text-gray-600 mt-1">Customer's WhatsApp number</p>
            </div>
            <div className="bg-gray-50 p-3 rounded border">
              <code className="text-blue-600 font-mono">{'{quantity}'}</code>
              <p className="text-gray-600 mt-1">Number of people</p>
            </div>
            <div className="bg-gray-50 p-3 rounded border">
              <code className="text-blue-600 font-mono">{'{date}'}</code>
              <p className="text-gray-600 mt-1">Preferred travel date</p>
            </div>
            <div className="bg-gray-50 p-3 rounded border">
              <code className="text-blue-600 font-mono">{'{message}'}</code>
              <p className="text-gray-600 mt-1">Customer's message</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-4">
            Use these variables in your email templates to automatically include customer information.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
