import { atom } from "jotai";

export const endOfCenturyWarmingMinAtom = atom<number>(Number.MAX_SAFE_INTEGER);
export const endOfCenturyWarmingMaxAtom = atom<number>(Number.MIN_SAFE_INTEGER);
