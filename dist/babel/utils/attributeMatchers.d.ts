/**
 * Utility functions for matching and handling JSX attribute names
 */
/**
 * Default className-like attributes (used when no custom attributes are provided)
 */
export declare const DEFAULT_CLASS_ATTRIBUTES: readonly ["className", "contentContainerClassName", "columnWrapperClassName", "ListHeaderComponentClassName", "ListFooterComponentClassName"];
/**
 * Build attribute matching structures from plugin options
 * Separates exact matches from pattern-based matches
 */
export declare function buildAttributeMatchers(attributes: string[]): {
    exactMatches: Set<string>;
    patterns: RegExp[];
};
/**
 * Check if an attribute name matches the configured attributes
 */
export declare function isAttributeSupported(attributeName: string, exactMatches: Set<string>, patterns: RegExp[]): boolean;
/**
 * Get the target style prop name based on the className attribute
 */
export declare function getTargetStyleProp(attributeName: string): string;
