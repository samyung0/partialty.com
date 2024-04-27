/** @jsxImportSource react */
import { withRef } from '@udecode/cn';
import type { ELEMENT_IMAGE, ELEMENT_MEDIA_EMBED } from '@udecode/plate-media';
import { useMediaToolbarButton } from '@udecode/plate-media';

import { Icons } from './icons';

import { ToolbarButton } from './toolbar';

export const MediaToolbarButton = withRef<
  typeof ToolbarButton,
  {
    nodeType?: typeof ELEMENT_IMAGE | typeof ELEMENT_MEDIA_EMBED;
  }
>(({ nodeType, ...rest }, ref) => {
  const { props } = useMediaToolbarButton({ nodeType });

  return (
    <ToolbarButton ref={ref} {...props} {...rest}>
      <Icons.image />
    </ToolbarButton>
  );
});
