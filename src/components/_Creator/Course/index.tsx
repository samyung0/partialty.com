/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import type { NoSerialize, QRL, Signal } from "@builder.io/qwik";
import { $, component$, useComputed$, useSignal, useStore, useTask$ } from "@builder.io/qwik";
import { server$, useNavigate, z } from "@builder.io/qwik-city";
import {
  FaLockOpenSolid,
  FaLockSolid,
  FaPenToSquareRegular,
  FaSlidersSolid,
  FaTrashSolid,
} from "@qwikest/icons/font-awesome";
import { IoCaretDown } from "@qwikest/icons/ionicons";
import {
  LuAlertTriangle,
  LuArrowRight,
  LuBan,
  LuCheck,
  LuEye,
  LuEyeOff,
  LuGem,
  LuHourglass,
  LuInfo,
  LuLock,
  LuUnlock,
  LuX,
} from "@qwikest/icons/lucide";
import { and, eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

import { isServer } from "@builder.io/qwik/build";
import LoadingSVG from "~/components/LoadingSVG";
import { useUserLoader } from "~/routes/[lang.]/(wrapper)/(authRoutes)/layout";
import drizzleClient from "~/utils/drizzleClient";
import getSQLTimeStamp from "~/utils/getSQLTimeStamp";
import type { Content, NewContent } from "../../../../drizzle_turso/schema/content";
import { content } from "../../../../drizzle_turso/schema/content";
import type { ContentCategory } from "../../../../drizzle_turso/schema/content_category";
import { content_index, type ContentIndex } from "../../../../drizzle_turso/schema/content_index";
import type { CourseApproval } from "../../../../drizzle_turso/schema/course_approval";
import { course_approval } from "../../../../drizzle_turso/schema/course_approval";
import { type Profiles } from "../../../../drizzle_turso/schema/profiles";
import type { Tag } from "../../../../drizzle_turso/schema/tag";
import { displayNamesLang, listSupportedLang } from "../../../../lang";

export const getChapters = server$(async (courseId: string) => {
  return await drizzleClient().select().from(content).where(eq(content.index_id, courseId));
});

const deleteCourse = server$(async (courseId: string) => {
  await drizzleClient()
    .update(content_index)
    .set({ is_deleted: true, updated_at: getSQLTimeStamp() })
    .where(eq(content_index.id, courseId));
  // DO NOT DELETE the course, it will fail due to foreign key constraints, instead set the delete flag
});

const deleteChapter = server$(async (chapterId: string) => {
  await drizzleClient()
    .update(content)
    .set({ is_deleted: true, updated_at: getSQLTimeStamp() })
    .where(eq(content.id, chapterId));
  // DO NOT DELETE the course, it will fail due to foreign key constraints, instead set the delete flag
});

const createChapter = server$(async (newChapter: NewContent, chapter_order: string[]) => {
  return await drizzleClient().transaction(async (tx) => {
    await tx
      .update(content_index)
      .set({ chapter_order, updated_at: getSQLTimeStamp() })
      .where(eq(content_index.id, newChapter.index_id));
    return await tx.insert(content).values(newChapter).returning();
  });
});

const saveChapter = server$(async (newChapter: Content) => {
  return await drizzleClient()
    .update(content)
    .set(newChapter)
    .where(eq(content.id, newChapter.id))
    .returning();
});

const checkExistingChapter = server$(async (slug: string, courseId: string) => {
  return await drizzleClient()
    .select({ id: content.id })
    .from(content)
    .where(
      and(eq(content.slug, slug), eq(content.index_id, courseId), eq(content.is_deleted, false))
    );
});

const checkExistingChapterLink = server$(async (link: string) => {
  return await drizzleClient()
    .select({ id: content.id })
    .from(content)
    .where(and(eq(content.link, link), eq(content.is_deleted, false)));
});

const addCategorySchema = z.object({
  name: z.string().min(1, "A name is required").max(35, "Name is too long (max. 35 chars)"),
  slug: z
    .string()
    .min(2, "A slug is required")
    .regex(/^[a-za-z0-9]+.*[a-za-z0-9]+$/, "The slug must start and end with characters!")
    .regex(
      /^[a-za-z0-9]+[-a-za-z0-9]*[a-za-z0-9]+$/,
      "No special characters except hyphens are allowed"
    ),
  link: z
    .string()
    .min(1, "A link is required")
    .regex(/^\//, "The link needs to start with a slash")
    .regex(/^\/[a-za-z0-9]+[-/a-za-z0-9]*$/, "No special characters except -/ are allowed"),
});

const publishCourse = server$(async (courseId: string) => {
  await drizzleClient()
    .update(course_approval)
    .set({ ready_for_approval: true, updated_at: getSQLTimeStamp() })
    .where(eq(course_approval.course_id, courseId));
});

const amendCourse = server$(async (courseId: string) => {
  await drizzleClient()
    .update(course_approval)
    .set({ status: "pending", updated_at: getSQLTimeStamp() })
    .where(eq(course_approval.course_id, courseId));
});

const unpublishCourse = server$(async (courseId: string) => {
  await drizzleClient()
    .update(course_approval)
    .set({ ready_for_approval: false, status: "pending", updated_at: getSQLTimeStamp() })
    .where(eq(course_approval.course_id, courseId));
});

const unlockChapter = server$(async (chapterId: string) => {
  await drizzleClient().update(content).set({ is_locked: false }).where(eq(content.id, chapterId));
});

const lockChapter = server$(async (chapterId: string) => {
  await drizzleClient().update(content).set({ is_locked: true }).where(eq(content.id, chapterId));
});

const unlockCourse = server$(async (courseId: string) => {
  await drizzleClient()
    .update(content_index)
    .set({ is_locked: false })
    .where(eq(content_index.id, courseId));
});

const lockCourse = server$(async (courseId: string) => {
  await drizzleClient()
    .update(content_index)
    .set({ is_locked: true })
    .where(eq(content_index.id, courseId));
});

export const AddChapter = component$(
  ({
    showAddChapter,
    courseId,
    courseChapters,
    courseSlug,
    callBackOnCreate,
  }: {
    showAddChapter: Signal<boolean>;
    courseId: Signal<string>;
    courseChapters: Signal<string[]>;
    courseSlug: Signal<string>;
    callBackOnCreate: QRL<(course: Content) => any>;
  }) => {
    const id = useSignal(uuidv4());
    const user = useUserLoader().value;
    const formData = useStore<NewContent>({
      id: id.value,
      name: "",
      slug: "",
      link: `/courses/${courseSlug.value}/chapters/`,
      index_id: courseId.value,
      renderedHTML: null,
      content_slate: null,
      is_locked: false,
      is_premium: false,
      audio_track_playback_id: null,
      audio_track_asset_id: null,
    });
    const formError = useStore({
      name: "",
      slug: "",
      link: "",
    });
    const ref = useSignal<HTMLInputElement>();
    const ref2 = useSignal<HTMLInputElement>();
    const loading = useSignal(false);

    const handleSubmit = $(async () => {
      if (loading.value) return;
      loading.value = true;
      formError.name = "";
      formError.slug = "";
      formError.link = "";
      const result = addCategorySchema.safeParse(formData);
      if (!result.success) {
        formError.name = result.error.formErrors.fieldErrors.name?.join("\n") || "";
        formError.slug = result.error.formErrors.fieldErrors.slug?.join("\n") || "";
        formError.link = result.error.formErrors.fieldErrors.link?.join("\n") || "";
        loading.value = false;
        return;
      }
      if (
        !formData.link!.startsWith("/courses") &&
        !window.confirm("Are you sure you want to use a custom link?")
      ) {
        loading.value = false;
        return;
      }
      const dup = await checkExistingChapter(formData.slug!, courseId.value);
      if (dup.length > 0) {
        formError.slug = "Slug already exists!";
        loading.value = false;
        return;
      }
      const dup2 = await checkExistingChapterLink(formData.link!);
      if (dup2.length > 0) {
        formError.link = "Link already exists!";
        loading.value = false;
        return;
      }
      try {
        const chapter = await createChapter(formData, [...courseChapters.value, id.value]);
        await callBackOnCreate(chapter[0]);
        loading.value = false;
        showAddChapter.value = false;
      } catch (e) {
        console.error(e);
        loading.value = false;
        showAddChapter.value = false;
        alert("An error occured. Please try refreshing the page or contact support.");
        return;
      }
    });
    return (
      <div class="z-100 fixed left-0 top-0 flex h-[100vh] w-full items-center justify-center backdrop-blur-sm">
        <div class="relative flex w-[40vw] min-w-[400px] max-w-[600px] flex-col items-center justify-center gap-3 rounded-lg border-2 border-black bg-white py-16 dark:bg-highlight-dark">
          <button
            onClick$={() => (showAddChapter.value = false)}
            class="absolute right-5 top-5 block p-1 text-[20px] text-primary-dark-gray dark:text-background-light-gray"
          >
            <LuX />
          </button>
          <h2 class="pb-6 text-center font-mosk text-[2rem] font-bold tracking-wider">
            Add Chapter
          </h2>
          <form preventdefault:submit onsubmit$={() => handleSubmit()}>
            <div>
              <label for="categoryName" class="cursor-pointer text-lg">
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
                    formData.name = el.value;
                    formData.slug = el.value.toLowerCase().replace(/ /g, "-");
                    formData.link = `/courses/${courseSlug.value}/chapters/${formData.slug}/`;
                    if (ref.value) ref.value.scrollLeft += 99999;
                    if (ref2.value) ref2.value.scrollLeft += 99999;
                  }}
                  required
                  class={
                    "w-[300px] rounded-md border-2 px-3 py-2 dark:border-background-light-gray  dark:bg-highlight-dark dark:text-background-light-gray dark:disabled:border-disabled-dark dark:disabled:bg-disabled-dark " +
                    (formError.name ? "border-tomato dark:border-tomato" : "border-black/10")
                  }
                />
              </div>
              <p class="w-[300px] whitespace-pre-wrap break-words pt-1 tracking-wide text-tomato">
                {formError.name}
              </p>
            </div>
            <div>
              <label for="categorySlug" class="cursor-pointer text-lg">
                Slug
              </label>
              <div class="pt-1">
                <input
                  ref={ref}
                  id="categorySlug"
                  name="slug"
                  type="text"
                  disabled={user.role !== "admin"}
                  value={formData.slug}
                  onInput$={(_, el) => {
                    formData.slug = el.value;
                  }}
                  required
                  class={
                    "w-[300px] rounded-md border-2 px-3 py-2 dark:border-background-light-gray  dark:bg-highlight-dark dark:text-background-light-gray dark:disabled:border-disabled-dark dark:disabled:bg-disabled-dark " +
                    (formError.slug ? "border-tomato dark:border-tomato" : "border-black/10")
                  }
                />
              </div>
              <p class="w-[300px] whitespace-pre-wrap break-words pt-1 tracking-wide text-tomato">
                {formError.slug}
              </p>
            </div>
            <div>
              <label for="categorLink" class="cursor-pointer text-lg">
                Link
              </label>
              <div class="pt-1">
                <input
                  ref={ref2}
                  id="categorLink"
                  name="link"
                  type="text"
                  disabled={user.role !== "admin"}
                  value={formData.link}
                  onInput$={(_, el) => {
                    formData.link = el.value;
                  }}
                  required
                  class={
                    "w-[300px] rounded-md border-2 px-3 py-2 dark:border-background-light-gray  dark:bg-highlight-dark dark:text-background-light-gray dark:disabled:border-disabled-dark dark:disabled:bg-disabled-dark " +
                    (formError.link ? "border-tomato dark:border-tomato" : "border-black/10")
                  }
                />
              </div>
              <p class="w-[300px] whitespace-pre-wrap break-words pt-1 tracking-wide text-tomato">
                {formError.link}
              </p>
            </div>
            {user.role === "admin" && (
              <>
                <br />
                <div>
                  <label
                    title="The course is only accessible to subscribed users if checked."
                    for="subscriptionRequired"
                    class="flex cursor-pointer items-center gap-5   text-lg"
                  >
                    <span class="flex items-center gap-2">
                      <span class="text-[20px] text-primary-dark-gray dark:text-background-light-gray">
                        <LuGem />
                      </span>
                      Subscription Required
                    </span>
                    <input
                      id="subscriptionRequired"
                      type="checkbox"
                      class="h-4 w-4"
                      checked={formData.is_premium}
                      onChange$={(e, currentTarget) =>
                        (formData.is_premium = currentTarget.checked)
                      }
                    />
                  </label>
                </div>
                <br />
              </>
            )}
            <br />
            <button
              type="submit"
              class="block w-[300px] rounded-lg bg-primary-dark-gray p-4 text-background-light-gray dark:bg-primary-dark-gray"
            >
              {loading.value && (
                <span>
                  <LoadingSVG />
                </span>
              )}
              {!loading.value && <span>Submit</span>}
            </button>
          </form>
        </div>
      </div>
    );
  }
);

export const EditChapter = component$(
  ({
    showEditChapter,
    courseId,
    callBackOnSave,
    courseData,
    courseSlug,
  }: {
    showEditChapter: Signal<boolean>;
    courseId: Signal<string>;
    callBackOnSave: QRL<(course: Content) => any>;
    courseData: Content;
    courseSlug: Signal<string>;
  }) => {
    const user = useUserLoader().value;
    const formData = useStore(() => Object.assign({}, courseData));
    const formError = useStore({
      name: "",
      slug: "",
      link: "",
    });
    const ref = useSignal<HTMLInputElement>();
    const ref2 = useSignal<HTMLInputElement>();
    const loading = useSignal(false);

    const handleSubmit = $(async () => {
      if (loading.value) return;
      loading.value = true;
      formError.name = "";
      formError.slug = "";
      formError.link = "";
      const result = addCategorySchema.safeParse(formData);
      if (!result.success) {
        formError.name = result.error.formErrors.fieldErrors.name?.join("\n") || "";
        formError.slug = result.error.formErrors.fieldErrors.slug?.join("\n") || "";
        formError.link = result.error.formErrors.fieldErrors.link?.join("\n") || "";
        loading.value = false;
        return;
      }
      if (
        !formData.link!.startsWith("/courses") &&
        !window.confirm("Are you sure you want to use a custom link?")
      ) {
        loading.value = false;
        return;
      }
      const dup = await checkExistingChapter(formData.slug!, courseId.value);
      if (dup.filter((content) => content.id !== formData.id).length > 0) {
        formError.slug = "Slug already exists!";
        loading.value = false;
        return;
      }
      const dup2 = await checkExistingChapterLink(formData.link!);
      if (dup2.filter((content) => content.id !== formData.id).length > 0) {
        formError.link = "Link already exists!";
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
        alert("An error occured. Please try refreshing the page or contact support.");
        return;
      }
    });
    return (
      <div class="z-100 fixed left-0 top-0 flex h-[100vh] w-full items-center justify-center backdrop-blur-sm">
        <div class="relative flex w-[40vw] min-w-[400px] max-w-[600px] flex-col items-center justify-center gap-3 rounded-lg border-2 border-black bg-white py-16 dark:bg-highlight-dark">
          <button
            onClick$={() => (showEditChapter.value = false)}
            class="absolute right-5 top-5 block p-1 text-[20px] text-primary-dark-gray dark:text-background-light-gray"
          >
            <LuX />
          </button>
          <h2 class="pb-6 text-center font-mosk text-[2rem] font-bold tracking-wider">
            Edit Chapter
          </h2>
          <form preventdefault:submit onsubmit$={() => handleSubmit()}>
            <div>
              <label for="categoryName" class="cursor-pointer text-lg">
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
                    formData.name = el.value;
                    formData.slug = el.value.toLowerCase().replace(/ /g, "-");
                    formData.link = `/courses/${courseSlug.value}/chapters/${formData.slug}/`;
                    if (ref.value) ref.value.scrollLeft += 99999;
                    if (ref2.value) ref2.value.scrollLeft += 99999;
                  }}
                  required
                  class={
                    "w-[300px] rounded-md border-2 px-3 py-2 dark:border-background-light-gray  dark:bg-highlight-dark dark:text-background-light-gray dark:disabled:border-disabled-dark dark:disabled:bg-disabled-dark " +
                    (formError.name ? "border-tomato dark:border-tomato" : "border-black/10")
                  }
                />
              </div>
              <p class="w-[300px] whitespace-pre-wrap break-words pt-1 tracking-wide text-tomato">
                {formError.name}
              </p>
            </div>
            <div>
              <label for="categorySlug" class="cursor-pointer text-lg">
                Slug
              </label>
              <div class="pt-1">
                <input
                  ref={ref}
                  id="categorySlug"
                  name="slug"
                  type="text"
                  disabled={user.role !== "admin"}
                  value={formData.slug}
                  onInput$={(_, el) => {
                    formData.slug = el.value;
                  }}
                  required
                  class={
                    "w-[300px] rounded-md border-2 px-3 py-2 dark:border-background-light-gray  dark:bg-highlight-dark dark:text-background-light-gray dark:disabled:border-disabled-dark dark:disabled:bg-disabled-dark " +
                    (formError.slug ? "border-tomato dark:border-tomato" : "border-black/10")
                  }
                />
              </div>
              <p class="w-[300px] whitespace-pre-wrap break-words pt-1 tracking-wide text-tomato">
                {formError.slug}
              </p>
            </div>
            <div>
              <label for="categorLink" class="cursor-pointer text-lg">
                Link
              </label>
              <div class="pt-1">
                <input
                  ref={ref2}
                  id="categorLink"
                  name="link"
                  type="text"
                  disabled={user.role !== "admin"}
                  value={formData.link}
                  onInput$={(_, el) => {
                    formData.link = el.value;
                  }}
                  required
                  class={
                    "w-[300px] rounded-md border-2 px-3 py-2 dark:border-background-light-gray  dark:bg-highlight-dark dark:text-background-light-gray dark:disabled:border-disabled-dark dark:disabled:bg-disabled-dark " +
                    (formError.link ? "border-tomato dark:border-tomato" : "border-black/10")
                  }
                />
              </div>
              <p class="w-[300px] whitespace-pre-wrap break-words pt-1 tracking-wide text-tomato">
                {formError.link}
              </p>
            </div>
            {user.role === "admin" && (
              <>
                <br />
                <div>
                  <label
                    title="The course is only accessible to subscribed users if checked."
                    for="subscriptionRequired"
                    class="flex cursor-pointer items-center gap-5   text-lg"
                  >
                    <span class="flex items-center gap-2">
                      <span class="text-[20px] text-primary-dark-gray dark:text-background-light-gray">
                        <LuGem />
                      </span>
                      Subscription Required
                    </span>
                    <input
                      id="subscriptionRequired"
                      type="checkbox"
                      class="h-4 w-4"
                      checked={formData.is_premium}
                      onChange$={(e, currentTarget) =>
                        (formData.is_premium = currentTarget.checked)
                      }
                    />
                  </label>
                </div>
                <br />
              </>
            )}
            <br />
            <button
              type="submit"
              class="block w-[300px] rounded-lg bg-primary-dark-gray p-4 text-background-light-gray dark:bg-primary-dark-gray"
            >
              {loading.value && (
                <span>
                  <LoadingSVG />
                </span>
              )}
              {!loading.value && <span>Save</span>}
            </button>
          </form>
        </div>
      </div>
    );
  }
);

export default component$(
  ({
    ws,
    userAccessibleCourseWrite,
    userAccessibleCourseWriteResolved,
    tags,
    categories,
    courseIdToEditingUser,
  }: {
    ws: Signal<NoSerialize<WebSocket>>;
    userAccessibleCourseWrite: Signal<string[]>;
    userAccessibleCourseWriteResolved: Signal<
      {
        content_index: ContentIndex;
        profiles: Profiles;
        course_approval: CourseApproval;
      }[]
    >;
    tags: Tag[];
    categories: ContentCategory[];
    courseIdToEditingUser: Record<string, [string, string]>;
  }) => {
    const nav = useNavigate();
    const user = useUserLoader().value;
    const courses = useStore(() =>
      Object.fromEntries(
        userAccessibleCourseWriteResolved.value.map(
          ({ content_index, profiles, course_approval }) => {
            return [
              content_index.id,
              Object.assign({}, content_index, {
                isOpen: false,
                chapters: [] as Content[],
                isLoadingChapter: false,
                hasLoadedChapter: false,
                profile: profiles,
                chaptersMap: {} as Record<string, { isDeleting: boolean }>,
                courseApproval: course_approval,
                isPublishing: false,
              }),
            ];
          }
        )
      )
    );
    useTask$(({ track }) => {
      track(userAccessibleCourseWriteResolved);
      if (isServer) return;
      const keys = Object.keys(courses);
      userAccessibleCourseWriteResolved.value.forEach(
        async ({ content_index, profiles, course_approval }) => {
          keys.splice(keys.indexOf(content_index.id), 1);
          const isOpen = courses[content_index.id]?.isOpen || false;
          if (isOpen) {
            const chapters = await getChapters(content_index.id);
            courses[content_index.id] = Object.assign({}, content_index, {
              isOpen: true,
              chapters,
              isLoadingChapter: courses[content_index.id]?.isLoadingChapter || false,
              hasLoadedChapter: true,
              profile: profiles,
              chaptersMap: Object.fromEntries(
                chapters.map((c) => [
                  c.id,
                  {
                    isDeleting: false,
                  },
                ])
              ),
              courseApproval: course_approval,
              isPublishing: courses[content_index.id]?.isPublishing || false,
            });
          } else {
            courses[content_index.id] = Object.assign({}, content_index, {
              isOpen: false,
              chapters: [],
              isLoadingChapter: courses[content_index.id]?.isLoadingChapter || false,
              hasLoadedChapter: false,
              profile: profiles,
              chaptersMap: {},
              courseApproval: course_approval,
              isPublishing: courses[content_index.id]?.isPublishing || false,
            });
          }
        }
      );
      for (const i of keys) {
        delete courses[i];
      }
    });

    const displayCourses = useComputed$(() =>
      Object.values(courses).toSorted(
        (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      )
    );

    const isDeletingChapterCallback = useSignal<QRL<() => any> | undefined>(undefined);
    const isDeletingChapterCallbackErr = useSignal<QRL<() => any> | undefined>(undefined);
    const isDeletingChapterTimeout = useSignal<any>();

    const isDeletingChapterIndex = useSignal("");
    const isDeletingChapterIndexCallback = useSignal<QRL<() => any> | undefined>(undefined);
    const isDeletingChapterIndexTimeout = useSignal<any>();

    const showAddChapter = useSignal(false);
    const showAddCourseId = useSignal("");
    const showAddCourseChapters = useComputed$<string[]>(() =>
      showAddCourseId.value === "" ? [] : courses[showAddCourseId.value].chapter_order
    );
    const showAddCourseSlug = useComputed$<string>(() =>
      showAddCourseId.value === "" ? "" : courses[showAddCourseId.value].slug
    );

    const showEditChapter = useSignal(false);
    const showEditChapterId = useSignal("");
    const showEditCourseId = useSignal("");
    const showEditCourseData = useComputed$(() => {
      if (showEditCourseId.value === "" || showEditChapterId.value === "") return undefined;
      return courses[showEditCourseId.value].chapters.find((c) => c.id === showEditChapterId.value);
    });
    const showEditCourseSlug = useComputed$<string>(() =>
      showEditChapterId.value === "" ? "" : courses[showEditCourseId.value].slug
    );

    useTask$(({ track }) => {
      track(ws);
      if (!ws.value) return;

      ws.value.addEventListener("message", ({ data }) => {
        try {
          const d = JSON.parse(data);
          if (d.type === "deleteContentSuccess") {
            if (!isDeletingChapterCallback.value) return;
            isDeletingChapterCallback.value();
            isDeletingChapterCallback.value = undefined;
            isDeletingChapterCallbackErr.value = undefined;
            clearTimeout(isDeletingChapterTimeout.value);
            return;
          }
          if (d.type === "deleteContentError") {
            alert(d.message);
            if (isDeletingChapterCallbackErr.value) isDeletingChapterCallbackErr.value();
            isDeletingChapterCallback.value = undefined;
            isDeletingChapterCallbackErr.value = undefined;
            clearTimeout(isDeletingChapterTimeout.value);
            return;
          }
          if (d.type === "deleteContentIndexSuccess") {
            if (!isDeletingChapterIndexCallback.value) return;
            isDeletingChapterIndexCallback.value();
            isDeletingChapterIndexCallback.value = undefined;
            clearTimeout(isDeletingChapterIndexTimeout.value);
            return;
          }
          if (d.type === "deleteContentIndexError") {
            alert(d.message);
            isDeletingChapterIndex.value = "";
            isDeletingChapterIndexCallback.value = undefined;
            clearTimeout(isDeletingChapterIndexTimeout.value);
            return;
          }
          if (
            d.type === "contentDeleted" ||
            d.type === "contentIndexDeleted" ||
            d.type === "contentIndexDetailsEdited" ||
            d.type === "chapterCreated" ||
            d.type === "contentCreated" ||
            d.type === "contentLocked" ||
            d.type === "contentIndexLocked" ||
            d.type === "contentIndexUnlocked" ||
            d.type === "contentUnlocked" ||
            d.type === "contentDetailsEdited"
          ) {
            nav();
            return;
          }
        } catch (e) {
          console.error(e);
        }
      });
    });

    const handleDeleteContentIndex = $(async (courseId: string) => {
      if (isDeletingChapterIndex.value || !ws.value) return;
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!courses[courseId])
        return alert("Something went wrong! Please refresh the page and try again.");
      if (!window.confirm("Are you sure you want to delete this course?")) return;
      isDeletingChapterIndex.value = courseId;
      isDeletingChapterIndexCallback.value = $(async () => {
        try {
          await deleteCourse(courseId);
        } catch (e) {
          console.error(e);
          return alert(
            "An error occurred! Please refresh the page and try again or contact support."
          );
        }
        isDeletingChapterIndex.value = "";
        ws.value?.send(
          JSON.stringify({
            type: "deleteContentIndexCB",
            courseId,
          })
        );
      });
      isDeletingChapterIndexTimeout.value = setTimeout(() => {
        alert("Server Timeout! Please try again later or contact support.");
        isDeletingChapterIndexCallback.value = undefined;
        isDeletingChapterIndex.value = "";
      }, 7000);
      ws.value.send(
        JSON.stringify({
          type: "deleteContentIndex",
          userId: user.userId,
          courseId,
          contentId: courses[courseId].chapter_order,
        })
      );
    });

    const refreshChapters = $(async (id: string) => {
      courses[id].isLoadingChapter = true;
      const chapters = await getChapters(id);
      courses[id].chapters = chapters;
      courses[id].chaptersMap = Object.fromEntries(
        chapters.map((c) => [
          c.id,
          {
            isDeleting: false,
          },
        ])
      );
      courses[id].isLoadingChapter = false;
      courses[id].hasLoadedChapter = true;
    });

    const handleDeleteContent = $(async (chapterId: string, courseId: string) => {
      if (courses[courseId].chaptersMap[chapterId].isDeleting || !ws.value) return;

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!courses[courseId])
        return alert("Something went wrong! Please refresh the page and try again.");
      if (!window.confirm("Are you sure you want to delete this chapter?")) return;
      courses[courseId].chaptersMap[chapterId].isDeleting = true;
      isDeletingChapterCallback.value = $(async () => {
        try {
          await deleteChapter(chapterId);
          ws.value?.send(
            JSON.stringify({
              type: "deleteContentCB",
              courseId,
              contentId: chapterId,
            })
          );
          // courses[courseId].chaptersMap[chapterId].isDeleting = false;
          // refreshChapters(courseId);
        } catch (e) {
          console.error(e);
          return alert(
            "An error occurred! Please refresh the page and try again or contact support."
          );
        }
      });
      isDeletingChapterCallbackErr.value = $(() => {
        courses[courseId].chaptersMap[chapterId].isDeleting = false;
      });
      isDeletingChapterTimeout.value = setTimeout(() => {
        alert("Server Timeout! Please try again later or contact support.");
        isDeletingChapterCallback.value = undefined;
        if (isDeletingChapterCallbackErr.value) isDeletingChapterCallbackErr.value();
        isDeletingChapterCallbackErr.value = undefined;
      }, 7000);
      ws.value.send(
        JSON.stringify({
          type: "deleteContent",
          userId: user.userId,
          courseId,
          contentId: chapterId,
        })
      );
    });

    const handlePublish = $(async (courseId: string) => {
      if (!window.confirm("Are you sure you want to publish this course?")) return;

      if (courses[courseId].isPublishing) return;
      courses[courseId].isPublishing = true;
      try {
        await publishCourse(courseId);
        courses[courseId].courseApproval.ready_for_approval = true;
      } catch (e) {
        console.error(e);
        alert("Something went wrong! Please refresh the page and try again or contact support!");
      }
      courses[courseId].isPublishing = false;
    });

    const handleAmendment = $(async (courseId: string) => {
      if (!window.confirm("Are you sure you want to re-publish this course?")) return;

      if (courses[courseId].isPublishing) return;
      courses[courseId].isPublishing = true;
      try {
        await amendCourse(courseId);
        courses[courseId].courseApproval.ready_for_approval = true;
      } catch (e) {
        console.error(e);
        alert("Something went wrong! Please refresh the page and try again or contact support!");
      }
      courses[courseId].isPublishing = false;
    });

    const handleUnpublish = $(async (courseId: string) => {
      if (!window.confirm("Are you sure you want to unpublish this course?")) return;

      if (courses[courseId].isPublishing) return;
      courses[courseId].isPublishing = true;
      try {
        await unpublishCourse(courseId);
        courses[courseId].courseApproval.ready_for_approval = false;
      } catch (e) {
        console.error(e);
        alert("Something went wrong! Please refresh the page and try again or contact support!");
      }
      courses[courseId].isPublishing = false;
    });

    const handleLockUnlockChapter = $(
      async (chapterId: string, courseId: string, userId: string) => {
        if (!courses[courseId])
          return alert("Something went wrong! Please refresh the page and try again.");
        if (courses[courseId].profile.id !== userId)
          return alert("You do not have permission to lock/unlock the course!");
        const chapter = courses[courseId].chapters.find((chapter) => chapter.id === chapterId);
        if (!chapter) return alert("Something went wrong! Please refresh the page and try again.");
        if (chapter.is_locked) {
          await unlockChapter(chapterId);
          ws.value?.send(
            JSON.stringify({
              type: "unlockContent",
              contentId: chapterId,
              courseId,
              userId,
            })
          );
        } else {
          if (
            courseIdToEditingUser[chapterId] &&
            !window.confirm(
              "Are you sure you want to lock this chapter? Someone is already editing it and all changes will be lost."
            )
          )
            return;
          else if (
            !window.confirm(
              "Are you sure you wnat to lock this chapter? Only you will be able to edit this chapter."
            )
          )
            return;
          await lockChapter(chapterId);
          ws.value?.send(
            JSON.stringify({
              type: "lockContent",
              contentId: chapterId,
              courseId,
              userId,
            })
          );
        }
      }
    );

    const handleLockUnlockCourse = $(async (courseId: string, userId: string) => {
      if (!courses[courseId])
        return alert("Something went wrong! Please refresh the page and try again.");
      if (courses[courseId].profile.id !== userId)
        return alert("You do not have permission to lock/unlock the course!");
      if (courses[courseId].is_locked) {
        await unlockCourse(courseId);
        ws.value?.send(
          JSON.stringify({
            type: "unlockContentIndex",
            contentId: courses[courseId].chapter_order,
            courseId,
            userId,
          })
        );
      } else {
        const isEditing = courses[courseId].chapter_order.filter(
          (id) => !!courseIdToEditingUser[id]
        );
        if (
          isEditing.length > 0 &&
          !window.confirm(
            "Are you sure you want to lock this course? Someone is already editing it and all changes will be lost."
          )
        )
          return;
        else if (
          !window.confirm(
            "Are you sure you wnat to lock this course? Only you will be able to edit this course."
          )
        )
          return;
        await lockCourse(courseId);
        ws.value?.send(
          JSON.stringify({
            type: "lockContentIndex",
            contentId: courses[courseId].chapter_order,
            courseId,
            userId,
          })
        );
      }
    });

    const handleEditChapter = $((chapterId: string, courseId: string) => {
      if (courseIdToEditingUser[chapterId]) {
        return alert("Someone is already editing this chapter!");
      }
      if (
        courses[courseId].is_locked &&
        user.role !== "admin" &&
        courses[courseId].author !== user.userId
      ) {
        return alert("This course is locked!");
      }
      window.open(`/contenteditor?courseId=${courseId}&chapterId=${chapterId}`);
    });

    return (
      <>
        {showAddChapter.value && showAddCourseId.value && (
          <AddChapter
            showAddChapter={showAddChapter}
            courseId={showAddCourseId}
            courseChapters={showAddCourseChapters}
            courseSlug={showAddCourseSlug}
            callBackOnCreate={$((chapter) => {
              // courses[showAddCourseId.value].chapter_order.push(chapter.id);
              // refreshChapters(showAddCourseId.value);
              ws.value?.send(
                JSON.stringify({
                  type: "createChapter",
                  courseId: showAddCourseId.value,
                  chapterId: chapter.id,
                  details: chapter,
                })
              );
            })}
          />
        )}
        {showEditChapter.value &&
          showEditChapterId.value &&
          showEditCourseId.value &&
          showEditCourseData.value && (
            <EditChapter
              showEditChapter={showEditChapter}
              courseId={showEditCourseId}
              callBackOnSave={$((chapter) => {
                // refreshChapters(showEditCourseId.value);
                ws.value?.send(
                  JSON.stringify({
                    type: "editContentDetails",
                    courseId: showEditCourseId.value,
                    chapterId: showEditChapterId.value,
                    details: chapter,
                  })
                );
              })}
              courseData={showEditCourseData.value}
              courseSlug={showEditCourseSlug}
            />
          )}
        <div class="mx-auto flex w-[80%] flex-col">
          <h1 class="font-mosk text-3xl font-bold tracking-wide">Your Courses</h1>
          <div class="mt-3 h-[2px] w-full bg-primary-dark-gray dark:bg-background-light-gray"></div>
          <div class="mt-6">
            <a
              target="_blank"
              href={"/creator/create-course/"}
              class="inline-block rounded-lg bg-primary-dark-gray px-6 py-3 text-background-light-gray shadow-lg dark:bg-highlight-dark "
            >
              Create New Course
            </a>
          </div>
          <section>
            {!ws.value && (
              <span class="mt-6 inline-block">
                <LoadingSVG />
              </span>
            )}
            {ws.value && (
              <>
                {displayCourses.value.length === 0 && (
                  <p class="mt-6">You have not created any courses yet. ヾ(•ω•`)o</p>
                )}
                {displayCourses.value.length > 0 && (
                  <ul class="flex flex-col gap-2 py-6">
                    {displayCourses.value.map((currentCourse) => {
                      const displayChapters = courses[currentCourse.id].chapter_order.filter(
                        (chapter) => {
                          const t = courses[currentCourse.id].chapters.find(
                            (c) => c.id === chapter
                          );
                          return t && !t.is_deleted;
                        }
                      );
                      return (
                        <li
                          class={
                            "flex flex-col rounded-xl border-2 border-primary-dark-gray bg-background-light-gray px-6 py-3 dark:bg-highlight-dark dark:text-background-light-gray"
                          }
                          key={`currentCourses${currentCourse.slug}`}
                        >
                          <div
                            onClick$={() => {
                              courses[currentCourse.id].isOpen = !courses[currentCourse.id].isOpen;
                              if (courses[currentCourse.id].hasLoadedChapter) return;
                              refreshChapters(currentCourse.id);
                            }}
                            class="flex cursor-pointer items-center justify-between"
                          >
                            <div class="flex flex-col gap-1">
                              <h2 class="text-lg font-bold tracking-wide">
                                {courses[currentCourse.id].name}
                              </h2>
                              <p class="flex items-center gap-2">
                                <span class="text-sm tracking-wide">
                                  {new Date(courses[currentCourse.id].updated_at).toDateString()},{" "}
                                  {
                                    displayNamesLang[
                                      courses[currentCourse.id]
                                        .lang as keyof typeof displayNamesLang
                                    ]
                                  }
                                </span>
                                <span>
                                  <img
                                    src={currentCourse.profile.avatar_url}
                                    alt=""
                                    width={20}
                                    height={20}
                                    class="rounded-full"
                                  />
                                </span>
                              </p>
                            </div>
                            <div class="flex items-center gap-2">
                              {currentCourse.is_single_page && (
                                <div class="flex items-center gap-3">
                                  {!!courseIdToEditingUser[currentCourse.chapter_order[0]] && (
                                    <span>
                                      <img
                                        src={
                                          courseIdToEditingUser[currentCourse.chapter_order[0]][1]
                                        }
                                        alt=""
                                        width={30}
                                        height={30}
                                        class="rounded-full"
                                      />
                                    </span>
                                  )}
                                  <a
                                    class="rounded-lg bg-primary-dark-gray px-6 py-3 text-background-light-gray shadow-md"
                                    href={`/contenteditor?courseId=${currentCourse.id}&chapterId=${
                                      courses[currentCourse.id].chapter_order[0]
                                    }`}
                                    target="_blank"
                                  >
                                    Edit Content
                                  </a>
                                </div>
                              )}
                              <button class="p-2">
                                <span
                                  style={{
                                    transform: courses[currentCourse.id].isOpen
                                      ? "rotateZ(180deg)"
                                      : "",
                                  }}
                                  class={
                                    "inline-block text-[15px] text-primary-dark-gray dark:text-background-light-gray"
                                  }
                                >
                                  <IoCaretDown />
                                </span>
                              </button>
                            </div>
                          </div>
                          <p class="mt-4 flex flex-col gap-3">
                            {!courses[currentCourse.id].courseApproval.ready_for_approval && (
                              <span class="inline-flex items-center gap-2">
                                <span class="mt-[-2px] inline-block text-[20px] text-primary-dark-gray dark:text-background-light-gray">
                                  <LuInfo />
                                </span>
                                Not Published
                                {courses[currentCourse.id].isPublishing && (
                                  <span class="ml-6">
                                    <LoadingSVG />
                                  </span>
                                )}
                                {!courses[currentCourse.id].isPublishing && (
                                  <button
                                    onClick$={() => handlePublish(currentCourse.id)}
                                    class="ml-6 underline decoration-wavy underline-offset-[6px]"
                                  >
                                    <span>Publish</span>
                                  </button>
                                )}
                              </span>
                            )}

                            {courses[currentCourse.id].courseApproval.ready_for_approval &&
                              courses[currentCourse.id].courseApproval.status === "pending" && (
                                <span class="inline-flex items-center gap-2">
                                  <span class="text-[20px] text-primary-dark-gray dark:text-background-light-gray">
                                    <LuHourglass />
                                  </span>
                                  Pending for Approval
                                  {courses[currentCourse.id].isPublishing && (
                                    <span class="ml-6">
                                      <LoadingSVG />
                                    </span>
                                  )}
                                  {!courses[currentCourse.id].isPublishing && (
                                    <button
                                      onClick$={() => handleUnpublish(currentCourse.id)}
                                      class="ml-6 underline decoration-wavy underline-offset-[6px]"
                                    >
                                      <span>Cancel Publish</span>
                                    </button>
                                  )}
                                </span>
                              )}

                            {courses[currentCourse.id].courseApproval.ready_for_approval &&
                              courses[currentCourse.id].courseApproval.status === "approved" && (
                                <span class="inline-flex items-center gap-2">
                                  <span class="text-[20px] text-mint-down">
                                    <LuCheck />
                                  </span>
                                  Published
                                  {courses[currentCourse.id].isPublishing && (
                                    <span class="ml-6">
                                      <LoadingSVG />
                                    </span>
                                  )}
                                  {!courses[currentCourse.id].isPublishing && (
                                    <button
                                      onClick$={() => handleUnpublish(currentCourse.id)}
                                      class="ml-6 rounded-lg bg-tomato px-4 py-2 text-background-light-gray shadow-md"
                                    >
                                      <span>Unpublish</span>
                                    </button>
                                  )}
                                </span>
                              )}

                            {courses[currentCourse.id].courseApproval.ready_for_approval &&
                              courses[currentCourse.id].courseApproval.status === "rejected" && (
                                <span class="inline-flex items-center gap-2 text-tomato">
                                  <span class="text-[20px]">
                                    <LuBan />
                                  </span>
                                  Unable to Publish
                                </span>
                              )}

                            {courses[currentCourse.id].courseApproval.ready_for_approval &&
                              courses[currentCourse.id].courseApproval.status ===
                                "need_amendment" && (
                                <span class="inline-flex items-center gap-2 text-tomato">
                                  <span class="text-[20px]">
                                    <LuAlertTriangle />
                                  </span>
                                  Amendment Needed
                                  {courses[currentCourse.id].isPublishing && (
                                    <span class="ml-6">
                                      <LoadingSVG />
                                    </span>
                                  )}
                                  {!courses[currentCourse.id].isPublishing && (
                                    <button
                                      onClick$={() => handleAmendment(currentCourse.id)}
                                      class="ml-6 underline decoration-wavy underline-offset-[6px]"
                                    >
                                      <span>Re-Publish</span>
                                    </button>
                                  )}
                                </span>
                              )}
                          </p>
                          <div class="mt-4 flex items-center gap-3">
                            <a
                              target="_blank"
                              href={`/creator/edit-course/${currentCourse.id}/`}
                              class="flex gap-2 self-start"
                            >
                              <span class="border-b-2 border-primary-dark-gray dark:border-background-light-gray">
                                Edit Details
                              </span>
                              <span class="text-[15px] text-primary-dark-gray dark:text-background-light-gray">
                                <LuArrowRight />
                              </span>
                            </a>
                            {courses[currentCourse.id].link && (
                              <a
                                target="_blank"
                                href={courses[currentCourse.id].link!}
                                class="flex gap-2 self-start"
                              >
                                <span class="border-b-2 border-primary-dark-gray dark:border-background-light-gray">
                                  View Course
                                </span>
                                <span class="text-[15px] text-primary-dark-gray dark:text-background-light-gray">
                                  <LuArrowRight />
                                </span>
                              </a>
                            )}
                          </div>
                          {courses[currentCourse.id].isOpen ? (
                            courses[currentCourse.id].isLoadingChapter ? (
                              <span class="mt-6">
                                <LoadingSVG />
                              </span>
                            ) : (
                              <>
                                <div class="mt-6 flex gap-4 pb-2">
                                  <h3 class="w-[30%]">Author:</h3>
                                  <p class={`w-[70%]`}>
                                    <span class="flex items-center gap-2">
                                      <span>
                                        <img
                                          src={currentCourse.profile.avatar_url}
                                          alt=""
                                          width={30}
                                          height={30}
                                          class="rounded-full"
                                        />
                                      </span>
                                      <span>{currentCourse.profile.nickname}</span>
                                    </span>
                                  </p>
                                </div>
                                <div class="flex gap-4 pb-2">
                                  <h3 class="w-[30%]">Course Language:</h3>
                                  <p class={`w-[70%]`}>
                                    {
                                      listSupportedLang.find(
                                        (lang) => lang.value === courses[currentCourse.id].lang
                                      )!.label
                                    }
                                  </p>
                                </div>
                                {user.role === "admin" && (
                                  <div class="flex gap-4 pb-2">
                                    <h3 class="w-[30%]">Supported Languages:</h3>
                                    <p class={`w-[70%]`}>
                                      {courses[currentCourse.id].supported_lang
                                        .filter((_lang) =>
                                          listSupportedLang.find(({ value }) => value === _lang)
                                        )
                                        .map(
                                          (_lang) =>
                                            listSupportedLang.find((lang) => lang.value === _lang)!
                                              .label
                                        )
                                        .join(", ")}
                                    </p>
                                  </div>
                                )}
                                <div class="flex gap-4 pb-2">
                                  <h3 class="w-[30%]">Created At:</h3>
                                  <p class={`w-[70%]`}>
                                    {new Date(currentCourse.created_at).toDateString()}
                                  </p>
                                </div>
                                <div class="flex gap-4 pb-2">
                                  <h3 class="w-[30%]">Updated At:</h3>
                                  <p class={`w-[70%]`}>
                                    {new Date(courses[currentCourse.id].updated_at).toDateString()}
                                  </p>
                                </div>

                                {courses[currentCourse.id].category && (
                                  <div class="flex gap-4 pb-2">
                                    <h3 class="w-[30%]">Category:</h3>
                                    <p class={`w-[70%]`}>
                                      {categories.find(
                                        (category) =>
                                          category.id === courses[currentCourse.id].category
                                      ) && (
                                        <a
                                          target="_blank"
                                          href={
                                            categories.find(
                                              (category) =>
                                                category.id === courses[currentCourse.id].category
                                            )!.link
                                          }
                                          class={`border-b-2 border-primary-dark-gray dark:border-background-light-gray`}
                                        >
                                          {
                                            categories.find(
                                              (category) =>
                                                category.id === courses[currentCourse.id].category
                                            )!.name
                                          }
                                        </a>
                                      )}
                                    </p>
                                  </div>
                                )}

                                {courses[currentCourse.id].tags && (
                                  <div class="flex gap-4 pb-2">
                                    <h3 class="w-[30%]">Tags:</h3>
                                    <ul class="flex w-[70%] flex-wrap gap-x-4 gap-y-2">
                                      {(courses[currentCourse.id].tags || [])
                                        .filter((tag) => tags.find((tag2) => tag2.id === tag))
                                        .map((tag) => (
                                          <li key={`Course${currentCourse.id}Tag${tag}`}>
                                            <a
                                              target="_blank"
                                              class="border-b-2 border-primary-dark-gray dark:border-background-light-gray"
                                              href={tags.find((tag2) => tag2.id === tag)!.link}
                                            >
                                              {tags.find((tag2) => tag2.id === tag)!.name}
                                            </a>
                                          </li>
                                        ))}
                                    </ul>
                                  </div>
                                )}

                                <div
                                  class="mt-6 flex gap-4 pb-2"
                                  title="Checks if the course is visible to everyone."
                                >
                                  <p class="flex items-center gap-2">
                                    {courses[currentCourse.id].is_private && (
                                      <span class="text-[20px] text-primary-dark-gray dark:text-background-light-gray">
                                        <LuEyeOff />
                                      </span>
                                    )}
                                    {!courses[currentCourse.id].is_private && (
                                      <span class="text-[20px] text-primary-dark-gray dark:text-background-light-gray">
                                        <LuEye />
                                      </span>
                                    )}
                                    <span>
                                      {courses[currentCourse.id].is_private
                                        ? "Only people with invite codes can view"
                                        : "Open to everyone"}
                                    </span>
                                  </p>
                                </div>

                                {user.role === "admin" && (
                                  <div
                                    class="flex gap-4 pb-2"
                                    title="Checks if a subscription is needed to read the course content."
                                  >
                                    <p class="flex items-center gap-2">
                                      <span
                                        class={
                                          "text-[20px] " +
                                          (courses[currentCourse.id].is_premium
                                            ? "text-tomato"
                                            : "text-gray-300")
                                        }
                                      >
                                        <LuGem />
                                      </span>
                                      <span>
                                        {courses[currentCourse.id].is_premium
                                          ? "Subscription Required"
                                          : "Subscrtiption Not Required"}
                                      </span>
                                    </p>
                                  </div>
                                )}

                                <div
                                  class="flex gap-4 pb-2"
                                  title="If a course is locked, the content cannot be edited."
                                >
                                  <p class="flex items-center gap-2">
                                    <span
                                      class={
                                        "text-[20px] text-primary-dark-gray dark:text-background-light-gray"
                                      }
                                    >
                                      {courses[currentCourse.id].is_locked ? (
                                        <LuLock />
                                      ) : (
                                        <LuUnlock />
                                      )}
                                    </span>
                                    <span>
                                      {courses[currentCourse.id].is_locked
                                        ? "Only you can edit"
                                        : "Anyone with permission can edit"}
                                    </span>
                                    <button
                                      onClick$={() =>
                                        handleLockUnlockCourse(currentCourse.id, user.userId)
                                      }
                                      class="ml-6 inline-block underline decoration-wavy underline-offset-[6px]"
                                    >
                                      {courses[currentCourse.id].is_locked ? "unlock" : "lock"}
                                    </button>
                                  </p>
                                </div>

                                <div class="mt-6 flex gap-4 py-2">
                                  <h3 class="w-[30%]">Description:</h3>
                                  <p class={`w-[80%] whitespace-pre leading-5`}>
                                    {courses[currentCourse.id].description}
                                  </p>
                                </div>
                                {!courses[currentCourse.id].is_single_page &&
                                  courses[currentCourse.id].isLoadingChapter && (
                                    <span>
                                      <LoadingSVG />
                                    </span>
                                  )}
                                {!courses[currentCourse.id].is_single_page &&
                                  courses[currentCourse.id].hasLoadedChapter && (
                                    <>
                                      <div class="flex items-center gap-2 py-4">
                                        <h3 class="font-bold tracking-wide">Chapters</h3>
                                        <button
                                          onClick$={(e) => {
                                            e.stopPropagation();
                                            showAddChapter.value = true;
                                            showAddCourseId.value = currentCourse.id;
                                          }}
                                          class="pl-6 text-[15px] text-primary-dark-gray underline decoration-wavy underline-offset-[6px] dark:text-background-light-gray"
                                        >
                                          add chapter
                                        </button>
                                      </div>
                                      {displayChapters.length === 0 && (
                                        <p class="pb-4">
                                          No chapters yet. Start by adding a chapter :P
                                        </p>
                                      )}
                                      {displayChapters.length > 0 && (
                                        <ul class="flex flex-col gap-4 pb-4">
                                          {displayChapters.map((_chapterId) => {
                                            const chapter = courses[currentCourse.id].chapters.find(
                                              (c) => c.id === _chapterId
                                            );
                                            if (!chapter) return;
                                            return (
                                              <li
                                                key={`Course${currentCourse.id}Chapter${chapter.id}`}
                                                class="flex items-center justify-between"
                                              >
                                                <div class="flex items-center gap-2">
                                                  <h4 class="border-b-2 border-primary-dark-gray dark:border-background-light-gray">
                                                    <a
                                                      target="_blank"
                                                      href={chapter.link || undefined}
                                                    >
                                                      {chapter.name ? chapter.name : ""}
                                                    </a>
                                                  </h4>
                                                  {user.role === "admin" && (
                                                    <p class="flex items-center gap-2">
                                                      <span
                                                        class={
                                                          "text-[18px] " +
                                                          (chapter.is_premium
                                                            ? "text-tomato"
                                                            : "text-gray-300")
                                                        }
                                                      >
                                                        <LuGem />
                                                      </span>
                                                    </p>
                                                  )}
                                                </div>
                                                <div class="flex items-center gap-2 text-[20px] text-primary-dark-gray dark:text-background-light-gray">
                                                  {!!courseIdToEditingUser[chapter.id] && (
                                                    <span>
                                                      <img
                                                        src={courseIdToEditingUser[chapter.id][1]}
                                                        alt=""
                                                        width={25}
                                                        height={25}
                                                        class="rounded-full"
                                                      />
                                                    </span>
                                                  )}
                                                  <button
                                                    onClick$={() =>
                                                      handleEditChapter(
                                                        chapter.id,
                                                        currentCourse.id
                                                      )
                                                    }
                                                    class="p-1"
                                                  >
                                                    <FaPenToSquareRegular />
                                                  </button>
                                                  <button
                                                    onClick$={() => {
                                                      showEditChapter.value = true;
                                                      showEditChapterId.value = chapter.id;
                                                      showEditCourseId.value = currentCourse.id;
                                                    }}
                                                    class="p-1"
                                                  >
                                                    <FaSlidersSolid />
                                                  </button>
                                                  {user.userId ===
                                                    courses[currentCourse.id].profile.id && (
                                                    <button
                                                      onClick$={() =>
                                                        handleLockUnlockChapter(
                                                          chapter.id,
                                                          currentCourse.id,
                                                          user.userId
                                                        )
                                                      }
                                                    >
                                                      <span
                                                        class={
                                                          "text-[18px] text-primary-dark-gray dark:text-background-light-gray"
                                                        }
                                                      >
                                                        {chapter.is_locked && <FaLockSolid />}
                                                        {!chapter.is_locked && <FaLockOpenSolid />}
                                                      </span>
                                                    </button>
                                                  )}
                                                  <button
                                                    onClick$={() => {
                                                      handleDeleteContent(
                                                        chapter.id,
                                                        currentCourse.id
                                                      );
                                                    }}
                                                    class="rounded-sm bg-tomato p-2 text-[16px] text-background-light-gray"
                                                  >
                                                    {courses[currentCourse.id].chaptersMap[
                                                      chapter.id
                                                    ].isDeleting ? (
                                                      <LoadingSVG />
                                                    ) : (
                                                      <FaTrashSolid />
                                                    )}
                                                  </button>
                                                </div>
                                              </li>
                                            );
                                          })}
                                        </ul>
                                      )}
                                    </>
                                  )}
                                <button
                                  onClick$={() => {
                                    handleDeleteContentIndex(currentCourse.id);
                                  }}
                                  class="rounded-lg bg-tomato px-6 py-3 text-background-light-gray shadow-lg"
                                >
                                  Delete Course
                                </button>
                              </>
                            )
                          ) : null}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </>
            )}
          </section>
        </div>
      </>
    );
  }
);