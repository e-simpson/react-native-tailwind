/**
 * Utility functions for processing class modifiers (active:, hover:, focus:, etc.)
 */
import type * as BabelTypes from "@babel/types";
import type { CustomTheme, ModifierType, ParsedModifier } from "../../parser/index.js";
import type { StyleObject } from "../../types/core.js";
/**
 * Plugin state interface (subset needed for modifier processing)
 */
export interface ModifierProcessingState {
    styleRegistry: Map<string, StyleObject>;
    customTheme: CustomTheme;
    stylesIdentifier: string;
}
/**
 * Process a static className string that contains modifiers
 * Returns a style function expression for Pressable components
 */
export declare function processStaticClassNameWithModifiers(className: string, state: ModifierProcessingState, parseClassName: (className: string, customTheme?: CustomTheme) => StyleObject, generateStyleKey: (className: string) => string, splitModifierClasses: (className: string) => {
    baseClasses: string[];
    modifierClasses: ParsedModifier[];
}, t: typeof BabelTypes): BabelTypes.Expression;
/**
 * Create a style function for Pressable: ({ pressed }) => styleExpression
 */
export declare function createStyleFunction(styleExpression: BabelTypes.Expression, modifierTypes: ModifierType[], t: typeof BabelTypes): BabelTypes.ArrowFunctionExpression;
