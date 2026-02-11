import type { CustomTheme } from "./parser/index.js";
import type { NativeStyle, TwStyle } from "./types/runtime.js";
/**
 * Runtime configuration type matching Tailwind config structure
 */
export type RuntimeConfig = {
    theme?: {
        extend?: {
            colors?: Record<string, string | Record<string, string>>;
            fontFamily?: Record<string, string | string[]>;
            fontSize?: Record<string, string | number>;
            spacing?: Record<string, string | number>;
        };
    };
};
/**
 * Configure runtime Tailwind settings
 * Matches the structure of tailwind.config.mjs for consistency
 *
 * @param config - Runtime configuration object
 *
 * @example
 * ```typescript
 * import { setConfig } from '@mgcrea/react-native-tailwind/runtime';
 *
 * setConfig({
 *   theme: {
 *     extend: {
 *       colors: {
 *         primary: '#007AFF',
 *         secondary: '#5856D6',
 *         brand: {
 *           light: '#FF6B6B',
 *           dark: '#CC0000'
 *         }
 *       }
 *     }
 *   }
 * });
 * ```
 */
export declare function setConfig(config: RuntimeConfig): void;
/**
 * Get currently configured custom theme
 */
export declare function getCustomTheme(): CustomTheme;
/**
 * Get currently configured custom colors (for backwards compatibility)
 * @deprecated Use getCustomTheme() instead
 */
export declare function getCustomColors(): Record<string, string> | undefined;
/**
 * Clear the memoization cache
 * Useful for testing or when you want to force re-parsing
 */
export declare function clearCache(): void;
/**
 * Get cache statistics (for debugging/monitoring)
 */
export declare function getCacheStats(): {
    size: number;
    keys: string[];
};
/**
 * Runtime Tailwind CSS template tag for React Native
 *
 * Parses Tailwind class names at runtime and returns a TwStyle object with separate
 * properties for base styles and modifier styles (active, focus, disabled).
 * Results are memoized for performance.
 *
 * @param strings - Template string parts
 * @param values - Interpolated values
 * @returns TwStyle object with style, activeStyle, focusStyle, and disabledStyle properties
 *
 * @example
 * ```tsx
 * import { tw } from '@mgcrea/react-native-tailwind/runtime';
 *
 * // Simple usage - access .style property
 * <View style={tw`m-4 p-2 bg-blue-500`.style} />
 *
 * // With interpolations
 * <View style={tw`flex-1 ${isActive && 'bg-blue-500'} p-4`.style} />
 *
 * // With state modifiers - access activeStyle/focusStyle for animations
 * const styles = tw`bg-blue-500 active:bg-blue-700 focus:bg-blue-800`;
 * <Pressable style={(state) => [
 *   styles.style,
 *   state.pressed && styles.activeStyle,
 *   state.focused && styles.focusStyle
 * ]}>
 *   <Text>Press me</Text>
 * </Pressable>
 *
 * // Use with reanimated for animations with raw values
 * const styles = tw`bg-blue-500 active:bg-blue-700`;
 * const animatedStyles = useAnimatedStyle(() => ({
 *   ...styles.style,
 *   backgroundColor: interpolateColor(
 *     progress.value,
 *     [0, 1],
 *     [styles.style.backgroundColor, styles.activeStyle?.backgroundColor]
 *   )
 * }));
 * ```
 */
export declare function tw<T extends NativeStyle = NativeStyle>(strings: TemplateStringsArray, ...values: unknown[]): TwStyle<T>;
/**
 * String version of tw for cases where template literals aren't needed
 *
 * Parses Tailwind class names at runtime and returns a TwStyle object with separate
 * properties for base styles and modifier styles (active, focus, disabled).
 *
 * @param className - Space-separated Tailwind class names
 * @returns TwStyle object with style, activeStyle, focusStyle, and disabledStyle properties
 *
 * @example
 * ```tsx
 * import { twStyle } from '@mgcrea/react-native-tailwind/runtime';
 *
 * // Simple usage - access .style property
 * <View style={twStyle('m-4 p-2 bg-blue-500').style} />
 *
 * // With state modifiers
 * const styles = twStyle('bg-blue-500 active:bg-blue-700 focus:bg-blue-800');
 * <Pressable style={(state) => [
 *   styles.style,
 *   state.pressed && styles.activeStyle,
 *   state.focused && styles.focusStyle
 * ]}>
 *   <Text>Press me</Text>
 * </Pressable>
 * ```
 */
export declare function twStyle<T extends NativeStyle = NativeStyle>(className: string): TwStyle<T> | undefined;
