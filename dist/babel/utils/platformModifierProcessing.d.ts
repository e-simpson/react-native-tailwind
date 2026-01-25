/**
 * Utility functions for processing platform modifiers (ios:, android:, web:)
 */
import type * as BabelTypes from "@babel/types";
import type { CustomTheme, ParsedModifier } from "../../parser/index.js";
import type { StyleObject } from "../../types/core.js";
/**
 * Plugin state interface (subset needed for platform modifier processing)
 */
export interface PlatformModifierProcessingState {
    styleRegistry: Map<string, StyleObject>;
    customTheme: CustomTheme;
    stylesIdentifier: string;
    needsPlatformImport: boolean;
}
/**
 * Process platform modifiers and generate Platform.select() expression
 *
 * @param platformModifiers - Array of parsed platform modifiers
 * @param state - Plugin state
 * @param parseClassName - Function to parse class names into style objects
 * @param generateStyleKey - Function to generate unique style keys
 * @param t - Babel types
 * @returns AST node for Platform.select() call
 *
 * @example
 * Input: [{ modifier: "ios", baseClass: "shadow-lg" }, { modifier: "android", baseClass: "elevation-4" }]
 * Output: Platform.select({ ios: styles._ios_shadow_lg, android: styles._android_elevation_4 })
 */
export declare function processPlatformModifiers(platformModifiers: ParsedModifier[], state: PlatformModifierProcessingState, parseClassName: (className: string, customTheme?: CustomTheme) => StyleObject, generateStyleKey: (className: string) => string, t: typeof BabelTypes): BabelTypes.Expression;
