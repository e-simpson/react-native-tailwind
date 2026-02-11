/**
 * Sizing utilities (width, height, min/max)
 */
import type { StyleObject } from "../types";
export declare const SIZE_SCALE: Record<string, number>;
export declare const SIZE_PERCENTAGES: Record<string, string>;
/**
 * Parse sizing classes
 * @param cls - The class name to parse
 * @param customSpacing - Optional custom spacing values from tailwind.config (shared with spacing utilities)
 */
export declare function parseSizing(cls: string, customSpacing?: Record<string, number>): StyleObject | null;
