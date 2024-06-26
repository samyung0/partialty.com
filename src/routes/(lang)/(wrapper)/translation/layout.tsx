import { component$, Slot } from '@builder.io/qwik';
import { useSpeak } from 'qwik-speak';

export default component$(() => {
  useSpeak({ assets: ['page1'] });

  return <Slot />;
});
