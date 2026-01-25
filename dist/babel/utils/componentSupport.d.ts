/**
 * Utility functions for determining component modifier support
 */
import type * as BabelTypes from "@babel/types";
import type { ModifierType } from "../../parser/index.js";
/**
 * Check if a JSX element supports modifiers and determine which modifiers are supported
 * Returns an object with component info and supported modifiers
 */
export declare function getComponentModifierSupport(jsxElement: BabelTypes.Node, t: typeof BabelTypes): {
    component: string;
    supportedModifiers: ModifierType[];
} | null;
/**
 * Get the state property name for a modifier type
 * Maps modifier types to component state parameter properties
 */
export declare function getStatePropertyForModifier(modifier: ModifierType): string;
