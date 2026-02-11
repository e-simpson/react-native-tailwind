/**
 * Utility functions for injecting StyleSheet imports and style definitions
 */
import type { NodePath } from "@babel/core";
import type * as BabelTypes from "@babel/types";
import type { StyleObject } from "../../types/core.js";
/**
 * Add StyleSheet import to the file or merge with existing react-native import
 */
export declare function addStyleSheetImport(path: NodePath<BabelTypes.Program>, t: typeof BabelTypes): void;
/**
 * Add Platform import to the file or merge with existing react-native import
 */
export declare function addPlatformImport(path: NodePath<BabelTypes.Program>, t: typeof BabelTypes): void;
/**
 * Add useColorScheme import to the file or merge with existing react-native import
 */
export declare function addColorSchemeImport(path: NodePath<BabelTypes.Program>, importSource: string, hookName: string, t: typeof BabelTypes): void;
/**
 * Inject color scheme hook call at the top of a function component
 *
 * @param functionPath - Path to the function component
 * @param colorSchemeVariableName - Name for the color scheme variable
 * @param hookName - Name of the hook to call (e.g., 'useColorScheme')
 * @param localIdentifier - Local identifier if hook is already imported with an alias
 * @param t - Babel types
 * @returns true if hook was injected, false if already exists
 */
export declare function injectColorSchemeHook(functionPath: NodePath<BabelTypes.Function>, colorSchemeVariableName: string, hookName: string, localIdentifier: string | undefined, t: typeof BabelTypes): boolean;
/**
 * Add I18nManager import to the file or merge with existing react-native import
 */
export declare function addI18nManagerImport(path: NodePath<BabelTypes.Program>, t: typeof BabelTypes): void;
/**
 * Inject I18nManager.isRTL variable at the top of the file (after imports and directives)
 *
 * Unlike hooks (useColorScheme, useWindowDimensions), I18nManager.isRTL is not a hook
 * and can be accessed at module level. This is injected once per file.
 *
 * @param path - Program path
 * @param variableName - Name for the RTL variable (e.g., '_twIsRTL')
 * @param localIdentifier - Local identifier if I18nManager is already imported with an alias
 * @param t - Babel types
 */
export declare function injectI18nManagerVariable(path: NodePath<BabelTypes.Program>, variableName: string, localIdentifier: string | undefined, t: typeof BabelTypes): void;
/**
 * Add useWindowDimensions import to the file or merge with existing react-native import
 */
export declare function addWindowDimensionsImport(path: NodePath<BabelTypes.Program>, t: typeof BabelTypes): void;
/**
 * Inject useWindowDimensions hook call at the top of a function component
 *
 * @param functionPath - Path to the function component
 * @param dimensionsVariableName - Name for the dimensions variable
 * @param hookName - Name of the hook to call (e.g., 'useWindowDimensions')
 * @param localIdentifier - Local identifier if hook is already imported with an alias
 * @param t - Babel types
 * @returns true if hook was injected, false if already exists
 */
export declare function injectWindowDimensionsHook(functionPath: NodePath<BabelTypes.Function>, dimensionsVariableName: string, hookName: string, localIdentifier: string | undefined, t: typeof BabelTypes): boolean;
/**
 * Inject StyleSheet.create with all collected styles at the top of the file
 * This ensures the styles object is defined before any code that references it
 */
export declare function injectStylesAtTop(path: NodePath<BabelTypes.Program>, styleRegistry: Map<string, StyleObject>, stylesIdentifier: string, t: typeof BabelTypes): void;
