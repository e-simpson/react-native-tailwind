---
title: Babel Configuration
description: Complete reference for all Babel plugin options
---

Complete reference for all available Babel plugin configuration options.

## Basic Configuration

```javascript
// babel.config.js
module.exports = {
  plugins: [
    "@mgcrea/react-native-tailwind/babel", // Default options
  ],
};
```

## All Options

```javascript
// babel.config.js
module.exports = {
  plugins: [
    [
      "@mgcrea/react-native-tailwind/babel",
      {
        // Custom attributes to transform
        attributes: ["*ClassName"],

        // Custom StyleSheet identifier
        stylesIdentifier: "_twStyles",

        // Custom color scheme hook
        colorScheme: {
          importFrom: "react-native",
          importName: "useColorScheme",
        },

        // Scheme modifier configuration
        schemeModifier: {
          darkSuffix: "-dark",
          lightSuffix: "-light",
        },

        // Custom CSS classes via @apply
        apply: {
          files: ["./src/styles/tw-components.css"],
        },
      },
    ],
  ],
};
```

## Option Reference

### `attributes`

Configure which props to transform.

**Type:** `string[]`

**Default:** `["className", "contentContainerClassName", "columnWrapperClassName", "ListHeaderComponentClassName", "ListFooterComponentClassName"]`

**Examples:**

```javascript
// Exact matches
{
  attributes: ["className", "buttonClassName", "containerClassName"]
}

// Glob patterns
{
  attributes: ["*ClassName"]  // Matches any attribute ending in 'ClassName'
}

// Mixed
{
  attributes: [
    "className",
    "*ClassName",
    "custom*"
  ]
}
```

See [Custom Attributes](/react-native-tailwind/advanced/custom-attributes/) for more details.

### `stylesIdentifier`

Customize the StyleSheet constant name.

**Type:** `string`

**Default:** `"_twStyles"`

**Examples:**

```javascript
{
  stylesIdentifier: "styles"      // Most common
}

{
  stylesIdentifier: "tw"          // Short form
}

{
  stylesIdentifier: "tailwind"    // Descriptive
}
```

See [Custom Styles Identifier](/react-native-tailwind/advanced/custom-styles-identifier/) for more details.

### `colorScheme`

Configure custom color scheme hook.

**Type:** `{ importFrom: string; importName: string }`

**Default:** `{ importFrom: "react-native", importName: "useColorScheme" }`

**Examples:**

```javascript
// Custom hook
{
  colorScheme: {
    importFrom: "@/hooks/useColorScheme",
    importName: "useColorScheme"
  }
}

// React Navigation
{
  colorScheme: {
    importFrom: "@react-navigation/native",
    importName: "useTheme"  // Requires wrapper
  }
}

// Expo Router
{
  colorScheme: {
    importFrom: "expo-router",
    importName: "useColorScheme"
  }
}
```

See [Custom Color Scheme Hook](/react-native-tailwind/advanced/custom-color-scheme-hook/) for more details.

### `schemeModifier`

Configure `scheme:` modifier color suffixes.

**Type:** `{ darkSuffix: string; lightSuffix: string }`

**Default:** `{ darkSuffix: "-dark", lightSuffix: "-light" }`

**Examples:**

```javascript
// Default (matches "color-dark" and "color-light")
{
  schemeModifier: {
    darkSuffix: "-dark",
    lightSuffix: "-light"
  }
}

// PascalCase (matches "colorDark" and "colorLight")
{
  schemeModifier: {
    darkSuffix: "Dark",
    lightSuffix: "Light"
  }
}

// Custom (matches "color_d" and "color_l")
{
  schemeModifier: {
    darkSuffix: "_d",
    lightSuffix: "_l"
  }
}
```

See [Color Scheme - Scheme Modifier](/react-native-tailwind/guides/color-scheme/#scheme-modifier-convenience) for more details.

### `apply`

Load custom reusable classes from CSS files that contain `@apply` rules.

**Type:** `{ files: string[] }`

**Default:** `undefined`

**Supported syntax:**

- Simple class selectors only: `.button { @apply ...; }`
- Comma selectors are supported: `.card, .panel { @apply ...; }`
- Nested aliases are supported: `.primary { @apply button-base bg-blue-500; }`

**Examples:**

```javascript
{
  apply: {
    files: ["./src/styles/tw-components.css"]
  }
}

{
  apply: {
    files: [
      "./src/styles/foundation.css",
      "./src/styles/components.css"
    ]
  }
}
```

**Notes:**

- Paths can be absolute or relative to the project root.
- Circular alias references throw a build error.
- Only `@apply` declarations are processed; other CSS declarations are ignored.

## Complete Example

```javascript
// babel.config.js
module.exports = {
  presets: ["module:@react-native/babel-preset"],
  plugins: [
    [
      "@mgcrea/react-native-tailwind/babel",
      {
        // Transform all *ClassName props
        attributes: ["*ClassName"],

        // Use 'styles' as identifier
        stylesIdentifier: "styles",

        // Use custom theme hook
        colorScheme: {
          importFrom: "@/context/ThemeContext",
          importName: "useColorScheme",
        },

        // PascalCase suffixes for scheme modifier
        schemeModifier: {
          darkSuffix: "Dark",
          lightSuffix: "Light",
        },

        // Reusable custom classes from CSS @apply
        apply: {
          files: ["./src/styles/tw-components.css"],
        },
      },
    ],
  ],
};
```

## Environment-Specific Configuration

```javascript
// babel.config.js
module.exports = function (api) {
  const isTest = api.env("test");

  return {
    presets: ["module:@react-native/babel-preset"],
    plugins: [
      [
        "@mgcrea/react-native-tailwind/babel",
        {
          // Mock color scheme in tests
          colorScheme: isTest
            ? {
                importFrom: "@/test/mocks/useColorScheme",
                importName: "useColorScheme",
              }
            : undefined,
        },
      ],
    ],
  };
};
```

## Clearing Cache

After changing Babel configuration, clear Metro's cache:

```bash
npx react-native start --reset-cache
```

## Related

- [Custom Attributes](/react-native-tailwind/advanced/custom-attributes/)
- [Custom Styles Identifier](/react-native-tailwind/advanced/custom-styles-identifier/)
- [Custom Color Scheme Hook](/react-native-tailwind/advanced/custom-color-scheme-hook/)
- [Reusable Components](/react-native-tailwind/guides/reusable-components/)
- [Custom Colors](/react-native-tailwind/advanced/custom-colors/)
- [Troubleshooting](/react-native-tailwind/advanced/troubleshooting/)
