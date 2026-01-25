/**
 * Spacing utilities (margin, padding, gap)
 */
import type { StyleObject } from "../types";
export declare const SPACING_SCALE: Record<string, number>;
/**
 * Parse spacing classes (margin, padding, gap)
 * Examples: m-4, mx-2, mt-8, p-4, px-2, pt-8, gap-4, m-[16px], pl-[4.5px], -m-4, -mt-[10px], ms-4, pe-2, mx-auto
 * @param cls - The class name to parse
 * @param customSpacing - Optional custom spacing values from tailwind.config
 */
export declare function parseSpacing(cls: string, customSpacing?: Record<string, number>): StyleObject | null;
