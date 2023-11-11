"use client";

import { useStore } from "@/app/store/store";
function StoreInitializer({ filter, users, vendors }) {
  useStore.setState((prevState) => ({
    filter: filter,
    users: users || prevState,
    vendors: vendors || prevState,
  }));
  // const init = useRef(false);
  // if (!init.current) {
  //   init.current = true;
  // }
  return null;
}

export default StoreInitializer;
