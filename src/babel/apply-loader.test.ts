import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { expandApplyClasses, loadApplyClassRegistry } from "./apply-loader";

function createTempDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), "rntw-apply-"));
}

function writeFile(filePath: string, content: string): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
}

const tempDirs: string[] = [];

afterEach(() => {
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();
    if (dir && fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  }
});

describe("apply-loader", () => {
  it("should load @apply classes from CSS file", () => {
    const tempDir = createTempDir();
    tempDirs.push(tempDir);
    const cssPath = path.join(tempDir, "styles.css");

    writeFile(
      cssPath,
      `
      .button {
        @apply px-4 py-2 rounded;
      }

      .card, .panel {
        @apply p-4 bg-white;
      }
    `,
    );

    const registry = loadApplyClassRegistry({ files: [cssPath] }, path.join(tempDir, "App.tsx"));

    expect(registry.get("button")).toEqual(["px-4", "py-2", "rounded"]);
    expect(registry.get("card")).toEqual(["p-4", "bg-white"]);
    expect(registry.get("panel")).toEqual(["p-4", "bg-white"]);
  });

  it("should merge aliases across multiple files in declaration order", () => {
    const tempDir = createTempDir();
    tempDirs.push(tempDir);
    const firstCssPath = path.join(tempDir, "first.css");
    const secondCssPath = path.join(tempDir, "second.css");

    writeFile(
      firstCssPath,
      `
      .button {
        @apply p-4;
      }
    `,
    );
    writeFile(
      secondCssPath,
      `
      .button {
        @apply bg-blue-500 text-white;
      }
    `,
    );

    const registry = loadApplyClassRegistry(
      { files: [firstCssPath, secondCssPath] },
      path.join(tempDir, "App.tsx"),
    );

    expect(registry.get("button")).toEqual(["p-4", "bg-blue-500", "text-white"]);
  });

  it("should ignore unsupported selectors", () => {
    const tempDir = createTempDir();
    tempDirs.push(tempDir);
    const cssPath = path.join(tempDir, "styles.css");
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(vi.fn());

    writeFile(
      cssPath,
      `
      .button:hover {
        @apply p-4;
      }

      .button {
        @apply rounded;
      }
    `,
    );

    const registry = loadApplyClassRegistry({ files: [cssPath] }, path.join(tempDir, "App.tsx"));

    expect(registry.get("button")).toEqual(["rounded"]);
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Unsupported selector ".button:hover"'));
    warnSpy.mockRestore();
  });

  it("should expand nested custom classes", () => {
    const registry = new Map<string, string[]>([
      ["button-base", ["px-4", "py-2"]],
      ["button-primary", ["button-base", "bg-blue-500", "text-white"]],
    ]);

    const expanded = expandApplyClasses("button-primary rounded", registry, new Map(), new Map());
    expect(expanded).toBe("px-4 py-2 bg-blue-500 text-white rounded");
  });

  it("should detect circular references", () => {
    const registry = new Map<string, string[]>([
      ["a", ["b"]],
      ["b", ["c"]],
      ["c", ["a"]],
    ]);

    expect(() => expandApplyClasses("a", registry, new Map(), new Map())).toThrow(
      /Circular @apply class reference detected/,
    );
  });
});
