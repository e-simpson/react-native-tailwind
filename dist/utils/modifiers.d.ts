/**
 * Shared utilities for parsing state modifiers (active:, focus:, disabled:)
 * Used by both runtime parser and Babel plugin
 */
export declare const SUPPORTED_MODIFIERS: readonly ["active", "focus", "disabled"];
export type SupportedModifier = (typeof SUPPORTED_MODIFIERS)[number];
/**
 * Detect if a className contains any state modifiers (active:, focus:, disabled:)
 */
export declare function hasModifiers(className: string): boolean;
/**
 * Split className into base classes and modifier-specific classes
 * Returns: { base: string[], modifiers: Map<modifier, string[]> }
 *
 * @example
 * splitModifierClasses('bg-blue-500 active:bg-blue-700 disabled:bg-gray-300')
 * // Returns:
 * // {
 * //   base: ['bg-blue-500'],
 * //   modifiers: Map {
 * //     'active' => ['bg-blue-700'],
 * //     'disabled' => ['bg-gray-300']
 * //   }
 * // }
 */
export declare function splitModifierClasses(className: string): {
    base: string[];
    modifiers: Map<SupportedModifier, string[]>;
};
