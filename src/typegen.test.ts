import assert from "node:assert";
import { describe, it } from "node:test";
import { generateTypeString } from "./typegen";
import type { Dirent } from "node:fs";

const mock = {
  file: (path: string, name: string) =>
    ({
      isFile: () => true,
      path,
      name,
    } as Dirent),

  dir: (path: string) =>
    ({
      isFile: () => false,
      path,
    } as Dirent),
};

describe("static pages", () => {
  it("removes index from route", () => {
    const result = generateTypeString("/root", [
      mock.file("/root", "index.astro"),
      mock.file("/root/api/nested", "index.ts"),
    ]);
    assert.strictEqual(
      result,
      'type AstroRoutes = [route: "/"] |\n[route: "/api/nested"];'
    );
  });

  it("ignore dirents that are not files", () => {
    const result = generateTypeString("/root", [
      mock.dir("/root"),
      mock.file("/root", "index.astro"),
    ]);
    assert.strictEqual(result, 'type AstroRoutes = [route: "/"];');
  });

  it("handles file names other than index", () => {
    const result = generateTypeString("/root", [
      mock.file("/root", "page.astro"),
      mock.file("/root/nested", "other-page.astro"),
    ]);
    assert.strictEqual(
      result,
      `type AstroRoutes = [route: "/page"] |\n[route: "/nested/other-page"];`
    );
  });
});

describe("dynamic pages", () => {});
