import type { Signal } from '@builder.io/qwik';
import { component$, useSignal } from '@builder.io/qwik';
import { LuX } from '@qwikest/icons/lucide';
// import generateContentShareToken from "~/auth/generateContentShareToken";
import LoadingSVG from '~/components/LoadingSVG';
import type { IsLockedValidation } from '~/components/_Creator/Course';
import { generateToken } from '~/components/_Creator/Course';

export default component$(
  ({
    showGetCode,
    contentId,
    userRole,
    userId,
    author,
    isLocked,
  }: { showGetCode: Signal<boolean>; contentId: string } & IsLockedValidation) => {
    const isGeneratingCode = useSignal(false);
    const generatedCode = useSignal('');
    return (
      <div class="fixed left-0 top-0 z-[100] flex h-[100vh] w-full items-center justify-center backdrop-blur-sm">
        <div class="relative flex w-[95vw] flex-col items-center justify-center gap-3 rounded-lg border-2 border-black bg-white py-16 dark:bg-highlight-dark md:w-[80vw] lg:w-[50vw] lg:min-w-[400px] lg:max-w-[600px]">
          <button
            onClick$={() => (showGetCode.value = false)}
            class="absolute right-5 top-5 block p-1 text-[15px] text-primary-dark-gray dark:text-background-light-gray md:text-[20px]"
          >
            <LuX />
          </button>
          <h2 class="pb-4 text-center font-mosk text-[1.5rem] font-bold tracking-wider md:pb-6 md:text-[2rem]">
            Add Chapter
          </h2>
          <div class="flex flex-col items-center justify-center gap-3">
            <button
              onClick$={async () => {
                if (isLocked && userId !== author && userRole !== 'admin') return alert('Unexpected!');
                if (isGeneratingCode.value) return;
                isGeneratingCode.value = true;
                try {
                  const code = await generateToken(contentId);
                  generatedCode.value = code;
                } catch (e) {
                  console.error(e);
                  alert('Unable to generate code. Please try again later or contact support.');
                }
                isGeneratingCode.value = false;
              }}
              class="w-[150px] rounded-md bg-primary-dark-gray px-4 py-3 text-background-light-gray "
            >
              {!isGeneratingCode.value && <span>Generate Code</span>}
              {isGeneratingCode.value && <LoadingSVG />}
            </button>
            {generatedCode.value && <p class="font-mosk text-xl font-bold tracking-widest">{generatedCode.value}</p>}
            {generatedCode.value && <p class="text-base">The code is valid for 30 minutes.</p>}
          </div>
          <p class="max-w-[280px] pt-4 text-center text-sm md:max-w-[400px] md:pt-6 md:text-base">
            Anyone with this code can view and edit your courses. If you don't want other people to edit the course,{' '}
            <span class="border-b-4 border-tomato dark:border-custom-pink">lock</span> the course before sharing the
            code. <br />
            <br />
            You CANNOT revoke the access later.
          </p>
        </div>
      </div>
    );
  }
);
