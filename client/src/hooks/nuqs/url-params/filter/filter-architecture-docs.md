# Filter URL Params Hook Architecture

## Overview

The `useFilterUrlParams` hook orchestrates multiple smaller hooks to manage filter state in the URL. It handles both **array filters** (like `climateCategory`) and **string filters** (like `renewablesShare2050`).

---

## Core Components

### 1. **FILTERS Config** (Orange - Source of Truth)

```typescript
{
  climateCategory: { group: "climate", type: "array" },
  renewablesShare2050: { group: "energy", type: "string" },
  // ...
}
```

- Defines all available filters
- Specifies whether each filter is an "array" or "string" type
- Used by all other hooks to understand filter structure

---

## The Flow (Step by Step)

### Step 1: Generate Parameter Names

**`useFilterParams(prefix)`** → `params object`

```typescript
// Input: prefix = "scenario"
// Output:
{
  climateCategory: "scenario_climateCategory",
  renewablesShare2050: "scenario_renewablesShare2050",
  // ...
}
```

- Takes each filter key and generates its URL parameter name
- Applies optional prefix for namespacing

---

### Step 2: Create Parser Configuration

**`useFilterParserConfig(params)`** → `config object`

```typescript
// Output:
{
  "scenario_climateCategory": parseAsArrayOf(parseAsString, ',').withDefault([]),
  "scenario_renewablesShare2050": parseAsString,
  // ...
}
```

- Creates nuqs parser for each parameter
- Array types: parse comma-separated values (`?category=C1b,C1a`)
- String types: parse as single string (`?renewables=10:20`)

---

### Step 3: Connect to URL (nuqs)

**`useQueryStates(config)`** → `[filters, setFilters]`

```typescript
// Returns:
filters = {
  scenario_climateCategory: ["C1b", "C1a"],
  scenario_renewablesShare2050: "10:20",
  // ...
};

setFilters = (updates) => {
  /* updates URL */
};
```

- **nuqs** manages the actual URL synchronization
- `filters`: current state from URL
- `setFilters`: function to update URL

---

### Step 4: Normalize Values

**`useFilterValues(filters, params)`** → `normalized values`

```typescript
// Input: filters with URL param names
{
  "scenario_climateCategory": ["C1b", "C1a"],
  "scenario_renewablesShare2050": "10:20"
}

// Output: normalized with original keys
{
  climateCategory: ["C1b", "C1a"],      // array
  renewablesShare2050: "10:20"          // string
}
```

- Transforms URL param names back to original filter keys
- Makes values easier to use in components

---

### Step 5: Create Setters

**`useFilterSetters(params, setFilters)`** → `individual setters`

```typescript
// Returns typed setter functions:
{
  setClimateCategory: (value: string[] | null) => Promise<URLSearchParams>,
  setRenewablesShare2050: (value: string | null) => Promise<URLSearchParams>,
  // ...
}

// Usage:
setClimateCategory(['C1b', 'C1a']);     // Updates ?category=C1b,C1a
setRenewablesShare2050('10:20');        // Updates ?renewables=10:20
```

- Creates individual setter for each filter
- Type-safe: arrays for array filters, strings for string filters

---

### Step 6: Create Clear Function

**`useClearAllFilters(params, setFilters)`** → `clearAll function`

```typescript
clearAll(); // Resets all filters to empty/null
```

- Resets all filters at once

---

## Final Return Object (Purple)

```typescript
{
  // Raw data
  params: { climateCategory: "scenario_climateCategory", ... },
  filters: { "scenario_climateCategory": ["C1b"], ... },
  setFilters: (updates) => { ... },

  // Normalized values (destructured)
  climateCategory: ["C1b", "C1a"],
  renewablesShare2050: "10:20",

  // Individual setters (destructured)
  setClimateCategory: (v) => { ... },
  setRenewablesShare2050: (v) => { ... },

  // Clear function
  clearAll: () => { ... }
}
```

---

## URL Format Examples

### Array Filters

```
?climateCategory=C1b,C1a&yearNetZero=2050,2060
```

- Multiple values in one parameter, comma-separated
- Parsed as: `["C1b", "C1a"]`

### String Filters

```
?renewablesShare2050=10:20&fossilShare2050=5:15
```

- Single string value per parameter
- Can contain special characters like `:` for ranges
- Parsed as: `"10:20"`

---

## Key Benefits

1. **Type Safety**: TypeScript knows which filters are arrays vs strings
2. **Separation of Concerns**: Each hook has one clear responsibility
3. **Flexible**: Easy to add new filter types or modify behavior
4. **Clean API**: Components get simple, typed setters and values
5. **URL Friendly**: Generates clean, readable URLs
