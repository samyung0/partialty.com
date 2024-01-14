import type { Signal } from "@builder.io/qwik";
import { $, component$, useSignal, useStore, useTask$ } from "@builder.io/qwik";
import { Form, Link, useLocation, useNavigate } from "@builder.io/qwik-city";
import { useSetBio, useSignupWithPassword } from "~/auth/signup";

import GithubIcon from "~/assets/svg/logo-github.svg";
import GoogleIcon from "~/assets/svg/logo-google.svg";
import { CLOUDINARY_MAX_IMG_SIZE, CLOUDINARY_MAX_PIXEL_COUNT } from "~/const";
import type { CloudinaryDefaultPic } from "~/types/Cloudinary";

import RandomAvatar from "~/assets/svg/shuffle-outline.svg";
import DeleteAvatar from "~/assets/svg/trash-outline.svg";

import Dragndrop from "~/components/_Signup/dragndrop";

export default component$(
  ({ cloudinaryDefaultPics }: { cloudinaryDefaultPics: Signal<CloudinaryDefaultPic[]> }) => {
    const params = useLocation().url.searchParams;
    const setBio = useSetBio();
    const signupWithPassword = useSignupWithPassword();

    const firstForm = useStore({
      email: "",
      password: "",
      rePassword: "",
    });
    const loadingStepOne = useSignal(false);

    const formError = useStore({
      email: "",
      password: "",
      wrongRePassword: "",
      wrongInfo: "",
      error: "",
    });
    const bioError = useStore({
      avatar: "",
      nickname: "",
      wrongInfo: "",
    });
    const nav = useNavigate();
    const isSetBio = useSignal(false);
    const originalAvatar = useSignal(
      cloudinaryDefaultPics.value[Math.floor(Math.random() * cloudinaryDefaultPics.value.length)]
    );
    const defaultBio = useStore<{ avatar: CloudinaryDefaultPic; nickname: string }>({
      avatar: JSON.parse(JSON.stringify(originalAvatar.value)),
      nickname: "Anonymous",
    });

    const customAvatar = useSignal(false);

    useTask$(({ track }) => {
      track(() => params.get("errMessage"));
      formError.wrongInfo = params.get("errMessage") ?? "";
    });

    useTask$(({ track }) => {
      track(() => signupWithPassword.status);
      if (signupWithPassword.status === 400) {
        formError.email = signupWithPassword.value?.fieldErrors?.email?.join("\n") ?? "";
        formError.password = signupWithPassword.value?.fieldErrors?.password?.join("\n") ?? "";
        if (signupWithPassword.value?.formErrors && signupWithPassword.value.formErrors.length > 0)
          formError.wrongRePassword = signupWithPassword.value.formErrors.join("\n");
      }
      if (signupWithPassword.status === 500) {
        if (signupWithPassword.value?.message === `Error! User already exists`)
          formError.wrongInfo = signupWithPassword.value.message;
        else formError.error = signupWithPassword.value?.message;
      }
      if (signupWithPassword.status === 200) {
        isSetBio.value = true;
        firstForm.email = "";
        firstForm.password = "";
        firstForm.rePassword = "";
      }
      loadingStepOne.value = false;
    });

    const restoreOriginalAvatar = $(() => {
      defaultBio.avatar = JSON.parse(JSON.stringify(originalAvatar.value));
      customAvatar.value = false;
      bioError.avatar = "";
    });

    const randomizeDefaultAvatar = $(() => {
      defaultBio.avatar = JSON.parse(
        JSON.stringify(
          cloudinaryDefaultPics.value[
            Math.floor(Math.random() * cloudinaryDefaultPics.value.length)
          ]
        )
      );
      customAvatar.value = false;
      bioError.avatar = "";
    });

    const handleImage = $((file: File) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onabort = () => (bioError.avatar = "Cannot load image!");
      reader.onerror = () => (bioError.avatar = "Cannot load image!");
      reader.onload = () => {
        if (!reader.result) {
          bioError.avatar = "Cannot load image!";
          return;
        }
        const img = new Image();
        img.src = reader.result as string;
        img.onload = () => {
          if (
            file.size > CLOUDINARY_MAX_IMG_SIZE ||
            img.width * img.height > CLOUDINARY_MAX_PIXEL_COUNT
          ) {
            bioError.avatar = "The picture is too large!";
            return;
          }

          customAvatar.value = true;
          defaultBio.avatar.secure_url = reader.result as string;
          defaultBio.avatar.width = img.width;
          defaultBio.avatar.height = img.height;
          defaultBio.avatar.pixels = img.width * img.height;
          defaultBio.avatar.bytes = file.size;
          defaultBio.avatar.public_id = "";
          bioError.avatar = "";
        };
      };
    });

    return (
      <section class="flex h-[100vh] items-center justify-center bg-sherbet">
        <div class="w-[50vw] min-w-[400px] max-w-[600px]  overflow-hidden ">
          <div class="flex w-[100vw] min-w-[800px] max-w-[1200px] justify-start overflow-hidden">
            <div
              class={
                "flex w-[50vw] min-w-[400px] max-w-[600px] items-center justify-center rounded-lg border-2 border-black bg-white py-16 transition-transform " +
                (isSetBio.value ? "translate-x-[-100%]" : "")
              }
            >
              <div class="flex flex-col items-center justify-center">
                <h1 class="pb-6 text-center font-mosk text-[2.5rem] font-bold tracking-wider">
                  Sign up
                </h1>
                <br />
                <form
                  preventdefault:submit
                  onSubmit$={() => {
                    loadingStepOne.value = true;
                    signupWithPassword.submit({
                      ...firstForm,
                      avatar_cloudinary_id: defaultBio.avatar.public_id,
                      nickname: defaultBio.nickname,
                    });
                  }}
                  class="space-y-6"
                >
                  <input
                    type="text"
                    name="avatar_cloudinary_id"
                    hidden
                    class="hidden"
                    aria-hidden
                    value={defaultBio.avatar.public_id}
                  />
                  <input
                    type="text"
                    name="nickname"
                    hidden
                    class="hidden"
                    aria-hidden
                    value={defaultBio.nickname}
                  />
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
                        value={firstForm.email}
                        onInput$={(_, el) => (firstForm.email = el.value)}
                        class={
                          "block w-[300px] rounded-md border-2 px-3 py-2 " +
                          (formError.email || formError.wrongInfo
                            ? "border-tomato"
                            : "border-black/10")
                        }
                      />
                    </div>
                    <p class="w-[300px] pt-1 tracking-wide text-tomato">
                      {formError.email || formError.wrongInfo}
                    </p>
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
                        autoComplete="off"
                        required
                        value={firstForm.password}
                        onInput$={(_, el) => (firstForm.password = el.value)}
                        class={
                          "block w-[300px] rounded-md border-2 px-3 py-2 " +
                          (formError.password ? "border-tomato" : "border-black/10")
                        }
                      />
                    </div>
                    <p class="w-[300px] pt-1 text-sm tracking-wide text-tomato">
                      {formError.password}
                    </p>
                  </div>
                  <div>
                    <label for="rePassword" class="cursor-pointer text-lg">
                      Re-enter Password
                    </label>
                    <div class="pt-1">
                      <input
                        id="rePassword"
                        name="rePassword"
                        type="password"
                        autoComplete="off"
                        required
                        value={firstForm.rePassword}
                        onInput$={(_, el) => (firstForm.rePassword = el.value)}
                        class={
                          "block w-[300px] rounded-md border-2 px-3 py-2 " +
                          (formError.wrongRePassword ? "border-tomato" : "border-black/10")
                        }
                      />
                    </div>
                    <p class="w-[300px] pt-1 text-sm tracking-wide text-tomato">
                      {formError.wrongRePassword || formError.error}
                    </p>
                  </div>
                  <br />
                  <button
                    type="submit"
                    class={
                      "relative block w-full rounded-lg bg-primary-dark-gray p-4 text-background-light-gray transition-all"
                    }
                    disabled={isSetBio.value}
                  >
                    {loadingStepOne.value && (
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
                    )}
                    {!loadingStepOne.value && <span>Yup, Next</span>}
                  </button>
                </form>

                <div class="relative my-10 mb-6 flex items-center self-stretch">
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
                    href="/login/"
                    class="inline-block underline decoration-wavy underline-offset-8"
                  >
                    Have an account already? Come here
                  </Link>
                </div>
              </div>
            </div>
            <div
              class={
                "flex w-[50vw] min-w-[400px] max-w-[600px] items-center justify-center rounded-lg border-2 border-black bg-white py-16 transition-transform " +
                (isSetBio.value ? "translate-x-[-100%]" : "")
              }
            >
              <div class="flex flex-col items-center justify-center">
                <h1 class="pb-6 text-center font-mosk text-[2rem] font-bold tracking-wider">
                  Let's make a funny profile.
                </h1>
                <br />
                <Form class="relative space-y-6">
                  <div class="absolute right-0 top-0 flex flex-col gap-2 p-2">
                    <button type="button" onClick$={restoreOriginalAvatar}>
                      <img
                        src={DeleteAvatar}
                        alt="Delete"
                        width={25}
                        height={25}
                        class="object-contain"
                      />
                    </button>
                    <button type="button" onClick$={randomizeDefaultAvatar}>
                      <img
                        src={RandomAvatar}
                        alt="Randomize"
                        width={25}
                        height={25}
                        class="object-contain"
                      />
                    </button>
                  </div>
                  <Dragndrop
                    width={defaultBio.avatar.width}
                    height={defaultBio.avatar.height}
                    secure_url={defaultBio.avatar.secure_url}
                    handleImage={handleImage}
                    bioErrorMsg={bioError.avatar}
                  ></Dragndrop>
                  <div>
                    <label for="nickname" class="cursor-pointer text-lg">
                      Nickname
                    </label>
                    <div class="pt-1">
                      <input
                        value={defaultBio.nickname}
                        onInput$={(_, el) => (defaultBio.nickname = el.value)}
                        id="nickname"
                        name="nickname"
                        type="text"
                        autoComplete="off"
                        required
                        class={
                          "block w-[300px] rounded-md border-2 px-3 py-2 " +
                          (bioError.nickname || bioError.wrongInfo
                            ? "border-tomato"
                            : "border-black/10")
                        }
                      />
                    </div>
                    <p class="w-[300px] pt-1 text-sm tracking-wide text-tomato">
                      {bioError.nickname || bioError.wrongInfo}
                    </p>
                  </div>
                  <br />
                  <button
                    onClick$={() => {
                      setBio.submit({
                        nickname: defaultBio.nickname,
                        customAvatar: customAvatar.value,
                        avatar: defaultBio.avatar,
                      });
                    }}
                    type="submit"
                    class="block w-full rounded-lg bg-primary-dark-gray p-4 text-background-light-gray"
                  >
                    Sign up
                  </button>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
);