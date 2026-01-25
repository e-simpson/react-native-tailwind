/**
 * Babel plugin for react-native-tailwind
 * Transforms className props to style props at compile time
 */
import type { PluginObj } from "@babel/core";
import * as BabelTypes from "@babel/types";
import type { PluginOptions, PluginState } from "./plugin/state.js";
export type { PluginOptions };
export default function reactNativeTailwindBabelPlugin({ types: t }: {
    types: typeof BabelTypes;
}, options?: PluginOptions): PluginObj<PluginState>;
