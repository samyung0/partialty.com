import type { RequestHandler } from '@builder.io/qwik-city';

export const onPost: RequestHandler = async (req) => {
  const { courseId } = (await req.parseBody()) as any;
  if (!courseId) throw req.json(400, 'Missing Course ID');
  req.cookie.set('favourite' + courseId, 1, {
    path: '/',
    maxAge: [480, 'weeks'],
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
  });
  req.json(200, 'OK');
};
