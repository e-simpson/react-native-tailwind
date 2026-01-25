"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/babel/index.ts
var index_exports = {};
__export(index_exports, {
  default: () => reactNativeTailwindBabelPlugin
});
module.exports = __toCommonJS(index_exports);

// src/babel/config-loader.ts
var fs = __toESM(require("fs"), 1);
var path = __toESM(require("path"), 1);

// src/utils/flattenColors.ts
function flattenColors(colors, prefix = "") {
  const result = {};
  for (const [key, value] of Object.entries(colors)) {
    const newKey = key === "DEFAULT" && prefix ? prefix : prefix ? `${prefix}-${key}` : key;
    if (typeof value === "string") {
      result[newKey] = value;
    } else if (typeof value === "object" && value !== null) {
      Object.assign(result, flattenColors(value, newKey));
    }
  }
  return result;
}

// src/babel/config-loader.ts
var SUPPORTED_THEME_KEYS = /* @__PURE__ */ new Set(["colors", "fontFamily", "fontSize", "spacing", "extend"]);
var warnedConfigPaths = /* @__PURE__ */ new Set();
function warnUnsupportedThemeKeys(config, configPath) {
  if (process.env.NODE_ENV === "production" || warnedConfigPaths.has(configPath)) {
    return;
  }
  const unsupportedKeys = [];
  if (config.theme?.extend && typeof config.theme.extend === "object") {
    for (const key of Object.keys(config.theme.extend)) {
      if (!SUPPORTED_THEME_KEYS.has(key)) {
        unsupportedKeys.push(`theme.extend.${key}`);
      }
    }
  }
  if (config.theme && typeof config.theme === "object") {
    for (const key of Object.keys(config.theme)) {
      if (key !== "extend" && !SUPPORTED_THEME_KEYS.has(key)) {
        unsupportedKeys.push(`theme.${key}`);
      }
    }
  }
  if (unsupportedKeys.length > 0) {
    warnedConfigPaths.add(configPath);
    console.warn(
      `[react-native-tailwind] Unsupported theme configuration detected:
  ${unsupportedKeys.join(", ")}

  Currently supported: colors, fontFamily, fontSize, spacing

  These extensions will be ignored. If you need support for these features,
  please open an issue: https://github.com/mgcrea/react-native-tailwind/issues/new`
    );
  }
}
var configCache = /* @__PURE__ */ new Map();
function findTailwindConfig(startDir) {
  let currentDir = startDir;
  const root = path.parse(currentDir).root;
  const configNames = [
    "tailwind.config.mjs",
    "tailwind.config.js",
    "tailwind.config.cjs",
    "tailwind.config.ts"
  ];
  while (currentDir !== root) {
    for (const configName of configNames) {
      const configPath = path.join(currentDir, configName);
      if (fs.existsSync(configPath)) {
        return configPath;
      }
    }
    currentDir = path.dirname(currentDir);
  }
  return null;
}
function loadTailwindConfig(configPath) {
  if (configCache.has(configPath)) {
    return configCache.get(configPath);
  }
  try {
    const resolvedPath = require.resolve(configPath);
    delete require.cache[resolvedPath];
    const config = require(configPath);
    const resolved = "default" in config ? config.default : config;
    configCache.set(configPath, resolved);
    return resolved;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[react-native-tailwind] Failed to load config from ${configPath}:`, error);
    }
    configCache.set(configPath, null);
    return null;
  }
}
function extractCustomTheme(filename) {
  const projectDir = path.dirname(filename);
  const configPath = findTailwindConfig(projectDir);
  if (!configPath) {
    return { colors: {}, fontFamily: {}, fontSize: {}, spacing: {} };
  }
  const config = loadTailwindConfig(configPath);
  if (!config?.theme) {
    return { colors: {}, fontFamily: {}, fontSize: {}, spacing: {} };
  }
  warnUnsupportedThemeKeys(config, configPath);
  if (config.theme.colors && !config.theme.extend?.colors && process.env.NODE_ENV !== "production") {
    console.warn(
      "[react-native-tailwind] Using theme.colors will override all default colors. Use theme.extend.colors to add custom colors while keeping defaults."
    );
  }
  const colors = config.theme.extend?.colors ?? config.theme.colors ?? {};
  if (config.theme.fontFamily && !config.theme.extend?.fontFamily && process.env.NODE_ENV !== "production") {
    console.warn(
      "[react-native-tailwind] Using theme.fontFamily will override all default font families. Use theme.extend.fontFamily to add custom fonts while keeping defaults."
    );
  }
  const fontFamily = config.theme.extend?.fontFamily ?? config.theme.fontFamily ?? {};
  const fontFamilyResult = {};
  for (const [key, value] of Object.entries(fontFamily)) {
    if (Array.isArray(value)) {
      fontFamilyResult[key] = value[0];
    } else {
      fontFamilyResult[key] = value;
    }
  }
  if (config.theme.fontSize && !config.theme.extend?.fontSize && process.env.NODE_ENV !== "production") {
    console.warn(
      "[react-native-tailwind] Using theme.fontSize will override all default font sizes. Use theme.extend.fontSize to add custom font sizes while keeping defaults."
    );
  }
  const fontSize = config.theme.extend?.fontSize ?? config.theme.fontSize ?? {};
  const fontSizeResult = {};
  for (const [key, value] of Object.entries(fontSize)) {
    if (typeof value === "number") {
      fontSizeResult[key] = value;
    } else if (typeof value === "string") {
      const parsed = parseFloat(value.replace(/px$/, ""));
      if (!isNaN(parsed)) {
        fontSizeResult[key] = parsed;
      } else {
        if (process.env.NODE_ENV !== "production") {
          console.warn(
            `[react-native-tailwind] Invalid fontSize value for "${key}": ${value}. Expected number or string like "18px".`
          );
        }
      }
    }
  }
  if (config.theme.spacing && !config.theme.extend?.spacing && process.env.NODE_ENV !== "production") {
    console.warn(
      "[react-native-tailwind] Using theme.spacing will override all default spacing. Use theme.extend.spacing to add custom spacing while keeping defaults."
    );
  }
  const spacing = config.theme.extend?.spacing ?? config.theme.spacing ?? {};
  const spacingResult = {};
  for (const [key, value] of Object.entries(spacing)) {
    if (typeof value === "number") {
      spacingResult[key] = value;
    } else if (typeof value === "string") {
      let parsed;
      if (value.endsWith("rem")) {
        parsed = parseFloat(value.replace(/rem$/, "")) * 16;
      } else {
        parsed = parseFloat(value.replace(/px$/, ""));
      }
      if (!isNaN(parsed)) {
        spacingResult[key] = parsed;
      } else {
        if (process.env.NODE_ENV !== "production") {
          console.warn(
            `[react-native-tailwind] Invalid spacing value for "${key}": ${value}. Expected number or string like "16px" or "1rem".`
          );
        }
      }
    }
  }
  return {
    colors: flattenColors(colors),
    fontFamily: fontFamilyResult,
    fontSize: fontSizeResult,
    spacing: spacingResult
  };
}

// src/babel/utils/attributeMatchers.ts
var DEFAULT_CLASS_ATTRIBUTES = [
  "className",
  "contentContainerClassName",
  "columnWrapperClassName",
  "ListHeaderComponentClassName",
  "ListFooterComponentClassName"
];
function buildAttributeMatchers(attributes) {
  const exactMatches = /* @__PURE__ */ new Set();
  const patterns = [];
  for (const attr of attributes) {
    if (attr.includes("*")) {
      const regexPattern = "^" + attr.replace(/\*/g, ".*") + "$";
      patterns.push(new RegExp(regexPattern));
    } else {
      exactMatches.add(attr);
    }
  }
  return { exactMatches, patterns };
}
function isAttributeSupported(attributeName, exactMatches, patterns) {
  if (exactMatches.has(attributeName)) {
    return true;
  }
  for (const pattern of patterns) {
    if (pattern.test(attributeName)) {
      return true;
    }
  }
  return false;
}
function getTargetStyleProp(attributeName) {
  return attributeName.endsWith("ClassName") ? attributeName.replace("ClassName", "Style") : "style";
}

// src/babel/plugin/state.ts
var DEFAULT_STYLES_IDENTIFIER = "_twStyles";
function createInitialState(options, filename, colorSchemeImportSource, colorSchemeHookName, schemeModifierConfig) {
  const attributes = options?.attributes ?? [...DEFAULT_CLASS_ATTRIBUTES];
  const { exactMatches, patterns } = buildAttributeMatchers(attributes);
  const stylesIdentifier = options?.stylesIdentifier ?? DEFAULT_STYLES_IDENTIFIER;
  const customTheme = extractCustomTheme(filename);
  return {
    styleRegistry: /* @__PURE__ */ new Map(),
    hasClassNames: false,
    hasStyleSheetImport: false,
    hasPlatformImport: false,
    needsPlatformImport: false,
    hasColorSchemeImport: false,
    needsColorSchemeImport: false,
    colorSchemeVariableName: "_twColorScheme",
    colorSchemeImportSource,
    colorSchemeHookName,
    colorSchemeLocalIdentifier: void 0,
    hasWindowDimensionsImport: false,
    needsWindowDimensionsImport: false,
    windowDimensionsVariableName: "_twDimensions",
    windowDimensionsLocalIdentifier: void 0,
    hasI18nManagerImport: false,
    needsI18nManagerImport: false,
    i18nManagerVariableName: "_twIsRTL",
    i18nManagerLocalIdentifier: void 0,
    customTheme,
    schemeModifierConfig,
    supportedAttributes: exactMatches,
    attributePatterns: patterns,
    stylesIdentifier,
    twImportNames: /* @__PURE__ */ new Set(),
    hasTwImport: false,
    reactNativeImportPath: void 0,
    functionComponentsNeedingColorScheme: /* @__PURE__ */ new Set(),
    functionComponentsNeedingWindowDimensions: /* @__PURE__ */ new Set()
  };
}

// src/utils/mergeStyles.ts
function getTransformType(transform) {
  return Object.keys(transform)[0];
}
function mergeTransforms(target, source) {
  const result = [...target];
  for (const sourceTransform of source) {
    const sourceType = getTransformType(sourceTransform);
    const existingIndex = result.findIndex((t) => getTransformType(t) === sourceType);
    if (existingIndex !== -1) {
      result[existingIndex] = sourceTransform;
    } else {
      result.push(sourceTransform);
    }
  }
  return result;
}
function mergeStyles(target, source) {
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const sourceValue = source[key];
      if (key === "transform" && Array.isArray(sourceValue)) {
        const targetValue = target[key];
        if (Array.isArray(targetValue)) {
          target.transform = mergeTransforms(targetValue, sourceValue);
        } else {
          target[key] = sourceValue;
        }
      } else {
        target[key] = sourceValue;
      }
    }
  }
  return target;
}

// src/parser/aspectRatio.ts
var ASPECT_RATIO_PRESETS = {
  "aspect-auto": void 0,
  // Remove aspect ratio
  "aspect-square": 1,
  // 1:1
  "aspect-video": 16 / 9
  // 16:9
};
function parseArbitraryAspectRatio(value) {
  const match = value.match(/^\[(\d+)\/(\d+)\]$/);
  if (match) {
    const numerator = Number.parseInt(match[1], 10);
    const denominator = Number.parseInt(match[2], 10);
    if (denominator === 0) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(`[react-native-tailwind] Invalid aspect ratio: ${value}. Denominator cannot be zero.`);
      }
      return null;
    }
    return numerator / denominator;
  }
  return null;
}
function parseAspectRatio(cls) {
  if (!cls.startsWith("aspect-")) {
    return null;
  }
  if (cls in ASPECT_RATIO_PRESETS) {
    const aspectRatio2 = ASPECT_RATIO_PRESETS[cls];
    if (aspectRatio2 === void 0) {
      return { aspectRatio: void 0 };
    }
    return { aspectRatio: aspectRatio2 };
  }
  const arbitraryValue = cls.substring(7);
  const aspectRatio = parseArbitraryAspectRatio(arbitraryValue);
  if (aspectRatio !== null) {
    return { aspectRatio };
  }
  return null;
}

// src/config/tailwind.ts
var TAILWIND_COLORS = {
  red: {
    "50": "#fef2f2",
    "100": "#ffe2e2",
    "200": "#ffc9c9",
    "300": "#ffa2a2",
    "400": "#ff6467",
    "500": "#fb2c36",
    "600": "#e7000b",
    "700": "#c10007",
    "800": "#9f0712",
    "900": "#82181a",
    "950": "#460809"
  },
  orange: {
    "50": "#fff7ed",
    "100": "#ffedd4",
    "200": "#ffd6a7",
    "300": "#ffb86a",
    "400": "#ff8904",
    "500": "#ff6900",
    "600": "#f54900",
    "700": "#ca3500",
    "800": "#9f2d00",
    "900": "#7e2a0c",
    "950": "#441306"
  },
  amber: {
    "50": "#fffbeb",
    "100": "#fef3c6",
    "200": "#fee685",
    "300": "#ffd230",
    "400": "#ffb900",
    "500": "#fe9a00",
    "600": "#e17100",
    "700": "#bb4d00",
    "800": "#973c00",
    "900": "#7b3306",
    "950": "#461901"
  },
  yellow: {
    "50": "#fefce8",
    "100": "#fef9c2",
    "200": "#fff085",
    "300": "#ffdf20",
    "400": "#fdc700",
    "500": "#f0b100",
    "600": "#d08700",
    "700": "#a65f00",
    "800": "#894b00",
    "900": "#733e0a",
    "950": "#432004"
  },
  lime: {
    "50": "#f7fee7",
    "100": "#ecfcca",
    "200": "#d8f999",
    "300": "#bbf451",
    "400": "#9ae600",
    "500": "#7ccf00",
    "600": "#5ea500",
    "700": "#497d00",
    "800": "#3c6300",
    "900": "#35530e",
    "950": "#192e03"
  },
  green: {
    "50": "#f0fdf4",
    "100": "#dcfce7",
    "200": "#b9f8cf",
    "300": "#7bf1a8",
    "400": "#05df72",
    "500": "#00c950",
    "600": "#00a63e",
    "700": "#008236",
    "800": "#016630",
    "900": "#0d542b",
    "950": "#032e15"
  },
  emerald: {
    "50": "#ecfdf5",
    "100": "#d0fae5",
    "200": "#a4f4cf",
    "300": "#5ee9b5",
    "400": "#00d492",
    "500": "#00bc7d",
    "600": "#009966",
    "700": "#007a55",
    "800": "#006045",
    "900": "#004f3b",
    "950": "#002c22"
  },
  teal: {
    "50": "#f0fdfa",
    "100": "#cbfbf1",
    "200": "#96f7e4",
    "300": "#46ecd5",
    "400": "#00d5be",
    "500": "#00bba7",
    "600": "#009689",
    "700": "#00786f",
    "800": "#005f5a",
    "900": "#0b4f4a",
    "950": "#022f2e"
  },
  cyan: {
    "50": "#ecfeff",
    "100": "#cefafe",
    "200": "#a2f4fd",
    "300": "#53eafd",
    "400": "#00d3f2",
    "500": "#00b8db",
    "600": "#0092b8",
    "700": "#007595",
    "800": "#005f78",
    "900": "#104e64",
    "950": "#053345"
  },
  sky: {
    "50": "#f0f9ff",
    "100": "#dff2fe",
    "200": "#b8e6fe",
    "300": "#74d4ff",
    "400": "#00bcff",
    "500": "#00a6f4",
    "600": "#0084d1",
    "700": "#0069a8",
    "800": "#00598a",
    "900": "#024a70",
    "950": "#052f4a"
  },
  blue: {
    "50": "#eff6ff",
    "100": "#dbeafe",
    "200": "#bedbff",
    "300": "#8ec5ff",
    "400": "#51a2ff",
    "500": "#2b7fff",
    "600": "#155dfc",
    "700": "#1447e6",
    "800": "#193cb8",
    "900": "#1c398e",
    "950": "#162456"
  },
  indigo: {
    "50": "#eef2ff",
    "100": "#e0e7ff",
    "200": "#c6d2ff",
    "300": "#a3b3ff",
    "400": "#7c86ff",
    "500": "#615fff",
    "600": "#4f39f6",
    "700": "#432dd7",
    "800": "#372aac",
    "900": "#312c85",
    "950": "#1e1a4d"
  },
  violet: {
    "50": "#f5f3ff",
    "100": "#ede9fe",
    "200": "#ddd6ff",
    "300": "#c4b4ff",
    "400": "#a684ff",
    "500": "#8e51ff",
    "600": "#7f22fe",
    "700": "#7008e7",
    "800": "#5d0ec0",
    "900": "#4d179a",
    "950": "#2f0d68"
  },
  purple: {
    "50": "#faf5ff",
    "100": "#f3e8ff",
    "200": "#e9d4ff",
    "300": "#dab2ff",
    "400": "#c27aff",
    "500": "#ad46ff",
    "600": "#9810fa",
    "700": "#8200db",
    "800": "#6e11b0",
    "900": "#59168b",
    "950": "#3c0366"
  },
  fuchsia: {
    "50": "#fdf4ff",
    "100": "#fae8ff",
    "200": "#f6cfff",
    "300": "#f4a8ff",
    "400": "#ed6aff",
    "500": "#e12afb",
    "600": "#c800de",
    "700": "#a800b7",
    "800": "#8a0194",
    "900": "#721378",
    "950": "#4b004f"
  },
  pink: {
    "50": "#fdf2f8",
    "100": "#fce7f3",
    "200": "#fccee8",
    "300": "#fda5d5",
    "400": "#fb64b6",
    "500": "#f6339a",
    "600": "#e60076",
    "700": "#c6005c",
    "800": "#a3004c",
    "900": "#861043",
    "950": "#510424"
  },
  rose: {
    "50": "#fff1f2",
    "100": "#ffe4e6",
    "200": "#ffccd3",
    "300": "#ffa1ad",
    "400": "#ff637e",
    "500": "#ff2056",
    "600": "#ec003f",
    "700": "#c70036",
    "800": "#a50036",
    "900": "#8b0836",
    "950": "#4d0218"
  },
  slate: {
    "50": "#f8fafc",
    "100": "#f1f5f9",
    "200": "#e2e8f0",
    "300": "#cad5e2",
    "400": "#90a1b9",
    "500": "#62748e",
    "600": "#45556c",
    "700": "#314158",
    "800": "#1d293d",
    "900": "#0f172b",
    "950": "#020618"
  },
  gray: {
    "50": "#f9fafb",
    "100": "#f3f4f6",
    "200": "#e5e7eb",
    "300": "#d1d5dc",
    "400": "#99a1af",
    "500": "#6a7282",
    "600": "#4a5565",
    "700": "#364153",
    "800": "#1e2939",
    "900": "#101828",
    "950": "#030712"
  },
  zinc: {
    "50": "#fafafa",
    "100": "#f4f4f5",
    "200": "#e4e4e7",
    "300": "#d4d4d8",
    "400": "#9f9fa9",
    "500": "#71717b",
    "600": "#52525c",
    "700": "#3f3f46",
    "800": "#27272a",
    "900": "#18181b",
    "950": "#09090b"
  },
  neutral: {
    "50": "#fafafa",
    "100": "#f5f5f5",
    "200": "#e5e5e5",
    "300": "#d4d4d4",
    "400": "#a1a1a1",
    "500": "#737373",
    "600": "#525252",
    "700": "#404040",
    "800": "#262626",
    "900": "#171717",
    "950": "#0a0a0a"
  },
  stone: {
    "50": "#fafaf9",
    "100": "#f5f5f4",
    "200": "#e7e5e4",
    "300": "#d6d3d1",
    "400": "#a6a09b",
    "500": "#79716b",
    "600": "#57534d",
    "700": "#44403b",
    "800": "#292524",
    "900": "#1c1917",
    "950": "#0c0a09"
  }
};

// src/utils/colorUtils.ts
var COLORS = {
  ...flattenColors(TAILWIND_COLORS),
  white: "#FFFFFF",
  black: "#000000",
  transparent: "transparent"
};
function applyOpacity(hex, opacity) {
  if (hex === "transparent") {
    return "transparent";
  }
  const cleanHex = hex.replace(/^#/, "");
  const fullHex = cleanHex.length === 3 ? cleanHex.split("").map((char) => char + char).join("") : cleanHex;
  const alpha = Math.round(opacity / 100 * 255);
  const alphaHex = alpha.toString(16).padStart(2, "0").toUpperCase();
  return `#${fullHex.toUpperCase()}${alphaHex}`;
}
function parseArbitraryColor(value) {
  const hexMatch = value.match(/^\[#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\]$/);
  if (hexMatch) {
    const hex = hexMatch[1];
    if (hex.length === 3) {
      const expanded = hex.split("").map((char) => char + char).join("");
      return `#${expanded}`;
    }
    return `#${hex}`;
  }
  return null;
}
function parseColorValue(colorKey, customColors) {
  const getColor = (key) => {
    return customColors?.[key] ?? COLORS[key];
  };
  const opacityMatch = colorKey.match(/^(.+)\/(\d+)$/);
  if (opacityMatch) {
    const baseColorKey = opacityMatch[1];
    const opacity = Number.parseInt(opacityMatch[2], 10);
    if (opacity < 0 || opacity > 100) {
      return null;
    }
    const arbitraryColor2 = parseArbitraryColor(baseColorKey);
    if (arbitraryColor2 !== null) {
      return applyOpacity(arbitraryColor2, opacity);
    }
    const color = getColor(baseColorKey);
    if (color) {
      return applyOpacity(color, opacity);
    }
    return null;
  }
  const arbitraryColor = parseArbitraryColor(colorKey);
  if (arbitraryColor !== null) {
    return arbitraryColor;
  }
  return getColor(colorKey) ?? null;
}

// src/parser/colors.ts
function parseColor(cls, customColors) {
  const getColor = (key) => {
    return customColors?.[key] ?? COLORS[key];
  };
  const parseColorWithOpacity = (colorKey) => {
    const opacityMatch = colorKey.match(/^(.+)\/(\d+)$/);
    if (opacityMatch) {
      const baseColorKey = opacityMatch[1];
      const opacity = Number.parseInt(opacityMatch[2], 10);
      if (opacity < 0 || opacity > 100) {
        if (process.env.NODE_ENV !== "production") {
          console.warn(
            `[react-native-tailwind] Invalid opacity value: ${opacity}. Opacity must be between 0 and 100.`
          );
        }
        return null;
      }
      const arbitraryColor2 = parseArbitraryColor(baseColorKey);
      if (arbitraryColor2 !== null) {
        return applyOpacity(arbitraryColor2, opacity);
      }
      const color = getColor(baseColorKey);
      if (color) {
        return applyOpacity(color, opacity);
      }
      return null;
    }
    const arbitraryColor = parseArbitraryColor(colorKey);
    if (arbitraryColor !== null) {
      return arbitraryColor;
    }
    if (colorKey.startsWith("[") && colorKey.endsWith("]")) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          `[react-native-tailwind] Unsupported arbitrary color value: ${colorKey}. Only hex colors are supported (e.g., [#ff0000], [#f00], or [#ff0000aa]).`
        );
      }
      return null;
    }
    return getColor(colorKey) ?? null;
  };
  if (cls.startsWith("bg-")) {
    const colorKey = cls.substring(3);
    if (colorKey.startsWith("[") && !colorKey.startsWith("[#")) {
      return null;
    }
    const color = parseColorWithOpacity(colorKey);
    if (color) {
      return { backgroundColor: color };
    }
  }
  if (cls.startsWith("text-")) {
    const colorKey = cls.substring(5);
    if (colorKey.startsWith("[") && !colorKey.startsWith("[#")) {
      return null;
    }
    const color = parseColorWithOpacity(colorKey);
    if (color) {
      return { color };
    }
  }
  if (cls.startsWith("border-") && !cls.match(/^border-[0-9]/)) {
    const colorKey = cls.substring(7);
    if (colorKey.startsWith("[") && !colorKey.startsWith("[#")) {
      return null;
    }
    const color = parseColorWithOpacity(colorKey);
    if (color) {
      return { borderColor: color };
    }
  }
  if (cls.startsWith("outline-") && !cls.match(/^outline-[0-9]/) && !cls.startsWith("outline-offset-")) {
    const colorKey = cls.substring(8);
    if (["solid", "dashed", "dotted", "none"].includes(colorKey)) {
      return null;
    }
    if (colorKey.startsWith("[") && !colorKey.startsWith("[#")) {
      return null;
    }
    const color = parseColorWithOpacity(colorKey);
    if (color) {
      return { outlineColor: color };
    }
  }
  const dirBorderMatch = cls.match(/^border-([trblxy])-(.+)$/);
  if (dirBorderMatch) {
    const dir = dirBorderMatch[1];
    const colorKey = dirBorderMatch[2];
    if (colorKey.startsWith("[") && !colorKey.startsWith("[#")) {
      return null;
    }
    const color = parseColorWithOpacity(colorKey);
    if (color) {
      if (dir === "x") {
        return {
          borderLeftColor: color,
          borderRightColor: color
        };
      }
      if (dir === "y") {
        return {
          borderTopColor: color,
          borderBottomColor: color
        };
      }
      const propMap = {
        t: "borderTopColor",
        r: "borderRightColor",
        b: "borderBottomColor",
        l: "borderLeftColor"
      };
      return { [propMap[dir]]: color };
    }
  }
  return null;
}

// src/parser/borders.ts
var BORDER_WIDTH_SCALE = {
  "": 1,
  "0": 0,
  "2": 2,
  "4": 4,
  "8": 8
};
var BORDER_RADIUS_SCALE = {
  none: 0,
  sm: 2,
  "": 4,
  md: 6,
  lg: 8,
  xl: 12,
  "2xl": 16,
  "3xl": 24,
  full: 9999
};
var BORDER_WIDTH_PROP_MAP = {
  t: "borderTopWidth",
  r: "borderRightWidth",
  b: "borderBottomWidth",
  l: "borderLeftWidth",
  s: "borderStartWidth",
  e: "borderEndWidth"
};
var BORDER_RADIUS_CORNER_MAP = {
  tl: "borderTopLeftRadius",
  tr: "borderTopRightRadius",
  bl: "borderBottomLeftRadius",
  br: "borderBottomRightRadius"
};
var BORDER_RADIUS_LOGICAL_CORNER_MAP = {
  ss: "borderTopStartRadius",
  se: "borderTopEndRadius",
  es: "borderBottomStartRadius",
  ee: "borderBottomEndRadius"
};
var BORDER_RADIUS_SIDE_MAP = {
  t: ["borderTopLeftRadius", "borderTopRightRadius"],
  r: ["borderTopRightRadius", "borderBottomRightRadius"],
  b: ["borderBottomLeftRadius", "borderBottomRightRadius"],
  l: ["borderTopLeftRadius", "borderBottomLeftRadius"],
  s: ["borderTopStartRadius", "borderBottomStartRadius"],
  e: ["borderTopEndRadius", "borderBottomEndRadius"]
};
function parseArbitraryBorderWidth(value) {
  const pxMatch = value.match(/^\[(\d+)(?:px)?\]$/);
  if (pxMatch) {
    return parseInt(pxMatch[1], 10);
  }
  if (value.startsWith("[") && value.endsWith("]")) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[react-native-tailwind] Unsupported arbitrary border width value: ${value}. Only px values are supported (e.g., [8px] or [8]).`
      );
    }
    return null;
  }
  return null;
}
function parseArbitraryBorderRadius(value) {
  const pxMatch = value.match(/^\[(\d+)(?:px)?\]$/);
  if (pxMatch) {
    return parseInt(pxMatch[1], 10);
  }
  if (value.startsWith("[") && value.endsWith("]")) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[react-native-tailwind] Unsupported arbitrary border radius value: ${value}. Only px values are supported (e.g., [12px] or [12]).`
      );
    }
    return null;
  }
  return null;
}
function parseBorder(cls, customColors) {
  if (cls === "border-solid") return { borderStyle: "solid" };
  if (cls === "border-dotted") return { borderStyle: "dotted" };
  if (cls === "border-dashed") return { borderStyle: "dashed" };
  if (cls.startsWith("border-")) {
    return parseBorderWidth(cls, customColors);
  }
  if (cls === "border") {
    return { borderWidth: 1 };
  }
  if (cls.startsWith("rounded")) {
    return parseBorderRadius(cls);
  }
  return null;
}
function parseBorderWidth(cls, customColors) {
  const dirMatch = cls.match(/^border-([trblse])(?:-(.+))?$/);
  if (dirMatch) {
    const dir = dirMatch[1];
    const valueStr = dirMatch[2] || "";
    if (valueStr && dir !== "s" && dir !== "e") {
      const colorResult = parseColor(cls, customColors);
      if (colorResult !== null) {
        return null;
      }
    }
    if (valueStr.startsWith("[")) {
      const arbitraryValue = parseArbitraryBorderWidth(valueStr);
      if (arbitraryValue !== null) {
        return { [BORDER_WIDTH_PROP_MAP[dir]]: arbitraryValue };
      }
      return null;
    }
    const scaleValue = BORDER_WIDTH_SCALE[valueStr];
    if (scaleValue !== void 0) {
      return { [BORDER_WIDTH_PROP_MAP[dir]]: scaleValue };
    }
    return null;
  }
  const allMatch = cls.match(/^border-(\d+)$/);
  if (allMatch) {
    const value = BORDER_WIDTH_SCALE[allMatch[1]];
    if (value !== void 0) {
      return { borderWidth: value };
    }
  }
  const allArbMatch = cls.match(/^border-(\[.+\])$/);
  if (allArbMatch) {
    const arbitraryValue = parseArbitraryBorderWidth(allArbMatch[1]);
    if (arbitraryValue !== null) {
      return { borderWidth: arbitraryValue };
    }
  }
  return null;
}
function parseBorderRadius(cls) {
  const withoutPrefix = cls.substring(7);
  if (withoutPrefix === "") {
    return { borderRadius: BORDER_RADIUS_SCALE[""] };
  }
  if (!withoutPrefix.startsWith("-")) {
    return null;
  }
  const rest = withoutPrefix.substring(1);
  if (rest === "") {
    return null;
  }
  const cornerMatch = rest.match(/^(tl|tr|bl|br)(?:-(.+))?$/);
  if (cornerMatch) {
    const corner = cornerMatch[1];
    const valueStr = cornerMatch[2] || "";
    if (valueStr.startsWith("[")) {
      const arbitraryValue = parseArbitraryBorderRadius(valueStr);
      if (arbitraryValue !== null) {
        return { [BORDER_RADIUS_CORNER_MAP[corner]]: arbitraryValue };
      }
      return null;
    }
    const scaleValue2 = BORDER_RADIUS_SCALE[valueStr];
    if (scaleValue2 !== void 0) {
      return { [BORDER_RADIUS_CORNER_MAP[corner]]: scaleValue2 };
    }
    return null;
  }
  const logicalCornerMatch = rest.match(/^(ss|se|es|ee)(?:-(.+))?$/);
  if (logicalCornerMatch) {
    const corner = logicalCornerMatch[1];
    const valueStr = logicalCornerMatch[2] || "";
    if (valueStr.startsWith("[")) {
      const arbitraryValue = parseArbitraryBorderRadius(valueStr);
      if (arbitraryValue !== null) {
        return { [BORDER_RADIUS_LOGICAL_CORNER_MAP[corner]]: arbitraryValue };
      }
      return null;
    }
    const scaleValue2 = BORDER_RADIUS_SCALE[valueStr];
    if (scaleValue2 !== void 0) {
      return { [BORDER_RADIUS_LOGICAL_CORNER_MAP[corner]]: scaleValue2 };
    }
    return null;
  }
  const sideMatch = rest.match(/^([trblse])(?:-(.+))?$/);
  if (sideMatch) {
    const side = sideMatch[1];
    const valueStr = sideMatch[2] || "";
    let value;
    if (valueStr.startsWith("[")) {
      const arbitraryValue = parseArbitraryBorderRadius(valueStr);
      if (arbitraryValue !== null) {
        value = arbitraryValue;
      } else {
        return null;
      }
    } else {
      value = BORDER_RADIUS_SCALE[valueStr];
    }
    if (value !== void 0) {
      const result = {};
      BORDER_RADIUS_SIDE_MAP[side].forEach((prop) => result[prop] = value);
      return result;
    }
    return null;
  }
  if (rest.startsWith("[")) {
    const arbitraryValue = parseArbitraryBorderRadius(rest);
    if (arbitraryValue !== null) {
      return { borderRadius: arbitraryValue };
    }
    return null;
  }
  const scaleValue = BORDER_RADIUS_SCALE[rest];
  if (scaleValue !== void 0) {
    return { borderRadius: scaleValue };
  }
  return null;
}

// src/parser/layout.ts
function parseArbitraryInset(value) {
  const pxMatch = value.match(/^\[(-?\d+)(?:px)?\]$/);
  if (pxMatch) {
    return parseInt(pxMatch[1], 10);
  }
  const percentMatch = value.match(/^\[(-?\d+(?:\.\d+)?)%\]$/);
  if (percentMatch) {
    return `${percentMatch[1]}%`;
  }
  if (value.startsWith("[") && value.endsWith("]")) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[react-native-tailwind] Unsupported arbitrary inset unit: ${value}. Only px and % are supported.`
      );
    }
    return null;
  }
  return null;
}
function parseArbitraryZIndex(value) {
  const zMatch = value.match(/^\[(-?\d+)\]$/);
  if (zMatch) {
    return parseInt(zMatch[1], 10);
  }
  if (value.startsWith("[") && value.endsWith("]")) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[react-native-tailwind] Invalid arbitrary z-index: ${value}. Only integers are supported.`
      );
    }
    return null;
  }
  return null;
}
function parseArbitraryGrowShrink(value) {
  const match = value.match(/^\[(\d+(?:\.\d+)?|\.\d+)\]$/);
  if (match) {
    return parseFloat(match[1]);
  }
  if (value.startsWith("[") && value.endsWith("]")) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[react-native-tailwind] Invalid arbitrary grow/shrink value: ${value}. Only non-negative numbers are supported (e.g., [1.5], [2], [0.5], [.5]).`
      );
    }
    return null;
  }
  return null;
}
var DISPLAY_MAP = {
  flex: { display: "flex" },
  hidden: { display: "none" }
};
var FLEX_DIRECTION_MAP = {
  "flex-row": { flexDirection: "row" },
  "flex-row-reverse": { flexDirection: "row-reverse" },
  "flex-col": { flexDirection: "column" },
  "flex-col-reverse": { flexDirection: "column-reverse" }
};
var FLEX_WRAP_MAP = {
  "flex-wrap": { flexWrap: "wrap" },
  "flex-wrap-reverse": { flexWrap: "wrap-reverse" },
  "flex-nowrap": { flexWrap: "nowrap" }
};
var FLEX_MAP = {
  "flex-1": { flex: 1 },
  "flex-auto": { flex: 1 },
  "flex-none": { flex: 0 }
};
var GROW_SHRINK_MAP = {
  grow: { flexGrow: 1 },
  "grow-0": { flexGrow: 0 },
  shrink: { flexShrink: 1 },
  "shrink-0": { flexShrink: 0 },
  // CSS-style aliases
  "flex-grow": { flexGrow: 1 },
  "flex-grow-0": { flexGrow: 0 },
  "flex-shrink": { flexShrink: 1 },
  "flex-shrink-0": { flexShrink: 0 }
};
var JUSTIFY_CONTENT_MAP = {
  "justify-start": { justifyContent: "flex-start" },
  "justify-end": { justifyContent: "flex-end" },
  "justify-center": { justifyContent: "center" },
  "justify-between": { justifyContent: "space-between" },
  "justify-around": { justifyContent: "space-around" },
  "justify-evenly": { justifyContent: "space-evenly" }
};
var ALIGN_ITEMS_MAP = {
  "items-start": { alignItems: "flex-start" },
  "items-end": { alignItems: "flex-end" },
  "items-center": { alignItems: "center" },
  "items-baseline": { alignItems: "baseline" },
  "items-stretch": { alignItems: "stretch" }
};
var ALIGN_SELF_MAP = {
  "self-auto": { alignSelf: "auto" },
  "self-start": { alignSelf: "flex-start" },
  "self-end": { alignSelf: "flex-end" },
  "self-center": { alignSelf: "center" },
  "self-stretch": { alignSelf: "stretch" },
  "self-baseline": { alignSelf: "baseline" }
};
var ALIGN_CONTENT_MAP = {
  "content-start": { alignContent: "flex-start" },
  "content-end": { alignContent: "flex-end" },
  "content-center": { alignContent: "center" },
  "content-between": { alignContent: "space-between" },
  "content-around": { alignContent: "space-around" },
  "content-stretch": { alignContent: "stretch" }
};
var POSITION_MAP = {
  absolute: { position: "absolute" },
  relative: { position: "relative" }
};
var OVERFLOW_MAP = {
  "overflow-hidden": { overflow: "hidden" },
  "overflow-visible": { overflow: "visible" },
  "overflow-scroll": { overflow: "scroll" }
};
var OPACITY_MAP = {
  "opacity-0": { opacity: 0 },
  "opacity-5": { opacity: 0.05 },
  "opacity-10": { opacity: 0.1 },
  "opacity-15": { opacity: 0.15 },
  "opacity-20": { opacity: 0.2 },
  "opacity-25": { opacity: 0.25 },
  "opacity-30": { opacity: 0.3 },
  "opacity-35": { opacity: 0.35 },
  "opacity-40": { opacity: 0.4 },
  "opacity-45": { opacity: 0.45 },
  "opacity-50": { opacity: 0.5 },
  "opacity-55": { opacity: 0.55 },
  "opacity-60": { opacity: 0.6 },
  "opacity-65": { opacity: 0.65 },
  "opacity-70": { opacity: 0.7 },
  "opacity-75": { opacity: 0.75 },
  "opacity-80": { opacity: 0.8 },
  "opacity-85": { opacity: 0.85 },
  "opacity-90": { opacity: 0.9 },
  "opacity-95": { opacity: 0.95 },
  "opacity-100": { opacity: 1 }
};
var Z_INDEX_SCALE = {
  0: 0,
  10: 10,
  20: 20,
  30: 30,
  40: 40,
  50: 50,
  auto: 0
  // React Native doesn't have 'auto', default to 0
};
var INSET_SCALE = {
  0: 0,
  0.5: 2,
  1: 4,
  1.5: 6,
  2: 8,
  2.5: 10,
  3: 12,
  3.5: 14,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96
};
function parseLayout(cls, customSpacing) {
  const insetMap = customSpacing ? { ...INSET_SCALE, ...customSpacing } : INSET_SCALE;
  if (cls.startsWith("z-")) {
    const zKey = cls.substring(2);
    const arbitraryZ = parseArbitraryZIndex(zKey);
    if (arbitraryZ !== null) {
      return { zIndex: arbitraryZ };
    }
    const zValue = Z_INDEX_SCALE[zKey];
    if (zValue !== void 0) {
      return { zIndex: zValue };
    }
  }
  const topMatch = cls.match(/^(-?)top-(.+)$/);
  if (topMatch) {
    const [, negPrefix, topKey] = topMatch;
    const isNegative = negPrefix === "-";
    if (topKey === "auto") {
      return {};
    }
    const arbitraryTop = parseArbitraryInset(topKey);
    if (arbitraryTop !== null) {
      if (typeof arbitraryTop === "number") {
        return { top: isNegative ? -arbitraryTop : arbitraryTop };
      }
      if (isNegative && arbitraryTop.endsWith("%")) {
        const numValue = parseFloat(arbitraryTop);
        return { top: `${-numValue}%` };
      }
      return { top: arbitraryTop };
    }
    const topValue = insetMap[topKey];
    if (topValue !== void 0) {
      return { top: isNegative ? -topValue : topValue };
    }
  }
  const rightMatch = cls.match(/^(-?)right-(.+)$/);
  if (rightMatch) {
    const [, negPrefix, rightKey] = rightMatch;
    const isNegative = negPrefix === "-";
    if (rightKey === "auto") {
      return {};
    }
    const arbitraryRight = parseArbitraryInset(rightKey);
    if (arbitraryRight !== null) {
      if (typeof arbitraryRight === "number") {
        return { right: isNegative ? -arbitraryRight : arbitraryRight };
      }
      if (isNegative && arbitraryRight.endsWith("%")) {
        const numValue = parseFloat(arbitraryRight);
        return { right: `${-numValue}%` };
      }
      return { right: arbitraryRight };
    }
    const rightValue = insetMap[rightKey];
    if (rightValue !== void 0) {
      return { right: isNegative ? -rightValue : rightValue };
    }
  }
  const bottomMatch = cls.match(/^(-?)bottom-(.+)$/);
  if (bottomMatch) {
    const [, negPrefix, bottomKey] = bottomMatch;
    const isNegative = negPrefix === "-";
    if (bottomKey === "auto") {
      return {};
    }
    const arbitraryBottom = parseArbitraryInset(bottomKey);
    if (arbitraryBottom !== null) {
      if (typeof arbitraryBottom === "number") {
        return { bottom: isNegative ? -arbitraryBottom : arbitraryBottom };
      }
      if (isNegative && arbitraryBottom.endsWith("%")) {
        const numValue = parseFloat(arbitraryBottom);
        return { bottom: `${-numValue}%` };
      }
      return { bottom: arbitraryBottom };
    }
    const bottomValue = insetMap[bottomKey];
    if (bottomValue !== void 0) {
      return { bottom: isNegative ? -bottomValue : bottomValue };
    }
  }
  const leftMatch = cls.match(/^(-?)left-(.+)$/);
  if (leftMatch) {
    const [, negPrefix, leftKey] = leftMatch;
    const isNegative = negPrefix === "-";
    if (leftKey === "auto") {
      return {};
    }
    const arbitraryLeft = parseArbitraryInset(leftKey);
    if (arbitraryLeft !== null) {
      if (typeof arbitraryLeft === "number") {
        return { left: isNegative ? -arbitraryLeft : arbitraryLeft };
      }
      if (isNegative && arbitraryLeft.endsWith("%")) {
        const numValue = parseFloat(arbitraryLeft);
        return { left: `${-numValue}%` };
      }
      return { left: arbitraryLeft };
    }
    const leftValue = insetMap[leftKey];
    if (leftValue !== void 0) {
      return { left: isNegative ? -leftValue : leftValue };
    }
  }
  const startMatch = cls.match(/^(-?)start-(.+)$/);
  if (startMatch) {
    const [, negPrefix, startKey] = startMatch;
    const isNegative = negPrefix === "-";
    if (startKey === "auto") {
      return {};
    }
    const arbitraryStart = parseArbitraryInset(startKey);
    if (arbitraryStart !== null) {
      if (typeof arbitraryStart === "number") {
        return { start: isNegative ? -arbitraryStart : arbitraryStart };
      }
      if (isNegative && arbitraryStart.endsWith("%")) {
        const numValue = parseFloat(arbitraryStart);
        return { start: `${-numValue}%` };
      }
      return { start: arbitraryStart };
    }
    const startValue = insetMap[startKey];
    if (startValue !== void 0) {
      return { start: isNegative ? -startValue : startValue };
    }
  }
  const endMatch = cls.match(/^(-?)end-(.+)$/);
  if (endMatch) {
    const [, negPrefix, endKey] = endMatch;
    const isNegative = negPrefix === "-";
    if (endKey === "auto") {
      return {};
    }
    const arbitraryEnd = parseArbitraryInset(endKey);
    if (arbitraryEnd !== null) {
      if (typeof arbitraryEnd === "number") {
        return { end: isNegative ? -arbitraryEnd : arbitraryEnd };
      }
      if (isNegative && arbitraryEnd.endsWith("%")) {
        const numValue = parseFloat(arbitraryEnd);
        return { end: `${-numValue}%` };
      }
      return { end: arbitraryEnd };
    }
    const endValue = insetMap[endKey];
    if (endValue !== void 0) {
      return { end: isNegative ? -endValue : endValue };
    }
  }
  if (cls.startsWith("inset-x-")) {
    const insetKey = cls.substring(8);
    const arbitraryInset = parseArbitraryInset(insetKey);
    if (arbitraryInset !== null) {
      return { left: arbitraryInset, right: arbitraryInset };
    }
    const insetValue = insetMap[insetKey];
    if (insetValue !== void 0) {
      return { left: insetValue, right: insetValue };
    }
  }
  if (cls.startsWith("inset-y-")) {
    const insetKey = cls.substring(8);
    const arbitraryInset = parseArbitraryInset(insetKey);
    if (arbitraryInset !== null) {
      return { top: arbitraryInset, bottom: arbitraryInset };
    }
    const insetValue = insetMap[insetKey];
    if (insetValue !== void 0) {
      return { top: insetValue, bottom: insetValue };
    }
  }
  if (cls.startsWith("inset-s-")) {
    const insetKey = cls.substring(8);
    const arbitraryInset = parseArbitraryInset(insetKey);
    if (arbitraryInset !== null) {
      return { start: arbitraryInset };
    }
    const insetValue = insetMap[insetKey];
    if (insetValue !== void 0) {
      return { start: insetValue };
    }
  }
  if (cls.startsWith("inset-e-")) {
    const insetKey = cls.substring(8);
    const arbitraryInset = parseArbitraryInset(insetKey);
    if (arbitraryInset !== null) {
      return { end: arbitraryInset };
    }
    const insetValue = insetMap[insetKey];
    if (insetValue !== void 0) {
      return { end: insetValue };
    }
  }
  if (cls.startsWith("inset-")) {
    const insetKey = cls.substring(6);
    const arbitraryInset = parseArbitraryInset(insetKey);
    if (arbitraryInset !== null) {
      return { top: arbitraryInset, right: arbitraryInset, bottom: arbitraryInset, left: arbitraryInset };
    }
    const insetValue = insetMap[insetKey];
    if (insetValue !== void 0) {
      return { top: insetValue, right: insetValue, bottom: insetValue, left: insetValue };
    }
  }
  if (cls.startsWith("grow-") || cls.startsWith("flex-grow-")) {
    const prefix = cls.startsWith("flex-grow-") ? "flex-grow-" : "grow-";
    const growKey = cls.substring(prefix.length);
    const arbitraryGrow = parseArbitraryGrowShrink(growKey);
    if (arbitraryGrow !== null) {
      return { flexGrow: arbitraryGrow };
    }
  }
  if (cls.startsWith("shrink-") || cls.startsWith("flex-shrink-")) {
    const prefix = cls.startsWith("flex-shrink-") ? "flex-shrink-" : "shrink-";
    const shrinkKey = cls.substring(prefix.length);
    const arbitraryShrink = parseArbitraryGrowShrink(shrinkKey);
    if (arbitraryShrink !== null) {
      return { flexShrink: arbitraryShrink };
    }
  }
  return DISPLAY_MAP[cls] ?? FLEX_DIRECTION_MAP[cls] ?? FLEX_WRAP_MAP[cls] ?? FLEX_MAP[cls] ?? GROW_SHRINK_MAP[cls] ?? JUSTIFY_CONTENT_MAP[cls] ?? ALIGN_ITEMS_MAP[cls] ?? ALIGN_SELF_MAP[cls] ?? ALIGN_CONTENT_MAP[cls] ?? POSITION_MAP[cls] ?? OVERFLOW_MAP[cls] ?? OPACITY_MAP[cls] ?? null;
}

// src/parser/outline.ts
function parseArbitraryOutlineValue(value) {
  const pxMatch = value.match(/^\[(\d+)(?:px)?\]$/);
  if (pxMatch) {
    return parseInt(pxMatch[1], 10);
  }
  if (value.startsWith("[") && value.endsWith("]")) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[react-native-tailwind] Unsupported arbitrary outline value: ${value}. Only px values are supported (e.g., [8px] or [8]).`
      );
    }
    return null;
  }
  return null;
}
function parseOutline(cls, customColors) {
  if (cls === "outline") {
    return { outlineWidth: 1, outlineStyle: "solid" };
  }
  if (cls === "outline-none") {
    return { outlineWidth: 0 };
  }
  if (cls === "outline-solid") return { outlineStyle: "solid" };
  if (cls === "outline-dotted") return { outlineStyle: "dotted" };
  if (cls === "outline-dashed") return { outlineStyle: "dashed" };
  if (cls.startsWith("outline-offset-")) {
    const valueStr = cls.substring(15);
    if (valueStr.startsWith("[")) {
      const arbitraryValue = parseArbitraryOutlineValue(valueStr);
      if (arbitraryValue !== null) {
        return { outlineOffset: arbitraryValue };
      }
      return null;
    }
    const scaleValue = BORDER_WIDTH_SCALE[valueStr];
    if (scaleValue !== void 0) {
      return { outlineOffset: scaleValue };
    }
    return null;
  }
  const widthMatch = cls.match(/^outline-(\d+)$/);
  if (widthMatch) {
    const value = BORDER_WIDTH_SCALE[widthMatch[1]];
    if (value !== void 0) {
      return { outlineWidth: value };
    }
  }
  const arbMatch = cls.match(/^outline-(\[.+\])$/);
  if (arbMatch) {
    const arbitraryValue = parseArbitraryOutlineValue(arbMatch[1]);
    if (arbitraryValue !== null) {
      return { outlineWidth: arbitraryValue };
    }
    return null;
  }
  return null;
}

// src/parser/shadows.ts
var SHADOW_SCALE = {
  "shadow-sm": {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1
  },
  shadow: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  "shadow-md": {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4
  },
  "shadow-lg": {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8
  },
  "shadow-xl": {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 12
  },
  "shadow-2xl": {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 16
  },
  "shadow-none": {
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0
  }
};
function parseShadow(cls, customColors) {
  if (cls in SHADOW_SCALE) {
    return SHADOW_SCALE[cls];
  }
  if (cls.startsWith("shadow-")) {
    const colorPart = cls.substring(7);
    const shadowColor = parseColorValue(colorPart, customColors);
    if (shadowColor) {
      return { shadowColor };
    }
  }
  return null;
}

// src/config/markers.ts
var RUNTIME_DIMENSIONS_MARKER = "{{RUNTIME:dimensions.";

// src/parser/sizing.ts
var SIZE_SCALE = {
  0: 0,
  0.5: 2,
  1: 4,
  1.5: 6,
  2: 8,
  2.5: 10,
  3: 12,
  3.5: 14,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  11: 44,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
  24: 96,
  28: 112,
  32: 128,
  36: 144,
  40: 160,
  44: 176,
  48: 192,
  52: 208,
  56: 224,
  60: 240,
  64: 256,
  72: 288,
  80: 320,
  96: 384
};
var SIZE_PERCENTAGES = {
  full: "100%",
  "1/2": "50%",
  "1/3": "33.333333%",
  "2/3": "66.666667%",
  "1/4": "25%",
  "2/4": "50%",
  "3/4": "75%",
  "1/5": "20%",
  "2/5": "40%",
  "3/5": "60%",
  "4/5": "80%",
  "1/6": "16.666667%",
  "2/6": "33.333333%",
  "3/6": "50%",
  "4/6": "66.666667%",
  "5/6": "83.333333%"
};
function parseArbitrarySize(value) {
  const pxMatch = value.match(/^\[(\d+)(?:px)?\]$/);
  if (pxMatch) {
    return parseInt(pxMatch[1], 10);
  }
  const percentMatch = value.match(/^\[(\d+(?:\.\d+)?)%\]$/);
  if (percentMatch) {
    return `${percentMatch[1]}%`;
  }
  if (value.startsWith("[") && value.endsWith("]")) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[react-native-tailwind] Unsupported arbitrary size unit: ${value}. Only px and % are supported.`
      );
    }
    return null;
  }
  return null;
}
function parseSizing(cls, customSpacing) {
  const sizeMap = customSpacing ? { ...SIZE_SCALE, ...customSpacing } : SIZE_SCALE;
  if (cls.startsWith("size-")) {
    const sizeKey = cls.substring(5);
    const arbitrarySize = parseArbitrarySize(sizeKey);
    if (arbitrarySize !== null) {
      return { width: arbitrarySize, height: arbitrarySize };
    }
    const percentage = SIZE_PERCENTAGES[sizeKey];
    if (percentage) {
      return { width: percentage, height: percentage };
    }
    const numericSize = sizeMap[sizeKey];
    if (numericSize !== void 0) {
      return { width: numericSize, height: numericSize };
    }
    if (sizeKey === "auto") {
      return { width: "auto", height: "auto" };
    }
  }
  if (cls.startsWith("w-")) {
    const sizeKey = cls.substring(2);
    if (sizeKey === "screen") {
      return { width: `${RUNTIME_DIMENSIONS_MARKER}width}}` };
    }
    const arbitrarySize = parseArbitrarySize(sizeKey);
    if (arbitrarySize !== null) {
      return { width: arbitrarySize };
    }
    const percentage = SIZE_PERCENTAGES[sizeKey];
    if (percentage) {
      return { width: percentage };
    }
    const numericSize = sizeMap[sizeKey];
    if (numericSize !== void 0) {
      return { width: numericSize };
    }
    if (sizeKey === "auto") {
      return { width: "auto" };
    }
  }
  if (cls.startsWith("h-")) {
    const sizeKey = cls.substring(2);
    if (sizeKey === "screen") {
      return { height: `${RUNTIME_DIMENSIONS_MARKER}height}}` };
    }
    const arbitrarySize = parseArbitrarySize(sizeKey);
    if (arbitrarySize !== null) {
      return { height: arbitrarySize };
    }
    const percentage = SIZE_PERCENTAGES[sizeKey];
    if (percentage) {
      return { height: percentage };
    }
    const numericSize = sizeMap[sizeKey];
    if (numericSize !== void 0) {
      return { height: numericSize };
    }
    if (sizeKey === "auto") {
      return { height: "auto" };
    }
  }
  if (cls.startsWith("min-w-")) {
    const sizeKey = cls.substring(6);
    const arbitrarySize = parseArbitrarySize(sizeKey);
    if (arbitrarySize !== null) {
      return { minWidth: arbitrarySize };
    }
    const percentage = SIZE_PERCENTAGES[sizeKey];
    if (percentage) {
      return { minWidth: percentage };
    }
    const numericSize = sizeMap[sizeKey];
    if (numericSize !== void 0) {
      return { minWidth: numericSize };
    }
  }
  if (cls.startsWith("min-h-")) {
    const sizeKey = cls.substring(6);
    const arbitrarySize = parseArbitrarySize(sizeKey);
    if (arbitrarySize !== null) {
      return { minHeight: arbitrarySize };
    }
    const percentage = SIZE_PERCENTAGES[sizeKey];
    if (percentage) {
      return { minHeight: percentage };
    }
    const numericSize = sizeMap[sizeKey];
    if (numericSize !== void 0) {
      return { minHeight: numericSize };
    }
  }
  if (cls.startsWith("max-w-")) {
    const sizeKey = cls.substring(6);
    const arbitrarySize = parseArbitrarySize(sizeKey);
    if (arbitrarySize !== null) {
      return { maxWidth: arbitrarySize };
    }
    const percentage = SIZE_PERCENTAGES[sizeKey];
    if (percentage) {
      return { maxWidth: percentage };
    }
    const numericSize = sizeMap[sizeKey];
    if (numericSize !== void 0) {
      return { maxWidth: numericSize };
    }
  }
  if (cls.startsWith("max-h-")) {
    const sizeKey = cls.substring(6);
    const arbitrarySize = parseArbitrarySize(sizeKey);
    if (arbitrarySize !== null) {
      return { maxHeight: arbitrarySize };
    }
    const percentage = SIZE_PERCENTAGES[sizeKey];
    if (percentage) {
      return { maxHeight: percentage };
    }
    const numericSize = sizeMap[sizeKey];
    if (numericSize !== void 0) {
      return { maxHeight: numericSize };
    }
  }
  return null;
}

// src/parser/spacing.ts
var SPACING_SCALE = {
  0: 0,
  0.5: 2,
  1: 4,
  1.5: 6,
  2: 8,
  2.5: 10,
  3: 12,
  3.5: 14,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  11: 44,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
  24: 96,
  28: 112,
  32: 128,
  36: 144,
  40: 160,
  44: 176,
  48: 192,
  52: 208,
  56: 224,
  60: 240,
  64: 256,
  72: 288,
  80: 320,
  96: 384
};
function parseArbitrarySpacing(value) {
  const pxMatch = value.match(/^\[(-?\d+(?:\.\d+)?)(?:px)?\]$/);
  if (pxMatch) {
    return parseFloat(pxMatch[1]);
  }
  if (value.startsWith("[") && value.endsWith("]")) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[react-native-tailwind] Unsupported arbitrary spacing value: ${value}. Only px values are supported (e.g., [16px], [16], [4.5px], [4.5]).`
      );
    }
    return null;
  }
  return null;
}
function parseSpacing(cls, customSpacing) {
  const spacingMap = customSpacing ? { ...SPACING_SCALE, ...customSpacing } : SPACING_SCALE;
  const autoMarginMatch = cls.match(/^m([xytrblse]?)-auto$/);
  if (autoMarginMatch) {
    const dir = autoMarginMatch[1];
    return getMarginStyle(dir, "auto");
  }
  const marginMatch = cls.match(/^(-?)m([xytrblse]?)-(.+)$/);
  if (marginMatch) {
    const [, negativePrefix, dir, valueStr] = marginMatch;
    const isNegative = negativePrefix === "-";
    const arbitraryValue = parseArbitrarySpacing(valueStr);
    if (arbitraryValue !== null) {
      const finalValue = isNegative ? -arbitraryValue : arbitraryValue;
      return getMarginStyle(dir, finalValue);
    }
    const scaleValue = spacingMap[valueStr];
    if (scaleValue !== void 0) {
      const finalValue = isNegative ? -scaleValue : scaleValue;
      return getMarginStyle(dir, finalValue);
    }
  }
  const paddingMatch = cls.match(/^p([xytrblse]?)-(.+)$/);
  if (paddingMatch) {
    const [, dir, valueStr] = paddingMatch;
    const arbitraryValue = parseArbitrarySpacing(valueStr);
    if (arbitraryValue !== null) {
      return getPaddingStyle(dir, arbitraryValue);
    }
    const scaleValue = spacingMap[valueStr];
    if (scaleValue !== void 0) {
      return getPaddingStyle(dir, scaleValue);
    }
  }
  const gapMatch = cls.match(/^gap-(.+)$/);
  if (gapMatch) {
    const valueStr = gapMatch[1];
    const arbitraryValue = parseArbitrarySpacing(valueStr);
    if (arbitraryValue !== null) {
      return { gap: arbitraryValue };
    }
    const scaleValue = spacingMap[valueStr];
    if (scaleValue !== void 0) {
      return { gap: scaleValue };
    }
  }
  return null;
}
function getMarginStyle(dir, value) {
  switch (dir) {
    case "":
      return { margin: value };
    case "x":
      return { marginHorizontal: value };
    case "y":
      return { marginVertical: value };
    case "t":
      return { marginTop: value };
    case "r":
      return { marginRight: value };
    case "b":
      return { marginBottom: value };
    case "l":
      return { marginLeft: value };
    case "s":
      return { marginStart: value };
    case "e":
      return { marginEnd: value };
    default:
      return {};
  }
}
function getPaddingStyle(dir, value) {
  switch (dir) {
    case "":
      return { padding: value };
    case "x":
      return { paddingHorizontal: value };
    case "y":
      return { paddingVertical: value };
    case "t":
      return { paddingTop: value };
    case "r":
      return { paddingRight: value };
    case "b":
      return { paddingBottom: value };
    case "l":
      return { paddingLeft: value };
    case "s":
      return { paddingStart: value };
    case "e":
      return { paddingEnd: value };
    default:
      return {};
  }
}

// src/parser/transforms.ts
var SCALE_MAP = {
  0: 0,
  50: 0.5,
  75: 0.75,
  90: 0.9,
  95: 0.95,
  100: 1,
  105: 1.05,
  110: 1.1,
  125: 1.25,
  150: 1.5,
  200: 2
};
var ROTATE_MAP = {
  0: 0,
  1: 1,
  2: 2,
  3: 3,
  6: 6,
  12: 12,
  45: 45,
  90: 90,
  180: 180
};
var SKEW_MAP = {
  0: 0,
  1: 1,
  2: 2,
  3: 3,
  6: 6,
  12: 12
};
var PERSPECTIVE_SCALE = {
  0: 0,
  100: 100,
  200: 200,
  300: 300,
  400: 400,
  500: 500,
  600: 600,
  700: 700,
  800: 800,
  900: 900,
  1e3: 1e3
};
function parseArbitraryScale(value) {
  const scaleMatch = value.match(/^\[(-?\d+(?:\.\d+)?)\]$/);
  if (scaleMatch) {
    return parseFloat(scaleMatch[1]);
  }
  if (value.startsWith("[") && value.endsWith("]")) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[react-native-tailwind] Invalid arbitrary scale value: ${value}. Only numbers are supported (e.g., [1.5], [0.75]).`
      );
    }
    return null;
  }
  return null;
}
function parseArbitraryRotation(value) {
  const rotateMatch = value.match(/^\[(-?\d+(?:\.\d+)?)deg\]$/);
  if (rotateMatch) {
    return `${rotateMatch[1]}deg`;
  }
  if (value.startsWith("[") && value.endsWith("]")) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[react-native-tailwind] Invalid arbitrary rotation value: ${value}. Only deg unit is supported (e.g., [45deg], [-15deg]).`
      );
    }
    return null;
  }
  return null;
}
function parseArbitraryTranslation(value) {
  const pxMatch = value.match(/^\[(-?\d+)(?:px)?\]$/);
  if (pxMatch) {
    return parseInt(pxMatch[1], 10);
  }
  const percentMatch = value.match(/^\[(-?\d+(?:\.\d+)?)%\]$/);
  if (percentMatch) {
    return `${percentMatch[1]}%`;
  }
  if (value.startsWith("[") && value.endsWith("]")) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[react-native-tailwind] Unsupported arbitrary translation unit: ${value}. Only px and % are supported.`
      );
    }
    return null;
  }
  return null;
}
function parseArbitraryPerspective(value) {
  const perspectiveMatch = value.match(/^\[(-?\d+)\]$/);
  if (perspectiveMatch) {
    return parseInt(perspectiveMatch[1], 10);
  }
  if (value.startsWith("[") && value.endsWith("]")) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[react-native-tailwind] Invalid arbitrary perspective value: ${value}. Only integers are supported (e.g., [1500]).`
      );
    }
    return null;
  }
  return null;
}
function parseTransform(cls, customSpacing) {
  const spacingMap = customSpacing ? { ...SPACING_SCALE, ...customSpacing } : SPACING_SCALE;
  if (cls.startsWith("origin-")) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[react-native-tailwind] transform-origin is not supported in React Native. Class "${cls}" will be ignored.`
      );
    }
    return null;
  }
  if (cls.startsWith("scale-")) {
    const scaleKey = cls.substring(6);
    const arbitraryScale = parseArbitraryScale(scaleKey);
    if (arbitraryScale !== null) {
      return { transform: [{ scale: arbitraryScale }] };
    }
    const scaleValue = SCALE_MAP[scaleKey];
    if (scaleValue !== void 0) {
      return { transform: [{ scale: scaleValue }] };
    }
  }
  if (cls.startsWith("scale-x-")) {
    const scaleKey = cls.substring(8);
    const arbitraryScale = parseArbitraryScale(scaleKey);
    if (arbitraryScale !== null) {
      return { transform: [{ scaleX: arbitraryScale }] };
    }
    const scaleValue = SCALE_MAP[scaleKey];
    if (scaleValue !== void 0) {
      return { transform: [{ scaleX: scaleValue }] };
    }
  }
  if (cls.startsWith("scale-y-")) {
    const scaleKey = cls.substring(8);
    const arbitraryScale = parseArbitraryScale(scaleKey);
    if (arbitraryScale !== null) {
      return { transform: [{ scaleY: arbitraryScale }] };
    }
    const scaleValue = SCALE_MAP[scaleKey];
    if (scaleValue !== void 0) {
      return { transform: [{ scaleY: scaleValue }] };
    }
  }
  if (cls.startsWith("rotate-") || cls.startsWith("-rotate-")) {
    const isNegative = cls.startsWith("-");
    const rotateKey = isNegative ? cls.substring(8) : cls.substring(7);
    const arbitraryRotate = parseArbitraryRotation(rotateKey);
    if (arbitraryRotate !== null) {
      const degrees = isNegative ? `-${arbitraryRotate}` : arbitraryRotate;
      return { transform: [{ rotate: degrees }] };
    }
    const rotateValue = ROTATE_MAP[rotateKey];
    if (rotateValue !== void 0) {
      const degrees = isNegative ? -rotateValue : rotateValue;
      return { transform: [{ rotate: `${degrees}deg` }] };
    }
  }
  if (cls.startsWith("rotate-x-") || cls.startsWith("-rotate-x-")) {
    const isNegative = cls.startsWith("-");
    const rotateKey = isNegative ? cls.substring(10) : cls.substring(9);
    const arbitraryRotate = parseArbitraryRotation(rotateKey);
    if (arbitraryRotate !== null) {
      const degrees = isNegative ? `-${arbitraryRotate}` : arbitraryRotate;
      return { transform: [{ rotateX: degrees }] };
    }
    const rotateValue = ROTATE_MAP[rotateKey];
    if (rotateValue !== void 0) {
      const degrees = isNegative ? -rotateValue : rotateValue;
      return { transform: [{ rotateX: `${degrees}deg` }] };
    }
  }
  if (cls.startsWith("rotate-y-") || cls.startsWith("-rotate-y-")) {
    const isNegative = cls.startsWith("-");
    const rotateKey = isNegative ? cls.substring(10) : cls.substring(9);
    const arbitraryRotate = parseArbitraryRotation(rotateKey);
    if (arbitraryRotate !== null) {
      const degrees = isNegative ? `-${arbitraryRotate}` : arbitraryRotate;
      return { transform: [{ rotateY: degrees }] };
    }
    const rotateValue = ROTATE_MAP[rotateKey];
    if (rotateValue !== void 0) {
      const degrees = isNegative ? -rotateValue : rotateValue;
      return { transform: [{ rotateY: `${degrees}deg` }] };
    }
  }
  if (cls.startsWith("rotate-z-") || cls.startsWith("-rotate-z-")) {
    const isNegative = cls.startsWith("-");
    const rotateKey = isNegative ? cls.substring(10) : cls.substring(9);
    const arbitraryRotate = parseArbitraryRotation(rotateKey);
    if (arbitraryRotate !== null) {
      const degrees = isNegative ? `-${arbitraryRotate}` : arbitraryRotate;
      return { transform: [{ rotateZ: degrees }] };
    }
    const rotateValue = ROTATE_MAP[rotateKey];
    if (rotateValue !== void 0) {
      const degrees = isNegative ? -rotateValue : rotateValue;
      return { transform: [{ rotateZ: `${degrees}deg` }] };
    }
  }
  if (cls.startsWith("translate-x-") || cls.startsWith("-translate-x-")) {
    const isNegative = cls.startsWith("-");
    const translateKey = isNegative ? cls.substring(13) : cls.substring(12);
    const arbitraryTranslate = parseArbitraryTranslation(translateKey);
    if (arbitraryTranslate !== null) {
      const value = typeof arbitraryTranslate === "number" ? isNegative ? -arbitraryTranslate : arbitraryTranslate : isNegative ? `-${arbitraryTranslate}` : arbitraryTranslate;
      return { transform: [{ translateX: value }] };
    }
    const translateValue = spacingMap[translateKey];
    if (translateValue !== void 0) {
      const value = isNegative ? -translateValue : translateValue;
      return { transform: [{ translateX: value }] };
    }
  }
  if (cls.startsWith("translate-y-") || cls.startsWith("-translate-y-")) {
    const isNegative = cls.startsWith("-");
    const translateKey = isNegative ? cls.substring(13) : cls.substring(12);
    const arbitraryTranslate = parseArbitraryTranslation(translateKey);
    if (arbitraryTranslate !== null) {
      const value = typeof arbitraryTranslate === "number" ? isNegative ? -arbitraryTranslate : arbitraryTranslate : isNegative ? `-${arbitraryTranslate}` : arbitraryTranslate;
      return { transform: [{ translateY: value }] };
    }
    const translateValue = spacingMap[translateKey];
    if (translateValue !== void 0) {
      const value = isNegative ? -translateValue : translateValue;
      return { transform: [{ translateY: value }] };
    }
  }
  if (cls.startsWith("skew-x-") || cls.startsWith("-skew-x-")) {
    const isNegative = cls.startsWith("-");
    const skewKey = isNegative ? cls.substring(8) : cls.substring(7);
    const arbitrarySkew = parseArbitraryRotation(skewKey);
    if (arbitrarySkew !== null) {
      const degrees = isNegative ? `-${arbitrarySkew}` : arbitrarySkew;
      return { transform: [{ skewX: degrees }] };
    }
    const skewValue = SKEW_MAP[skewKey];
    if (skewValue !== void 0) {
      const degrees = isNegative ? -skewValue : skewValue;
      return { transform: [{ skewX: `${degrees}deg` }] };
    }
  }
  if (cls.startsWith("skew-y-") || cls.startsWith("-skew-y-")) {
    const isNegative = cls.startsWith("-");
    const skewKey = isNegative ? cls.substring(8) : cls.substring(7);
    const arbitrarySkew = parseArbitraryRotation(skewKey);
    if (arbitrarySkew !== null) {
      const degrees = isNegative ? `-${arbitrarySkew}` : arbitrarySkew;
      return { transform: [{ skewY: degrees }] };
    }
    const skewValue = SKEW_MAP[skewKey];
    if (skewValue !== void 0) {
      const degrees = isNegative ? -skewValue : skewValue;
      return { transform: [{ skewY: `${degrees}deg` }] };
    }
  }
  if (cls.startsWith("perspective-")) {
    const perspectiveKey = cls.substring(12);
    const arbitraryPerspective = parseArbitraryPerspective(perspectiveKey);
    if (arbitraryPerspective !== null) {
      return { transform: [{ perspective: arbitraryPerspective }] };
    }
    const perspectiveValue = PERSPECTIVE_SCALE[perspectiveKey];
    if (perspectiveValue !== void 0) {
      return { transform: [{ perspective: perspectiveValue }] };
    }
  }
  return null;
}

// src/parser/typography.ts
var FONT_SIZES = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  "2xl": 24,
  "3xl": 30,
  "4xl": 36,
  "5xl": 48,
  "6xl": 60,
  "7xl": 72,
  "8xl": 96,
  "9xl": 128
};
var FONT_FAMILY_MAP = {
  "font-sans": { fontFamily: "System" },
  "font-serif": { fontFamily: "serif" },
  "font-mono": { fontFamily: "Courier" }
};
var FONT_WEIGHT_MAP = {
  "font-thin": { fontWeight: "100" },
  "font-extralight": { fontWeight: "200" },
  "font-light": { fontWeight: "300" },
  "font-normal": { fontWeight: "400" },
  "font-medium": { fontWeight: "500" },
  "font-semibold": { fontWeight: "600" },
  "font-bold": { fontWeight: "700" },
  "font-extrabold": { fontWeight: "800" },
  "font-black": { fontWeight: "900" }
};
var FONT_STYLE_MAP = {
  italic: { fontStyle: "italic" },
  "not-italic": { fontStyle: "normal" }
};
var TEXT_ALIGN_MAP = {
  "text-left": { textAlign: "left" },
  "text-center": { textAlign: "center" },
  "text-right": { textAlign: "right" },
  "text-justify": { textAlign: "justify" }
};
var TEXT_DECORATION_MAP = {
  underline: { textDecorationLine: "underline" },
  "line-through": { textDecorationLine: "line-through" },
  "no-underline": { textDecorationLine: "none" }
};
var TEXT_TRANSFORM_MAP = {
  uppercase: { textTransform: "uppercase" },
  lowercase: { textTransform: "lowercase" },
  capitalize: { textTransform: "capitalize" },
  "normal-case": { textTransform: "none" }
};
var LINE_HEIGHT_SCALE = {
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40
};
var LINE_HEIGHT_MAP = {
  "leading-none": { lineHeight: 16 },
  "leading-tight": { lineHeight: 20 },
  "leading-snug": { lineHeight: 22 },
  "leading-normal": { lineHeight: 24 },
  "leading-relaxed": { lineHeight: 28 },
  "leading-loose": { lineHeight: 32 }
};
var TRACKING_MAP = {
  "tracking-tighter": { letterSpacing: -0.8 },
  "tracking-tight": { letterSpacing: -0.4 },
  "tracking-normal": { letterSpacing: 0 },
  "tracking-wide": { letterSpacing: 0.4 },
  "tracking-wider": { letterSpacing: 0.8 },
  "tracking-widest": { letterSpacing: 1.6 }
};
function parseArbitraryFontSize(value) {
  const pxMatch = value.match(/^\[(-?\d+(?:\.\d+)?|-?\.\d+)(?:px)?\]$/);
  if (pxMatch) {
    return parseFloat(pxMatch[1]);
  }
  if (value.startsWith("[") && value.endsWith("]")) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[react-native-tailwind] Unsupported arbitrary font size value: ${value}. Only px values are supported (e.g., [18px], [13.5px], [.5]).`
      );
    }
    return null;
  }
  return null;
}
function parseArbitraryLineHeight(value) {
  const pxMatch = value.match(/^\[(-?\d+(?:\.\d+)?|-?\.\d+)(?:px)?\]$/);
  if (pxMatch) {
    return parseFloat(pxMatch[1]);
  }
  if (value.startsWith("[") && value.endsWith("]")) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[react-native-tailwind] Unsupported arbitrary line height value: ${value}. Only px values are supported (e.g., [24px], [21.5px], [.5]).`
      );
    }
    return null;
  }
  return null;
}
function parseArbitraryLetterSpacing(value) {
  const pxMatch = value.match(/^\[(-?\d+(?:\.\d+)?|-?\.\d+)(?:px)?\]$/);
  if (pxMatch) {
    return parseFloat(pxMatch[1]);
  }
  if (value.startsWith("[") && value.endsWith("]")) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[react-native-tailwind] Unsupported arbitrary letter spacing value: ${value}. Only px values are supported (e.g., [0.5px], [0.3], [.5], [-0.4]).`
      );
    }
    return null;
  }
  return null;
}
function parseTypography(cls, customFontFamily, customFontSize) {
  const fontFamilyMap = customFontFamily ? {
    ...FONT_FAMILY_MAP,
    ...Object.fromEntries(
      Object.entries(customFontFamily).map(([key, value]) => [`font-${key}`, { fontFamily: value }])
    )
  } : FONT_FAMILY_MAP;
  if (cls.startsWith("text-")) {
    const sizeKey = cls.substring(5);
    const arbitraryValue = parseArbitraryFontSize(sizeKey);
    if (arbitraryValue !== null) {
      return { fontSize: arbitraryValue };
    }
    if (customFontSize?.[sizeKey] !== void 0) {
      return { fontSize: customFontSize[sizeKey] };
    }
    const fontSize = FONT_SIZES[sizeKey];
    if (fontSize !== void 0) {
      return { fontSize };
    }
  }
  if (cls.startsWith("leading-")) {
    const heightKey = cls.substring(8);
    const arbitraryValue = parseArbitraryLineHeight(heightKey);
    if (arbitraryValue !== null) {
      return { lineHeight: arbitraryValue };
    }
    const lineHeight = LINE_HEIGHT_SCALE[heightKey];
    if (lineHeight !== void 0) {
      return { lineHeight };
    }
  }
  if (cls.startsWith("tracking-")) {
    const trackingKey = cls.substring(9);
    const arbitraryValue = parseArbitraryLetterSpacing(trackingKey);
    if (arbitraryValue !== null) {
      return { letterSpacing: arbitraryValue };
    }
  }
  return fontFamilyMap[cls] ?? FONT_WEIGHT_MAP[cls] ?? FONT_STYLE_MAP[cls] ?? TEXT_ALIGN_MAP[cls] ?? TEXT_DECORATION_MAP[cls] ?? TEXT_TRANSFORM_MAP[cls] ?? LINE_HEIGHT_MAP[cls] ?? TRACKING_MAP[cls] ?? null;
}

// src/parser/placeholder.ts
function parsePlaceholderClass(cls, customColors) {
  if (!cls.startsWith("text-")) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[react-native-tailwind] Only text color utilities are supported in placeholder: modifier. Class "${cls}" will be ignored. React Native only supports placeholderTextColor prop.`
      );
    }
    return null;
  }
  const styleObject = parseColor(cls, customColors);
  if (!styleObject?.color) {
    return null;
  }
  return styleObject.color;
}
function parsePlaceholderClasses(classes, customColors) {
  const classList = classes.trim().split(/\s+/).filter(Boolean);
  let finalColor = null;
  for (const cls of classList) {
    const color = parsePlaceholderClass(cls, customColors);
    if (color) {
      finalColor = color;
    }
  }
  return finalColor;
}

// src/parser/modifiers.ts
var STATE_MODIFIERS = [
  "active",
  "hover",
  "focus",
  "disabled",
  "placeholder"
];
var PLATFORM_MODIFIERS = ["ios", "android", "web"];
var COLOR_SCHEME_MODIFIERS = ["dark", "light"];
var SCHEME_MODIFIERS = ["scheme"];
var DIRECTIONAL_MODIFIERS = ["rtl", "ltr"];
var SUPPORTED_MODIFIERS = [
  ...STATE_MODIFIERS,
  ...PLATFORM_MODIFIERS,
  ...COLOR_SCHEME_MODIFIERS,
  ...SCHEME_MODIFIERS,
  ...DIRECTIONAL_MODIFIERS
];
function parseModifier(cls) {
  const colonIndex = cls.indexOf(":");
  if (colonIndex === -1) {
    return null;
  }
  const potentialModifier = cls.slice(0, colonIndex);
  const baseClass = cls.slice(colonIndex + 1);
  if (!SUPPORTED_MODIFIERS.includes(potentialModifier)) {
    return null;
  }
  if (baseClass.includes(":")) {
    return null;
  }
  if (!baseClass) {
    return null;
  }
  return {
    modifier: potentialModifier,
    baseClass
  };
}
function isStateModifier(modifier) {
  return STATE_MODIFIERS.includes(modifier);
}
function isPlatformModifier(modifier) {
  return PLATFORM_MODIFIERS.includes(modifier);
}
function isColorSchemeModifier(modifier) {
  return COLOR_SCHEME_MODIFIERS.includes(modifier);
}
function isSchemeModifier(modifier) {
  return SCHEME_MODIFIERS.includes(modifier);
}
function isDirectionalModifier(modifier) {
  return DIRECTIONAL_MODIFIERS.includes(modifier);
}
function isColorClass(className) {
  return className.startsWith("text-") || className.startsWith("bg-") || className.startsWith("border-");
}
function expandSchemeModifier(schemeModifier, customColors, darkSuffix = "-dark", lightSuffix = "-light") {
  const { baseClass } = schemeModifier;
  if (!isColorClass(baseClass)) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[react-native-tailwind] scheme: modifier only supports color classes (text-*, bg-*, border-*). Found: "${baseClass}". This modifier will be ignored.`
      );
    }
    return [];
  }
  const match = baseClass.match(/^(text|bg|border)-(.+)$/);
  if (!match) {
    return [];
  }
  const [, prefix, colorName] = match;
  const darkColorName = `${colorName}${darkSuffix}`;
  const lightColorName = `${colorName}${lightSuffix}`;
  const darkColorExists = customColors[darkColorName] !== void 0;
  const lightColorExists = customColors[lightColorName] !== void 0;
  if (!darkColorExists || !lightColorExists) {
    if (process.env.NODE_ENV !== "production") {
      const missing = [];
      if (!darkColorExists) missing.push(`${colorName}${darkSuffix}`);
      if (!lightColorExists) missing.push(`${colorName}${lightSuffix}`);
      console.warn(
        `[react-native-tailwind] scheme:${baseClass} requires both color variants to exist. Missing: ${missing.join(", ")}. This modifier will be ignored.`
      );
    }
    return [];
  }
  return [
    {
      modifier: "dark",
      baseClass: `${prefix}-${darkColorName}`
    },
    {
      modifier: "light",
      baseClass: `${prefix}-${lightColorName}`
    }
  ];
}
var DIRECTIONAL_TEXT_ALIGN_EXPANSIONS = {
  "text-start": { ltr: "text-left", rtl: "text-right" },
  "text-end": { ltr: "text-right", rtl: "text-left" }
};
function getDirectionalExpansion(cls) {
  return DIRECTIONAL_TEXT_ALIGN_EXPANSIONS[cls];
}
function splitModifierClasses(className) {
  const classes = className.trim().split(/\s+/).filter(Boolean);
  const baseClasses = [];
  const modifierClasses = [];
  for (const cls of classes) {
    const directionalExpansion = getDirectionalExpansion(cls);
    if (directionalExpansion) {
      modifierClasses.push({ modifier: "ltr", baseClass: directionalExpansion.ltr });
      modifierClasses.push({ modifier: "rtl", baseClass: directionalExpansion.rtl });
      continue;
    }
    const parsed = parseModifier(cls);
    if (parsed) {
      modifierClasses.push(parsed);
    } else {
      baseClasses.push(cls);
    }
  }
  return { baseClasses, modifierClasses };
}

// src/parser/index.ts
function parseClassName(className, customTheme) {
  const classes = className.split(/\s+/).filter(Boolean);
  const style = {};
  for (const cls of classes) {
    const parsedStyle = parseClass(cls, customTheme);
    mergeStyles(style, parsedStyle);
  }
  return style;
}
function parseClass(cls, customTheme) {
  const parsers = [
    (cls2) => parseSpacing(cls2, customTheme?.spacing),
    (cls2) => parseBorder(cls2, customTheme?.colors),
    (cls2) => parseOutline(cls2, customTheme?.colors),
    (cls2) => parseColor(cls2, customTheme?.colors),
    (cls2) => parseLayout(cls2, customTheme?.spacing),
    (cls2) => parseTypography(cls2, customTheme?.fontFamily, customTheme?.fontSize),
    (cls2) => parseSizing(cls2, customTheme?.spacing),
    (cls2) => parseShadow(cls2, customTheme?.colors),
    parseAspectRatio,
    (cls2) => parseTransform(cls2, customTheme?.spacing)
  ];
  for (const parser of parsers) {
    const result = parser(cls);
    if (result !== null) {
      return result;
    }
  }
  if (process.env.NODE_ENV !== "production") {
    console.warn(`[react-native-tailwind] Unknown class: "${cls}"`);
  }
  return {};
}

// src/utils/styleKey.ts
function generateStyleKey(className) {
  const classes = className.split(/\s+/).filter(Boolean).sort();
  const key = "_" + classes.join("_").replace(/[^a-zA-Z0-9_]/g, "_").replace(/_+/g, "_");
  return key;
}

// src/babel/utils/windowDimensionsProcessing.ts
function hasRuntimeDimensions(styleObject) {
  return Object.values(styleObject).some(
    (value) => typeof value === "string" && value.startsWith(RUNTIME_DIMENSIONS_MARKER)
  );
}
function createRuntimeDimensionObject(styleObject, state, t) {
  state.needsWindowDimensionsImport = true;
  const properties = [];
  for (const [key, value] of Object.entries(styleObject)) {
    let valueNode;
    if (typeof value === "string" && value.startsWith(RUNTIME_DIMENSIONS_MARKER)) {
      const match = value.match(/dimensions\.(\w+)/);
      const prop = match?.[1];
      if (prop) {
        valueNode = t.memberExpression(t.identifier(state.windowDimensionsVariableName), t.identifier(prop));
      } else {
        valueNode = t.stringLiteral(value);
      }
    } else if (typeof value === "number") {
      valueNode = t.numericLiteral(value);
    } else if (typeof value === "string") {
      valueNode = t.stringLiteral(value);
    } else if (typeof value === "object" && value !== null) {
      valueNode = t.valueToNode(value);
    } else {
      valueNode = t.valueToNode(value);
    }
    properties.push(t.objectProperty(t.identifier(key), valueNode));
  }
  return t.objectExpression(properties);
}
function splitStaticAndRuntimeStyles(styleObject) {
  const staticStyles = {};
  const runtimeStyles = {};
  for (const [key, value] of Object.entries(styleObject)) {
    if (typeof value === "string" && value.startsWith(RUNTIME_DIMENSIONS_MARKER)) {
      runtimeStyles[key] = value;
    } else {
      staticStyles[key] = value;
    }
  }
  return { static: staticStyles, runtime: runtimeStyles };
}

// src/babel/utils/colorSchemeModifierProcessing.ts
function processColorSchemeModifiers(colorSchemeModifiers, state, parseClassName2, generateStyleKey2, t) {
  state.needsColorSchemeImport = true;
  const modifiersByScheme = /* @__PURE__ */ new Map();
  for (const mod of colorSchemeModifiers) {
    const scheme = mod.modifier;
    if (!modifiersByScheme.has(scheme)) {
      modifiersByScheme.set(scheme, []);
    }
    const schemeGroup = modifiersByScheme.get(scheme);
    if (schemeGroup) {
      schemeGroup.push(mod);
    }
  }
  const conditionalExpressions = [];
  for (const [scheme, modifiers] of modifiersByScheme) {
    const classNames = modifiers.map((m) => m.baseClass).join(" ");
    const styleObject = parseClassName2(classNames, state.customTheme);
    if (hasRuntimeDimensions(styleObject)) {
      throw new Error(
        `w-screen and h-screen cannot be combined with color scheme modifiers (dark:, light:, scheme:). Found in: "${scheme}:${classNames}". Use w-screen/h-screen without modifiers instead.`
      );
    }
    const styleKey = generateStyleKey2(`${scheme}_${classNames}`);
    state.styleRegistry.set(styleKey, styleObject);
    const colorSchemeCheck = t.binaryExpression(
      "===",
      t.identifier(state.colorSchemeVariableName),
      t.stringLiteral(scheme)
    );
    const styleReference = t.memberExpression(t.identifier(state.stylesIdentifier), t.identifier(styleKey));
    const conditionalExpression = t.logicalExpression("&&", colorSchemeCheck, styleReference);
    conditionalExpressions.push(conditionalExpression);
  }
  return conditionalExpressions;
}

// src/babel/utils/componentSupport.ts
function getComponentModifierSupport(jsxElement, t) {
  if (!t.isJSXOpeningElement(jsxElement)) {
    return null;
  }
  const name = jsxElement.name;
  let componentName = null;
  if (t.isJSXIdentifier(name)) {
    componentName = name.name;
  }
  if (t.isJSXMemberExpression(name)) {
    const property = name.property;
    if (t.isJSXIdentifier(property)) {
      componentName = property.name;
    }
  }
  if (!componentName) {
    return null;
  }
  switch (componentName) {
    case "Pressable":
      return { component: "Pressable", supportedModifiers: ["active", "hover", "focus", "disabled"] };
    case "TouchableOpacity":
      return { component: "TouchableOpacity", supportedModifiers: ["active", "disabled"] };
    case "TextInput":
      return { component: "TextInput", supportedModifiers: ["focus", "disabled", "placeholder"] };
    default:
      return null;
  }
}
function getStatePropertyForModifier(modifier) {
  switch (modifier) {
    case "active":
      return "pressed";
    case "hover":
      return "hovered";
    case "focus":
      return "focused";
    case "disabled":
      return "disabled";
    default:
      return "pressed";
  }
}

// src/babel/utils/directionalModifierProcessing.ts
function processDirectionalModifiers(directionalModifiers, state, parseClassName2, generateStyleKey2, t) {
  state.needsI18nManagerImport = true;
  const modifiersByDirection = /* @__PURE__ */ new Map();
  for (const mod of directionalModifiers) {
    const direction = mod.modifier;
    if (!modifiersByDirection.has(direction)) {
      modifiersByDirection.set(direction, []);
    }
    const directionGroup = modifiersByDirection.get(direction);
    if (directionGroup) {
      directionGroup.push(mod);
    }
  }
  const conditionalExpressions = [];
  for (const [direction, modifiers] of modifiersByDirection) {
    const classNames = modifiers.map((m) => m.baseClass).join(" ");
    const styleObject = parseClassName2(classNames, state.customTheme);
    if (hasRuntimeDimensions(styleObject)) {
      throw new Error(
        `w-screen and h-screen cannot be combined with directional modifiers (rtl:, ltr:). Found in: "${direction}:${classNames}". Use w-screen/h-screen without modifiers instead.`
      );
    }
    const styleKey = generateStyleKey2(`${direction}_${classNames}`);
    state.styleRegistry.set(styleKey, styleObject);
    const rtlVariable = t.identifier(state.i18nManagerVariableName);
    const directionCheck = direction === "rtl" ? rtlVariable : t.unaryExpression("!", rtlVariable);
    const styleReference = t.memberExpression(t.identifier(state.stylesIdentifier), t.identifier(styleKey));
    const conditionalExpression = t.logicalExpression("&&", directionCheck, styleReference);
    conditionalExpressions.push(conditionalExpression);
  }
  return conditionalExpressions;
}

// src/babel/utils/dynamicProcessing.ts
function processDynamicExpression(expression, state, parseClassName2, generateStyleKey2, splitModifierClasses2, processPlatformModifiers2, processColorSchemeModifiers2, componentScope, isPlatformModifier2, isColorSchemeModifier2, isSchemeModifier2, expandSchemeModifier2, t) {
  if (t.isTemplateLiteral(expression)) {
    return processTemplateLiteral(
      expression,
      state,
      parseClassName2,
      generateStyleKey2,
      splitModifierClasses2,
      processPlatformModifiers2,
      processColorSchemeModifiers2,
      componentScope,
      isPlatformModifier2,
      isColorSchemeModifier2,
      isSchemeModifier2,
      expandSchemeModifier2,
      t
    );
  }
  if (t.isConditionalExpression(expression)) {
    return processConditionalExpression(
      expression,
      state,
      parseClassName2,
      generateStyleKey2,
      splitModifierClasses2,
      processPlatformModifiers2,
      processColorSchemeModifiers2,
      componentScope,
      isPlatformModifier2,
      isColorSchemeModifier2,
      isSchemeModifier2,
      expandSchemeModifier2,
      t
    );
  }
  if (t.isLogicalExpression(expression)) {
    return processLogicalExpression(
      expression,
      state,
      parseClassName2,
      generateStyleKey2,
      splitModifierClasses2,
      processPlatformModifiers2,
      processColorSchemeModifiers2,
      componentScope,
      isPlatformModifier2,
      isColorSchemeModifier2,
      isSchemeModifier2,
      expandSchemeModifier2,
      t
    );
  }
  return null;
}
function processTemplateLiteral(node, state, parseClassName2, generateStyleKey2, splitModifierClasses2, processPlatformModifiers2, processColorSchemeModifiers2, componentScope, isPlatformModifier2, isColorSchemeModifier2, isSchemeModifier2, expandSchemeModifier2, t) {
  const parts = [];
  const staticParts = [];
  for (let i = 0; i < node.quasis.length; i++) {
    const quasi = node.quasis[i];
    const staticText = quasi.value.cooked?.trim();
    if (staticText) {
      const processedExpression = processStringOrExpressionHelper(
        t.stringLiteral(staticText),
        state,
        parseClassName2,
        generateStyleKey2,
        splitModifierClasses2,
        processPlatformModifiers2,
        processColorSchemeModifiers2,
        componentScope,
        isPlatformModifier2,
        isColorSchemeModifier2,
        isSchemeModifier2,
        expandSchemeModifier2,
        t
      );
      if (processedExpression) {
        staticParts.push(staticText);
        if (t.isArrayExpression(processedExpression)) {
          parts.push(...processedExpression.elements);
        } else {
          parts.push(processedExpression);
        }
      }
    }
    if (i < node.expressions.length) {
      const expr = node.expressions[i];
      const result = processDynamicExpression(
        expr,
        state,
        parseClassName2,
        generateStyleKey2,
        splitModifierClasses2,
        processPlatformModifiers2,
        processColorSchemeModifiers2,
        componentScope,
        isPlatformModifier2,
        isColorSchemeModifier2,
        isSchemeModifier2,
        expandSchemeModifier2,
        t
      );
      if (result) {
        parts.push(result.expression);
      } else {
        parts.push(expr);
      }
    }
  }
  if (parts.length === 0) {
    return null;
  }
  const expression = parts.length === 1 ? parts[0] : t.arrayExpression(parts);
  return {
    expression,
    staticParts: staticParts.length > 0 ? staticParts : void 0
  };
}
function processConditionalExpression(node, state, parseClassName2, generateStyleKey2, splitModifierClasses2, processPlatformModifiers2, processColorSchemeModifiers2, componentScope, isPlatformModifier2, isColorSchemeModifier2, isSchemeModifier2, expandSchemeModifier2, t) {
  const consequent = processStringOrExpressionHelper(
    node.consequent,
    state,
    parseClassName2,
    generateStyleKey2,
    splitModifierClasses2,
    processPlatformModifiers2,
    processColorSchemeModifiers2,
    componentScope,
    isPlatformModifier2,
    isColorSchemeModifier2,
    isSchemeModifier2,
    expandSchemeModifier2,
    t
  );
  const alternate = processStringOrExpressionHelper(
    node.alternate,
    state,
    parseClassName2,
    generateStyleKey2,
    splitModifierClasses2,
    processPlatformModifiers2,
    processColorSchemeModifiers2,
    componentScope,
    isPlatformModifier2,
    isColorSchemeModifier2,
    isSchemeModifier2,
    expandSchemeModifier2,
    t
  );
  if (!consequent && !alternate) {
    return null;
  }
  const expression = t.conditionalExpression(
    node.test,
    consequent ?? t.nullLiteral(),
    alternate ?? t.nullLiteral()
  );
  return { expression };
}
function processLogicalExpression(node, state, parseClassName2, generateStyleKey2, splitModifierClasses2, processPlatformModifiers2, processColorSchemeModifiers2, componentScope, isPlatformModifier2, isColorSchemeModifier2, isSchemeModifier2, expandSchemeModifier2, t) {
  if (node.operator !== "&&") {
    return null;
  }
  const right = processStringOrExpressionHelper(
    node.right,
    state,
    parseClassName2,
    generateStyleKey2,
    splitModifierClasses2,
    processPlatformModifiers2,
    processColorSchemeModifiers2,
    componentScope,
    isPlatformModifier2,
    isColorSchemeModifier2,
    isSchemeModifier2,
    expandSchemeModifier2,
    t
  );
  if (!right) {
    return null;
  }
  const expression = t.logicalExpression("&&", node.left, right);
  return { expression };
}
function processStringOrExpressionHelper(node, state, parseClassName2, generateStyleKey2, splitModifierClasses2, processPlatformModifiers2, processColorSchemeModifiers2, componentScope, isPlatformModifier2, isColorSchemeModifier2, isSchemeModifier2, expandSchemeModifier2, t) {
  if (t.isStringLiteral(node)) {
    const className = node.value.trim();
    if (!className) {
      return null;
    }
    const { baseClasses, modifierClasses: rawModifierClasses } = splitModifierClasses2(className);
    const modifierClasses = [];
    for (const modifier of rawModifierClasses) {
      if (isSchemeModifier2(modifier.modifier)) {
        const expanded = expandSchemeModifier2(
          modifier,
          state.customTheme.colors ?? {},
          state.schemeModifierConfig.darkSuffix ?? "-dark",
          state.schemeModifierConfig.lightSuffix ?? "-light"
        );
        modifierClasses.push(...expanded);
      } else {
        modifierClasses.push(modifier);
      }
    }
    const platformModifiers = modifierClasses.filter((m) => isPlatformModifier2(m.modifier));
    const colorSchemeModifiers = modifierClasses.filter((m) => isColorSchemeModifier2(m.modifier));
    const styleElements = [];
    if (baseClasses.length > 0) {
      const baseClassName = baseClasses.join(" ");
      const styleObject = parseClassName2(baseClassName, state.customTheme);
      const styleKey = generateStyleKey2(baseClassName);
      state.styleRegistry.set(styleKey, styleObject);
      styleElements.push(t.memberExpression(t.identifier(state.stylesIdentifier), t.identifier(styleKey)));
    }
    if (platformModifiers.length > 0) {
      state.needsPlatformImport = true;
      const platformExpression = processPlatformModifiers2(
        platformModifiers,
        state,
        parseClassName2,
        generateStyleKey2,
        t
      );
      styleElements.push(platformExpression);
    }
    if (colorSchemeModifiers.length > 0) {
      if (componentScope) {
        state.needsColorSchemeImport = true;
        state.functionComponentsNeedingColorScheme.add(componentScope);
        const colorSchemeExpressions = processColorSchemeModifiers2(
          colorSchemeModifiers,
          state,
          parseClassName2,
          generateStyleKey2,
          t
        );
        styleElements.push(...colorSchemeExpressions);
      } else {
        if (process.env.NODE_ENV !== "production") {
          console.warn(
            "[react-native-tailwind] dark:/light: modifiers in dynamic expressions require a function component scope. These modifiers will be ignored."
          );
        }
      }
    }
    if (styleElements.length === 0) {
      return null;
    }
    if (styleElements.length === 1) {
      return styleElements[0];
    }
    return t.arrayExpression(styleElements);
  }
  if (t.isConditionalExpression(node)) {
    const result = processConditionalExpression(
      node,
      state,
      parseClassName2,
      generateStyleKey2,
      splitModifierClasses2,
      processPlatformModifiers2,
      processColorSchemeModifiers2,
      componentScope,
      isPlatformModifier2,
      isColorSchemeModifier2,
      isSchemeModifier2,
      expandSchemeModifier2,
      t
    );
    return result?.expression ?? null;
  }
  if (t.isLogicalExpression(node)) {
    const result = processLogicalExpression(
      node,
      state,
      parseClassName2,
      generateStyleKey2,
      splitModifierClasses2,
      processPlatformModifiers2,
      processColorSchemeModifiers2,
      componentScope,
      isPlatformModifier2,
      isColorSchemeModifier2,
      isSchemeModifier2,
      expandSchemeModifier2,
      t
    );
    return result?.expression ?? null;
  }
  if (t.isTemplateLiteral(node)) {
    const result = processTemplateLiteral(
      node,
      state,
      parseClassName2,
      generateStyleKey2,
      splitModifierClasses2,
      processPlatformModifiers2,
      processColorSchemeModifiers2,
      componentScope,
      isPlatformModifier2,
      isColorSchemeModifier2,
      isSchemeModifier2,
      expandSchemeModifier2,
      t
    );
    return result?.expression ?? null;
  }
  return null;
}

// src/babel/utils/modifierProcessing.ts
function processStaticClassNameWithModifiers(className, state, parseClassName2, generateStyleKey2, splitModifierClasses2, t) {
  const { baseClasses, modifierClasses } = splitModifierClasses2(className);
  let baseStyleExpression = null;
  if (baseClasses.length > 0) {
    const baseClassName = baseClasses.join(" ");
    const baseStyleObject = parseClassName2(baseClassName, state.customTheme);
    if (hasRuntimeDimensions(baseStyleObject)) {
      throw new Error(
        `w-screen and h-screen cannot be combined with state modifiers (active:, hover:, focus:, etc.) or platform modifiers (ios:, android:, web:). Found in: "${baseClassName}". Use w-screen/h-screen without modifiers instead.`
      );
    }
    const baseStyleKey = generateStyleKey2(baseClassName);
    state.styleRegistry.set(baseStyleKey, baseStyleObject);
    baseStyleExpression = t.memberExpression(t.identifier(state.stylesIdentifier), t.identifier(baseStyleKey));
  }
  const modifiersByType = /* @__PURE__ */ new Map();
  for (const mod of modifierClasses) {
    if (!modifiersByType.has(mod.modifier)) {
      modifiersByType.set(mod.modifier, []);
    }
    const modGroup = modifiersByType.get(mod.modifier);
    if (modGroup) {
      modGroup.push(mod);
    }
  }
  const styleArrayElements = [];
  if (baseStyleExpression) {
    styleArrayElements.push(baseStyleExpression);
  }
  for (const [modifierType, modifiers] of modifiersByType) {
    const modifierClassNames = modifiers.map((m) => m.baseClass).join(" ");
    const modifierStyleObject = parseClassName2(modifierClassNames, state.customTheme);
    if (hasRuntimeDimensions(modifierStyleObject)) {
      throw new Error(
        `w-screen and h-screen cannot be combined with state modifiers (active:, hover:, focus:, etc.) or platform modifiers (ios:, android:, web:). Found in: "${modifierType}:${modifierClassNames}". Use w-screen/h-screen without modifiers instead.`
      );
    }
    const modifierStyleKey = generateStyleKey2(`${modifierType}_${modifierClassNames}`);
    state.styleRegistry.set(modifierStyleKey, modifierStyleObject);
    const stateProperty = getStatePropertyForModifier(modifierType);
    const conditionalExpression = t.logicalExpression(
      "&&",
      t.identifier(stateProperty),
      t.memberExpression(t.identifier(state.stylesIdentifier), t.identifier(modifierStyleKey))
    );
    styleArrayElements.push(conditionalExpression);
  }
  if (styleArrayElements.length === 1) {
    return styleArrayElements[0];
  }
  return t.arrayExpression(styleArrayElements);
}
function createStyleFunction(styleExpression, modifierTypes, t) {
  const paramProperties = [];
  const usedStateProps = /* @__PURE__ */ new Set();
  for (const modifierType of modifierTypes) {
    const stateProperty = getStatePropertyForModifier(modifierType);
    if (!usedStateProps.has(stateProperty)) {
      usedStateProps.add(stateProperty);
      paramProperties.push(
        t.objectProperty(t.identifier(stateProperty), t.identifier(stateProperty), false, true)
      );
    }
  }
  const param = t.objectPattern(paramProperties);
  return t.arrowFunctionExpression([param], styleExpression);
}

// src/babel/utils/platformModifierProcessing.ts
function processPlatformModifiers(platformModifiers, state, parseClassName2, generateStyleKey2, t) {
  state.needsPlatformImport = true;
  const modifiersByPlatform = /* @__PURE__ */ new Map();
  for (const mod of platformModifiers) {
    const platform = mod.modifier;
    if (!modifiersByPlatform.has(platform)) {
      modifiersByPlatform.set(platform, []);
    }
    const platformGroup = modifiersByPlatform.get(platform);
    if (platformGroup) {
      platformGroup.push(mod);
    }
  }
  const selectProperties = [];
  for (const [platform, modifiers] of modifiersByPlatform) {
    const classNames = modifiers.map((m) => m.baseClass).join(" ");
    const styleObject = parseClassName2(classNames, state.customTheme);
    if (hasRuntimeDimensions(styleObject)) {
      throw new Error(
        `w-screen and h-screen cannot be combined with platform modifiers (ios:, android:, web:). Found in: "${platform}:${classNames}". Use w-screen/h-screen without modifiers instead.`
      );
    }
    const styleKey = generateStyleKey2(`${platform}_${classNames}`);
    state.styleRegistry.set(styleKey, styleObject);
    const styleReference = t.memberExpression(t.identifier(state.stylesIdentifier), t.identifier(styleKey));
    selectProperties.push(t.objectProperty(t.identifier(platform), styleReference));
  }
  return t.callExpression(t.memberExpression(t.identifier("Platform"), t.identifier("select")), [
    t.objectExpression(selectProperties)
  ]);
}

// src/babel/utils/styleTransforms.ts
function getStyleExpression(styleAttribute, t) {
  const value = styleAttribute.value;
  if (!t.isJSXExpressionContainer(value)) return null;
  const expression = value.expression;
  if (t.isJSXEmptyExpression(expression)) return null;
  return expression;
}
function findStyleAttribute(path2, targetStyleProp, t) {
  const parent = path2.parent;
  return parent.attributes.find(
    (attr) => t.isJSXAttribute(attr) && t.isJSXIdentifier(attr.name) && attr.name.name === targetStyleProp
  );
}
function replaceWithStyleAttribute(classNamePath, styleKey, targetStyleProp, stylesIdentifier, t) {
  const styleAttribute = t.jsxAttribute(
    t.jsxIdentifier(targetStyleProp),
    t.jsxExpressionContainer(t.memberExpression(t.identifier(stylesIdentifier), t.identifier(styleKey)))
  );
  classNamePath.replaceWith(styleAttribute);
}
function mergeStyleAttribute(classNamePath, styleAttribute, styleKey, stylesIdentifier, t) {
  const existingStyle = getStyleExpression(styleAttribute, t);
  if (!existingStyle) return;
  if (t.isArrowFunctionExpression(existingStyle) || t.isFunctionExpression(existingStyle)) {
    const paramIdentifier = t.identifier("_state");
    const functionCall = t.callExpression(existingStyle, [paramIdentifier]);
    const mergedArray = t.arrayExpression([
      t.memberExpression(t.identifier(stylesIdentifier), t.identifier(styleKey)),
      functionCall
    ]);
    const wrapperFunction = t.arrowFunctionExpression([paramIdentifier], mergedArray);
    styleAttribute.value = t.jsxExpressionContainer(wrapperFunction);
  } else {
    const styleArray = t.arrayExpression([
      t.memberExpression(t.identifier(stylesIdentifier), t.identifier(styleKey)),
      existingStyle
    ]);
    styleAttribute.value = t.jsxExpressionContainer(styleArray);
  }
  classNamePath.remove();
}
function replaceDynamicWithStyleAttribute(classNamePath, result, targetStyleProp, t) {
  const styleAttribute = t.jsxAttribute(
    t.jsxIdentifier(targetStyleProp),
    t.jsxExpressionContainer(result.expression)
  );
  classNamePath.replaceWith(styleAttribute);
}
function mergeDynamicStyleAttribute(classNamePath, styleAttribute, result, t) {
  const existingStyle = getStyleExpression(styleAttribute, t);
  if (!existingStyle) return;
  if (t.isArrowFunctionExpression(existingStyle) || t.isFunctionExpression(existingStyle)) {
    const paramIdentifier = t.identifier("_state");
    const functionCall = t.callExpression(existingStyle, [paramIdentifier]);
    const mergedArray = t.arrayExpression([result.expression, functionCall]);
    const wrapperFunction = t.arrowFunctionExpression([paramIdentifier], mergedArray);
    styleAttribute.value = t.jsxExpressionContainer(wrapperFunction);
  } else {
    let styleArray;
    if (t.isArrayExpression(existingStyle)) {
      styleArray = t.arrayExpression([result.expression, ...existingStyle.elements]);
    } else {
      styleArray = t.arrayExpression([result.expression, existingStyle]);
    }
    styleAttribute.value = t.jsxExpressionContainer(styleArray);
  }
  classNamePath.remove();
}
function replaceWithStyleFunctionAttribute(classNamePath, styleFunctionExpression, targetStyleProp, t) {
  const styleAttribute = t.jsxAttribute(
    t.jsxIdentifier(targetStyleProp),
    t.jsxExpressionContainer(styleFunctionExpression)
  );
  classNamePath.replaceWith(styleAttribute);
}
function mergeStyleFunctionAttribute(classNamePath, styleAttribute, styleFunctionExpression, t) {
  const existingStyle = getStyleExpression(styleAttribute, t);
  if (!existingStyle) return;
  if (t.isArrowFunctionExpression(existingStyle) || t.isFunctionExpression(existingStyle)) {
    const paramIdentifier = t.identifier("_state");
    const newFunctionCall = t.callExpression(styleFunctionExpression, [paramIdentifier]);
    const existingFunctionCall = t.callExpression(existingStyle, [paramIdentifier]);
    const mergedArray = t.arrayExpression([newFunctionCall, existingFunctionCall]);
    const wrapperFunction = t.arrowFunctionExpression([paramIdentifier], mergedArray);
    styleAttribute.value = t.jsxExpressionContainer(wrapperFunction);
  } else {
    const paramIdentifier = t.identifier("_state");
    const functionCall = t.callExpression(styleFunctionExpression, [paramIdentifier]);
    const mergedArray = t.arrayExpression([functionCall, existingStyle]);
    const wrapperFunction = t.arrowFunctionExpression([paramIdentifier], mergedArray);
    styleAttribute.value = t.jsxExpressionContainer(wrapperFunction);
  }
  classNamePath.remove();
}
function addOrMergePlaceholderTextColorProp(jsxOpeningElement, color, t) {
  const existingProp = jsxOpeningElement.attributes.find(
    (attr) => t.isJSXAttribute(attr) && attr.name.name === "placeholderTextColor"
  );
  if (existingProp) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[react-native-tailwind] placeholderTextColor prop will be overridden by className placeholder: modifier. Remove the explicit prop or the placeholder: modifier to avoid confusion.`
      );
    }
    existingProp.value = t.stringLiteral(color);
  } else {
    const newProp = t.jsxAttribute(t.jsxIdentifier("placeholderTextColor"), t.stringLiteral(color));
    jsxOpeningElement.attributes.push(newProp);
  }
}

// src/babel/plugin/componentScope.ts
function isComponentScope(functionPath, t) {
  const node = functionPath.node;
  const parent = functionPath.parent;
  const parentPath = functionPath.parentPath;
  if (t.isClassMethod(parent)) {
    return false;
  }
  if (functionPath.findParent((p) => t.isClassBody(p.node))) {
    return false;
  }
  if (t.isFunctionDeclaration(node)) {
    if (t.isProgram(parent) || t.isExportNamedDeclaration(parent) || t.isExportDefaultDeclaration(parent)) {
      return true;
    }
  }
  if (t.isFunctionExpression(node) || t.isArrowFunctionExpression(node)) {
    if (t.isVariableDeclarator(parent)) {
      const varDeclarationPath = parentPath?.parentPath;
      if (varDeclarationPath && t.isVariableDeclaration(varDeclarationPath.node) && (t.isProgram(varDeclarationPath.parent) || t.isExportNamedDeclaration(varDeclarationPath.parent))) {
        if (t.isIdentifier(parent.id)) {
          const name = parent.id.name;
          return /^[A-Z]/.test(name);
        }
      }
    }
  }
  return false;
}
function findComponentScope(path2, t) {
  let current = path2.getFunctionParent();
  while (current) {
    if (t.isFunction(current.node) && isComponentScope(current, t)) {
      return current;
    }
    current = current.getFunctionParent();
  }
  return null;
}

// src/babel/plugin/visitors/className.ts
function jsxAttributeVisitor(path2, state, t) {
  const node = path2.node;
  if (!t.isJSXIdentifier(node.name)) {
    return;
  }
  const attributeName = node.name.name;
  if (!isAttributeSupported(attributeName, state.supportedAttributes, state.attributePatterns)) {
    return;
  }
  const value = node.value;
  const targetStyleProp = getTargetStyleProp(attributeName);
  const processStaticClassName = (className) => {
    const trimmedClassName = className.trim();
    if (!trimmedClassName) {
      path2.remove();
      return true;
    }
    state.hasClassNames = true;
    const { baseClasses, modifierClasses: rawModifierClasses } = splitModifierClasses(trimmedClassName);
    const modifierClasses = [];
    for (const modifier of rawModifierClasses) {
      if (isSchemeModifier(modifier.modifier)) {
        const expanded = expandSchemeModifier(
          modifier,
          state.customTheme.colors ?? {},
          state.schemeModifierConfig.darkSuffix,
          state.schemeModifierConfig.lightSuffix
        );
        modifierClasses.push(...expanded);
      } else {
        modifierClasses.push(modifier);
      }
    }
    const placeholderModifiers = modifierClasses.filter((m) => m.modifier === "placeholder");
    const platformModifiers = modifierClasses.filter((m) => isPlatformModifier(m.modifier));
    const colorSchemeModifiers = modifierClasses.filter((m) => isColorSchemeModifier(m.modifier));
    const directionalModifiers = modifierClasses.filter((m) => isDirectionalModifier(m.modifier));
    const stateModifiers = modifierClasses.filter(
      (m) => isStateModifier(m.modifier) && m.modifier !== "placeholder"
    );
    if (placeholderModifiers.length > 0) {
      const jsxOpeningElement = path2.parent;
      const componentSupport = getComponentModifierSupport(jsxOpeningElement, t);
      if (componentSupport?.supportedModifiers.includes("placeholder")) {
        const placeholderClasses = placeholderModifiers.map((m) => m.baseClass).join(" ");
        const placeholderColor = parsePlaceholderClasses(placeholderClasses, state.customTheme.colors);
        if (placeholderColor) {
          addOrMergePlaceholderTextColorProp(jsxOpeningElement, placeholderColor, t);
        }
      } else {
        if (process.env.NODE_ENV !== "production") {
          console.warn(
            `[react-native-tailwind] placeholder: modifier can only be used on TextInput component at ${state.file.opts.filename ?? "unknown"}`
          );
        }
      }
    }
    const hasPlatformModifiers = platformModifiers.length > 0;
    const hasColorSchemeModifiers = colorSchemeModifiers.length > 0;
    const hasDirectionalModifiers = directionalModifiers.length > 0;
    const hasStateModifiers = stateModifiers.length > 0;
    const hasBaseClasses = baseClasses.length > 0;
    let componentScope = null;
    if (hasColorSchemeModifiers) {
      componentScope = findComponentScope(path2, t);
      if (componentScope) {
        state.functionComponentsNeedingColorScheme.add(componentScope);
      } else {
        if (process.env.NODE_ENV !== "production") {
          console.warn(
            `[react-native-tailwind] dark:/light: modifiers require a function component scope. Found in non-component context at ${state.file.opts.filename ?? "unknown"}. These modifiers are not supported in class components or nested callbacks.`
          );
        }
      }
    }
    if (hasStateModifiers && (hasPlatformModifiers || hasColorSchemeModifiers || hasDirectionalModifiers)) {
      const jsxOpeningElement = path2.parent;
      const componentSupport = getComponentModifierSupport(jsxOpeningElement, t);
      if (componentSupport) {
        const styleArrayElements = [];
        if (hasBaseClasses) {
          const baseClassName = baseClasses.join(" ");
          const baseStyleObject = parseClassName(baseClassName, state.customTheme);
          if (hasRuntimeDimensions(baseStyleObject)) {
            throw path2.buildCodeFrameError(
              `w-screen and h-screen cannot be combined with modifiers. Found: "${baseClassName}" with state, platform, color scheme, or directional modifiers. Use w-screen/h-screen without modifiers instead.`
            );
          }
          const baseStyleKey = generateStyleKey(baseClassName);
          state.styleRegistry.set(baseStyleKey, baseStyleObject);
          styleArrayElements.push(
            t.memberExpression(t.identifier(state.stylesIdentifier), t.identifier(baseStyleKey))
          );
        }
        if (hasPlatformModifiers) {
          const platformSelectExpression = processPlatformModifiers(
            platformModifiers,
            state,
            parseClassName,
            generateStyleKey,
            t
          );
          styleArrayElements.push(platformSelectExpression);
        }
        if (hasColorSchemeModifiers && componentScope) {
          const colorSchemeConditionals = processColorSchemeModifiers(
            colorSchemeModifiers,
            state,
            parseClassName,
            generateStyleKey,
            t
          );
          styleArrayElements.push(...colorSchemeConditionals);
        }
        if (hasDirectionalModifiers) {
          const directionalConditionals = processDirectionalModifiers(
            directionalModifiers,
            state,
            parseClassName,
            generateStyleKey,
            t
          );
          styleArrayElements.push(...directionalConditionals);
        }
        const modifiersByType = /* @__PURE__ */ new Map();
        for (const mod of stateModifiers) {
          const modType = mod.modifier;
          if (!modifiersByType.has(modType)) {
            modifiersByType.set(modType, []);
          }
          modifiersByType.get(modType)?.push(mod);
        }
        for (const [modifierType, modifiers] of modifiersByType) {
          if (!componentSupport.supportedModifiers.includes(modifierType)) {
            continue;
          }
          const modifierClassNames = modifiers.map((m) => m.baseClass).join(" ");
          const modifierStyleObject = parseClassName(modifierClassNames, state.customTheme);
          const modifierStyleKey = generateStyleKey(`${modifierType}_${modifierClassNames}`);
          state.styleRegistry.set(modifierStyleKey, modifierStyleObject);
          const stateProperty = getStatePropertyForModifier(modifierType);
          const conditionalExpression = t.logicalExpression(
            "&&",
            t.identifier(stateProperty),
            t.memberExpression(t.identifier(state.stylesIdentifier), t.identifier(modifierStyleKey))
          );
          styleArrayElements.push(conditionalExpression);
        }
        const usedModifiers = Array.from(new Set(stateModifiers.map((m) => m.modifier))).filter(
          (mod) => componentSupport.supportedModifiers.includes(mod)
        );
        const styleArrayExpression = t.arrayExpression(styleArrayElements);
        const styleFunctionExpression = createStyleFunction(styleArrayExpression, usedModifiers, t);
        const styleAttribute2 = findStyleAttribute(path2, targetStyleProp, t);
        if (styleAttribute2) {
          mergeStyleFunctionAttribute(path2, styleAttribute2, styleFunctionExpression, t);
        } else {
          replaceWithStyleFunctionAttribute(path2, styleFunctionExpression, targetStyleProp, t);
        }
        return true;
      } else {
      }
    }
    if ((hasPlatformModifiers || hasColorSchemeModifiers || hasDirectionalModifiers) && !hasStateModifiers) {
      const styleExpressions = [];
      if (hasBaseClasses) {
        const baseClassName = baseClasses.join(" ");
        const baseStyleObject = parseClassName(baseClassName, state.customTheme);
        if (hasRuntimeDimensions(baseStyleObject)) {
          throw path2.buildCodeFrameError(
            `w-screen and h-screen cannot be combined with modifiers. Found: "${baseClassName}" with platform, color scheme, or directional modifiers. Use w-screen/h-screen without modifiers instead.`
          );
        }
        const baseStyleKey = generateStyleKey(baseClassName);
        state.styleRegistry.set(baseStyleKey, baseStyleObject);
        styleExpressions.push(
          t.memberExpression(t.identifier(state.stylesIdentifier), t.identifier(baseStyleKey))
        );
      }
      if (hasPlatformModifiers) {
        const platformSelectExpression = processPlatformModifiers(
          platformModifiers,
          state,
          parseClassName,
          generateStyleKey,
          t
        );
        styleExpressions.push(platformSelectExpression);
      }
      if (hasColorSchemeModifiers && componentScope) {
        const colorSchemeConditionals = processColorSchemeModifiers(
          colorSchemeModifiers,
          state,
          parseClassName,
          generateStyleKey,
          t
        );
        styleExpressions.push(...colorSchemeConditionals);
      }
      if (hasDirectionalModifiers) {
        const directionalConditionals = processDirectionalModifiers(
          directionalModifiers,
          state,
          parseClassName,
          generateStyleKey,
          t
        );
        styleExpressions.push(...directionalConditionals);
      }
      const styleExpression = styleExpressions.length === 1 ? styleExpressions[0] : t.arrayExpression(styleExpressions);
      const styleAttribute2 = findStyleAttribute(path2, targetStyleProp, t);
      if (styleAttribute2) {
        const existingStyle = styleAttribute2.value;
        if (t.isJSXExpressionContainer(existingStyle) && !t.isJSXEmptyExpression(existingStyle.expression)) {
          const existing = existingStyle.expression;
          const mergedArray = t.isArrayExpression(existing) ? t.arrayExpression([styleExpression, ...existing.elements]) : t.arrayExpression([styleExpression, existing]);
          styleAttribute2.value = t.jsxExpressionContainer(mergedArray);
        } else {
          styleAttribute2.value = t.jsxExpressionContainer(styleExpression);
        }
        path2.remove();
      } else {
        path2.node.name = t.jsxIdentifier(targetStyleProp);
        path2.node.value = t.jsxExpressionContainer(styleExpression);
      }
      return true;
    }
    if (hasStateModifiers) {
      const jsxOpeningElement = path2.parent;
      const componentSupport = getComponentModifierSupport(jsxOpeningElement, t);
      if (componentSupport) {
        const usedModifiers = Array.from(new Set(stateModifiers.map((m) => m.modifier)));
        const unsupportedModifiers = usedModifiers.filter(
          (mod) => !componentSupport.supportedModifiers.includes(mod)
        );
        if (unsupportedModifiers.length > 0) {
          if (process.env.NODE_ENV !== "production") {
            console.warn(
              `[react-native-tailwind] Modifiers (${unsupportedModifiers.map((m) => `${m}:`).join(", ")}) are not supported on ${componentSupport.component} component at ${state.file.opts.filename ?? "unknown"}. Supported modifiers: ${componentSupport.supportedModifiers.join(", ")}`
            );
          }
          const supportedModifierClasses = stateModifiers.filter(
            (m) => componentSupport.supportedModifiers.includes(m.modifier)
          );
          if (supportedModifierClasses.length === 0) {
          } else {
            const filteredClassName = baseClasses.join(" ") + " " + supportedModifierClasses.map((m) => `${m.modifier}:${m.baseClass}`).join(" ");
            const styleExpression = processStaticClassNameWithModifiers(
              filteredClassName.trim(),
              state,
              parseClassName,
              generateStyleKey,
              splitModifierClasses,
              t
            );
            const modifierTypes = Array.from(new Set(supportedModifierClasses.map((m) => m.modifier)));
            const styleFunctionExpression = createStyleFunction(styleExpression, modifierTypes, t);
            const styleAttribute2 = findStyleAttribute(path2, targetStyleProp, t);
            if (styleAttribute2) {
              mergeStyleFunctionAttribute(path2, styleAttribute2, styleFunctionExpression, t);
            } else {
              replaceWithStyleFunctionAttribute(path2, styleFunctionExpression, targetStyleProp, t);
            }
            return true;
          }
        } else {
          const styleExpression = processStaticClassNameWithModifiers(
            trimmedClassName,
            state,
            parseClassName,
            generateStyleKey,
            splitModifierClasses,
            t
          );
          const modifierTypes = usedModifiers;
          const styleFunctionExpression = createStyleFunction(styleExpression, modifierTypes, t);
          const styleAttribute2 = findStyleAttribute(path2, targetStyleProp, t);
          if (styleAttribute2) {
            mergeStyleFunctionAttribute(path2, styleAttribute2, styleFunctionExpression, t);
          } else {
            replaceWithStyleFunctionAttribute(path2, styleFunctionExpression, targetStyleProp, t);
          }
          return true;
        }
      } else {
        if (process.env.NODE_ENV !== "production") {
          const usedModifiers = Array.from(new Set(stateModifiers.map((m) => m.modifier)));
          console.warn(
            `[react-native-tailwind] Modifiers (${usedModifiers.map((m) => `${m}:`).join(", ")}) can only be used on compatible components (Pressable, TextInput). Found on unsupported element at ${state.file.opts.filename ?? "unknown"}`
          );
        }
      }
    }
    const classNameForStyle = baseClasses.join(" ");
    if (!classNameForStyle) {
      path2.remove();
      return true;
    }
    const styleObject = parseClassName(classNameForStyle, state.customTheme);
    if (hasRuntimeDimensions(styleObject)) {
      const { static: staticStyles, runtime: runtimeStyles } = splitStaticAndRuntimeStyles(styleObject);
      const componentScope2 = findComponentScope(path2, t);
      if (componentScope2) {
        state.hasClassNames = true;
        state.functionComponentsNeedingWindowDimensions.add(componentScope2);
        state.needsWindowDimensionsImport = true;
        const styleExpressions = [];
        if (Object.keys(staticStyles).length > 0) {
          const styleKey2 = generateStyleKey(classNameForStyle);
          state.styleRegistry.set(styleKey2, staticStyles);
          styleExpressions.push(
            t.memberExpression(t.identifier(state.stylesIdentifier), t.identifier(styleKey2))
          );
        }
        const runtimeDimensionObject = createRuntimeDimensionObject(runtimeStyles, state, t);
        styleExpressions.push(runtimeDimensionObject);
        const styleExpression = styleExpressions.length === 1 ? styleExpressions[0] : t.arrayExpression(styleExpressions);
        const styleAttribute2 = findStyleAttribute(path2, targetStyleProp, t);
        if (styleAttribute2) {
          const existingStyle = styleAttribute2.value;
          if (t.isJSXExpressionContainer(existingStyle) && !t.isJSXEmptyExpression(existingStyle.expression)) {
            const existing = existingStyle.expression;
            if (t.isArrowFunctionExpression(existing) || t.isFunctionExpression(existing)) {
              const paramIdentifier = t.identifier("_state");
              const functionCall = t.callExpression(existing, [paramIdentifier]);
              const mergedArray = t.arrayExpression([styleExpression, functionCall]);
              const wrappedFunction = t.arrowFunctionExpression([paramIdentifier], mergedArray);
              styleAttribute2.value = t.jsxExpressionContainer(wrappedFunction);
            } else {
              const mergedArray = t.isArrayExpression(existing) ? t.arrayExpression([styleExpression, ...existing.elements]) : t.arrayExpression([styleExpression, existing]);
              styleAttribute2.value = t.jsxExpressionContainer(mergedArray);
            }
          } else {
            styleAttribute2.value = t.jsxExpressionContainer(styleExpression);
          }
          path2.remove();
        } else {
          path2.node.name = t.jsxIdentifier(targetStyleProp);
          path2.node.value = t.jsxExpressionContainer(styleExpression);
        }
        return true;
      } else {
        if (process.env.NODE_ENV !== "production") {
          console.warn(
            `[react-native-tailwind] w-screen/h-screen classes require a function component scope. Found in non-component context at ${state.file.opts.filename ?? "unknown"}. These classes are not supported in class components or nested callbacks.`
          );
        }
      }
    }
    const styleKey = generateStyleKey(classNameForStyle);
    state.styleRegistry.set(styleKey, styleObject);
    const styleAttribute = findStyleAttribute(path2, targetStyleProp, t);
    if (styleAttribute) {
      mergeStyleAttribute(path2, styleAttribute, styleKey, state.stylesIdentifier, t);
    } else {
      replaceWithStyleAttribute(path2, styleKey, targetStyleProp, state.stylesIdentifier, t);
    }
    return true;
  };
  if (t.isStringLiteral(value)) {
    if (processStaticClassName(value.value)) {
      return;
    }
  }
  if (t.isJSXExpressionContainer(value)) {
    const expression = value.expression;
    if (t.isJSXEmptyExpression(expression)) {
      return;
    }
    if (t.isStringLiteral(expression)) {
      if (processStaticClassName(expression.value)) {
        return;
      }
    }
    try {
      const componentScope = findComponentScope(path2, t);
      const result = processDynamicExpression(
        expression,
        state,
        parseClassName,
        generateStyleKey,
        splitModifierClasses,
        processPlatformModifiers,
        processColorSchemeModifiers,
        componentScope,
        isPlatformModifier,
        isColorSchemeModifier,
        isSchemeModifier,
        expandSchemeModifier,
        t
      );
      if (result) {
        state.hasClassNames = true;
        const styleAttribute = findStyleAttribute(path2, targetStyleProp, t);
        if (styleAttribute) {
          mergeDynamicStyleAttribute(path2, styleAttribute, result, t);
        } else {
          replaceDynamicWithStyleAttribute(path2, result, targetStyleProp, t);
        }
        return;
      }
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          `[react-native-tailwind] Failed to process dynamic ${attributeName} at ${state.file.opts.filename ?? "unknown"}: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    }
  }
  if (process.env.NODE_ENV !== "production") {
    const filename = state.file.opts.filename ?? "unknown";
    console.warn(
      `[react-native-tailwind] Dynamic ${attributeName} values are not fully supported at ${filename}. Use the ${targetStyleProp} prop for dynamic values.`
    );
  }
}

// src/babel/plugin/visitors/imports.ts
function importDeclarationVisitor(path2, state, t) {
  const node = path2.node;
  if (node.source.value === "react-native") {
    const specifiers = node.specifiers;
    const hasStyleSheet = specifiers.some((spec) => {
      if (t.isImportSpecifier(spec) && t.isIdentifier(spec.imported)) {
        return spec.imported.name === "StyleSheet";
      }
      return false;
    });
    const hasPlatform = specifiers.some((spec) => {
      if (t.isImportSpecifier(spec) && t.isIdentifier(spec.imported)) {
        return spec.imported.name === "Platform";
      }
      return false;
    });
    if (node.importKind !== "type") {
      for (const spec of specifiers) {
        if (t.isImportSpecifier(spec) && t.isIdentifier(spec.imported)) {
          if (spec.imported.name === "I18nManager") {
            state.hasI18nManagerImport = true;
            state.i18nManagerLocalIdentifier = spec.local.name;
            break;
          }
        }
      }
    }
    if (node.importKind !== "type") {
      for (const spec of specifiers) {
        if (t.isImportSpecifier(spec) && t.isIdentifier(spec.imported)) {
          if (spec.imported.name === "useWindowDimensions") {
            state.hasWindowDimensionsImport = true;
            state.windowDimensionsLocalIdentifier = spec.local.name;
            break;
          }
        }
      }
    }
    if (hasStyleSheet) {
      state.hasStyleSheetImport = true;
    }
    if (hasPlatform) {
      state.hasPlatformImport = true;
    }
    state.reactNativeImportPath = path2;
  }
  if (node.source.value === state.colorSchemeImportSource && node.importKind !== "type") {
    const specifiers = node.specifiers;
    for (const spec of specifiers) {
      if (t.isImportSpecifier(spec) && t.isIdentifier(spec.imported)) {
        if (spec.imported.name === state.colorSchemeHookName) {
          state.hasColorSchemeImport = true;
          state.colorSchemeLocalIdentifier = spec.local.name;
          break;
        }
      }
    }
  }
  if (node.source.value === "@mgcrea/react-native-tailwind") {
    const specifiers = node.specifiers;
    specifiers.forEach((spec) => {
      if (t.isImportSpecifier(spec) && t.isIdentifier(spec.imported)) {
        const importedName = spec.imported.name;
        if (importedName === "tw" || importedName === "twStyle") {
          const localName = spec.local.name;
          state.twImportNames.add(localName);
        }
      }
    });
  }
}

// src/babel/utils/styleInjection.ts
function addStyleSheetImport(path2, t) {
  const body = path2.node.body;
  let existingValueImport = null;
  for (const statement of body) {
    if (t.isImportDeclaration(statement) && statement.source.value === "react-native") {
      if (statement.importKind === "type") {
        continue;
      }
      const hasNamespaceImport = statement.specifiers.some((spec) => t.isImportNamespaceSpecifier(spec));
      if (hasNamespaceImport) {
        continue;
      }
      existingValueImport = statement;
      break;
    }
  }
  if (existingValueImport) {
    const hasStyleSheet = existingValueImport.specifiers.some(
      (spec) => t.isImportSpecifier(spec) && spec.imported.type === "Identifier" && spec.imported.name === "StyleSheet"
    );
    if (!hasStyleSheet) {
      existingValueImport.specifiers.push(
        t.importSpecifier(t.identifier("StyleSheet"), t.identifier("StyleSheet"))
      );
    }
  } else {
    const importDeclaration = t.importDeclaration(
      [t.importSpecifier(t.identifier("StyleSheet"), t.identifier("StyleSheet"))],
      t.stringLiteral("react-native")
    );
    path2.unshiftContainer("body", importDeclaration);
  }
}
function addPlatformImport(path2, t) {
  const body = path2.node.body;
  let existingValueImport = null;
  for (const statement of body) {
    if (t.isImportDeclaration(statement) && statement.source.value === "react-native") {
      if (statement.importKind === "type") {
        continue;
      }
      const hasNamespaceImport = statement.specifiers.some((spec) => t.isImportNamespaceSpecifier(spec));
      if (hasNamespaceImport) {
        continue;
      }
      existingValueImport = statement;
      break;
    }
  }
  if (existingValueImport) {
    const hasPlatform = existingValueImport.specifiers.some(
      (spec) => t.isImportSpecifier(spec) && spec.imported.type === "Identifier" && spec.imported.name === "Platform"
    );
    if (!hasPlatform) {
      existingValueImport.specifiers.push(
        t.importSpecifier(t.identifier("Platform"), t.identifier("Platform"))
      );
    }
  } else {
    const importDeclaration = t.importDeclaration(
      [t.importSpecifier(t.identifier("Platform"), t.identifier("Platform"))],
      t.stringLiteral("react-native")
    );
    path2.unshiftContainer("body", importDeclaration);
  }
}
function addColorSchemeImport(path2, importSource, hookName, t) {
  const body = path2.node.body;
  let existingValueImport = null;
  for (const statement of body) {
    if (t.isImportDeclaration(statement) && statement.source.value === importSource) {
      if (statement.importKind !== "type") {
        existingValueImport = statement;
        break;
      }
    }
  }
  if (existingValueImport) {
    const hasHook = existingValueImport.specifiers.some(
      (spec) => t.isImportSpecifier(spec) && spec.imported.type === "Identifier" && spec.imported.name === hookName
    );
    if (!hasHook) {
      existingValueImport.specifiers.push(t.importSpecifier(t.identifier(hookName), t.identifier(hookName)));
    }
  } else {
    const importDeclaration = t.importDeclaration(
      [t.importSpecifier(t.identifier(hookName), t.identifier(hookName))],
      t.stringLiteral(importSource)
    );
    path2.unshiftContainer("body", importDeclaration);
  }
}
function injectColorSchemeHook(functionPath, colorSchemeVariableName, hookName, localIdentifier, t) {
  let body = functionPath.node.body;
  if (!t.isBlockStatement(body)) {
    if (t.isArrowFunctionExpression(functionPath.node) && t.isExpression(body)) {
      const returnStatement = t.returnStatement(body);
      const blockStatement = t.blockStatement([returnStatement]);
      functionPath.node.body = blockStatement;
      body = blockStatement;
    } else {
      return false;
    }
  }
  const hasHook = body.body.some((statement) => {
    if (t.isVariableDeclaration(statement) && statement.declarations.length > 0 && t.isVariableDeclarator(statement.declarations[0])) {
      const declarator = statement.declarations[0];
      return t.isIdentifier(declarator.id) && declarator.id.name === colorSchemeVariableName;
    }
    return false;
  });
  if (hasHook) {
    return false;
  }
  const identifierToCall = localIdentifier ?? hookName;
  const hookCall = t.variableDeclaration("const", [
    t.variableDeclarator(
      t.identifier(colorSchemeVariableName),
      t.callExpression(t.identifier(identifierToCall), [])
    )
  ]);
  body.body.unshift(hookCall);
  return true;
}
function addI18nManagerImport(path2, t) {
  const body = path2.node.body;
  let existingValueImport = null;
  for (const statement of body) {
    if (t.isImportDeclaration(statement) && statement.source.value === "react-native") {
      if (statement.importKind === "type") {
        continue;
      }
      const hasNamespaceImport = statement.specifiers.some((spec) => t.isImportNamespaceSpecifier(spec));
      if (hasNamespaceImport) {
        continue;
      }
      existingValueImport = statement;
      break;
    }
  }
  if (existingValueImport) {
    const hasI18nManager = existingValueImport.specifiers.some(
      (spec) => t.isImportSpecifier(spec) && spec.imported.type === "Identifier" && spec.imported.name === "I18nManager"
    );
    if (!hasI18nManager) {
      existingValueImport.specifiers.push(
        t.importSpecifier(t.identifier("I18nManager"), t.identifier("I18nManager"))
      );
    }
  } else {
    const importDeclaration = t.importDeclaration(
      [t.importSpecifier(t.identifier("I18nManager"), t.identifier("I18nManager"))],
      t.stringLiteral("react-native")
    );
    path2.unshiftContainer("body", importDeclaration);
  }
}
function injectI18nManagerVariable(path2, variableName, localIdentifier, t) {
  const body = path2.node.body;
  for (const statement of body) {
    if (t.isVariableDeclaration(statement) && statement.declarations.length > 0 && t.isVariableDeclarator(statement.declarations[0])) {
      const declarator = statement.declarations[0];
      if (t.isIdentifier(declarator.id) && declarator.id.name === variableName) {
        return;
      }
    }
  }
  const identifierToUse = localIdentifier ?? "I18nManager";
  const i18nVariable = t.variableDeclaration("const", [
    t.variableDeclarator(
      t.identifier(variableName),
      t.memberExpression(t.identifier(identifierToUse), t.identifier("isRTL"))
    )
  ]);
  let insertIndex = 0;
  for (let i = 0; i < body.length; i++) {
    const statement = body[i];
    if (t.isExpressionStatement(statement) && t.isStringLiteral(statement.expression)) {
      insertIndex = i + 1;
      continue;
    }
    if (t.isImportDeclaration(statement)) {
      insertIndex = i + 1;
      continue;
    }
    break;
  }
  body.splice(insertIndex, 0, i18nVariable);
}
function addWindowDimensionsImport(path2, t) {
  const body = path2.node.body;
  let existingValueImport = null;
  for (const statement of body) {
    if (t.isImportDeclaration(statement) && statement.source.value === "react-native") {
      if (statement.importKind !== "type") {
        existingValueImport = statement;
        break;
      }
    }
  }
  if (existingValueImport) {
    const hasHook = existingValueImport.specifiers.some(
      (spec) => t.isImportSpecifier(spec) && spec.imported.type === "Identifier" && spec.imported.name === "useWindowDimensions"
    );
    if (!hasHook) {
      existingValueImport.specifiers.push(
        t.importSpecifier(t.identifier("useWindowDimensions"), t.identifier("useWindowDimensions"))
      );
    }
  } else {
    const importDeclaration = t.importDeclaration(
      [t.importSpecifier(t.identifier("useWindowDimensions"), t.identifier("useWindowDimensions"))],
      t.stringLiteral("react-native")
    );
    path2.unshiftContainer("body", importDeclaration);
  }
}
function injectWindowDimensionsHook(functionPath, dimensionsVariableName, hookName, localIdentifier, t) {
  let body = functionPath.node.body;
  if (!t.isBlockStatement(body)) {
    if (t.isArrowFunctionExpression(functionPath.node) && t.isExpression(body)) {
      const returnStatement = t.returnStatement(body);
      const blockStatement = t.blockStatement([returnStatement]);
      functionPath.node.body = blockStatement;
      body = blockStatement;
    } else {
      return false;
    }
  }
  const hasHook = body.body.some((statement) => {
    if (t.isVariableDeclaration(statement) && statement.declarations.length > 0 && t.isVariableDeclarator(statement.declarations[0])) {
      const declarator = statement.declarations[0];
      return t.isIdentifier(declarator.id) && declarator.id.name === dimensionsVariableName;
    }
    return false;
  });
  if (hasHook) {
    return false;
  }
  const identifierToCall = localIdentifier ?? hookName;
  const hookCall = t.variableDeclaration("const", [
    t.variableDeclarator(
      t.identifier(dimensionsVariableName),
      t.callExpression(t.identifier(identifierToCall), [])
    )
  ]);
  body.body.unshift(hookCall);
  return true;
}
function injectStylesAtTop(path2, styleRegistry, stylesIdentifier, t) {
  const styleProperties = [];
  for (const [key, styleObject] of styleRegistry) {
    const properties = Object.entries(styleObject).map(([styleProp, styleValue]) => {
      let valueNode;
      if (typeof styleValue === "number") {
        valueNode = t.numericLiteral(styleValue);
      } else if (typeof styleValue === "string") {
        valueNode = t.stringLiteral(styleValue);
      } else {
        valueNode = t.valueToNode(styleValue);
      }
      return t.objectProperty(t.identifier(styleProp), valueNode);
    });
    styleProperties.push(t.objectProperty(t.identifier(key), t.objectExpression(properties)));
  }
  const styleSheet = t.variableDeclaration("const", [
    t.variableDeclarator(
      t.identifier(stylesIdentifier),
      t.callExpression(t.memberExpression(t.identifier("StyleSheet"), t.identifier("create")), [
        t.objectExpression(styleProperties)
      ])
    )
  ]);
  const body = path2.node.body;
  let insertIndex = 0;
  for (let i = 0; i < body.length; i++) {
    const statement = body[i];
    if (t.isExpressionStatement(statement) && t.isStringLiteral(statement.expression)) {
      insertIndex = i + 1;
      continue;
    }
    if (t.isImportDeclaration(statement)) {
      insertIndex = i + 1;
      continue;
    }
    break;
  }
  body.splice(insertIndex, 0, styleSheet);
}

// src/babel/utils/twProcessing.ts
function processTwCall(className, path2, state, parseClassName2, generateStyleKey2, splitModifierClasses2, findComponentScope2, t) {
  const { baseClasses, modifierClasses: rawModifierClasses } = splitModifierClasses2(className);
  const modifierClasses = [];
  for (const modifier of rawModifierClasses) {
    if (isSchemeModifier(modifier.modifier)) {
      const expanded = expandSchemeModifier(
        modifier,
        state.customTheme.colors ?? {},
        state.schemeModifierConfig.darkSuffix ?? "-dark",
        state.schemeModifierConfig.lightSuffix ?? "-light"
      );
      modifierClasses.push(...expanded);
    } else {
      modifierClasses.push(modifier);
    }
  }
  const objectProperties = [];
  if (baseClasses.length > 0) {
    const baseClassName = baseClasses.join(" ");
    const baseStyleObject = parseClassName2(baseClassName, state.customTheme);
    if (hasRuntimeDimensions(baseStyleObject)) {
      throw path2.buildCodeFrameError(
        `w-screen and h-screen are not supported in tw\`\` or twStyle() calls. Found: "${baseClassName}". Use them in className attributes instead.`
      );
    }
    const baseStyleKey = generateStyleKey2(baseClassName);
    state.styleRegistry.set(baseStyleKey, baseStyleObject);
    objectProperties.push(
      t.objectProperty(
        t.identifier("style"),
        t.memberExpression(t.identifier(state.stylesIdentifier), t.identifier(baseStyleKey))
      )
    );
  } else {
    objectProperties.push(t.objectProperty(t.identifier("style"), t.objectExpression([])));
  }
  const colorSchemeModifiers = modifierClasses.filter((m) => isColorSchemeModifier(m.modifier));
  const platformModifiers = modifierClasses.filter((m) => isPlatformModifier(m.modifier));
  const directionalModifiers = modifierClasses.filter((m) => isDirectionalModifier(m.modifier));
  const otherModifiers = modifierClasses.filter(
    (m) => !isColorSchemeModifier(m.modifier) && !isPlatformModifier(m.modifier) && !isDirectionalModifier(m.modifier)
  );
  const hasColorSchemeModifiers = colorSchemeModifiers.length > 0;
  let componentScope = null;
  if (hasColorSchemeModifiers) {
    componentScope = findComponentScope2(path2, t);
    if (!componentScope) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          `[react-native-tailwind] Color scheme modifiers (dark:, light:) in tw/twStyle calls must be used inside a React component. Modifiers will be ignored.`
        );
      }
    } else {
      state.functionComponentsNeedingColorScheme.add(componentScope);
    }
  }
  if (hasColorSchemeModifiers && componentScope) {
    const colorSchemeConditionals = processColorSchemeModifiers(
      colorSchemeModifiers,
      state,
      parseClassName2,
      generateStyleKey2,
      t
    );
    const styleArrayElements = [];
    if (baseClasses.length > 0) {
      const baseClassName = baseClasses.join(" ");
      const baseStyleObject = parseClassName2(baseClassName, state.customTheme);
      const baseStyleKey = generateStyleKey2(baseClassName);
      state.styleRegistry.set(baseStyleKey, baseStyleObject);
      styleArrayElements.push(
        t.memberExpression(t.identifier(state.stylesIdentifier), t.identifier(baseStyleKey))
      );
    }
    styleArrayElements.push(...colorSchemeConditionals);
    objectProperties[0] = t.objectProperty(t.identifier("style"), t.arrayExpression(styleArrayElements));
    const darkModifiers = colorSchemeModifiers.filter((m) => m.modifier === "dark");
    const lightModifiers = colorSchemeModifiers.filter((m) => m.modifier === "light");
    if (darkModifiers.length > 0) {
      const darkClassNames = darkModifiers.map((m) => m.baseClass).join(" ");
      const darkStyleObject = parseClassName2(darkClassNames, state.customTheme);
      const darkStyleKey = generateStyleKey2(`dark_${darkClassNames}`);
      state.styleRegistry.set(darkStyleKey, darkStyleObject);
      objectProperties.push(
        t.objectProperty(
          t.identifier("darkStyle"),
          t.memberExpression(t.identifier(state.stylesIdentifier), t.identifier(darkStyleKey))
        )
      );
    }
    if (lightModifiers.length > 0) {
      const lightClassNames = lightModifiers.map((m) => m.baseClass).join(" ");
      const lightStyleObject = parseClassName2(lightClassNames, state.customTheme);
      const lightStyleKey = generateStyleKey2(`light_${lightClassNames}`);
      state.styleRegistry.set(lightStyleKey, lightStyleObject);
      objectProperties.push(
        t.objectProperty(
          t.identifier("lightStyle"),
          t.memberExpression(t.identifier(state.stylesIdentifier), t.identifier(lightStyleKey))
        )
      );
    }
  }
  const hasPlatformModifiers = platformModifiers.length > 0;
  if (hasPlatformModifiers) {
    state.needsPlatformImport = true;
    const platformSelectExpression = processPlatformModifiers(
      platformModifiers,
      state,
      parseClassName2,
      generateStyleKey2,
      t
    );
    if (hasColorSchemeModifiers && componentScope) {
      const styleProperty = objectProperties.find(
        (prop) => t.isIdentifier(prop.key) && prop.key.name === "style"
      );
      if (styleProperty && t.isArrayExpression(styleProperty.value)) {
        styleProperty.value.elements.push(platformSelectExpression);
      }
    } else {
      const styleArrayElements = [];
      if (baseClasses.length > 0) {
        const baseClassName = baseClasses.join(" ");
        const baseStyleObject = parseClassName2(baseClassName, state.customTheme);
        const baseStyleKey = generateStyleKey2(baseClassName);
        state.styleRegistry.set(baseStyleKey, baseStyleObject);
        styleArrayElements.push(
          t.memberExpression(t.identifier(state.stylesIdentifier), t.identifier(baseStyleKey))
        );
      }
      styleArrayElements.push(platformSelectExpression);
      objectProperties[0] = t.objectProperty(t.identifier("style"), t.arrayExpression(styleArrayElements));
    }
    const iosModifiers = platformModifiers.filter((m) => m.modifier === "ios");
    const androidModifiers = platformModifiers.filter((m) => m.modifier === "android");
    const webModifiers = platformModifiers.filter((m) => m.modifier === "web");
    if (iosModifiers.length > 0) {
      const iosClassNames = iosModifiers.map((m) => m.baseClass).join(" ");
      const iosStyleObject = parseClassName2(iosClassNames, state.customTheme);
      const iosStyleKey = generateStyleKey2(`ios_${iosClassNames}`);
      state.styleRegistry.set(iosStyleKey, iosStyleObject);
      objectProperties.push(
        t.objectProperty(
          t.identifier("iosStyle"),
          t.memberExpression(t.identifier(state.stylesIdentifier), t.identifier(iosStyleKey))
        )
      );
    }
    if (androidModifiers.length > 0) {
      const androidClassNames = androidModifiers.map((m) => m.baseClass).join(" ");
      const androidStyleObject = parseClassName2(androidClassNames, state.customTheme);
      const androidStyleKey = generateStyleKey2(`android_${androidClassNames}`);
      state.styleRegistry.set(androidStyleKey, androidStyleObject);
      objectProperties.push(
        t.objectProperty(
          t.identifier("androidStyle"),
          t.memberExpression(t.identifier(state.stylesIdentifier), t.identifier(androidStyleKey))
        )
      );
    }
    if (webModifiers.length > 0) {
      const webClassNames = webModifiers.map((m) => m.baseClass).join(" ");
      const webStyleObject = parseClassName2(webClassNames, state.customTheme);
      const webStyleKey = generateStyleKey2(`web_${webClassNames}`);
      state.styleRegistry.set(webStyleKey, webStyleObject);
      objectProperties.push(
        t.objectProperty(
          t.identifier("webStyle"),
          t.memberExpression(t.identifier(state.stylesIdentifier), t.identifier(webStyleKey))
        )
      );
    }
  }
  const hasDirectionalModifiers = directionalModifiers.length > 0;
  if (hasDirectionalModifiers) {
    state.needsI18nManagerImport = true;
    const directionalConditionals = processDirectionalModifiers(
      directionalModifiers,
      state,
      parseClassName2,
      generateStyleKey2,
      t
    );
    const styleProperty = objectProperties.find(
      (prop) => t.isIdentifier(prop.key) && prop.key.name === "style"
    );
    if (styleProperty && t.isArrayExpression(styleProperty.value)) {
      styleProperty.value.elements.push(...directionalConditionals);
    } else {
      const styleArrayElements = [];
      if (baseClasses.length > 0) {
        const baseClassName = baseClasses.join(" ");
        const baseStyleObject = parseClassName2(baseClassName, state.customTheme);
        const baseStyleKey = generateStyleKey2(baseClassName);
        state.styleRegistry.set(baseStyleKey, baseStyleObject);
        styleArrayElements.push(
          t.memberExpression(t.identifier(state.stylesIdentifier), t.identifier(baseStyleKey))
        );
      }
      styleArrayElements.push(...directionalConditionals);
      objectProperties[0] = t.objectProperty(t.identifier("style"), t.arrayExpression(styleArrayElements));
    }
    const rtlModifiers = directionalModifiers.filter((m) => m.modifier === "rtl");
    const ltrModifiers = directionalModifiers.filter((m) => m.modifier === "ltr");
    if (rtlModifiers.length > 0) {
      const rtlClassNames = rtlModifiers.map((m) => m.baseClass).join(" ");
      const rtlStyleObject = parseClassName2(rtlClassNames, state.customTheme);
      const rtlStyleKey = generateStyleKey2(`rtl_${rtlClassNames}`);
      state.styleRegistry.set(rtlStyleKey, rtlStyleObject);
      objectProperties.push(
        t.objectProperty(
          t.identifier("rtlStyle"),
          t.memberExpression(t.identifier(state.stylesIdentifier), t.identifier(rtlStyleKey))
        )
      );
    }
    if (ltrModifiers.length > 0) {
      const ltrClassNames = ltrModifiers.map((m) => m.baseClass).join(" ");
      const ltrStyleObject = parseClassName2(ltrClassNames, state.customTheme);
      const ltrStyleKey = generateStyleKey2(`ltr_${ltrClassNames}`);
      state.styleRegistry.set(ltrStyleKey, ltrStyleObject);
      objectProperties.push(
        t.objectProperty(
          t.identifier("ltrStyle"),
          t.memberExpression(t.identifier(state.stylesIdentifier), t.identifier(ltrStyleKey))
        )
      );
    }
  }
  const modifiersByType = /* @__PURE__ */ new Map();
  for (const mod of otherModifiers) {
    if (!modifiersByType.has(mod.modifier)) {
      modifiersByType.set(mod.modifier, []);
    }
    const modGroup = modifiersByType.get(mod.modifier);
    if (modGroup) {
      modGroup.push(mod);
    }
  }
  for (const [modifierType, modifiers] of modifiersByType) {
    const modifierClassNames = modifiers.map((m) => m.baseClass).join(" ");
    const modifierStyleObject = parseClassName2(modifierClassNames, state.customTheme);
    const modifierStyleKey = generateStyleKey2(`${modifierType}_${modifierClassNames}`);
    state.styleRegistry.set(modifierStyleKey, modifierStyleObject);
    const propertyName = `${modifierType}Style`;
    objectProperties.push(
      t.objectProperty(
        t.identifier(propertyName),
        t.memberExpression(t.identifier(state.stylesIdentifier), t.identifier(modifierStyleKey))
      )
    );
  }
  const twStyleObject = t.objectExpression(objectProperties);
  path2.replaceWith(twStyleObject);
}
function removeTwImports(path2, t) {
  path2.traverse({
    ImportDeclaration(importPath) {
      const node = importPath.node;
      if (node.source.value !== "@mgcrea/react-native-tailwind") {
        return;
      }
      const remainingSpecifiers = node.specifiers.filter((spec) => {
        if (t.isImportSpecifier(spec) && t.isIdentifier(spec.imported)) {
          const importedName = spec.imported.name;
          return importedName !== "tw" && importedName !== "twStyle";
        }
        return true;
      });
      if (remainingSpecifiers.length === 0) {
        importPath.remove();
      } else if (remainingSpecifiers.length < node.specifiers.length) {
        node.specifiers = remainingSpecifiers;
      }
    }
  });
}

// src/babel/plugin/visitors/program.ts
function programEnter(_path, _state) {
}
function programExit(path2, state, t) {
  if (state.hasTwImport) {
    removeTwImports(path2, t);
  }
  if (!state.hasClassNames && !state.needsWindowDimensionsImport && !state.needsColorSchemeImport && !state.needsI18nManagerImport) {
    return;
  }
  if (!state.hasStyleSheetImport && state.styleRegistry.size > 0) {
    addStyleSheetImport(path2, t);
  }
  if (state.needsPlatformImport && !state.hasPlatformImport) {
    addPlatformImport(path2, t);
  }
  if (state.needsI18nManagerImport && !state.hasI18nManagerImport) {
    addI18nManagerImport(path2, t);
  }
  if (state.needsI18nManagerImport) {
    injectI18nManagerVariable(path2, state.i18nManagerVariableName, state.i18nManagerLocalIdentifier, t);
  }
  if (state.needsColorSchemeImport && !state.hasColorSchemeImport) {
    addColorSchemeImport(path2, state.colorSchemeImportSource, state.colorSchemeHookName, t);
  }
  if (state.needsColorSchemeImport) {
    for (const functionPath of state.functionComponentsNeedingColorScheme) {
      injectColorSchemeHook(
        functionPath,
        state.colorSchemeVariableName,
        state.colorSchemeHookName,
        state.colorSchemeLocalIdentifier,
        t
      );
    }
  }
  if (state.needsWindowDimensionsImport && !state.hasWindowDimensionsImport) {
    addWindowDimensionsImport(path2, t);
  }
  if (state.needsWindowDimensionsImport) {
    for (const functionPath of state.functionComponentsNeedingWindowDimensions) {
      injectWindowDimensionsHook(
        functionPath,
        state.windowDimensionsVariableName,
        "useWindowDimensions",
        state.windowDimensionsLocalIdentifier,
        t
      );
    }
  }
  if (state.styleRegistry.size > 0) {
    injectStylesAtTop(path2, state.styleRegistry, state.stylesIdentifier, t);
  }
}

// src/babel/plugin/visitors/tw.ts
function taggedTemplateVisitor(path2, state, t) {
  const node = path2.node;
  if (!t.isIdentifier(node.tag)) {
    return;
  }
  const tagName = node.tag.name;
  if (!state.twImportNames.has(tagName)) {
    return;
  }
  const quasi = node.quasi;
  if (!t.isTemplateLiteral(quasi)) {
    return;
  }
  if (quasi.expressions.length > 0) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[react-native-tailwind] Dynamic tw\`...\` with interpolations is not supported at ${state.file.opts.filename ?? "unknown"}. Use style prop for dynamic values.`
      );
    }
    return;
  }
  const className = quasi.quasis[0]?.value.cooked?.trim() ?? "";
  if (!className) {
    path2.replaceWith(t.objectExpression([t.objectProperty(t.identifier("style"), t.objectExpression([]))]));
    state.hasTwImport = true;
    return;
  }
  state.hasClassNames = true;
  processTwCall(
    className,
    path2,
    state,
    parseClassName,
    generateStyleKey,
    splitModifierClasses,
    findComponentScope,
    t
  );
  state.hasTwImport = true;
}
function callExpressionVisitor(path2, state, t) {
  const node = path2.node;
  if (!t.isIdentifier(node.callee)) {
    return;
  }
  const calleeName = node.callee.name;
  if (!state.twImportNames.has(calleeName)) {
    return;
  }
  if (node.arguments.length !== 1) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[react-native-tailwind] twStyle() expects exactly one argument at ${state.file.opts.filename ?? "unknown"}`
      );
    }
    return;
  }
  const arg = node.arguments[0];
  if (!t.isStringLiteral(arg)) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[react-native-tailwind] twStyle() only supports static string literals at ${state.file.opts.filename ?? "unknown"}. Use style prop for dynamic values.`
      );
    }
    return;
  }
  const className = arg.value.trim();
  if (!className) {
    path2.replaceWith(t.identifier("undefined"));
    state.hasTwImport = true;
    return;
  }
  state.hasClassNames = true;
  processTwCall(
    className,
    path2,
    state,
    parseClassName,
    generateStyleKey,
    splitModifierClasses,
    findComponentScope,
    t
  );
  state.hasTwImport = true;
}

// src/babel/plugin.ts
function reactNativeTailwindBabelPlugin({ types: t }, options) {
  const colorSchemeImportSource = options?.colorScheme?.importFrom ?? "react-native";
  const colorSchemeHookName = options?.colorScheme?.importName ?? "useColorScheme";
  const schemeModifierConfig = {
    darkSuffix: options?.schemeModifier?.darkSuffix ?? "-dark",
    lightSuffix: options?.schemeModifier?.lightSuffix ?? "-light"
  };
  return {
    name: "react-native-tailwind",
    visitor: {
      Program: {
        enter(path2, state) {
          const initialState = createInitialState(
            options,
            state.file.opts.filename ?? "",
            colorSchemeImportSource,
            colorSchemeHookName,
            schemeModifierConfig
          );
          Object.assign(state, initialState);
          programEnter(path2, state);
        },
        exit(path2, state) {
          programExit(path2, state, t);
        }
      },
      ImportDeclaration(path2, state) {
        importDeclarationVisitor(path2, state, t);
      },
      TaggedTemplateExpression(path2, state) {
        taggedTemplateVisitor(path2, state, t);
      },
      CallExpression(path2, state) {
        callExpressionVisitor(path2, state, t);
      },
      JSXAttribute(path2, state) {
        jsxAttributeVisitor(path2, state, t);
      }
    }
  };
}
