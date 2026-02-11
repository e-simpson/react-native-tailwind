/**
 * JSXAttribute visitor - handles className attribute transformations
 */
import type { NodePath } from "@babel/core";
import type * as BabelTypes from "@babel/types";
import type { PluginState } from "../state.js";
/**
 * JSXAttribute visitor
 * Handles all className attribute transformations (static, dynamic, modifiers)
 */
export declare function jsxAttributeVisitor(path: NodePath<BabelTypes.JSXAttribute>, state: PluginState, t: typeof BabelTypes): void;
