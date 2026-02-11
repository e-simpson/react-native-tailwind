/**
 * CSS @apply loader for custom class aliases.
 * Loads .css files and extracts rules like:
 * .btn { @apply px-4 py-2 rounded; }
 */

import * as fs from "fs";
import * as path from "path";
import { findTailwindConfig } from "./config-loader.js";

export type ApplyClassRegistry = Map<string, string[]>;

export type ApplyOptions = {
  files?: string[];
};

type CachedApplyFile = {
  mtimeMs: number;
  size: number;
  registry: ApplyClassRegistry;
};

const applyFileCache = new Map<string, CachedApplyFile>();
const warnedMessages = new Set<string>();

function warn(message: string): void {
  if (process.env.NODE_ENV === "production") {
    return;
  }

  if (warnedMessages.has(message)) {
    return;
  }

  warnedMessages.add(message);
  console.warn(message);
}

function resolveBaseDir(filename: string): string {
  const startDir = filename ? path.dirname(filename) : process.cwd();
  const configPath = findTailwindConfig(startDir);
  return configPath ? path.dirname(configPath) : process.cwd();
}

function resolveApplyFilePath(filePath: string, filename: string): string {
  if (path.isAbsolute(filePath)) {
    return path.normalize(filePath);
  }

  const baseDir = resolveBaseDir(filename);
  return path.resolve(baseDir, filePath);
}

function parseApplyTokens(body: string): { tokens: string[]; hasApply: boolean } {
  const applyTokens: string[] = [];
  let hasApply = false;
  const applyRegex = /@apply\s+([^;{}]+);/g;

  for (const match of body.matchAll(applyRegex)) {
    hasApply = true;
    const classes = match[1].trim().split(/\s+/).filter(Boolean);
    applyTokens.push(...classes);
  }

  return { tokens: applyTokens, hasApply };
}

function parseClassSelector(selector: string): string | null {
  const trimmed = selector.trim();
  const match = trimmed.match(/^\.([A-Za-z0-9_-]+)$/);
  return match ? match[1] : null;
}

function mergeRegistryEntry(registry: ApplyClassRegistry, className: string, tokens: string[]): void {
  const existing = registry.get(className) ?? [];
  existing.push(...tokens);
  registry.set(className, existing);
}

function parseApplyCss(content: string, filePath: string): ApplyClassRegistry {
  const registry: ApplyClassRegistry = new Map();
  const css = content.replace(/\/\*[\s\S]*?\*\//g, "");
  const blockRegex = /([^{}]+)\{([^{}]*)\}/g;
  let sawApplyToken = false;
  let sawParsedApplyRule = false;

  for (const match of css.matchAll(blockRegex)) {
    const selectors = match[1]?.trim();
    const body = match[2] ?? "";
    if (!selectors) {
      continue;
    }

    const { tokens, hasApply } = parseApplyTokens(body);
    if (!hasApply) {
      continue;
    }

    sawApplyToken = true;
    if (tokens.length === 0) {
      warn(`[react-native-tailwind] Ignoring empty @apply declaration in ${filePath}`);
      continue;
    }

    const unsupportedBody = body.replace(/@apply\s+[^;{}]+;/g, "").trim();
    if (unsupportedBody) {
      warn(
        `[react-native-tailwind] Ignoring non-@apply declarations in ${filePath}: "${unsupportedBody.replace(/\s+/g, " ")}"`,
      );
    }

    for (const selector of selectors
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean)) {
      const className = parseClassSelector(selector);
      if (!className) {
        warn(
          `[react-native-tailwind] Unsupported selector "${selector}" in ${filePath}. ` +
            "Only simple class selectors are supported (e.g. .button).",
        );
        continue;
      }

      mergeRegistryEntry(registry, className, tokens);
      sawParsedApplyRule = true;
    }
  }

  if (sawApplyToken && !sawParsedApplyRule) {
    warn(`[react-native-tailwind] Found @apply in ${filePath}, but no supported class selectors were parsed.`);
  }

  return registry;
}

function loadApplyFile(filePath: string): ApplyClassRegistry {
  if (!fs.existsSync(filePath)) {
    warn(`[react-native-tailwind] CSS apply file not found: ${filePath}`);
    return new Map();
  }

  const stat = fs.statSync(filePath);
  const cached = applyFileCache.get(filePath);
  if (cached?.mtimeMs === stat.mtimeMs && cached?.size === stat.size) {
    return cached.registry;
  }

  const content = fs.readFileSync(filePath, "utf8");
  const registry = parseApplyCss(content, filePath);

  applyFileCache.set(filePath, {
    mtimeMs: stat.mtimeMs,
    size: stat.size,
    registry,
  });

  return registry;
}

/**
 * Load custom class registry from configured CSS files.
 */
export function loadApplyClassRegistry(
  options: ApplyOptions | undefined,
  filename: string,
): ApplyClassRegistry {
  const files = options?.files ?? [];
  if (files.length === 0) {
    return new Map();
  }

  const combined: ApplyClassRegistry = new Map();

  for (const file of files) {
    const resolvedPath = resolveApplyFilePath(file, filename);
    const fileRegistry = loadApplyFile(resolvedPath);

    for (const [className, tokens] of fileRegistry.entries()) {
      mergeRegistryEntry(combined, className, tokens);
    }
  }

  return combined;
}

function resolveAlias(
  alias: string,
  registry: ApplyClassRegistry,
  resolvedAliasCache: Map<string, string[]>,
  stack: string[],
): string[] {
  const cached = resolvedAliasCache.get(alias);
  if (cached) {
    return cached;
  }

  if (stack.includes(alias)) {
    const cycle = [...stack, alias].join(" -> ");
    throw new Error(`[react-native-tailwind] Circular @apply class reference detected: ${cycle}`);
  }

  const rawTokens = registry.get(alias) ?? [];
  const nextStack = [...stack, alias];
  const resolvedTokens: string[] = [];

  for (const token of rawTokens) {
    if (registry.has(token)) {
      resolvedTokens.push(...resolveAlias(token, registry, resolvedAliasCache, nextStack));
    } else {
      resolvedTokens.push(token);
    }
  }

  resolvedAliasCache.set(alias, resolvedTokens);
  return resolvedTokens;
}

/**
 * Expand custom classes in a className string.
 */
export function expandApplyClasses(
  className: string,
  registry: ApplyClassRegistry,
  classNameCache: Map<string, string>,
  resolvedAliasCache: Map<string, string[]>,
): string {
  const normalized = className.trim().replace(/\s+/g, " ");
  if (!normalized || registry.size === 0) {
    return normalized;
  }

  const cachedClassName = classNameCache.get(normalized);
  if (cachedClassName) {
    return cachedClassName;
  }

  const expandedTokens: string[] = [];
  for (const token of normalized.split(" ").filter(Boolean)) {
    if (registry.has(token)) {
      expandedTokens.push(...resolveAlias(token, registry, resolvedAliasCache, []));
    } else {
      expandedTokens.push(token);
    }
  }

  const expandedClassName = expandedTokens.join(" ");
  classNameCache.set(normalized, expandedClassName);
  return expandedClassName;
}
