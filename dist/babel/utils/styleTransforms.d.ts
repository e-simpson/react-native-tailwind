/**
 * Utility functions for transforming and merging style attributes
 */
import type { NodePath } from "@babel/core";
import type * as BabelTypes from "@babel/types";
import type { DynamicExpressionResult } from "./dynamicProcessing.js";
/**
 * Helper to find existing style attribute on parent JSX element
 */
export declare function findStyleAttribute(path: NodePath, targetStyleProp: string, t: typeof BabelTypes): BabelTypes.JSXAttribute | undefined;
/**
 * Replace className with style attribute
 */
export declare function replaceWithStyleAttribute(classNamePath: NodePath, styleKey: string, targetStyleProp: string, stylesIdentifier: string, t: typeof BabelTypes): void;
/**
 * Merge className styles with existing style prop
 */
export declare function mergeStyleAttribute(classNamePath: NodePath, styleAttribute: BabelTypes.JSXAttribute, styleKey: string, stylesIdentifier: string, t: typeof BabelTypes): void;
/**
 * Replace className with dynamic style attribute
 */
export declare function replaceDynamicWithStyleAttribute(classNamePath: NodePath, result: DynamicExpressionResult, targetStyleProp: string, t: typeof BabelTypes): void;
/**
 * Merge dynamic className styles with existing style prop
 */
export declare function mergeDynamicStyleAttribute(classNamePath: NodePath, styleAttribute: BabelTypes.JSXAttribute, result: DynamicExpressionResult, t: typeof BabelTypes): void;
/**
 * Replace className with style function attribute (for Pressable with modifiers)
 */
export declare function replaceWithStyleFunctionAttribute(classNamePath: NodePath, styleFunctionExpression: BabelTypes.Expression, targetStyleProp: string, t: typeof BabelTypes): void;
/**
 * Merge className style function with existing style prop (for Pressable with modifiers)
 */
export declare function mergeStyleFunctionAttribute(classNamePath: NodePath, styleAttribute: BabelTypes.JSXAttribute, styleFunctionExpression: BabelTypes.Expression, t: typeof BabelTypes): void;
/**
 * Add or merge placeholderTextColor prop on a JSX element
 * Handles merging with existing placeholderTextColor if present
 */
export declare function addOrMergePlaceholderTextColorProp(jsxOpeningElement: BabelTypes.JSXOpeningElement, color: string, t: typeof BabelTypes): void;
