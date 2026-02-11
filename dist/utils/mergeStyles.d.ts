/**
 * Smart merge utility for StyleObject values
 * Handles transform arrays with "last wins" semantics for same transform types
 */
import type { StyleObject } from "../types/core";
/**
 * Merge two StyleObject instances, handling transform arrays specially
 *
 * @param target - The target object to merge into (mutated)
 * @param source - The source object to merge from
 * @returns The merged target object
 *
 * @example
 * // Standard properties are overwritten (like Object.assign)
 * mergeStyles({ margin: 4 }, { padding: 8 })
 * // => { margin: 4, padding: 8 }
 *
 * @example
 * // Different transform types are combined
 * mergeStyles(
 *   { transform: [{ rotate: '45deg' }] },
 *   { transform: [{ scale: 1.1 }] }
 * )
 * // => { transform: [{ rotate: '45deg' }, { scale: 1.1 }] }
 *
 * @example
 * // Same transform type: last wins (Tailwind parity)
 * mergeStyles(
 *   { transform: [{ rotate: '45deg' }] },
 *   { transform: [{ rotate: '90deg' }] }
 * )
 * // => { transform: [{ rotate: '90deg' }] }
 */
export declare function mergeStyles(target: StyleObject, source: StyleObject): StyleObject;
