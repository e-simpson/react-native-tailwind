/**
 * Color utilities (background, text, border colors)
 */
import type { StyleObject } from "../types";
import { COLORS } from "../utils/colorUtils";
export { COLORS };
/**
 * Parse color classes (background, text, border)
 * Supports opacity modifier: bg-blue-500/50, text-black/80, border-red-500/30
 */
export declare function parseColor(cls: string, customColors?: Record<string, string>): StyleObject | null;
