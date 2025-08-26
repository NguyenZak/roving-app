"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const schema = z.object({
  fullName: z.string().min(2),
  quantity: z.coerce.number().min(1),
  date: z.string(),
  whatsapp: z.string().optional(),
  email: z.string().email(),
  owner: z.string().optional(),
});

export default function ContactForm() {
  const t = useTranslations("contact");
  const form = useForm({ resolver: zodResolver(schema), defaultValues: { quantity: 1 } });

  async function onSubmit(values: unknown) {
    const parsed = schema.parse(values);
    await fetch("/api/contact", { method: "POST", body: JSON.stringify(parsed) });
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid md:grid-cols-2 gap-4">
        <FormField control={form.control} name="fullName" render={({ field }) => (
          <FormItem>
            <FormLabel>{t("fullName")}</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="quantity" render={({ field }) => (
          <FormItem>
            <FormLabel>{t("quantity")}</FormLabel>
            <FormControl>
              <Input
                type="number"
                min={1}
                {...field}
                value={typeof field.value === "number" ? field.value : Number(field.value ?? 1)}
                onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="date" render={({ field }) => (
          <FormItem>
            <FormLabel>{t("date")}</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="whatsapp" render={({ field }) => (
          <FormItem>
            <FormLabel>{t("whatsapp")}</FormLabel>
            <FormControl>
              <Input placeholder="+84..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="email" render={({ field }) => (
          <FormItem>
            <FormLabel>{t("email")}</FormLabel>
            <FormControl>
              <Input type="email" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="owner" render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>{t("infoOwner")}</FormLabel>
            <FormControl>
              <Textarea rows={4} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <div className="md:col-span-2">
          <Button type="submit">{t("submit")}</Button>
        </div>
      </form>
    </Form>
  );
}


