/**
 * Aspect ratio utilities for React Native
 * Uses aspectRatio style property (React Native 0.71+)
 */
import type { StyleObject } from "../types";
/**
 * Preset aspect ratios
 */
declare const ASPECT_RATIO_PRESETS: Record<string, number | undefined>;
/**
 * Parse aspect ratio classes
 * @param cls - Class name to parse
 * @returns Style object or null if not an aspect ratio class
 */
export declare function parseAspectRatio(cls: string): StyleObject | null;
export { ASPECT_RATIO_PRESETS };
