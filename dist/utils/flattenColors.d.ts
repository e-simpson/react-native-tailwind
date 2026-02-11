/**
 * Type representing a nested color structure that can be arbitrarily deep
 */
type NestedColors = {
    [key: string]: string | NestedColors;
};
/**
 * Flatten nested color objects into flat key-value map
 * Example: { brand: { light: '#fff', dark: '#000' } } => { 'brand-light': '#fff', 'brand-dark': '#000' }
 * Special handling for DEFAULT: { primary: { DEFAULT: '#000', 500: '#333' } } => { 'primary': '#000', 'primary-500': '#333' }
 *
 * @param colors - Nested color object where values can be strings or objects
 * @param prefix - Optional prefix for nested keys (used for recursion)
 * @returns Flattened color map with dash-separated keys
 */
export declare function flattenColors(colors: NestedColors, prefix?: string): Record<string, string>;
export {};
