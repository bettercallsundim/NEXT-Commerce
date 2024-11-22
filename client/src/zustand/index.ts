import { User } from "@/prisma-types";
import { create } from "zustand";

interface ZustandStates {
  user: User | null;
  setUser: (user: User | null) => void;
}

const zustandStore = create<ZustandStates>((set) => ({
  user: null,
  setUser: (user: User | null) => set({ user }),
}));

export default zustandStore;
