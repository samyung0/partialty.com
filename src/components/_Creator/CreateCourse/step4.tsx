import type { Signal } from '@builder.io/qwik';
import { $, component$, useSignal, useStore } from '@builder.io/qwik';
import { server$, z } from '@builder.io/qwik-city';
import { LuArrowLeft, LuTrash, LuX } from '@qwikest/icons/lucide';
import { and, eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import LoadingSVG from '~/components/LoadingSVG';
import { useTags } from '~/routes/(lang)/(wrapper)/(authRoutes)/creator/layout';
import { useUserLoader } from '~/routes/(lang)/(wrapper)/(authRoutes)/layout';
import drizzleClient from '~/utils/drizzleClient';
import type { NewContentIndex } from '../../../../drizzle_turso/schema/content_index';
import type { NewTag, Tag } from '../../../../drizzle_turso/schema/tag';
import { tag } from '../../../../drizzle_turso/schema/tag';

const checkExistingCourseFromTag = server$(async function (id: string) {
  return (
    await drizzleClient(this.env, import.meta.env.VITE_USE_PROD_DB === '1')
      .select()
      .from(tag)
      .where(eq(tag.id, id))
  )[0].content_index_id;
});

const deleteTagAction = server$(async function (id: string) {
  return await drizzleClient(this.env, import.meta.env.VITE_USE_PROD_DB === '1')
    .delete(tag)
    .where(eq(tag.id, id))
    .returning();
});

const addTagAction = server$(async function (formData: NewTag) {
  return await drizzleClient(this.env, import.meta.env.VITE_USE_PROD_DB === '1')
    .insert(tag)
    .values(formData)
    .returning();
});

const checkExistingTag = server$(async function (slug: string) {
  return await drizzleClient(this.env, import.meta.env.VITE_USE_PROD_DB === '1')
    .select({ id: tag.id })
    .from(tag)
    .where(and(eq(tag.slug, slug), eq(tag.approved, true)));
});

const checkExistingTagLink = server$(async function (link: string) {
  return await drizzleClient(this.env, import.meta.env.VITE_USE_PROD_DB === '1')
    .select({ id: tag.id })
    .from(tag)
    .where(and(eq(tag.link, link), eq(tag.approved, true)));
});

const addTagSchema = z.object({
  name: z.string().min(1, 'A name is required').max(35, 'Name is too long (max. 35 chars)'),
  slug: z
    .string()
    .min(2, 'A slug is required')
    .regex(/^[a-zA-Z0-9]+.*[a-zA-Z0-9]+$/, 'The slug must start and end with characters!')
    .regex(/^[a-zA-Z0-9]+[-a-zA-Z0-9]*[a-zA-Z0-9]+$/, 'No special characters except hyphens are allowed'),
  link: z
    .string()
    .min(1, 'A link is required')
    .regex(/^\//, 'The link needs to start with a slash')
    .regex(/^\/[a-zA-Z0-9]+[-?=&/a-zA-Z0-9]*$/, 'No special characters except -?=& are allowed'),
});

export const AddTag = component$(
  ({
    showAddTag,
    tags,
    createdTags,
    courseData,
  }: {
    showAddTag: Signal<boolean>;
    tags: Tag[];
    createdTags: Tag[];
    courseData: NewContentIndex;
  }) => {
    const userRole = useUserLoader().value.role;
    const formData = useStore<Tag>({
      id: uuidv4(),
      name: '',
      slug: '',
      link: '/catalog?tag=',
      content_index_id: [],
      approved: false,
    });
    const formError = useStore({
      name: '',
      slug: '',
      link: '',
    });
    const ref = useSignal<HTMLInputElement>();
    const ref2 = useSignal<HTMLInputElement>();
    const loading = useSignal(false);

    const handleSubmit = $(async () => {
      loading.value = true;
      formError.name = '';
      formError.slug = '';
      formError.link = '';
      const result = addTagSchema.safeParse(formData);
      if (!result.success) {
        formError.name = result.error.formErrors.fieldErrors.name?.join('\n') || '';
        formError.slug = result.error.formErrors.fieldErrors.slug?.join('\n') || '';
        formError.link = result.error.formErrors.fieldErrors.link?.join('\n') || '';
        loading.value = false;
        return;
      }
      if (!formData.link.startsWith('/catalog') && !window.confirm('Are you sure you want to use a custom link?')) {
        loading.value = false;
        return;
      }
      const dup = await checkExistingTag(formData.slug);
      if (dup.length > 0 || createdTags.filter((tag) => tag.slug === formData.slug).length > 0) {
        formError.slug = 'Slug already exists!';
        loading.value = false;
        return;
      }
      const dup2 = await checkExistingTagLink(formData.link);
      if (dup2.length > 0 || createdTags.filter((tag) => tag.link === formData.link).length > 0) {
        formError.link = 'Link already exists!';
        loading.value = false;
        return;
      }
      // const ret = await addTagAction(formData);
      tags.push(formData);
      createdTags.push(formData);
      loading.value = false;
      showAddTag.value = false;
      if (courseData.tags!.length < 5) {
        courseData.tags!.push(formData.id);
      }
    });
    return (
      <div class="absolute left-0 top-0 z-10 flex h-[100vh] w-full items-center justify-center backdrop-blur-sm">
        <div class="relative flex w-[40vw] min-w-[350px] max-w-[600px] flex-col items-center justify-center gap-3 rounded-lg border-2 border-black bg-white py-16 dark:bg-highlight-dark">
          <button
            onClick$={() => (showAddTag.value = false)}
            class="absolute right-5 top-5 block p-1 text-[15px] text-primary-dark-gray dark:text-background-light-gray md:text-[20px]"
          >
            <LuX />
          </button>
          <h2 class="pb-3 text-center font-mosk text-[1.5rem] font-bold tracking-wider md:pb-6 md:text-[2rem]">
            Add Tag
          </h2>
          <div>
            <div>
              <label for="TagName" class="cursor-pointer text-base md:text-lg">
                Name
              </label>
              <div class="pt-1">
                <input
                  id="TagName"
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
                    formData.link = `/catalog?tag=${formData.slug}`;
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
              <label for="TagSlug" class="cursor-pointer text-base md:text-lg">
                Slug
              </label>
              <div class="pt-1">
                <input
                  ref={ref}
                  id="TagSlug"
                  name="slug"
                  type="text"
                  value={formData.slug}
                  disabled={userRole !== 'admin'}
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
                  disabled={userRole !== 'admin'}
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
            <br />
            <button
              type="button"
              onClick$={handleSubmit}
              class="block w-[250px] rounded-lg bg-primary-dark-gray p-2 text-background-light-gray dark:bg-primary-dark-gray md:w-[300px] md:p-4"
            >
              {loading.value && (
                <span>
                  <LoadingSVG />
                </span>
              )}
              {!loading.value && <span>Next</span>}
            </button>
          </div>
        </div>
      </div>
    );
  }
);

function remove_duplicates_safe(arr: any[]) {
  const seen: any = {};
  const ret_arr: any = [];
  for (let i = 0; i < arr.length; i++) {
    if (!(arr[i].id in seen)) {
      ret_arr.push(arr[i]);
      seen[arr[i].id] = true;
    }
  }
  return ret_arr;
}

export default component$(
  ({
    courseData,
    formSteps,
    createdTags,
    isEditing = false,
    isPublished = false,
  }: {
    courseData: NewContentIndex;
    formSteps: Signal<number>;
    createdTags: Tag[];
    isEditing?: boolean;
    isPublished?: boolean;
  }) => {
    const _tags = useTags().value.filter((_tag) => _tag.approved);
    const tags = useStore(() => {
      const t = [..._tags, ...createdTags];
      return remove_duplicates_safe(t) as Tag[];
    });
    const loading = useSignal(false);
    const showAddTag = useSignal(false);

    const handleDeleteTag = $(async (id: string) => {
      // const coursesWithTag = await checkExistingCourseFromTag(id);
      // if (coursesWithTag.length > 0) {
      //   return alert("Course(s) with tag exists! Please remove all courses with this tag first.");
      // }
      // await deleteTagAction(id);
      if (courseData.tags!.includes(id)) courseData.tags!.splice(courseData.tags!.indexOf(id), 1);
      const index = tags.findIndex((tag) => tag.id === id);
      const index2 = createdTags.findIndex((tag) => tag.id === id);
      createdTags.splice(index2, 1);
      tags.splice(index, 1);
      // return shouldAlert && alert("Tag deleted successfully.");
    });

    return (
      <div class="relative h-[100vh] w-[95vw] md:w-[80vw]">
        {showAddTag.value && (
          <AddTag createdTags={createdTags} showAddTag={showAddTag} tags={tags} courseData={courseData} />
        )}
        <section class="flex h-[100vh] w-[95vw] items-center justify-center bg-background-light-gray dark:bg-primary-dark-gray md:w-[80vw]">
          <div class="relative flex max-h-[90dvh] w-full items-start justify-center overflow-auto rounded-lg border-2 border-black bg-white py-16 dark:bg-highlight-dark md:w-[80%] lg:w-[60%] lg:min-w-[400px] lg:max-w-[700px]">
            <div
              class="absolute left-3 top-3 cursor-pointer text-[20px] text-primary-dark-gray dark:text-background-light-gray md:left-6 md:top-6 md:text-[25px]"
              onClick$={() => formSteps.value--}
            >
              <LuArrowLeft />
            </div>
            <div>
              <h1 class="px-4 pb-3 text-center font-mosk text-[1.5rem] font-bold tracking-wider md:pb-6 md:text-[2rem] lg:text-[2.5rem]">
                Choose tags (up to 5)
              </h1>
              <br />
              <div class="flex flex-col items-center justify-center space-y-6">
                <button
                  onClick$={() => {
                    if (isEditing && isPublished) return window.alert('Cannot create tags after publishing!');
                    showAddTag.value = true;
                  }}
                  class="w-[250px] rounded-md bg-primary-dark-gray px-4 py-2 text-[0.875rem] text-background-light-gray md:w-[300px] md:px-6 md:text-[1rem]"
                >
                  Add New Tag
                </button>
                {tags.length > 0 && (
                  <ul class="flex max-w-[500px] flex-wrap gap-2 px-6">
                    {tags.map((tag) => (
                      <li
                        onClick$={() => {
                          if (courseData.tags!.includes(tag.id))
                            courseData.tags!.splice(courseData.tags!.indexOf(tag.id), 1);
                          else if (courseData.tags!.length < 5) courseData.tags!.push(tag.id);
                        }}
                        key={`Tag${tag.id}`}
                        class={
                          'relative cursor-pointer rounded-lg border-2 border-primary-dark-gray bg-background-light-gray px-3 py-2 text-[0.875rem] transition-all hover:bg-primary-dark-gray hover:text-background-light-gray dark:bg-primary-dark-gray dark:hover:bg-background-light-gray dark:hover:text-primary-dark-gray md:px-4 md:py-3 md:text-[1rem] ' +
                          (courseData.tags!.includes(tag.id)
                            ? ' bg-primary-dark-gray text-background-light-gray  dark:!bg-background-light-gray dark:!text-tomato '
                            : '') +
                          (createdTags.find((tag2) => tag2.id === tag.id) && ' pr-10 md:pr-12')
                        }
                      >
                        <span>{tag.name}</span>
                        {createdTags.find((tag2) => tag2.id === tag.id) && (
                          <span
                            onClick$={(e) => {
                              e.stopPropagation();
                              handleDeleteTag(tag.id);
                            }}
                            class="absolute right-[6px] top-[50%] block translate-y-[-50%] rounded-md bg-tomato p-1 text-[12px] text-background-light-gray md:text-[15px]"
                          >
                            <LuTrash />
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
                <br />
                <div class="flex flex-col items-center justify-center gap-3">
                  <button
                    onClick$={() => formSteps.value++}
                    class="text-sm underline decoration-wavy underline-offset-[6px] md:text-base"
                  >
                    Skip for now
                  </button>
                  <button
                    onClick$={async () => {
                      loading.value = true;
                      formSteps.value++;
                      loading.value = false;
                    }}
                    type="button"
                    class="block w-[250px] rounded-lg bg-primary-dark-gray p-2 text-background-light-gray dark:bg-primary-dark-gray md:w-[300px] md:p-4"
                  >
                    {loading.value && (
                      <span>
                        <LoadingSVG />
                      </span>
                    )}
                    {!loading.value && <span class="text-[0.875rem] md:text-[1rem]">Next</span>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
);
