"use client";

import { ReactNode, useMemo } from "react";
import { Provider } from "react-redux";
import { initListeners, makeStore } from "@/store";

export default function Providers({ children }: { children: ReactNode }) {
  const store = useMemo(() => {
    const created = makeStore();
    initListeners(created);
    return created;
  }, []);

  return <Provider store={store}>{children}</Provider>;
}


