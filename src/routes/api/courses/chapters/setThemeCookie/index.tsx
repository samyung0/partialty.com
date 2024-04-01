import type { RequestHandler } from '@builder.io/qwik-city';

export const onPost: RequestHandler = async (req) => {
  const { theme } = (await req.parseBody()) as any;
  if (!theme) throw req.json(400, 'Missing Theme');
  req.cookie.set('theme', theme, {
    path: '/',
    maxAge: [480, 'weeks'],
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
  });
  req.json(200, 'OK');
};
