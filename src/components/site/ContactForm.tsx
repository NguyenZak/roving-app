"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { CheckCircle, Loader2, Send, Mail, MessageCircle, Calendar, Users } from "lucide-react";

const schema = z.object({
  fullName: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  whatsapp: z.string().optional(),
  quantity: z.coerce.number().min(1, "Số lượng phải ít nhất là 1"),
  date: z.string().min(1, "Vui lòng chọn ngày"),
  message: z.string().optional(),
});

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formContent, setFormContent] = useState({
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
  });

  // Load form content from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('contactFormContent');
    if (saved) {
      try {
        setFormContent(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading saved form content:', error);
      }
    }
  }, []);

  const form = useForm({ 
    resolver: zodResolver(schema), 
    defaultValues: { 
      quantity: 1,
      message: ""
    } 
  });

  async function onSubmit(values: unknown) {
    try {
      setIsSubmitting(true);
      const parsed = schema.parse(values);
      const response = await fetch("/api/contact", { 
        method: "POST", 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parsed) 
      });
      
      if (response.ok) {
        setIsSuccess(true);
        form.reset();
        setTimeout(() => setIsSuccess(false), 5000);
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSuccess) {
    return (
      <div className="text-center py-12 px-6">
        <div className="max-w-md mx-auto">
          <div className="bg-green-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">{formContent.successTitle}</h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            {formContent.successMessage}
          </p>
          <Button 
            onClick={() => setIsSuccess(false)} 
            variant="outline"
            className="px-6 py-2"
          >
            {formContent.sendAnotherButton}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
          <h2 className="text-2xl font-bold text-white mb-2">{formContent.title}</h2>
          <p className="text-blue-100">
            {formContent.subtitle}
          </p>
        </div>

        {/* Form */}
        <div className="p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <FormField 
                  control={form.control} 
                  name="fullName" 
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        {formContent.fullNameLabel}
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder={formContent.fullNamePlaceholder}
                          className="h-12 px-4 border-gray-200 focus:border-blue-500 focus:ring-blue-500 placeholder:text-gray-400"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} 
                />
                
                <FormField 
                  control={form.control} 
                  name="email" 
                  render={({ field }) => (
                    <FormItem>
                                              <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          {formContent.emailLabel}
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            {...field} 
                            placeholder={formContent.emailPlaceholder}
                            className="h-12 px-4 border-gray-200 focus:border-blue-500 focus:ring-blue-500 placeholder:text-gray-400"
                          />
                        </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} 
                />
              </div>

              {/* Contact Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <FormField 
                  control={form.control} 
                  name="whatsapp" 
                  render={({ field }) => (
                    <FormItem>
                                              <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <MessageCircle className="h-4 w-4" />
                          {formContent.whatsappLabel}
                        </FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder={formContent.whatsappPlaceholder}
                            className="h-12 px-4 border-gray-200 focus:border-blue-500 focus:ring-blue-500 placeholder:text-gray-400"
                          />
                        </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} 
                />

                <FormField 
                  control={form.control} 
                  name="quantity" 
                  render={({ field }) => (
                    <FormItem>
                                              <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          {formContent.quantityLabel}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            {...field}
                            value={Number(field.value) || 1}
                            onChange={(e) => field.onChange(e.target.value === "" ? 1 : Number(e.target.value))}
                            placeholder={formContent.quantityPlaceholder}
                            className="h-12 px-4 border-gray-200 focus:border-blue-500 focus:ring-blue-500 placeholder:text-gray-400"
                          />
                        </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} 
                />
              </div>

              {/* Tour Information */}
              <FormField 
                control={form.control} 
                name="date" 
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {formContent.dateLabel}
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        {...field} 
                        className="h-12 px-4 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} 
              />

              {/* Message */}
              <FormField 
                control={form.control} 
                name="message" 
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      {formContent.messageLabel}
                    </FormLabel>
                    <FormControl>
                      <Textarea 
                        rows={4} 
                        {...field} 
                        placeholder={formContent.messagePlaceholder}
                        className="px-4 py-3 border-gray-200 focus:border-blue-500 focus:ring-blue-500 resize-none placeholder:text-gray-400"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} 
              />

              {/* Submit Button */}
              <div className="pt-4">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      {formContent.sendingText}
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      {formContent.submitButton}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}


