/**
 * @mgcrea/react-native-tailwind
 * Compile-time Tailwind CSS for React Native
 */
export { tw, twStyle } from "./stubs/tw";
export { parseClass, parseClassName } from "./parser";
export { flattenColors } from "./utils/flattenColors";
export { mergeStyles } from "./utils/mergeStyles";
export { generateStyleKey } from "./utils/styleKey";
export type { StyleObject } from "./types/core";
export type { NativeStyle, TwStyle } from "./types/runtime";
export { TAILWIND_COLORS } from "./config/tailwind";
export { parseAspectRatio, parseBorder, parseColor, parseLayout, parseOutline, parsePlaceholderClass, parsePlaceholderClasses, parseShadow, parseSizing, parseSpacing, parseTypography, } from "./parser";
export { ASPECT_RATIO_PRESETS } from "./parser/aspectRatio";
export { COLORS } from "./parser/colors";
export { INSET_SCALE, Z_INDEX_SCALE } from "./parser/layout";
export { SHADOW_SCALE } from "./parser/shadows";
export { SIZE_PERCENTAGES, SIZE_SCALE } from "./parser/sizing";
export { SPACING_SCALE } from "./parser/spacing";
export { FONT_SIZES, LETTER_SPACING_SCALE } from "./parser/typography";
export * from "./components";
