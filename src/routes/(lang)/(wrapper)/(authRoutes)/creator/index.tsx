import { $, component$, useStore } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { routeLoader$ } from '@builder.io/qwik-city';
import { and, eq, not, or } from 'drizzle-orm';

import Creator from '~/components/_Creator';
import { useCategories, useTags } from '~/routes/(lang)/(wrapper)/(authRoutes)/creator/layout';
import { useUserLoader } from '~/routes/(lang)/(wrapper)/(authRoutes)/layout';
import drizzleClient from '~/utils/drizzleClient';
import useWS from '~/utils/useWS';
import type { ContentIndex } from '../../../../../../drizzle_turso/schema/content_index';
import { content_index } from '../../../../../../drizzle_turso/schema/content_index';
import type { CourseApproval } from '../../../../../../drizzle_turso/schema/course_approval';
import { course_approval } from '../../../../../../drizzle_turso/schema/course_approval';
import type { Profiles } from '../../../../../../drizzle_turso/schema/profiles';
import { profiles } from '../../../../../../drizzle_turso/schema/profiles';

export const useAccessibleCourseWrite = routeLoader$(async (event) => {
  const userVal = await event.resolveValue(useUserLoader);
  if (userVal.role === 'admin') return ['*'];
  let courses: string[];
  try {
    courses = JSON.parse(userVal.accessible_courses || '[]');
  } catch (e) {
    console.error(e);
    courses = [];
  }
  return courses;
});

export const useAccessibleCourseRead = routeLoader$(async (event) => {
  const userVal = await event.resolveValue(useUserLoader);
  if (userVal.role === 'admin') return ['*'];
  let courses: string[];
  try {
    courses = JSON.parse(userVal.accessible_courses_read || '[]');
  } catch (e) {
    console.error(e);
    courses = [];
  }
  return courses;
});

export const useAccessibleCourseWriteResolved = routeLoader$(async (event) => {
  const accessibleCourseWrite = await event.resolveValue(useAccessibleCourseWrite);
  if (accessibleCourseWrite.length === 0) return [];
  let courses: {
    content_index: ContentIndex;
    profiles: Profiles;
    course_approval: CourseApproval;
  }[] = [];
  if (accessibleCourseWrite.length === 1 && accessibleCourseWrite[0] === '*') {
    courses = await drizzleClient(event.env, import.meta.env.VITE_USE_PROD_DB === '1')
      .select()
      .from(content_index)
      .where(not(eq(content_index.is_deleted, true)))
      .innerJoin(profiles, eq(profiles.id, content_index.author))
      .innerJoin(course_approval, eq(course_approval.course_id, content_index.id));
  } else
    courses = await drizzleClient(event.env, import.meta.env.VITE_USE_PROD_DB === '1')
      .select()
      .from(content_index)
      .where(
        and(or(...accessibleCourseWrite.map((id) => eq(content_index.id, id))), not(eq(content_index.is_deleted, true)))
      )
      .innerJoin(profiles, eq(profiles.id, content_index.author))
      .innerJoin(course_approval, eq(course_approval.course_id, content_index.id));
  return courses;
});

export default component$(() => {
  const user = useUserLoader().value;
  const userAccessibleCourseWrite = useAccessibleCourseWrite();
  const userAccessibleCourseRead = useAccessibleCourseRead();
  const userAccessibleCourseWriteResolved = useAccessibleCourseWriteResolved();
  const tags = useTags().value;
  const catgories = useCategories().value;
  const courseIdToEditingUser = useStore<Record<string, [string, string]>>({});

  const ws = useWS(user, {
    onOpen$: $((ws, useTimeStamp) => {
      ws.send(
        JSON.stringify({
          type: 'init',
          userId: useTimeStamp,
          accessible_courses: userAccessibleCourseWrite.value,
        })
      );
    }),
    onMessage$: $((ws, useTimeStamp, data) => {
      try {
        const d = JSON.parse(data);
        console.log(d);
        if (d.type === 'initUserEditing') {
          for (const i in courseIdToEditingUser) delete courseIdToEditingUser[i];
          for (const i in d.message) courseIdToEditingUser[i] = d.message[i];
          return;
        }
        if (d.type === 'addUserEditing') {
          for (const i in d.message) courseIdToEditingUser[i] = d.message[i];
          return;
        }
        if (d.type === 'removeUserEditing') {
          for (const i in d.message) delete courseIdToEditingUser[i];
          return;
        }
        if (d.type === 'error') {
          console.error(d.message);
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }),
  });
  const contentWS = ws.contentWS;

  return (
    <main>
      <Creator
        ws={contentWS}
        userAccessibleCourseWrite={userAccessibleCourseWrite}
        userAccessibleCourseRead={userAccessibleCourseRead}
        userAccessibleCourseWriteResolved={userAccessibleCourseWriteResolved}
        tags={tags}
        categories={catgories}
        courseIdToEditingUser={courseIdToEditingUser}
      />
    </main>
  );
});

export const head: DocumentHead = {
  title: 'Creator',
  meta: [
    {
      name: 'description',
      content: 'A page to manage all the courses and projects created by you.',
    },
  ],
};
