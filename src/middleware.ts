import { defineMiddleware } from "astro/middleware";
import { route } from "./route";

export const onRequest = defineMiddleware((context, next) => {
  context.locals.route = route;

  return next();
});
