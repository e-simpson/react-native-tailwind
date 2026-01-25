/**
 * Program visitor - entry and exit points for file processing
 */
import type { NodePath } from "@babel/core";
import type * as BabelTypes from "@babel/types";
import type { PluginState } from "../state.js";
/**
 * Program enter visitor - initialize state for each file
 */
export declare function programEnter(_path: NodePath<BabelTypes.Program>, _state: PluginState): void;
/**
 * Program exit visitor - finalize transformations
 * Injects imports, hooks, and StyleSheet.create
 */
export declare function programExit(path: NodePath<BabelTypes.Program>, state: PluginState, t: typeof BabelTypes): void;
