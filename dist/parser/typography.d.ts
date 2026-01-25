/**
 * Typography utilities (font size, weight, line height, text align, letter spacing)
 */
import type { StyleObject } from "../types";
export declare const FONT_SIZES: Record<string, number>;
export declare const LETTER_SPACING_SCALE: Record<string, number>;
export declare const LINE_HEIGHT_SCALE: Record<string, number>;
/**
 * Parse typography classes
 * @param cls - Class name to parse
 * @param customFontFamily - Optional custom fontFamily from tailwind.config
 * @param customFontSize - Optional custom fontSize from tailwind.config
 */
export declare function parseTypography(cls: string, customFontFamily?: Record<string, string>, customFontSize?: Record<string, number>): StyleObject | null;
