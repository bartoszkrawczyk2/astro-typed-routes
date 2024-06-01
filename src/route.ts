export type Routes = [string] | [string, Record<string, string | number>];

export const route = (...args: Routes) => {
  const [route, params] = args;
  if (!params) return route;

  let withParams = route;

  for (const key in params) {
    withParams = withParams.replace(`[${key}]`, String(params[key]));
  }

  return withParams;
};
