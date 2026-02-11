/**
 * Plugin state and options types
 */
import type { NodePath, PluginPass } from "@babel/core";
import type * as BabelTypes from "@babel/types";
import type { SchemeModifierConfig } from "../../types/config.js";
import type { StyleObject } from "../../types/core.js";
import type { CustomTheme } from "../config-loader.js";
/**
 * Plugin options
 */
export type PluginOptions = {
    /**
     * List of JSX attribute names to transform (in addition to or instead of 'className')
     * Supports exact matches and glob patterns:
     * - Exact: 'className', 'containerClassName'
     * - Glob: '*ClassName' (matches any attribute ending in 'ClassName')
     *
     * @default ['className', 'contentContainerClassName', 'columnWrapperClassName', 'ListHeaderComponentClassName', 'ListFooterComponentClassName']
     */
    attributes?: string[];
    /**
     * Custom identifier name for the generated StyleSheet constant
     *
     * @default '_twStyles'
     */
    stylesIdentifier?: string;
    /**
     * Configuration for the scheme: modifier that expands to both dark: and light: modifiers
     *
     * @example
     * {
     *   darkSuffix: '-dark',  // scheme:bg-primary -> dark:bg-primary-dark
     *   lightSuffix: '-light' // scheme:bg-primary -> light:bg-primary-light
     * }
     *
     * @default { darkSuffix: '-dark', lightSuffix: '-light' }
     */
    schemeModifier?: {
        darkSuffix?: string;
        lightSuffix?: string;
    };
    /**
     * Configuration for color scheme hook import (dark:/light: modifiers)
     *
     * Allows using custom color scheme hooks from theme providers instead of
     * React Native's built-in useColorScheme.
     *
     * @example
     * // Use custom hook from theme provider
     * {
     *   importFrom: '@/hooks/useColorScheme',
     *   importName: 'useColorScheme'
     * }
     *
     * @example
     * // Use React Navigation theme
     * {
     *   importFrom: '@react-navigation/native',
     *   importName: 'useTheme'  // You'd wrap this to return ColorSchemeName
     * }
     *
     * @default { importFrom: 'react-native', importName: 'useColorScheme' }
     */
    colorScheme?: {
        /**
         * Module to import the color scheme hook from
         * @default 'react-native'
         */
        importFrom?: string;
        /**
         * Name of the hook to import
         * @default 'useColorScheme'
         */
        importName?: string;
    };
};
/**
 * Plugin state - passed through all visitors
 */
export type PluginState = PluginPass & {
    styleRegistry: Map<string, StyleObject>;
    hasClassNames: boolean;
    hasStyleSheetImport: boolean;
    hasPlatformImport: boolean;
    needsPlatformImport: boolean;
    hasColorSchemeImport: boolean;
    needsColorSchemeImport: boolean;
    colorSchemeVariableName: string;
    colorSchemeImportSource: string;
    colorSchemeHookName: string;
    colorSchemeLocalIdentifier?: string;
    hasWindowDimensionsImport: boolean;
    needsWindowDimensionsImport: boolean;
    windowDimensionsVariableName: string;
    windowDimensionsLocalIdentifier?: string;
    hasI18nManagerImport: boolean;
    needsI18nManagerImport: boolean;
    i18nManagerVariableName: string;
    i18nManagerLocalIdentifier?: string;
    customTheme: CustomTheme;
    schemeModifierConfig: SchemeModifierConfig;
    supportedAttributes: Set<string>;
    attributePatterns: RegExp[];
    stylesIdentifier: string;
    twImportNames: Set<string>;
    hasTwImport: boolean;
    reactNativeImportPath?: NodePath<BabelTypes.ImportDeclaration>;
    functionComponentsNeedingColorScheme: Set<NodePath<BabelTypes.Function>>;
    functionComponentsNeedingWindowDimensions: Set<NodePath<BabelTypes.Function>>;
};
export declare const DEFAULT_STYLES_IDENTIFIER = "_twStyles";
/**
 * Create initial plugin state for a file
 *
 * @param options - Plugin options from babel config
 * @param filename - Current file being processed
 * @param colorSchemeImportSource - Where to import the color scheme hook from
 * @param colorSchemeHookName - Name of the color scheme hook to import
 * @param schemeModifierConfig - Configuration for scheme: modifier expansion
 * @returns Initial plugin state
 */
export declare function createInitialState(options: PluginOptions | undefined, filename: string, colorSchemeImportSource: string, colorSchemeHookName: string, schemeModifierConfig: SchemeModifierConfig): Partial<PluginState>;
