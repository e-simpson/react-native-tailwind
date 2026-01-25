/**
 * Tailwind config loader for Babel plugin
 * Discovers and loads tailwind.config.* files from the project
 */
export type TailwindConfig = {
    theme?: {
        extend?: {
            colors?: Record<string, string | Record<string, string>>;
            fontFamily?: Record<string, string | string[]>;
            fontSize?: Record<string, string | number>;
            spacing?: Record<string, string | number>;
            [key: string]: unknown;
        };
        colors?: Record<string, string | Record<string, string>>;
        fontFamily?: Record<string, string | string[]>;
        fontSize?: Record<string, string | number>;
        spacing?: Record<string, string | number>;
        [key: string]: unknown;
    };
};
/**
 * Check for unsupported theme extensions and warn the user
 * @internal Exported for testing
 */
export declare function warnUnsupportedThemeKeys(config: TailwindConfig, configPath: string): void;
/**
 * Find tailwind.config.* file by traversing up from startDir
 */
export declare function findTailwindConfig(startDir: string): string | null;
/**
 * Load and parse tailwind config file
 */
export declare function loadTailwindConfig(configPath: string): TailwindConfig | null;
/**
 * Custom theme configuration extracted from tailwind.config
 */
export type CustomTheme = {
    colors: Record<string, string>;
    fontFamily: Record<string, string>;
    fontSize: Record<string, number>;
    spacing: Record<string, number>;
};
/**
 * Extract all custom theme extensions from tailwind config
 * Prefers theme.extend.* over theme.* to avoid overriding defaults
 */
export declare function extractCustomTheme(filename: string): CustomTheme;
