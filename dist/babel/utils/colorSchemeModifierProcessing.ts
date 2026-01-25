/**
 * Utility functions for processing color scheme modifiers (dark:, light:)
 */

import type * as BabelTypes from "@babel/types";
import type { ColorSchemeModifierType, CustomTheme, ParsedModifier } from "../../parser/index.js";
import type { StyleObject } from "../../types/core.js";
import { hasRuntimeDimensions } from "./windowDimensionsProcessing.js";

/**
 * Plugin state interface (subset needed for color scheme modifier processing)
 */
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export interface ColorSchemeModifierProcessingState {
  styleRegistry: Map<string, StyleObject>;
  customTheme: CustomTheme;
  stylesIdentifier: string;
  needsColorSchemeImport: boolean;
  colorSchemeVariableName: string;
  // React Compiler compatibility fields
  reactCompilerCompatible: boolean;
  colorSchemeStyleKeys: Map<string, Set<string>>;
}

// Constants for memoized color scheme style object identifiers
// These are kept for backwards compatibility but deprecated
export const DARK_STYLES_IDENTIFIER = "_twDarkStyles";
export const LIGHT_STYLES_IDENTIFIER = "_twLightStyles";

// New identifier for the useMemo-based color scheme styles
export const COLOR_SCHEME_STYLES_IDENTIFIER = "_twColorSchemeStyles";

/**
 * Process color scheme modifiers and generate conditional style expressions
 *
 * @param colorSchemeModifiers - Array of parsed color scheme modifiers
 * @param state - Plugin state
 * @param parseClassName - Function to parse class names into style objects
 * @param generateStyleKey - Function to generate unique style keys
 * @param t - Babel types
 * @returns Array of AST nodes for conditional expressions
 *
 * @example
 * Normal mode:
 * Input: [{ modifier: "dark", baseClass: "bg-gray-900" }, { modifier: "light", baseClass: "bg-white" }]
 * Output: [
 *   _twColorScheme === 'dark' && _twStyles._dark_bg_gray_900,
 *   _twColorScheme === 'light' && _twStyles._light_bg_white
 * ]
 *
 * React Compiler mode (with useMemo):
 * Input: [{ modifier: "dark", baseClass: "bg-gray-900" }, { modifier: "light", baseClass: "bg-white" }]
 * Output: [
 *   _twColorSchemeStyles._dark_bg_gray_900,
 *   _twColorSchemeStyles._light_bg_white
 * ]
 * (The useMemo hook handles the conditional logic based on _twColorScheme)
 */
export function processColorSchemeModifiers(
  colorSchemeModifiers: ParsedModifier[],
  state: ColorSchemeModifierProcessingState,
  parseClassName: (className: string, customTheme?: CustomTheme) => StyleObject,
  generateStyleKey: (className: string) => string,
  t: typeof BabelTypes,
): BabelTypes.Expression[] {
  // Mark that we need useColorScheme import and hook injection
  state.needsColorSchemeImport = true;

  // Group modifiers by color scheme (dark, light)
  const modifiersByScheme = new Map<ColorSchemeModifierType, ParsedModifier[]>();

  for (const mod of colorSchemeModifiers) {
    const scheme = mod.modifier as ColorSchemeModifierType;
    if (!modifiersByScheme.has(scheme)) {
      modifiersByScheme.set(scheme, []);
    }
    const schemeGroup = modifiersByScheme.get(scheme);
    if (schemeGroup) {
      schemeGroup.push(mod);
    }
  }

  // Build conditional expressions for each color scheme
  const conditionalExpressions: BabelTypes.Expression[] = [];

  for (const [scheme, modifiers] of modifiersByScheme) {
    // Parse all classes for this color scheme together
    const classNames = modifiers.map((m) => m.baseClass).join(" ");
    const styleObject = parseClassName(classNames, state.customTheme);

    // Check for runtime dimensions (w-screen, h-screen)
    if (hasRuntimeDimensions(styleObject)) {
      throw new Error(
        `w-screen and h-screen cannot be combined with color scheme modifiers (dark:, light:, scheme:). ` +
          `Found in: "${scheme}:${classNames}". ` +
          `Use w-screen/h-screen without modifiers instead.`,
      );
    }

    const styleKey = generateStyleKey(`${scheme}_${classNames}`);

    // Register style in the registry
    state.styleRegistry.set(styleKey, styleObject);

    // In React Compiler mode, track style keys by scheme for useMemo generation
    if (state.reactCompilerCompatible) {
      let schemeKeys = state.colorSchemeStyleKeys.get(scheme);
      if (!schemeKeys) {
        schemeKeys = new Set();
        state.colorSchemeStyleKeys.set(scheme, schemeKeys);
      }
      schemeKeys.add(styleKey);

      // In React Compiler mode, just reference the memoized style object directly
      // The useMemo hook handles the conditional logic based on _twColorScheme
      // This generates: _twColorSchemeStyles._dark_bg_gray_900
      const styleReference = t.memberExpression(
        t.identifier(COLOR_SCHEME_STYLES_IDENTIFIER),
        t.identifier(styleKey),
      );
      conditionalExpressions.push(styleReference);
    } else {
      // Normal mode: _twColorScheme === 'dark' && _twStyles._dark_bg_gray_900
      const colorSchemeCheck = t.binaryExpression(
        "===",
        t.identifier(state.colorSchemeVariableName),
        t.stringLiteral(scheme),
      );

      const styleReference = t.memberExpression(t.identifier(state.stylesIdentifier), t.identifier(styleKey));

      const conditionalExpression = t.logicalExpression("&&", colorSchemeCheck, styleReference);

      conditionalExpressions.push(conditionalExpression);
    }
  }

  return conditionalExpressions;
}
