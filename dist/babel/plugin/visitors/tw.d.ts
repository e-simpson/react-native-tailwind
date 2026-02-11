/**
 * tw and twStyle visitors - handles compile-time tw tagged templates and twStyle calls
 */
import type { NodePath } from "@babel/core";
import type * as BabelTypes from "@babel/types";
import type { PluginState } from "../state.js";
/**
 * TaggedTemplateExpression visitor
 * Handles tw`...` tagged template expressions
 */
export declare function taggedTemplateVisitor(path: NodePath<BabelTypes.TaggedTemplateExpression>, state: PluginState, t: typeof BabelTypes): void;
/**
 * CallExpression visitor
 * Handles twStyle('...') call expressions
 */
export declare function callExpressionVisitor(path: NodePath<BabelTypes.CallExpression>, state: PluginState, t: typeof BabelTypes): void;
