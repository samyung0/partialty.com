import { component$, useStore, useTask$ } from "@builder.io/qwik";
import { Form, Link, useLocation, useNavigate } from "@builder.io/qwik-city";
import { useLoginWithPassword } from "~/auth/login";

import GithubIcon from "~/assets/svg/logo-github.svg";
import GoogleIcon from "~/assets/svg/logo-google.svg";

export default component$(() => {
  const loginWithPassword = useLoginWithPassword();
  const params = useLocation().url.searchParams;
  const formError = useStore({
    email: "",
    password: "",
    wrongInfo: "",
  });
  const nav = useNavigate();
  useTask$(({ track }) => {
    track(() => params.get("errMessage"));
    formError.wrongInfo = params.get("errMessage") ?? "";
  });

  useTask$(({ track }) => {
    track(() => loginWithPassword.status);
    if (loginWithPassword.status === 400) {
      formError.email = loginWithPassword.value?.fieldErrors?.email?.join("\n") ?? "";
      formError.password = loginWithPassword.value?.fieldErrors?.password?.join("\n") ?? "";
    }
    if (loginWithPassword.status === 500) formError.wrongInfo = loginWithPassword.value?.message;
    if (loginWithPassword.status === 200) {
      console.log("OK");
      nav("/members/dashboard/");
    }
  });
  return (
    <section class="flex h-[100vh] items-center justify-center bg-sherbet">
      <div class="flex w-[50vw] min-w-[400px] max-w-[700px] items-center justify-center rounded-lg border-2 border-black bg-white py-16">
        <div>
          <h1 class="pb-6 text-center font-mosk text-[2.5rem] font-bold tracking-wider">Login</h1>
          <br />
          <Form action={loginWithPassword} class="space-y-6">
            <div>
              <label for="email" class="cursor-pointer text-lg">
                Email address
              </label>
              <div class="pt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  class={
                    "block w-[300px] rounded-md border-2 px-3 py-2 " +
                    (formError.email || formError.wrongInfo ? "border-tomato" : "border-black/10")
                  }
                />
              </div>
              <p class="w-[300px] pt-1 tracking-wide text-tomato">{formError.email}</p>
            </div>
            <div>
              <label for="password" class="cursor-pointer text-lg">
                Password
              </label>
              <div class="pt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="password"
                  required
                  class={
                    "block w-[300px] rounded-md border-2 px-3 py-2 " +
                    (formError.password || formError.wrongInfo
                      ? "border-tomato"
                      : "border-black/10")
                  }
                />
              </div>
              <p class="w-[300px] pt-1 text-sm tracking-wide text-tomato">
                {formError.password || formError.wrongInfo}
              </p>
            </div>
            <br />
            <button
              type="submit"
              class="block w-full rounded-lg bg-primary-dark-gray p-4 text-background-light-gray"
            >
              Log in
            </button>
          </Form>

          <div class="relative my-10 mb-6 flex items-center">
            <span class="inline-block h-[3px] flex-1 bg-black/10"></span>
            <span class="px-4 tracking-wide">or</span>
            <span class="inline-block h-[3px] flex-1 bg-black/10"></span>
          </div>

          <div class="flex items-center justify-evenly">
            <Link class="p-4 pt-0" aria-label="Login With Google" href="/login/google/">
              <img src={GoogleIcon} alt="Login With Google" width={55} height={55} />
            </Link>
            <Link class="p-4 pt-0" aria-label="Login With Github" href="/login/github/">
              <img src={GithubIcon} alt="Login With Github" width={50} height={50} />
            </Link>
          </div>

          <div class="pt-4 text-center">
            <Link
              prefetch
              href="/signup/"
              class="inline-block underline decoration-wavy underline-offset-8"
            >
              New User? Click Here to Sign up
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
});