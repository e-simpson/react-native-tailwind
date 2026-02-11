/**
 * Modifier parsing utilities for state-based, platform-specific, color scheme, and directional class names
 * - State modifiers: active:, hover:, focus:, disabled:, placeholder:
 * - Platform modifiers: ios:, android:, web:
 * - Color scheme modifiers: dark:, light:
 * - Directional modifiers: rtl:, ltr: (RTL-aware styling)
 */
export type StateModifierType = "active" | "hover" | "focus" | "disabled" | "placeholder";
export type PlatformModifierType = "ios" | "android" | "web";
export type ColorSchemeModifierType = "dark" | "light";
export type SchemeModifierType = "scheme";
export type DirectionalModifierType = "rtl" | "ltr";
export type ModifierType = StateModifierType | PlatformModifierType | ColorSchemeModifierType | SchemeModifierType | DirectionalModifierType;
export type ParsedModifier = {
    modifier: ModifierType;
    baseClass: string;
};
/**
 * Parse a class name to detect and extract modifiers
 *
 * @param cls - Class name to parse (e.g., "active:bg-blue-500")
 * @returns ParsedModifier if modifier found, null otherwise
 *
 * @example
 * parseModifier("active:bg-blue-500") // { modifier: "active", baseClass: "bg-blue-500" }
 * parseModifier("bg-blue-500") // null
 * parseModifier("hover:focus:bg-blue-500") // null (nested modifiers not supported)
 */
export declare function parseModifier(cls: string): ParsedModifier | null;
/**
 * Check if a class name contains a modifier
 *
 * @param cls - Class name to check
 * @returns true if class has a supported modifier prefix
 */
export declare function hasModifier(cls: string): boolean;
/**
 * Check if a modifier is a state modifier (active, hover, focus, disabled, placeholder)
 *
 * @param modifier - Modifier type to check
 * @returns true if modifier is a state modifier
 */
export declare function isStateModifier(modifier: ModifierType): modifier is StateModifierType;
/**
 * Check if a modifier is a platform modifier (ios, android, web)
 *
 * @param modifier - Modifier type to check
 * @returns true if modifier is a platform modifier
 */
export declare function isPlatformModifier(modifier: ModifierType): modifier is PlatformModifierType;
/**
 * Check if a modifier is a color scheme modifier (dark, light)
 *
 * @param modifier - Modifier type to check
 * @returns true if modifier is a color scheme modifier
 */
export declare function isColorSchemeModifier(modifier: ModifierType): modifier is ColorSchemeModifierType;
/**
 * Check if a modifier is a scheme modifier (scheme)
 *
 * @param modifier - Modifier type to check
 * @returns true if modifier is a scheme modifier
 */
export declare function isSchemeModifier(modifier: ModifierType): modifier is SchemeModifierType;
/**
 * Check if a modifier is a directional modifier (rtl, ltr)
 *
 * @param modifier - Modifier type to check
 * @returns true if modifier is a directional modifier
 */
export declare function isDirectionalModifier(modifier: ModifierType): modifier is DirectionalModifierType;
/**
 * Check if a class name is a color-based utility class
 *
 * @param className - Class name to check
 * @returns true if class is color-based (text-*, bg-*, border-*, outline-*)
 */
export declare function isColorClass(className: string): boolean;
/**
 * Expand scheme modifier into dark and light modifiers
 *
 * @param schemeModifier - Parsed scheme modifier
 * @param customColors - Custom colors from config
 * @param darkSuffix - Suffix for dark variant (default: "-dark")
 * @param lightSuffix - Suffix for light variant (default: "-light")
 * @returns Array of expanded modifiers (dark: and light:), or empty array if validation fails
 *
 * @example
 * expandSchemeModifier(
 *   { modifier: "scheme", baseClass: "text-systemGray" },
 *   { "systemGray-dark": "#333", "systemGray-light": "#ccc" },
 *   "-dark",
 *   "-light"
 * )
 * // Returns: [
 * //   { modifier: "dark", baseClass: "text-systemGray-dark" },
 * //   { modifier: "light", baseClass: "text-systemGray-light" }
 * // ]
 */
export declare function expandSchemeModifier(schemeModifier: ParsedModifier, customColors: Record<string, string>, darkSuffix?: string, lightSuffix?: string): ParsedModifier[];
/**
 * Check if a class should be expanded to directional modifiers
 *
 * @param cls - Class name to check
 * @returns Expansion object if class should expand, undefined otherwise
 */
export declare function getDirectionalExpansion(cls: string): {
    ltr: string;
    rtl: string;
} | undefined;
/**
 * Split a space-separated className string into base and modifier classes
 *
 * @param className - Space-separated class names
 * @returns Object with baseClasses and modifierClasses arrays
 *
 * @example
 * splitModifierClasses("bg-blue-500 active:bg-blue-700 p-4 active:p-6")
 * // {
 * //   baseClasses: ["bg-blue-500", "p-4"],
 * //   modifierClasses: [
 * //     { modifier: "active", baseClass: "bg-blue-700" },
 * //     { modifier: "active", baseClass: "p-6" }
 * //   ]
 * // }
 *
 * @example
 * // text-start/text-end auto-expand to directional modifiers for true RTL support
 * splitModifierClasses("text-start p-4")
 * // {
 * //   baseClasses: ["p-4"],
 * //   modifierClasses: [
 * //     { modifier: "ltr", baseClass: "text-left" },
 * //     { modifier: "rtl", baseClass: "text-right" }
 * //   ]
 * // }
 */
export declare function splitModifierClasses(className: string): {
    baseClasses: string[];
    modifierClasses: ParsedModifier[];
};
