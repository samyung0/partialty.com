import {
  component$,
  useSignal,
  $,
  useContext,
  useTask$,
} from "@builder.io/qwik";
import { Logo } from "../logo/logo";
import { ButtonStd } from "~/components/ui/button-std";
import { Link, useNavigate } from "@builder.io/qwik-city";

import { globalContext } from "../../../root";
import { DBLogout } from "../../../routes/plugin@Auth";

export const Navigation = component$(() => {
  // const nav = useNavigate();
  const context = useContext(globalContext);

  const handleLogout = $(() => {
    DBLogout();
  });

  return (
    <nav class="bg-white py-4 px-7 sticky">
      <div class="flex justify-between items-center">
        <Link href="/">
          <Logo />
        </Link>
        <div class="flex items-center text-sm">
          <ul class="flex space-x-10">
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/shop">Shop</Link>
            </li>
            <li>
              <Link href="/services">Services</Link>
            </li>
          </ul>
          <div class="border-r border-gray-300 h-10 ml-10"></div>

          {context.isLoggedIn && (
            <>
              <button onClick$={handleLogout} class="ml-10">
                Logout
              </button>
              <Link href="/members/dashboard">
                <ButtonStd
                  title="Dashboard"
                  classText="mr-5 ml-10 bg-sky-500 border border-sky-500 hover:bg-sky-400 text-white"
                />
              </Link>
            </>
          )}

          {!context.isLoggedIn && (
            <>
              <Link href="/login">
                <ButtonStd
                  title="Log In"
                  classText="mr-2 ml-10 border border-sky-500 text-sky-500 hover:text-sky-400 hover:border-sky-400"
                  noBackground
                />
              </Link>
              <Link href="/signup">
                <ButtonStd
                  title="Sign Up"
                  classText="mr-5 ml-5 bg-green-500 border border-green-500 hover:bg-green-400 text-white"
                />
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
});
