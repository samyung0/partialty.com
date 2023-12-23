import type { RequestHandler } from "@builder.io/qwik-city";
import { OAuthRequestError } from "@lucia-auth/oauth";
import { auth, googleAuth } from "~/auth/lucia";

export const onGet: RequestHandler = async (request) => {
  const storedState = request.cookie.get("google_oauth_state")?.value;
  const url = new URL(request.url);
  const state = url.searchParams.get("state");
  const code = url.searchParams.get("code");

  if (!storedState || !state || storedState !== state || !code) {
    throw request.redirect(302, "/login/?errMessage=OAuth failed!");
  }

  try {
    const { getExistingUser, googleUser, createUser } = await googleAuth().validateCallback(code);

    const getUser = async () => {
      const existingUser = await getExistingUser();
      if (existingUser) return existingUser;
      const attributes: any = {
        username: googleUser.name,
        avatar_url: googleUser.picture,
      };
      if (googleUser.email) attributes.email = googleUser.email;
      const user = await createUser({
        attributes,
      });
      return user;
    };

    const Auth = auth();

    const user = await getUser();
    const session = await Auth.createSession({
      userId: user.userId,
      attributes: {},
    });
    const authRequest = Auth.handleRequest(request);
    authRequest.setSession(session);
  } catch (e) {
    console.error(e);
    if (e instanceof OAuthRequestError) {
      throw request.redirect(302, "/login/?errMessage=OAuth failed!");
    }
    throw request.redirect(302, "/login/?errMessage=" + e);
  }
  throw request.redirect(302, "/members/dashboard/");
};