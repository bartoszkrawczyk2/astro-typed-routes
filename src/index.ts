import type { AstroIntegration } from "astro";
import { typegen } from "./typegen";
import type { Routes } from "./route";

export type Route<R extends Routes> = (...args: R) => string;

const AstroTypedRoutes = (): AstroIntegration => ({
  name: "astro-typed-routes",
  hooks: {
    "astro:config:setup": async ({ config, addMiddleware }) => {
      // TODO: add watch

      addMiddleware({
        entrypoint: "astro-typed-routes/middleware",
        order: "pre",
      });

      await typegen(config.root.pathname);
    },
  },
});

export default AstroTypedRoutes;
