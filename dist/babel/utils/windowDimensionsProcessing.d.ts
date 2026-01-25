/**
 * Utility functions for processing window dimensions (w-screen, h-screen)
 */
import type * as BabelTypes from "@babel/types";
import type { StyleObject } from "../../types/core.js";
/**
 * Plugin state interface (subset needed for window dimensions processing)
 */
export interface WindowDimensionsProcessingState {
    needsWindowDimensionsImport: boolean;
    windowDimensionsVariableName: string;
}
/**
 * Check if a style object contains runtime dimension markers
 *
 * @param styleObject - Style object to check
 * @returns true if the style object contains runtime dimension markers
 *
 * @example
 * hasRuntimeDimensions({ width: "{{RUNTIME:dimensions.width}}" }) // true
 * hasRuntimeDimensions({ width: 100 }) // false
 */
export declare function hasRuntimeDimensions(styleObject: StyleObject): boolean;
/**
 * Create an inline style object with runtime dimension access
 *
 * Converts runtime markers like "{{RUNTIME:dimensions.width}}" to
 * AST nodes like: { width: _twDimensions.width }
 *
 * @param styleObject - Style object with runtime markers
 * @param state - Plugin state
 * @param t - Babel types
 * @returns AST object expression for inline style
 *
 * @example
 * Input: { width: "{{RUNTIME:dimensions.width}}", height: "{{RUNTIME:dimensions.height}}" }
 * Output: { width: _twDimensions.width, height: _twDimensions.height }
 */
export declare function createRuntimeDimensionObject(styleObject: StyleObject, state: WindowDimensionsProcessingState, t: typeof BabelTypes): BabelTypes.ObjectExpression;
/**
 * Split a style object into static and runtime parts
 *
 * @param styleObject - Style object to split
 * @returns Object with static and runtime style objects
 *
 * @example
 * Input: { width: "{{RUNTIME:dimensions.width}}", padding: 16, backgroundColor: "#fff" }
 * Output: {
 *   static: { padding: 16, backgroundColor: "#fff" },
 *   runtime: { width: "{{RUNTIME:dimensions.width}}" }
 * }
 */
export declare function splitStaticAndRuntimeStyles(styleObject: StyleObject): {
    static: StyleObject;
    runtime: StyleObject;
};
