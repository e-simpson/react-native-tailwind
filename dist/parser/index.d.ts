/**
 * Tailwind class parser for React Native
 * Converts Tailwind-like class names to React Native style objects
 */
import type { StyleObject } from "../types";
/**
 * Custom theme configuration (subset of tailwind.config theme extensions)
 */
export type CustomTheme = {
    colors?: Record<string, string>;
    fontFamily?: Record<string, string>;
    fontSize?: Record<string, number>;
    spacing?: Record<string, number>;
};
/**
 * Parse a className string and return a React Native style object
 * @param className - Space-separated class names
 * @param customTheme - Optional custom theme from tailwind.config
 * @returns React Native style object
 */
export declare function parseClassName(className: string, customTheme?: CustomTheme): StyleObject;
/**
 * Parse a single class name
 * @param cls - Single class name
 * @param customTheme - Optional custom theme from tailwind.config
 * @returns React Native style object
 */
export declare function parseClass(cls: string, customTheme?: CustomTheme): StyleObject;
export { parseAspectRatio } from "./aspectRatio";
export { parseBorder } from "./borders";
export { parseColor } from "./colors";
export { parseLayout } from "./layout";
export { parseOutline } from "./outline";
export { parsePlaceholderClass, parsePlaceholderClasses } from "./placeholder";
export { parseShadow } from "./shadows";
export { parseSizing } from "./sizing";
export { parseSpacing } from "./spacing";
export { parseTransform } from "./transforms";
export { parseTypography } from "./typography";
export { expandSchemeModifier, hasModifier, isColorClass, isColorSchemeModifier, isDirectionalModifier, isPlatformModifier, isSchemeModifier, isStateModifier, parseModifier, splitModifierClasses, } from "./modifiers";
export type { ColorSchemeModifierType, DirectionalModifierType, ModifierType, ParsedModifier, PlatformModifierType, SchemeModifierType, StateModifierType, } from "./modifiers";
