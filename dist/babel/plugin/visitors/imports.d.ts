/**
 * ImportDeclaration visitor - tracks existing imports
 */
import type { NodePath } from "@babel/core";
import type * as BabelTypes from "@babel/types";
import type { PluginState } from "../state.js";
/**
 * ImportDeclaration visitor
 * Tracks existing imports from react-native and the main package
 */
export declare function importDeclarationVisitor(path: NodePath<BabelTypes.ImportDeclaration>, state: PluginState, t: typeof BabelTypes): void;
