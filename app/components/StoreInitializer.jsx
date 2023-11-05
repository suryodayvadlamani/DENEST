"use client";
import { useRef } from "react";
import { useStore } from "@/app/store/store";
function StoreInitializer({ filter }) {
  const init = useRef(false);
  if (!init.current) {
    useStore.setState({ filter });
    init.current = true;
  }
  return null;
}

export default StoreInitializer;
