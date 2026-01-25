/**
 * Babel preset for react-native-tailwind
 * Wraps the plugin as a preset for easier configuration
 */
import type { PluginOptions } from "./plugin.js";
import reactNativeTailwindBabelPlugin from "./plugin.js";
export type { PluginOptions };
export default function reactNativeTailwindBabelPreset(context: unknown, options?: PluginOptions): {
    plugins: (PluginOptions | typeof reactNativeTailwindBabelPlugin | undefined)[][];
};
