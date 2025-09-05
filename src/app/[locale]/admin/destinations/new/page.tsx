"use client";

import { useState } from "react";

export default function NewDestinationPage() {
  const [isSubmitting, setSubmitting] = useState(false);
  return (
    <div className="p-4 max-w-xl">
      <h1 className="text-xl font-semibold mb-4">Create Destination</h1>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.currentTarget as HTMLFormElement;
          const fd = new FormData(form);
          setSubmitting(true);
          const res = await fetch("/api/admin/destinations", { method: "POST", body: fd });
          setSubmitting(false);
          if (res.ok) window.location.href = "/admin/destinations";
          else alert("Failed to create");
        }}
        className="space-y-3"
      >
        <div>
          <label className="block text-sm mb-1">Region</label>
          <select name="region" className="w-full border rounded px-3 py-2" required>
            <option value="north">North</option>
            <option value="central">Central</option>
            <option value="south">South</option>
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Name (VI)</label>
          <input name="nameVi" className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm mb-1">Name (EN)</label>
          <input name="nameEn" className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm mb-1">Image URL</label>
          <input name="image" className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm mb-1">Alt</label>
          <input name="alt" className="w-full border rounded px-3 py-2" required />
        </div>
        <div className="flex items-center gap-4">
          <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" name="isFeatured" /> Featured</label>
          <div className="flex items-center gap-2">
            <label className="text-sm">Order</label>
            <input type="number" name="order" defaultValue={0} className="w-24 border rounded px-2 py-1" />
          </div>
        </div>
        <button type="submit" disabled={isSubmitting} className="px-4 py-2 border rounded bg-primary text-primary-foreground disabled:opacity-50">
          {isSubmitting ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
}


