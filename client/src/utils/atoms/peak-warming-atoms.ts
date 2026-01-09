import { atom } from "jotai";

export const peakWarmingMinAtom = atom<number>(Number.MAX_SAFE_INTEGER);
export const peakWarmingMaxAtom = atom<number>(Number.MIN_SAFE_INTEGER);
