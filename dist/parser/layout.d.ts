/**
 * Layout utilities (flexbox, positioning, display)
 */
import type { StyleObject } from "../types";
export declare const Z_INDEX_SCALE: Record<string, number>;
export declare const INSET_SCALE: Record<string, number>;
/**
 * Parse layout classes
 * @param cls - The class name to parse
 * @param customSpacing - Optional custom spacing values from tailwind.config (for inset utilities)
 */
export declare function parseLayout(cls: string, customSpacing?: Record<string, number>): StyleObject | null;
