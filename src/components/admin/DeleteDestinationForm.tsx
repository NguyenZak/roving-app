"use client";

import { useCallback } from "react";

export default function DeleteDestinationForm({ id }: { id: string }) {
  const onSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    if (!confirm("Delete destination?")) {
      e.preventDefault();
    }
  }, []);

  return (
    <form action={`/api/admin/destinations/${id}`} method="post" className="mt-6" onSubmit={onSubmit}>
      <input type="hidden" name="_method" value="DELETE" />
      <button className="px-4 py-2 border rounded text-destructive hover:bg-destructive/10">Delete</button>
    </form>
  );
}


