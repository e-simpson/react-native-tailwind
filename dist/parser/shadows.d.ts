/**
 * Shadow and elevation utilities for React Native
 * iOS uses shadow* properties, Android uses elevation
 */
import type { StyleObject } from "../types";
import { COLORS } from "../utils/colorUtils";
/**
 * Shadow scale definitions combining iOS and Android properties
 * Based on Tailwind CSS shadow scale, adapted for React Native
 *
 * Note: We include BOTH iOS shadow properties AND Android elevation in each style.
 * React Native will automatically use the appropriate properties for each platform:
 * - iOS uses shadowColor, shadowOffset, shadowOpacity, shadowRadius
 * - Android uses elevation
 */
declare const SHADOW_SCALE: Record<string, StyleObject>;
/**
 * Parse shadow classes
 * Supports shadow size presets (shadow-sm, shadow-md, etc.) and
 * shadow colors (shadow-red-500, shadow-blue-800/50, shadow-[#ff0000]/80)
 *
 * @param cls - Class name to parse
 * @param customColors - Optional custom colors from tailwind.config
 * @returns Style object or null if not a shadow class
 */
export declare function parseShadow(cls: string, customColors?: Record<string, string>): StyleObject | null;
export { COLORS as SHADOW_COLORS, SHADOW_SCALE };
