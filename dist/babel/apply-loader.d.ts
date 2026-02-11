/**
 * CSS @apply loader for custom class aliases.
 * Loads .css files and extracts rules like:
 * .btn { @apply px-4 py-2 rounded; }
 */
export type ApplyClassRegistry = Map<string, string[]>;
export type ApplyOptions = {
    files?: string[];
};
/**
 * Load custom class registry from configured CSS files.
 */
export declare function loadApplyClassRegistry(options: ApplyOptions | undefined, filename: string): ApplyClassRegistry;
/**
 * Expand custom classes in a className string.
 */
export declare function expandApplyClasses(className: string, registry: ApplyClassRegistry, classNameCache: Map<string, string>, resolvedAliasCache: Map<string, string[]>): string;
