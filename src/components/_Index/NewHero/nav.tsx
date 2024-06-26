import { $, component$, useContext, useStore, useVisibleTask$ } from '@builder.io/qwik';
import { Link, removeClientDataCache, useNavigate } from '@builder.io/qwik-city';
import { IoCaretDown } from '@qwikest/icons/ionicons';
import { LuHome, LuLogOut, LuMoon, LuPencilLine, LuShield, LuSun, LuUser2 } from '@qwikest/icons/lucide';

import Nav2 from '~/components/Nav';

import CrownPNG from '~/assets/img/crown.png';

import PartialtySVG from '~/assets/svg/partialty.svg';
import LoadingSVG from '~/components/LoadingSVG';
import type { LuciaSession } from '~/types/LuciaSession';

import theme from '~/const/theme';
import { themeContext } from '~/context/themeContext';

const setThemeCookieFn = $(async (themeValue: (typeof theme)[number]) => {
  const d = new FormData();
  d.append('theme', themeValue);
  return await fetch('/api/courses/chapters/setThemeCookie/', {
    method: 'POST',
    body: d,
    // headers: {
    //   'Content-Type': 'application/json',
    // },
  }).then((x) => x.json());
});

const logout = $(() => {
  return fetch('/api/courses/logout/', {
    method: 'POST',
  });
});

const getUserFn = $(async () => {
  return await fetch('/api/courses/chapters/getUser/').then((x) => x.json());
});

export default component$((props: { user?: LuciaSession['user'] | undefined }) => {
  const theme = useContext(themeContext);
  const nav = useNavigate();
  const login = useStore({
    isLoading: props.user === undefined,
    isLoggedIn: props.user !== undefined,
    user: props.user,
  });
  const handleLogout = $(async () => {
    await logout();
    removeClientDataCache();
    nav('/');
  });

  useVisibleTask$(async () => {
    const res = await fetch('/api/courses/chapters/getUser/', {
      credentials: 'include',
    }).then((x) => x.json());
    login.isLoading = false;
    if (res) {
      login.isLoggedIn = true;
      login.user = res.user;
    }
  }, {
    strategy: "document-ready"
  });

  return (
    <>
      <div class="block lg:hidden">
        <Nav2 getUserFn={getUserFn} setThemeCookieFn={setThemeCookieFn} logoutFn={logout} />
      </div>
      <div class="hidden shadow shadow-slate-200/80 ring-1 ring-slate-900/5 lg:block">
        <nav class="mx-auto flex h-[70px] max-w-7xl items-center justify-between px-8">
          <div class="inline-flex w-[250px] items-center gap-2">
            <img src={PartialtySVG} width="15" height="15" alt="icon" />
            <h2 class="font-mosk text-lg tracking-wide">
              <Link prefetch href="/">
                Partialty.com
              </Link>
            </h2>
          </div>
          <div class="inline-flex items-center gap-8">
            <a
              href="/members/dashboard/"
              class="text-gray-500 transition-colors hover:text-black dark:text-gray-300 dark:hover:text-background-light-gray"
            >
              Home
            </a>
            <a
              href="/catalog/"
              class="text-gray-500 transition-colors hover:text-black dark:text-gray-300 dark:hover:text-background-light-gray"
            >
              Courses
            </a>
          </div>
          <div class="inline-flex w-[250px] items-center">
            <ul class="flex items-center gap-4">
              <li>
                <label class="flex items-center gap-2 text-[18px] text-primary-dark-gray dark:text-background-light-gray">
                  <LuSun />
                  <input
                    onChange$={(e, cTarget) => {
                      if (cTarget.checked) {
                        theme.value = 'dark';
                      } else {
                        theme.value = 'light';
                      }
                      setThemeCookieFn(theme.value);
                    }}
                    checked={theme.value.includes('dark')}
                    type="checkbox"
                    class="peer sr-only"
                  ></input>
                  <div class="peer-checked:after:border-backgroundbg-background-light-gray peer relative h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-background-light-gray after:transition-all after:content-[''] peer-checked:bg-highlight-dark peer-checked:after:translate-x-full peer-focus:outline-none"></div>
                  <LuMoon />
                </label>
              </li>
              {login.isLoading ? (
                <span class="px-6">
                  <LoadingSVG />
                </span>
              ) : login.isLoggedIn && login.user ? (
                <li class={'relative flex gap-3 px-6 py-2 [&:hover>div>span:last-child]:rotate-180 [&:hover>div]:flex'}>
                  <div class={'flex gap-2'}>
                    <span class="relative">
                      <img
                        src={login.user.avatar_url}
                        alt="Avatar"
                        width={40}
                        height={40}
                        class="max-w-[unset] rounded-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                      {login.user.role !== 'free' && (
                        <img
                          src={CrownPNG}
                          width={20}
                          height={20}
                          alt="Crown"
                          class="absolute right-[-15px] top-[-15px] max-w-[unset]"
                        />
                      )}
                    </span>

                    <span
                      class={
                        'inline-flex items-center text-[16px] text-primary-dark-gray transition-transform dark:text-background-light-gray'
                      }
                    >
                      <IoCaretDown />
                    </span>
                  </div>
                  <div class="absolute left-[0] top-[100%] z-[50] hidden w-[180px] -translate-x-[50%] pt-2 font-bold xl:left-[50%]">
                    <div
                      class={
                        'flex-1 rounded-xl border-2 border-primary-dark-gray bg-background-light-gray text-primary-dark-gray dark:border-disabled-dark dark:bg-highlight-dark dark:text-background-light-gray'
                      }
                    >
                      <ul class="flex flex-col p-1 lg:p-2 [&>li]:p-1 lg:[&>li]:p-2">
                        <li>
                          <Link
                            prefetch
                            href={login.isLoggedIn ? '/members/dashboard/' : '/login/'}
                            class="flex items-center gap-3"
                          >
                            <span class="text-[20px]">
                              <LuHome />
                            </span>
                            <span class="whitespace-nowrap  ">Home</span>
                          </Link>
                        </li>
                        <li>
                          <Link prefetch href="/profile/" class="flex items-center gap-3">
                            <span class="text-[20px]">
                              <LuUser2 />
                            </span>
                            <span class="whitespace-nowrap">My Profile</span>
                          </Link>
                        </li>
                        {login.user.role !== 'free' && (
                          <li>
                            <Link prefetch href="/creator/" class="flex items-center gap-3">
                              <span class="text-[20px]">
                                <LuPencilLine />
                              </span>
                              <span class="whitespace-nowrap">Creator</span>
                            </Link>
                          </li>
                        )}
                        {login.user.role === 'admin' && (
                          <li>
                            <Link prefetch href="/admin/courseapproval/" class="flex items-center gap-3">
                              <span class="text-[20px]">
                                <LuShield />
                              </span>
                              <span class="whitespace-nowrap">Admin</span>
                            </Link>
                          </li>
                        )}
                        <li>
                          <button onClick$={handleLogout} class="flex items-center gap-3">
                            <span class="text-[20px]">
                              <LuLogOut />
                            </span>
                            <span>Logout</span>
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </li>
              ) : (
                <li>
                  <a
                    href={'/login/'}
                    class="whitespace-nowrap rounded-[2rem] bg-disabled-dark px-6 py-2 font-normal tracking-normal text-background-light-gray shadow-md"
                  >
                    Login
                  </a>
                </li>
              )}
            </ul>
          </div>
        </nav>
      </div>
    </>
  );
});
