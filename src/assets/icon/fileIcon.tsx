import type { QwikIntrinsicElements } from '@builder.io/qwik';

export function FileIcon(props: QwikIntrinsicElements['svg'], key: string) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props} key={key}>
      <path
        fill="currentColor"
        d="M12 19q1.675 0 2.838-1.175T16 15v-4h-2v4q0 .825-.575 1.413T12 17q-.825 0-1.412-.587T10 15V9.5q0-.225.15-.363T10.5 9q.225 0 .363.138T11 9.5V15h2V9.5q0-1.05-.725-1.775T10.5 7q-1.05 0-1.775.725T8 9.5V15q0 1.65 1.175 2.825T12 19m-8 3V2h11l5 5v15zM14 4v4h4z"
      ></path>
    </svg>
  );
}
