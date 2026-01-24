/**
 * Transform utilities (scale, rotate, translate, skew, perspective)
 */
import type { StyleObject } from "../types";
export declare const SCALE_MAP: Record<string, number>;
export declare const ROTATE_MAP: Record<string, number>;
export declare const SKEW_MAP: Record<string, number>;
export declare const PERSPECTIVE_SCALE: Record<string, number>;
/**
 * Parse transform classes
 * Each transform class returns a transform array with a single transform object
 * @param cls - The class name to parse
 * @param customSpacing - Optional custom spacing values from tailwind.config (for translate utilities)
 */
export declare function parseTransform(cls: string, customSpacing?: Record<string, number>): StyleObject | null;
