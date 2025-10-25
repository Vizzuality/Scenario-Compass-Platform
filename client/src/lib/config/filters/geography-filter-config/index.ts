interface GeographyOption {
  name: string;
  id: string;
  hierarchy: string;
}

export const geographyConfig: GeographyOption[] = [
  {
    name: "World",
    hierarchy: "common",
    id: "1",
  },
  {
    name: "OECD & EU (R5)",
    hierarchy: "R5",
    id: "3",
  },
  {
    name: "Reforming Economies (R5)",
    hierarchy: "R5",
    id: "4",
  },
  {
    name: "Asia (R5)",
    hierarchy: "R5",
    id: "5",
  },
  {
    name: "Middle East & Africa (R5)",
    hierarchy: "R5",
    id: "6",
  },
  {
    name: "Latin America (R5)",
    hierarchy: "R5",
    id: "7",
  },
  {
    name: "Other (R5)",
    hierarchy: "R5",
    id: "8",
  },
  {
    name: "European Union (R9)",
    hierarchy: "R9",
    id: "9",
  },
  {
    name: "USA (R9)",
    hierarchy: "R9",
    id: "10",
  },
  {
    name: "Other OECD (R9)",
    hierarchy: "R9",
    id: "11",
  },
  {
    name: "China (R9)",
    hierarchy: "R9",
    id: "12",
  },
  {
    name: "India (R9)",
    hierarchy: "R9",
    id: "13",
  },
  {
    name: "Other Asia (R9)",
    hierarchy: "R9",
    id: "14",
  },
  {
    name: "Reforming Economies (R9)",
    hierarchy: "R9",
    id: "15",
  },
  {
    name: "Middle East & Africa (R9)",
    hierarchy: "R9",
    id: "16",
  },
  {
    name: "Latin America (R9)",
    hierarchy: "R9",
    id: "17",
  },
  {
    name: "Other (R9)",
    hierarchy: "R9",
    id: "18",
  },
  {
    name: "Africa (R10)",
    hierarchy: "R10",
    id: "19",
  },
  {
    name: "China+ (R10)",
    hierarchy: "R10",
    id: "20",
  },
  {
    name: "Europe (R10)",
    hierarchy: "R10",
    id: "21",
  },
  {
    name: "India+ (R10)",
    hierarchy: "R10",
    id: "22",
  },
  {
    name: "Latin America (R10)",
    hierarchy: "R10",
    id: "23",
  },
  {
    name: "Middle East (R10)",
    hierarchy: "R10",
    id: "24",
  },
  {
    name: "North America (R10)",
    hierarchy: "R10",
    id: "25",
  },
  {
    name: "Pacific OECD (R10)",
    hierarchy: "R10",
    id: "26",
  },
  {
    name: "Reforming Economies (R10)",
    hierarchy: "R10",
    id: "27",
  },
  {
    name: "Rest of Asia (R10)",
    hierarchy: "R10",
    id: "28",
  },
  {
    name: "Other (R10)",
    hierarchy: "R10",
    id: "29",
  },
];

export const GEOGRAPHY_VALUES = geographyConfig.map((option) => option.name);
