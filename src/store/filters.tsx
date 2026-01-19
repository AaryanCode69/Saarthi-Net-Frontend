/**
 * Global Filter Store
 * 
 * Centralized state management for all dashboard filters and layer toggles.
 * This is the SINGLE source of truth for:
 * - District selection
 * - Time period selection
 * - Map layer visibility toggles
 * 
 * Uses React Context + useReducer pattern for predictable state updates.
 */

import React, { createContext, useContext, useReducer, ReactNode } from "react";

// ============================================================
// STATE INTERFACE
// ============================================================

export interface LayerState {
  migration: boolean;
  periUrban: boolean;
  digitalRisk: boolean;
}

export interface FilterState {
  district: string;
  period: string;
  layers: LayerState;
  /** District currently focused/hovered on map (UI state only, does not trigger API calls) */
  focusedDistrict: string | null;
}

// ============================================================
// DEFAULT STATE
// ============================================================

const DEFAULT_FILTER_STATE: FilterState = {
  district: "all",
  period: "30d",
  layers: {
    migration: true,
    periUrban: true,
    digitalRisk: false,
  },
  focusedDistrict: null,
};

// ============================================================
// ACTION TYPES
// ============================================================

type FilterAction =
  | { type: "SET_DISTRICT"; payload: string }
  | { type: "SET_PERIOD"; payload: string }
  | { type: "TOGGLE_LAYER"; payload: keyof LayerState }
  | { type: "SET_LAYER"; payload: { layer: keyof LayerState; value: boolean } }
  | { type: "SET_FOCUSED_DISTRICT"; payload: string | null }
  | { type: "RESET_FILTERS" };

// ============================================================
// REDUCER
// ============================================================

function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case "SET_DISTRICT":
      return { ...state, district: action.payload };

    case "SET_PERIOD":
      return { ...state, period: action.payload };

    case "TOGGLE_LAYER":
      return {
        ...state,
        layers: {
          ...state.layers,
          [action.payload]: !state.layers[action.payload],
        },
      };

    case "SET_LAYER":
      return {
        ...state,
        layers: {
          ...state.layers,
          [action.payload.layer]: action.payload.value,
        },
      };

    case "SET_FOCUSED_DISTRICT":
      return { ...state, focusedDistrict: action.payload };

    case "RESET_FILTERS":
      return DEFAULT_FILTER_STATE;

    default:
      return state;
  }
}

// ============================================================
// CONTEXT
// ============================================================

interface FilterContextValue {
  // State (read-only)
  state: FilterState;
  
  // Setters
  setDistrict: (district: string) => void;
  setPeriod: (period: string) => void;
  toggleLayer: (layer: keyof LayerState) => void;
  setLayer: (layer: keyof LayerState, value: boolean) => void;
  setFocusedDistrict: (district: string | null) => void;
  clearFocusedDistrict: () => void;
  resetFilters: () => void;
}

const FilterContext = createContext<FilterContextValue | null>(null);

// ============================================================
// PROVIDER
// ============================================================

interface FilterProviderProps {
  children: ReactNode;
  initialState?: Partial<FilterState>;
}

export function FilterProvider({ children, initialState }: FilterProviderProps) {
  const [state, dispatch] = useReducer(filterReducer, {
    ...DEFAULT_FILTER_STATE,
    ...initialState,
    layers: {
      ...DEFAULT_FILTER_STATE.layers,
      ...initialState?.layers,
    },
  });

  const value: FilterContextValue = {
    state,
    setDistrict: (district: string) => 
      dispatch({ type: "SET_DISTRICT", payload: district }),
    setPeriod: (period: string) => 
      dispatch({ type: "SET_PERIOD", payload: period }),
    toggleLayer: (layer: keyof LayerState) => 
      dispatch({ type: "TOGGLE_LAYER", payload: layer }),
    setLayer: (layer: keyof LayerState, value: boolean) => 
      dispatch({ type: "SET_LAYER", payload: { layer, value } }),
    setFocusedDistrict: (district: string | null) =>
      dispatch({ type: "SET_FOCUSED_DISTRICT", payload: district }),
    clearFocusedDistrict: () =>
      dispatch({ type: "SET_FOCUSED_DISTRICT", payload: null }),
    resetFilters: () => 
      dispatch({ type: "RESET_FILTERS" }),
  };

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
}

// ============================================================
// HOOK
// ============================================================

/**
 * Access the global filter state and setters.
 * Must be used within a FilterProvider.
 */
export function useFilters(): FilterContextValue {
  const context = useContext(FilterContext);
  
  if (!context) {
    throw new Error("useFilters must be used within a FilterProvider");
  }
  
  return context;
}

// ============================================================
// SELECTOR HOOKS (for optimized re-renders)
// ============================================================

/**
 * Get only the district value
 */
export function useDistrict(): [string, (district: string) => void] {
  const { state, setDistrict } = useFilters();
  return [state.district, setDistrict];
}

/**
 * Get only the period value
 */
export function usePeriod(): [string, (period: string) => void] {
  const { state, setPeriod } = useFilters();
  return [state.period, setPeriod];
}

/**
 * Get only the layer toggles
 */
export function useLayers(): [LayerState, (layer: keyof LayerState) => void] {
  const { state, toggleLayer } = useFilters();
  return [state.layers, toggleLayer];
}

/**
 * Get district and period together (for API fetching)
 */
export function useFilterParams(): { district: string; period: string } {
  const { state } = useFilters();
  return { district: state.district, period: state.period };
}

/**
 * Get focused district (for map-insight synchronization)
 */
export function useFocusedDistrict(): [
  string | null,
  (district: string | null) => void,
  () => void
] {
  const { state, setFocusedDistrict, clearFocusedDistrict } = useFilters();
  return [state.focusedDistrict, setFocusedDistrict, clearFocusedDistrict];
}
