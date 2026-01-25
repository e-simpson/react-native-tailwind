/**
 * Utility functions for processing tw`...` and twStyle() calls
 */
import type { NodePath } from "@babel/core";
import type * as BabelTypes from "@babel/types";
import type { CustomTheme, ParsedModifier } from "../../parser/index.js";
import type { SchemeModifierConfig } from "../../types/config.js";
import type { StyleObject } from "../../types/core.js";
/**
 * Plugin state interface (subset needed for tw processing)
 */
export interface TwProcessingState {
    styleRegistry: Map<string, StyleObject>;
    customTheme: CustomTheme;
    schemeModifierConfig: SchemeModifierConfig;
    stylesIdentifier: string;
    needsColorSchemeImport: boolean;
    colorSchemeVariableName: string;
    functionComponentsNeedingColorScheme: Set<NodePath<BabelTypes.Function>>;
    colorSchemeLocalIdentifier?: string;
    needsPlatformImport: boolean;
    needsI18nManagerImport: boolean;
    i18nManagerVariableName: string;
    reactCompilerCompatible: boolean;
    colorSchemeStyleKeys: Map<string, Set<string>>;
}
/**
 * Process tw`...` or twStyle('...') call and replace with TwStyle object
 * Generates: { style: styles._base, activeStyle: styles._active, ... }
 * When color-scheme modifiers are present, generates: { style: [base, _twColorScheme === 'dark' && dark, ...] }
 * When platform modifiers are present, generates: { style: [base, Platform.select({ ios: ..., android: ... })] }
 */
export declare function processTwCall(className: string, path: NodePath, state: TwProcessingState, parseClassName: (className: string, customTheme?: CustomTheme) => StyleObject, generateStyleKey: (className: string) => string, splitModifierClasses: (className: string) => {
    baseClasses: string[];
    modifierClasses: ParsedModifier[];
}, findComponentScope: (path: NodePath, t: typeof BabelTypes) => NodePath<BabelTypes.Function> | null, t: typeof BabelTypes): void;
/**
 * Remove tw/twStyle imports from @mgcrea/react-native-tailwind
 * This is called after all tw calls have been transformed
 */
export declare function removeTwImports(path: NodePath<BabelTypes.Program>, t: typeof BabelTypes): void;
