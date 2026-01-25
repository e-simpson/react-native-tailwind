/**
 * Component scope detection helpers for hook injection
 */
import type { NodePath } from "@babel/core";
import type * as BabelTypes from "@babel/types";
/**
 * Check if a function path represents a valid component scope for hook injection
 * Valid scopes:
 * - Top-level FunctionDeclaration
 * - FunctionExpression/ArrowFunctionExpression in top-level VariableDeclarator (with PascalCase name)
 * - NOT class methods, NOT nested functions, NOT inline callbacks
 *
 * @param functionPath - Path to the function to check
 * @param t - Babel types
 * @returns true if function is a valid component scope
 */
export declare function isComponentScope(functionPath: NodePath<BabelTypes.Function>, t: typeof BabelTypes): boolean;
/**
 * Find the nearest valid component scope for hook injection
 * Climbs the AST from the current path to find a component-level function
 *
 * @param path - Starting path (e.g., JSXAttribute)
 * @param t - Babel types
 * @returns NodePath to component function, or null if not found
 */
export declare function findComponentScope(path: NodePath, t: typeof BabelTypes): NodePath<BabelTypes.Function> | null;
