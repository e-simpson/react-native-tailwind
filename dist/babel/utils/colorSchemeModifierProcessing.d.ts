/**
 * Utility functions for processing color scheme modifiers (dark:, light:)
 */
import type * as BabelTypes from "@babel/types";
import type { CustomTheme, ParsedModifier } from "../../parser/index.js";
import type { StyleObject } from "../../types/core.js";
/**
 * Plugin state interface (subset needed for color scheme modifier processing)
 */
export interface ColorSchemeModifierProcessingState {
    styleRegistry: Map<string, StyleObject>;
    customTheme: CustomTheme;
    stylesIdentifier: string;
    needsColorSchemeImport: boolean;
    colorSchemeVariableName: string;
    reactCompilerCompatible: boolean;
    colorSchemeStyleKeys: Map<string, Set<string>>;
}
export declare const DARK_STYLES_IDENTIFIER = "_twDarkStyles";
export declare const LIGHT_STYLES_IDENTIFIER = "_twLightStyles";
/**
 * Process color scheme modifiers and generate conditional style expressions
 *
 * @param colorSchemeModifiers - Array of parsed color scheme modifiers
 * @param state - Plugin state
 * @param parseClassName - Function to parse class names into style objects
 * @param generateStyleKey - Function to generate unique style keys
 * @param t - Babel types
 * @returns Array of AST nodes for conditional expressions
 *
 * @example
 * Normal mode:
 * Input: [{ modifier: "dark", baseClass: "bg-gray-900" }, { modifier: "light", baseClass: "bg-white" }]
 * Output: [
 *   _twColorScheme === 'dark' && _twStyles._dark_bg_gray_900,
 *   _twColorScheme === 'light' && _twStyles._light_bg_white
 * ]
 *
 * React Compiler mode:
 * Input: [{ modifier: "dark", baseClass: "bg-gray-900" }, { modifier: "light", baseClass: "bg-white" }]
 * Output: [
 *   _twColorScheme === 'dark' && _twDarkStyles._dark_bg_gray_900,
 *   _twColorScheme === 'light' && _twLightStyles._light_bg_white
 * ]
 */
export declare function processColorSchemeModifiers(colorSchemeModifiers: ParsedModifier[], state: ColorSchemeModifierProcessingState, parseClassName: (className: string, customTheme?: CustomTheme) => StyleObject, generateStyleKey: (className: string) => string, t: typeof BabelTypes): BabelTypes.Expression[];
