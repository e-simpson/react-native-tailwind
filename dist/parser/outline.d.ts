/**
 * Outline utilities (outline width, style, offset)
 */
import type { StyleObject } from "../types";
/**
 * Parse outline classes
 * @param cls - The class name to parse
 * @param customColors - Optional custom colors (passed to parseColor for pattern detection)
 */
export declare function parseOutline(cls: string, customColors?: Record<string, string>): StyleObject | null;
