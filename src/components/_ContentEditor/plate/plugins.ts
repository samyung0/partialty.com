/** @jsxImportSource react */
import { withProps } from '@udecode/cn';
import { createAlignPlugin } from '@udecode/plate-alignment';
import { createAutoformatPlugin } from '@udecode/plate-autoformat';
import {
  createBoldPlugin,
  createCodePlugin,
  createItalicPlugin,
  createStrikethroughPlugin,
  createSubscriptPlugin,
  createSuperscriptPlugin,
  createUnderlinePlugin,
  MARK_BOLD,
  MARK_CODE,
  MARK_ITALIC,
  MARK_STRIKETHROUGH,
  MARK_SUBSCRIPT,
  MARK_SUPERSCRIPT,
  MARK_UNDERLINE,
} from '@udecode/plate-basic-marks';
import { createBlockquotePlugin, ELEMENT_BLOCKQUOTE } from '@udecode/plate-block-quote';
import { createExitBreakPlugin, createSoftBreakPlugin } from '@udecode/plate-break';
import { createCaptionPlugin } from '@udecode/plate-caption';
import {
  createCodeBlockPlugin,
  ELEMENT_CODE_BLOCK,
  ELEMENT_CODE_LINE,
  ELEMENT_CODE_SYNTAX,
  isCodeBlockEmpty,
  isSelectionAtCodeBlockStart,
  unwrapCodeBlock,
} from '@udecode/plate-code-block';
import { createComboboxPlugin } from '@udecode/plate-combobox';
import {
  createPlugins,
  isBlockAboveEmpty,
  isSelectionAtBlockStart,
  PlateElement,
  PlateLeaf,
  RenderAfterEditable,
  someNode,
} from '@udecode/plate-common';
import { createDndPlugin } from '@udecode/plate-dnd';
import { createExcalidrawPlugin, ELEMENT_EXCALIDRAW } from '@udecode/plate-excalidraw';
import { createFontBackgroundColorPlugin, createFontColorPlugin, createFontSizePlugin } from '@udecode/plate-font';
import {
  createHeadingPlugin,
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_H4,
  ELEMENT_H5,
  ELEMENT_H6,
  KEYS_HEADING,
} from '@udecode/plate-heading';
import { createHighlightPlugin, MARK_HIGHLIGHT } from '@udecode/plate-highlight';
import { createHorizontalRulePlugin, ELEMENT_HR } from '@udecode/plate-horizontal-rule';
import { createIndentPlugin } from '@udecode/plate-indent';
import { createIndentListPlugin, KEY_LIST_STYLE_TYPE } from '@udecode/plate-indent-list';
import { createJuicePlugin } from '@udecode/plate-juice';
import { createKbdPlugin, MARK_KBD } from '@udecode/plate-kbd';
import { createLineHeightPlugin } from '@udecode/plate-line-height';
import { createLinkPlugin, ELEMENT_LINK } from '@udecode/plate-link';
import { createTodoListPlugin, ELEMENT_LI, ELEMENT_OL, ELEMENT_TODO_LI, ELEMENT_UL } from '@udecode/plate-list';
import { createImagePlugin, createMediaEmbedPlugin, ELEMENT_IMAGE, ELEMENT_MEDIA_EMBED } from '@udecode/plate-media';
import { createNodeIdPlugin } from '@udecode/plate-node-id';
import { createParagraphPlugin, ELEMENT_PARAGRAPH } from '@udecode/plate-paragraph';
import { createResetNodePlugin } from '@udecode/plate-reset-node';
import { createSelectOnBackspacePlugin } from '@udecode/plate-select';
import { createBlockSelectionPlugin } from '@udecode/plate-selection';
import { createDeserializeDocxPlugin } from '@udecode/plate-serializer-docx';
import { createDeserializeMdPlugin } from '@udecode/plate-serializer-md';
import { createTabbablePlugin } from '@udecode/plate-tabbable';
import { createTablePlugin, ELEMENT_TABLE, ELEMENT_TD, ELEMENT_TH, ELEMENT_TR } from '@udecode/plate-table';
import { createTrailingBlockPlugin } from '@udecode/plate-trailing-block';

import { BlockquoteElement } from '~/components/_ContentEditor/plate-ui/blockquote-element';
import { CodeBlockElement } from '~/components/_ContentEditor/plate-ui/code-block-element';
import { CodeLeaf } from '~/components/_ContentEditor/plate-ui/code-leaf';
import { CodeLineElement } from '~/components/_ContentEditor/plate-ui/code-line-element';
import { CodeSyntaxLeaf } from '~/components/_ContentEditor/plate-ui/code-syntax-leaf';
import { ExcalidrawElement } from '~/components/_ContentEditor/plate-ui/excalidraw-element';
import { HeadingElement } from '~/components/_ContentEditor/plate-ui/heading-element';
import { HighlightLeaf } from '~/components/_ContentEditor/plate-ui/highlight-leaf';
import { HrElement } from '~/components/_ContentEditor/plate-ui/hr-element';
import { ImageElement } from '~/components/_ContentEditor/plate-ui/image-element';
import { KbdLeaf } from '~/components/_ContentEditor/plate-ui/kbd-leaf';
import { LinkElement } from '~/components/_ContentEditor/plate-ui/link-element';
import { LinkFloatingToolbar } from '~/components/_ContentEditor/plate-ui/link-floating-toolbar';
import { ListElement } from '~/components/_ContentEditor/plate-ui/list-element';
import { MediaEmbedElement } from '~/components/_ContentEditor/plate-ui/media-embed-element';
import { ParagraphElement } from '~/components/_ContentEditor/plate-ui/paragraph-element';
import { withPlaceholders } from '~/components/_ContentEditor/plate-ui/placeholder';
import { TableCellElement, TableCellHeaderElement } from '~/components/_ContentEditor/plate-ui/table-cell-element';
import { TableElement } from '~/components/_ContentEditor/plate-ui/table-element';
import { TableRowElement } from '~/components/_ContentEditor/plate-ui/table-row-element';
import { TodoListElement } from '~/components/_ContentEditor/plate-ui/todo-list-element';
// import { withDraggables } from '~/components/_ContentEditor/plate-ui/with-draggables';
import { autoformatPlugin } from './autoFormat';
import { TabbableElement } from './tabbable';

const resetBlockTypesCommonRule = {
  types: [ELEMENT_BLOCKQUOTE, ELEMENT_TODO_LI],
  defaultType: ELEMENT_PARAGRAPH,
};

const resetBlockTypesCodeBlockRule = {
  types: [ELEMENT_CODE_BLOCK],
  defaultType: ELEMENT_PARAGRAPH,
  onReset: unwrapCodeBlock,
};

export const plugins = createPlugins(
  [
    // Nodes
    createParagraphPlugin(),
    createHeadingPlugin(),
    createBlockquotePlugin(),
    createCodeBlockPlugin(),
    createHorizontalRulePlugin(),
    createLinkPlugin({
      renderAfterEditable: LinkFloatingToolbar as RenderAfterEditable,
    }),
    createImagePlugin(),
    createMediaEmbedPlugin(),
    createCaptionPlugin({
      options: { pluginKeys: [ELEMENT_IMAGE, ELEMENT_MEDIA_EMBED] },
    }),
    createTablePlugin(),
    createTodoListPlugin(),
    createExcalidrawPlugin(),

    // Marks
    createBoldPlugin(),
    createItalicPlugin(),
    createUnderlinePlugin(),
    createStrikethroughPlugin(),
    createCodePlugin(),
    createSubscriptPlugin(),
    createSuperscriptPlugin(),
    createFontColorPlugin(),
    createFontBackgroundColorPlugin(),
    createFontSizePlugin(),
    createHighlightPlugin(),
    createKbdPlugin(),

    // Block Style
    createAlignPlugin({
      inject: {
        props: {
          validTypes: [ELEMENT_PARAGRAPH, ELEMENT_H1, ELEMENT_H2, ELEMENT_H3],
        },
      },
    }),
    createIndentPlugin({
      inject: {
        props: {
          validTypes: [ELEMENT_PARAGRAPH, ELEMENT_H1, ELEMENT_H2, ELEMENT_H3, ELEMENT_BLOCKQUOTE, ELEMENT_CODE_BLOCK],
        },
      },
    }),
    createIndentListPlugin({
      inject: {
        props: {
          validTypes: [ELEMENT_PARAGRAPH, ELEMENT_H1, ELEMENT_H2, ELEMENT_H3, ELEMENT_BLOCKQUOTE, ELEMENT_CODE_BLOCK],
        },
      },
    }),
    createLineHeightPlugin({
      inject: {
        props: {
          defaultNodeValue: 1.5,
          validNodeValues: [1, 1.2, 1.5, 2, 3],
          validTypes: [ELEMENT_PARAGRAPH, ELEMENT_H1, ELEMENT_H2, ELEMENT_H3],
        },
      },
    }),

    // Functionality
    createAutoformatPlugin(autoformatPlugin),
    createBlockSelectionPlugin({
      options: {
        sizes: {
          top: 0,
          bottom: 0,
        },
      },
    }),
    createComboboxPlugin(),
    createDndPlugin({
      options: { enableScroller: true },
    }),
    createExitBreakPlugin({
      options: {
        rules: [
          {
            hotkey: 'mod+enter',
          },
          {
            hotkey: 'mod+shift+enter',
            before: true,
          },
          {
            hotkey: 'enter',
            query: {
              start: true,
              end: true,
              allow: KEYS_HEADING,
            },
            relative: true,
            level: 1,
          },
        ],
      },
    }),
    createNodeIdPlugin(),
    createResetNodePlugin({
      options: {
        rules: [
          {
            ...resetBlockTypesCommonRule,
            hotkey: 'Enter',
            predicate: isBlockAboveEmpty,
          },
          {
            ...resetBlockTypesCommonRule,
            hotkey: 'Backspace',
            predicate: isSelectionAtBlockStart,
          },
          {
            ...resetBlockTypesCodeBlockRule,
            hotkey: 'Enter',
            predicate: isCodeBlockEmpty,
          },
          {
            ...resetBlockTypesCodeBlockRule,
            hotkey: 'Backspace',
            predicate: isSelectionAtCodeBlockStart,
          },
        ],
      },
    }),
    createSelectOnBackspacePlugin({
      options: {
        query: {
          allow: [ELEMENT_IMAGE, ELEMENT_HR],
        },
      },
    }),

    createSoftBreakPlugin({
      options: {
        rules: [
          { hotkey: 'shift+enter' },
          {
            hotkey: 'enter',
            query: {
              allow: [ELEMENT_CODE_BLOCK, ELEMENT_BLOCKQUOTE, ELEMENT_TD],
            },
          },
        ],
      },
    }),
    createTabbablePlugin({
      options: {
        query: (editor) => {
          if (isSelectionAtBlockStart(editor)) return false;

          return !someNode(editor, {
            match: (n) => {
              return !!(
                n.type &&
                ([ELEMENT_TABLE, ELEMENT_LI, ELEMENT_CODE_BLOCK].includes(n.type as string) || n[KEY_LIST_STYLE_TYPE])
              );
            },
          });
        },
      },
      plugins: [
        {
          key: 'tabbable_element',
          isElement: true,
          isVoid: true,
          component: TabbableElement,
        },
      ],
    }),
    createTrailingBlockPlugin({
      options: { type: ELEMENT_PARAGRAPH },
    }),

    // Deserialization
    createDeserializeDocxPlugin(),
    createDeserializeMdPlugin(),
    createJuicePlugin(),
  ],
  {
    components: withPlaceholders({
      [ELEMENT_BLOCKQUOTE]: BlockquoteElement,
      [ELEMENT_CODE_BLOCK]: CodeBlockElement,
      [ELEMENT_CODE_LINE]: CodeLineElement,
      [ELEMENT_CODE_SYNTAX]: CodeSyntaxLeaf,
      [ELEMENT_HR]: HrElement,
      [ELEMENT_H1]: withProps(HeadingElement, { variant: 'h1' }),
      [ELEMENT_H2]: withProps(HeadingElement, { variant: 'h2' }),
      [ELEMENT_H3]: withProps(HeadingElement, { variant: 'h3' }),
      [ELEMENT_H4]: withProps(HeadingElement, { variant: 'h4' }),
      [ELEMENT_H5]: withProps(HeadingElement, { variant: 'h5' }),
      [ELEMENT_H6]: withProps(HeadingElement, { variant: 'h6' }),
      [ELEMENT_IMAGE]: ImageElement,
      [ELEMENT_LI]: withProps(PlateElement, { as: 'li' }),
      [ELEMENT_LINK]: LinkElement,
      [ELEMENT_MEDIA_EMBED]: MediaEmbedElement,
      [ELEMENT_UL]: withProps(ListElement, { variant: 'ul' }),
      [ELEMENT_OL]: withProps(ListElement, { variant: 'ol' }),
      [ELEMENT_PARAGRAPH]: ParagraphElement,
      [ELEMENT_TABLE]: TableElement,
      [ELEMENT_TD]: TableCellElement,
      [ELEMENT_TH]: TableCellHeaderElement,
      [ELEMENT_TODO_LI]: TodoListElement,
      [ELEMENT_TR]: TableRowElement,
      [ELEMENT_EXCALIDRAW]: ExcalidrawElement,
      [MARK_BOLD]: withProps(PlateLeaf, { as: 'strong' }),
      [MARK_CODE]: CodeLeaf,
      [MARK_HIGHLIGHT]: HighlightLeaf,
      [MARK_ITALIC]: withProps(PlateLeaf, { as: 'em' }),
      [MARK_KBD]: KbdLeaf,
      [MARK_STRIKETHROUGH]: withProps(PlateLeaf, { as: 's' }),
      [MARK_SUBSCRIPT]: withProps(PlateLeaf, { as: 'sub' }),
      [MARK_SUPERSCRIPT]: withProps(PlateLeaf, { as: 'sup' }),
      [MARK_UNDERLINE]: withProps(PlateLeaf, { as: 'u' }),
    }),
  }
);
