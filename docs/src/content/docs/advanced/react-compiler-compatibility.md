---
title: React Compiler Compatibility
description: Enable instant theme updates with React Compiler
---

# React Compiler Compatibility

React Native Tailwind supports React Compiler (React 19+) compatibility mode for color scheme modifiers (`dark:`, `light:`, `scheme:`). This ensures instant theme updates when using React Compiler's automatic memoization.

## The Problem

When using React Compiler with color scheme modifiers, the compiler may not properly track the `useColorScheme()` hook dependency in inline conditionals:

```tsx
// Without React Compiler compatibility
<View
  style={[
    _twStyles._bg_white,
    _twColorScheme === "dark" && _twStyles._dark_bg_gray_900,
  ]}
/>
```

React Compiler might not recognize that the style array depends on `_twColorScheme`, causing theme changes to not trigger re-renders.

## The Solution

Enable `reactCompilerCompatible` mode to generate a `useMemo` hook that properly tracks the color scheme dependency:

```tsx
// With React Compiler compatibility
const _twColorSchemeStyles = useMemo(
  () => ({
    _dark_bg_gray_900:
      _twColorScheme === "dark" ? _twStyles._dark_bg_gray_900 : undefined,
  }),
  [_twColorScheme]
);

<View style={[_twStyles._bg_white, _twColorSchemeStyles._dark_bg_gray_900]} />;
```

## Configuration

### Enable React Compiler Mode

```javascript
// babel.config.js
module.exports = {
  plugins: [
    [
      "@mgcrea/react-native-tailwind/babel",
      {
        reactCompilerCompatible: true,
      },
    ],
  ],
};
```

### Auto-Detection Mode

Use `'auto'` to automatically detect if React Compiler is present:

```javascript
// babel.config.js
module.exports = {
  plugins: [
    [
      "@mgcrea/react-native-tailwind/babel",
      {
        reactCompilerCompatible: "auto",
      },
    ],
  ],
};
```

Auto-detection checks for `babel-plugin-react-compiler` in your project.

## How It Works

### Normal Mode (Default)

```tsx
// Input
<View className="bg-white dark:bg-gray-900" />

// Output
const _twStyles = StyleSheet.create({
  _bg_white: { backgroundColor: "#ffffff" },
  _dark_bg_gray_900: { backgroundColor: "#111827" },
});

function Component() {
  const _twColorScheme = useColorScheme();
  return (
    <View
      style={[
        _twStyles._bg_white,
        _twColorScheme === "dark" && _twStyles._dark_bg_gray_900,
      ]}
    />
  );
}
```

### React Compiler Mode

```tsx
// Input
<View className="bg-white dark:bg-gray-900" />

// Output
import { useMemo } from "react";

const _twStyles = StyleSheet.create({
  _bg_white: { backgroundColor: "#ffffff" },
  _dark_bg_gray_900: { backgroundColor: "#111827" },
});

function Component() {
  const _twColorScheme = useColorScheme();
  const _twColorSchemeStyles = useMemo(
    () => ({
      _dark_bg_gray_900:
        _twColorScheme === "dark" ? _twStyles._dark_bg_gray_900 : undefined,
    }),
    [_twColorScheme]
  );
  return (
    <View
      style={[_twStyles._bg_white, _twColorSchemeStyles._dark_bg_gray_900]}
    />
  );
}
```

The `useMemo` hook is injected inside the component with `_twColorScheme` as a dependency. This ensures React Compiler properly tracks the dependency and re-renders when the color scheme changes.

## When to Use

### Use React Compiler Mode When:

- You have React Compiler enabled in your project
- Theme changes are not updating instantly
- You see stale theme values after switching dark/light mode

### Don't Use When:

- You're not using React Compiler
- Theme updates work correctly without it
- You want to minimize generated code size

## Compatibility

- Works with all color scheme modifiers: `dark:`, `light:`, `scheme:`
- Compatible with platform modifiers: `ios:`, `android:`, `web:`
- Compatible with state modifiers: `active:`, `focus:`, `hover:`
- Compatible with directional modifiers: `rtl:`, `ltr:`
- Works with custom color scheme hooks

## Example with Custom Hook

```javascript
// babel.config.js
module.exports = {
  plugins: [
    [
      "@mgcrea/react-native-tailwind/babel",
      {
        reactCompilerCompatible: true,
        colorScheme: {
          importFrom: "@react-navigation/native",
          importName: "useTheme",
        },
      },
    ],
  ],
};
```

## Troubleshooting

### Theme Still Not Updating

1. Verify React Compiler is properly configured
2. Check that `reactCompilerCompatible: true` is set
3. Ensure your color scheme hook returns the correct value
4. Clear Metro bundler cache: `npx expo start --clear`

### Generated Code Looks Different

This is expected. React Compiler mode generates a `useMemo` hook (`_twColorSchemeStyles`) inside each component that uses color scheme modifiers. This helps React Compiler track the dependency on `_twColorScheme`.

### Bundle Size Increase

React Compiler mode adds a small amount of code per component that uses color scheme modifiers. The increase is minimal and is a worthwhile trade-off for correct behavior with React Compiler.
