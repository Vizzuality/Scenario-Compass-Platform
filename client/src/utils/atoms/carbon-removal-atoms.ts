import { atom } from "jotai";

export const carbonRemovalMinAtom = atom<number>(Number.MAX_SAFE_INTEGER);
export const carbonRemovalMaxAtom = atom<number>(Number.MIN_SAFE_INTEGER);
