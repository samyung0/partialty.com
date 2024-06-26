import type { QRL, Signal } from '@builder.io/qwik';
import { $, component$, useSignal, useStore } from '@builder.io/qwik';
import { LuGem, LuGoal, LuX } from '@qwikest/icons/lucide';
import LoadingSVG from '~/components/LoadingSVG';
import type { IsLockedValidation } from '~/components/_Creator/Course';
import {
  addCategorySchema,
  checkExistingChapter,
  checkExistingChapterLink,
  saveChapter,
} from '~/components/_Creator/Course';
import { useUserLoader } from '~/routes/(lang)/(wrapper)/(authRoutes)/layout';
import type { Content } from '../../../../drizzle_turso/schema/content';
export { addCategorySchema, checkExistingChapter, checkExistingChapterLink, saveChapter };

export default component$(
  ({
    showEditChapter,
    courseId,
    callBackOnSave,
    courseData,
    courseSlug,
    userRole,
    userId,
    author,
    isLocked,
  }: {
    showEditChapter: Signal<boolean>;
    courseId: Signal<string>;
    callBackOnSave: QRL<(course: Content) => any>;
    courseData: Content;
    courseSlug: Signal<string>;
  } & IsLockedValidation) => {
    const user = useUserLoader().value;
    const formData = useStore(() => Object.assign({}, courseData));
    const formError = useStore({
      name: '',
      slug: '',
      link: '',
    });
    const ref = useSignal<HTMLInputElement>();
    const ref2 = useSignal<HTMLInputElement>();
    const loading = useSignal(false);

    const handleSubmit = $(async () => {
      if (isLocked && userId !== author && userRole !== 'admin') return alert('Unexpected!');
      if (loading.value) return;
      loading.value = true;
      formError.name = '';
      formError.slug = '';
      formError.link = '';
      const result = addCategorySchema.safeParse(formData);
      if (!result.success) {
        formError.name = result.error.formErrors.fieldErrors.name?.join('\n') || '';
        formError.slug = result.error.formErrors.fieldErrors.slug?.join('\n') || '';
        formError.link = result.error.formErrors.fieldErrors.link?.join('\n') || '';
        loading.value = false;
        return;
      }
      if (!formData.link!.startsWith('/courses') && !window.confirm('Are you sure you want to use a custom link?')) {
        loading.value = false;
        return;
      }
      const dup = await checkExistingChapter(formData.slug!, courseId.value);
      if (dup.filter((content) => content.id !== formData.id).length > 0) {
        formError.slug = 'Slug already exists!';
        loading.value = false;
        return;
      }
      const dup2 = await checkExistingChapterLink(formData.link!);
      if (dup2.filter((content) => content.id !== formData.id).length > 0) {
        formError.link = 'Link already exists!';
        loading.value = false;
        return;
      }
      try {
        const chapter = await saveChapter(formData);
        await callBackOnSave(chapter[0]);
        loading.value = false;
        showEditChapter.value = false;
      } catch (e) {
        console.error(e);
        loading.value = false;
        showEditChapter.value = false;
        alert('An error occured. Please try refreshing the page or contact support.');
        return;
      }
    });
    return (
      <div class="fixed left-0 top-0 z-[100] flex h-[100vh] w-full items-center justify-center backdrop-blur-sm">
        <div class="relative flex w-[95vw] flex-col items-center justify-center gap-3 rounded-lg border-2 border-black bg-white py-16 dark:bg-highlight-dark md:w-[80vw] lg:w-[50vw] lg:min-w-[400px] lg:max-w-[600px]">
          <button
            onClick$={() => (showEditChapter.value = false)}
            class="absolute right-5 top-5 block p-1 text-[15px] text-primary-dark-gray dark:text-background-light-gray md:text-[20px]"
          >
            <LuX />
          </button>
          <h2 class="pb-4 text-center font-mosk text-[1.5rem] font-bold tracking-wider md:pb-6 md:text-[2rem]">
            Edit Chapter
          </h2>
          <form preventdefault:submit onsubmit$={() => handleSubmit()} class="flex flex-col gap-2 md:gap-3">
            <div>
              <label for="categoryName" class="cursor-pointer text-base md:text-lg">
                Name
              </label>
              <div class="pt-1">
                <input
                  id="categoryName"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={formData.name}
                  onInput$={(_, el) => {
                    formData.name = el.value.trim();
                    formData.slug = el.value
                      .trim()
                      .replace(/\W+(?!$)/g, '-')
                      .toLowerCase();
                    formData.slug = formData.slug.replace(/\W$/, '').toLowerCase();
                    formData.link = `/courses/${courseSlug.value}/chapters/${formData.slug}/`;
                    if (ref.value) ref.value.scrollLeft += 99999;
                    if (ref2.value) ref2.value.scrollLeft += 99999;
                  }}
                  required
                  class={
                    'w-[250px] rounded-md border-2 px-3 py-2 dark:border-background-light-gray dark:bg-highlight-dark  dark:text-background-light-gray dark:disabled:border-disabled-dark dark:disabled:bg-disabled-dark md:w-[300px] ' +
                    (formError.name ? 'border-tomato dark:border-tomato' : 'border-black/10')
                  }
                />
              </div>
              <p class="w-[250px] whitespace-pre-wrap break-words pt-1 tracking-wide text-tomato md:w-[300px]">
                {formError.name}
              </p>
            </div>
            <div>
              <label for="categorySlug" class="cursor-pointer text-base md:text-lg">
                Slug
              </label>
              <div class="pt-1">
                <input
                  ref={ref}
                  id="categorySlug"
                  name="slug"
                  type="text"
                  disabled={user.role !== 'admin'}
                  value={formData.slug}
                  onInput$={(_, el) => {
                    formData.slug = el.value;
                  }}
                  required
                  class={
                    'w-[250px] rounded-md border-2 px-3 py-2 dark:border-background-light-gray dark:bg-highlight-dark  dark:text-background-light-gray dark:disabled:border-disabled-dark dark:disabled:bg-disabled-dark md:w-[300px] ' +
                    (formError.slug ? 'border-tomato dark:border-tomato' : 'border-black/10')
                  }
                />
              </div>
              <p class="w-[250px] whitespace-pre-wrap break-words pt-1 tracking-wide text-tomato md:w-[300px]">
                {formError.slug}
              </p>
            </div>
            <div>
              <label for="categorLink" class="cursor-pointer text-base md:text-lg">
                Link
              </label>
              <div class="pt-1">
                <input
                  ref={ref2}
                  id="categorLink"
                  name="link"
                  type="text"
                  disabled={user.role !== 'admin'}
                  value={formData.link}
                  onInput$={(_, el) => {
                    formData.link = el.value;
                  }}
                  required
                  class={
                    'w-[250px] rounded-md border-2 px-3 py-2 dark:border-background-light-gray dark:bg-highlight-dark  dark:text-background-light-gray dark:disabled:border-disabled-dark dark:disabled:bg-disabled-dark md:w-[300px] ' +
                    (formError.link ? 'border-tomato dark:border-tomato' : 'border-black/10')
                  }
                />
              </div>
              <p class="w-[250px] whitespace-pre-wrap break-words pt-1 tracking-wide text-tomato md:w-[300px]">
                {formError.link}
              </p>
            </div>
            <div>
              <label
                title="A checkpoint usually contains exercises for the user as revision."
                for="isCheckpoint"
                class="flex cursor-pointer items-center gap-3  text-base md:gap-5 md:text-lg"
              >
                <span class="flex items-center gap-2">
                  <span class="text-[15px] text-primary-dark-gray dark:text-background-light-gray md:text-[20px]">
                    <LuGoal />
                  </span>
                  Checkpoint
                </span>
                <input
                  id="isCheckpoint"
                  type="checkbox"
                  class="h-4 w-4"
                  checked={formData.is_checkpoint}
                  onChange$={(e, currentTarget) => (formData.is_checkpoint = currentTarget.checked)}
                />
              </label>
            </div>
            {user.role === 'admin' && (
              <div>
                <label
                  title="The course is only accessible to subscribed users if checked."
                  for="subscriptionRequired"
                  class="flex cursor-pointer items-center gap-3 text-base md:gap-5 md:text-lg"
                >
                  <span class="flex items-center gap-2">
                    <span class="text-[15px] text-primary-dark-gray dark:text-background-light-gray md:text-[20px]">
                      <LuGem />
                    </span>
                    Subscription Required
                  </span>
                  <input
                    id="subscriptionRequired"
                    type="checkbox"
                    class="h-4 w-4"
                    checked={formData.is_premium}
                    onChange$={(e, currentTarget) => (formData.is_premium = currentTarget.checked)}
                  />
                </label>
              </div>
            )}
            <br />
            <button
              type="submit"
              class="block w-[250px] rounded-lg bg-primary-dark-gray p-2 text-background-light-gray dark:bg-primary-dark-gray md:w-[300px] md:p-4"
            >
              {loading.value && (
                <span>
                  <LoadingSVG />
                </span>
              )}
              {!loading.value && <span class="text-[0.875rem] md:text-[1rem]">Save</span>}
            </button>
          </form>
        </div>
      </div>
    );
  }
);
