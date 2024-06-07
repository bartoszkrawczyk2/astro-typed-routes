import type { Dirent } from "node:fs";
import { readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

export function generateTypeString(pagesDir: string, pages: Dirent[]) {
  const routes = pages
    .filter((page) => page.isFile())
    .map((page) => {
      const path = `${page.path}/${page.name}`.split(pagesDir)[1];
      if (!path) return;

      const route: { route: string; params?: string[] } = {
        route: path.replace(/\.[^/.]+$/, "").replace(/\/index$/, "") || "/",
      };
      const params = path.match(/(?<=\[)(.*?)(?=\])/g);
      if (params) route.params = params;

      return route;
    });

  const type = `type AstroRoutes = ${routes
    .map((route) =>
      route
        ? `[route: "${route.route}"${
            route.params?.length
              ? `, params: { ${route.params
                  .map((p) => `${p}: string | number;`)
                  .join(" ")} }`
              : ""
          }]`
        : undefined
    )
    .filter(Boolean)
    .join(" |\n")};`;

  return type;
}

export async function typegen(root: string) {
  const pagesDir = join(root, "src/pages");
  const routesTypesPath = join(root, ".astro/routes.d.ts");

  const pages = await readdir(pagesDir, {
    recursive: true,
    withFileTypes: true,
  });

  const type = generateTypeString(pagesDir, pages);

  await writeFile(routesTypesPath, type, "utf-8");
}
