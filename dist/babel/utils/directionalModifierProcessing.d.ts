/**
 * Utility functions for processing directional modifiers (rtl:, ltr:)
 */
import type * as BabelTypes from "@babel/types";
import type { CustomTheme, ParsedModifier } from "../../parser/index.js";
import type { StyleObject } from "../../types/core.js";
/**
 * Plugin state interface (subset needed for directional modifier processing)
 */
export interface DirectionalModifierProcessingState {
    styleRegistry: Map<string, StyleObject>;
    customTheme: CustomTheme;
    stylesIdentifier: string;
    needsI18nManagerImport: boolean;
    i18nManagerVariableName: string;
}
/**
 * Process directional modifiers and generate conditional style expressions
 *
 * @param directionalModifiers - Array of parsed directional modifiers
 * @param state - Plugin state
 * @param parseClassName - Function to parse class names into style objects
 * @param generateStyleKey - Function to generate unique style keys
 * @param t - Babel types
 * @returns Array of AST nodes for conditional expressions
 *
 * @example
 * Input: [{ modifier: "rtl", baseClass: "mr-4" }, { modifier: "ltr", baseClass: "ml-4" }]
 * Output: [
 *   _twIsRTL ? styles._rtl_mr_4 : null,
 *   !_twIsRTL ? styles._ltr_ml_4 : null
 * ]
 */
export declare function processDirectionalModifiers(directionalModifiers: ParsedModifier[], state: DirectionalModifierProcessingState, parseClassName: (className: string, customTheme?: CustomTheme) => StyleObject, generateStyleKey: (className: string) => string, t: typeof BabelTypes): BabelTypes.Expression[];
