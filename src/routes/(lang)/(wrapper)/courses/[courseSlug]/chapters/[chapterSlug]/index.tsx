import { component$ } from '@builder.io/qwik';
import type { DocumentHead, RequestHandler, StaticGenerateHandler } from '@builder.io/qwik-city';

import ChapterPage from '~/components/_Courses/Chapter';
import { useCourseLoader } from '~/routes/(lang)/(wrapper)/courses/[courseSlug]/layout';
import { chaptersParams } from '../../../../../../../../prerender';

export const onGet: RequestHandler = async ({ cacheControl }) => {
  cacheControl({
    public: true,
    maxAge: 5,
    sMaxAge: 10,
    staleWhileRevalidate: 60 * 60 * 24 * 7,
  });
};

export default component$(() => {
  return <ChapterPage />;
});

export const head: DocumentHead = ({ resolveValue }) => {
  const { course } = resolveValue(useCourseLoader);
  return {
    title: `${course.content_index.name}`,
    meta: [
      {
        name: 'description',
        content: `${course.content_index.short_description} - ${course.content_index.description}`,
      },
    ],
  };
};

export const onStaticGenerate: StaticGenerateHandler = async () => {
  return {
    params: chaptersParams,
  };
};
