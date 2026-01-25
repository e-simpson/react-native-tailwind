/**
 * Utility functions for processing dynamic className expressions
 */
import type { NodePath } from "@babel/core";
import type * as BabelTypes from "@babel/types";
import type { CustomTheme, ParsedModifier } from "../../parser/index.js";
import type { SchemeModifierConfig } from "../../types/config.js";
import type { StyleObject } from "../../types/core.js";
/**
 * Plugin state interface (subset needed for dynamic processing)
 */
export interface DynamicProcessingState {
    styleRegistry: Map<string, StyleObject>;
    customTheme: CustomTheme;
    schemeModifierConfig: SchemeModifierConfig;
    stylesIdentifier: string;
    needsPlatformImport: boolean;
    needsColorSchemeImport: boolean;
    colorSchemeVariableName: string;
    functionComponentsNeedingColorScheme: Set<NodePath<BabelTypes.Function>>;
    reactCompilerCompatible: boolean;
    colorSchemeStyleKeys: Map<string, Set<string>>;
}
/**
 * Type for the splitModifierClasses function
 */
export type SplitModifierClassesFn = (className: string) => {
    baseClasses: string[];
    modifierClasses: ParsedModifier[];
};
/**
 * Type for the processPlatformModifiers function
 */
export type ProcessPlatformModifiersFn = (modifiers: ParsedModifier[], state: DynamicProcessingState, parseClassName: (className: string, customTheme?: CustomTheme) => StyleObject, generateStyleKey: (className: string) => string, t: typeof BabelTypes) => BabelTypes.Expression;
/**
 * Type for the processColorSchemeModifiers function
 */
export type ProcessColorSchemeModifiersFn = (modifiers: ParsedModifier[], state: DynamicProcessingState, parseClassName: (className: string, customTheme?: CustomTheme) => StyleObject, generateStyleKey: (className: string) => string, t: typeof BabelTypes) => BabelTypes.Expression[];
/**
 * Type for modifier type guard functions
 */
export type ModifierTypeGuardFn = (modifier: unknown) => boolean;
/**
 * Type for the expandSchemeModifier function
 */
export type ExpandSchemeModifierFn = (modifier: ParsedModifier, customColors: Record<string, string>, darkSuffix: string, lightSuffix: string) => ParsedModifier[];
/**
 * Result of processing a dynamic expression
 */
export type DynamicExpressionResult = {
    expression: BabelTypes.Expression;
    staticParts?: string[];
};
/**
 * Process a dynamic className expression
 * Extracts static strings and transforms the expression to use pre-compiled styles
 */
export declare function processDynamicExpression(expression: BabelTypes.Expression, state: DynamicProcessingState, parseClassName: (className: string, customTheme?: CustomTheme) => StyleObject, generateStyleKey: (className: string) => string, splitModifierClasses: SplitModifierClassesFn, processPlatformModifiers: ProcessPlatformModifiersFn, processColorSchemeModifiers: ProcessColorSchemeModifiersFn, componentScope: NodePath<BabelTypes.Function> | null, isPlatformModifier: ModifierTypeGuardFn, isColorSchemeModifier: ModifierTypeGuardFn, isSchemeModifier: ModifierTypeGuardFn, expandSchemeModifier: ExpandSchemeModifierFn, t: typeof BabelTypes): {
    expression: BabelTypes.Expression;
    staticParts: string[] | undefined;
} | {
    expression: BabelTypes.ConditionalExpression;
} | {
    expression: BabelTypes.LogicalExpression;
} | null;
