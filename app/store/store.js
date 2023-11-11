import { create } from "zustand";

export const useStore = create((set) => ({
  filter: {},
  users: [],
  vendors: [],
}));
