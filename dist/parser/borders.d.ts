/**
 * Border utilities (border width, radius, style)
 */
import type { StyleObject } from "../types";
export declare const BORDER_WIDTH_SCALE: Record<string, number>;
export declare const BORDER_RADIUS_SCALE: Record<string, number>;
/**
 * Parse border classes
 * @param cls - The class name to parse
 * @param customColors - Optional custom colors from tailwind.config (used to detect color patterns)
 */
export declare function parseBorder(cls: string, customColors?: Record<string, string>): StyleObject | null;
