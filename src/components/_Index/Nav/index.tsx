import { component$, useStore, useVisibleTask$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

import { IoCaretDown } from "@qwikest/icons/ionicons";
import { LuHome } from "@qwikest/icons/lucide";
import NavCourses from "~/components/NavCourses";
import getUser from "~/components/_Index/Nav/getUser";

export default component$(() => {
  const login = useStore({
    isLoading: true,
    isLoggedIn: false,
    avatarUrl: "",
  });

  getUser;

  useVisibleTask$(async () => {
    const res = await getUser();
    login.isLoading = false;
    if (res) {
      login.isLoggedIn = true;
      login.avatarUrl = res.user.avatar_url;
    }
  });
  return (
    <nav class="absolute left-0 top-0 z-20 flex w-full p-6">
      <div class="w-[50%] pr-[6vw]"></div>
      <ul class="flex w-[50%] items-center gap-6 text-base font-bold tracking-wide">
        <li class="px-2 py-2">
          <Link prefetch href={"/members/dashboard/"} class="flex gap-2">
            Home
            <span class="text-[20px] text-primary-dark-gray">
              <LuHome />
            </span>
          </Link>
        </li>
        <li class="relative px-6 py-2 [&:hover>div]:flex [&:hover_span:last-child]:rotate-180">
          <div class={"flex gap-2"}>
            <span>Courses</span>
            <span
              class={
                "inline-flex items-center text-[16px] text-primary-dark-gray transition-transform"
              }
            >
              <IoCaretDown />
            </span>
          </div>
          <div class="absolute left-[50%] top-[100%] z-[100] hidden w-[600px] -translate-x-[50%] pt-3">
            {NavCourses}
          </div>
        </li>
        <li class="px-2 py-2">
          <Link prefetch href={"/"}>
            Projects
          </Link>
        </li>
        <li class="px-2 py-2">
          <Link prefetch href={"/"}>
            Playground
          </Link>
        </li>
        {login.isLoading ? (
          <span>
            <svg
              aria-hidden="true"
              class="inline-block h-4 w-4 animate-spin fill-background-light-gray text-primary-dark-gray"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          </span>
        ) : login.isLoggedIn ? (
          <li>
            <Link prefetch href={"/members/dashboard/"} aria-label="Go to profile">
              <img
                src={login.avatarUrl}
                alt="Avatar"
                width={40}
                height={40}
                class="rounded-full object-contain"
              />
            </Link>
          </li>
        ) : (
          <li class="rounded-lg bg-primary-dark-gray px-4 py-2 font-normal tracking-normal text-background-light-gray shadow-md">
            <Link prefetch href={"/login"} class="whitespace-nowrap">
              Login | Signup
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
});
