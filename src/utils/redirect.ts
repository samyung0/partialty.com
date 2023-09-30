import { protectedRoutes } from "~/utils/protectedRoutes";

export const checkProtectedPath = (path: string | undefined, role: any): [boolean, string] => {
  let shouldRedirect = false,
    redirectTo = "/"; // default to base

  // in case somehow the path is empty, redirect to homepage and refresh
  if (!path) return [true, redirectTo];

  for (const i of protectedRoutes) {
    const re = new RegExp(i.path);
    if (re.test(path)) {
      redirectTo = i.redirectTo;
      if (role) shouldRedirect = !i.authRolesPermitted.includes(role);
      else shouldRedirect = i.authRolesPermitted.length !== 0; // if no roles permitted, then only UNAUTHED persons can access
      break;
    }
  }
  return [shouldRedirect, redirectTo];
};

// export const useRedirectLoader = routeLoader$(async (request) => {
//   // bind to the root request since request inside server$ has different request object
//   const context = await preload.bind(request)();

//   // userRole can be null if error
//   const [shouldRedirect, redirectTo] = checkProtectedPath(
//     context.req.url!.pathname,
//     context.session?.userRole
//   );
//   if (shouldRedirect) throw request.redirect(308, redirectTo);
//   return context;
// });