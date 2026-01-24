/**
 * Shared color utilities for parsing and manipulating colors
 */
/**
 * Tailwind color palette (flattened from config) with basic colors
 */
export declare const COLORS: Record<string, string>;
/**
 * Apply opacity to hex color by appending alpha channel
 * @param hex - Hex color string (e.g., "#ff0000", "#f00", or "transparent")
 * @param opacity - Opacity value 0-100 (e.g., 50 for 50%)
 * @returns 8-digit hex with alpha (e.g., "#FF000080") or transparent
 */
export declare function applyOpacity(hex: string, opacity: number): string;
/**
 * Parse arbitrary color value: [#ff0000], [#f00], [#FF0000AA]
 * Supports 3-digit, 6-digit, and 8-digit (with alpha) hex colors
 * @param value - Arbitrary value string like "[#ff0000]"
 * @returns Hex string if valid, null otherwise (preserves input case)
 */
export declare function parseArbitraryColor(value: string): string | null;
/**
 * Parse a color value with optional opacity modifier
 * Handles preset colors, custom colors, arbitrary hex values, and opacity modifiers
 *
 * @param colorKey - Color key like "red-500", "red-500/50", "[#ff0000]", "[#ff0000]/80"
 * @param customColors - Optional custom colors from tailwind.config
 * @returns Hex color string or null if invalid
 */
export declare function parseColorValue(colorKey: string, customColors?: Record<string, string>): string | null;
