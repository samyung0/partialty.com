/** @jsxImportSource react */
import { ArrowDown, ArrowUp, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Editor, Range } from "slate";
import { useSlate } from "slate-react";
import ColorChooser from "~/components/_ContentEditor/ColorChooser";
import type { CustomMarkFormat } from "~/components/_ContentEditor/types";

export const MarkButton = ({
  format,
  children,
}: {
  format: CustomMarkFormat;
  children: React.ReactNode;
}) => {
  const editor = useSlate();
  return (
    <button
      className={
        isMarkActive(editor, format) ? `border-b-2 border-black` : "border-b-2 border-light-mint"
      }
      onMouseDown={(event) => event.preventDefault()}
      onClick={(event) => {
        event.stopPropagation();
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      {children}
    </button>
  );
};

export const BackgroundMarkButton = ({
  format,
  children,
  audioTimeStamp,
}: {
  format: CustomMarkFormat;
  children: React.ReactNode;
  audioTimeStamp: React.MutableRefObject<number>;
}) => {
  const editor = useSlate();
  const mark = Editor.marks(editor) || {};
  return (
    <div
      className={
        (isMarkActive(editor, format)
          ? `border-b-2 border-black`
          : "border-b-2 border-light-mint ") + " relative cursor-pointer [&:hover>div]:block"
      }
      onMouseDown={(event) => event.preventDefault()}
    >
      {children}
      <div className="absolute left-[50%] top-[100%] z-50 hidden w-[300px] -translate-x-[50%] pt-2">
        <ColorChooser
          mark={mark}
          getTime={() => audioTimeStamp.current}
          setSync={() => {
            if (editor.selection && Range.isCollapsed(editor.selection)) return;
            const currentMark = Editor.marks(editor);
            if (currentMark && currentMark["sync"]) return Editor.removeMark(editor, "sync");
            Editor.addMark(editor, "sync", true);
          }}
          setTimeStamp={(timestamp: number) => {
            if (editor.selection && Range.isCollapsed(editor.selection)) return;
            Editor.addMark(editor, "timeStamp", timestamp);
          }}
          setAnimate={() => {
            if (editor.selection && Range.isCollapsed(editor.selection)) return;
            const currentMark = Editor.marks(editor);
            if (currentMark && currentMark["animate"]) return Editor.removeMark(editor, "animate");
            Editor.addMark(editor, "animate", true);
          }}
          setColor={(color: string) => {
            if (editor.selection && Range.isCollapsed(editor.selection)) return;
            const currentMark = Editor.marks(editor);
            if (currentMark && currentMark[format] && currentMark[format] === color)
              return Editor.removeMark(editor, format);
            Editor.addMark(editor, format, color);
          }}
          removeColor={() => {
            if (editor.selection && Range.isCollapsed(editor.selection)) return;
            Editor.removeMark(editor, format);
            Editor.removeMark(editor, "timeStamp");
            Editor.removeMark(editor, "sync");
            Editor.removeMark(editor, "animate");
          }}
        />
      </div>
    </div>
  );
};

export const UnderlineMarkButton = ({
  format,
  children,
  audioTimeStamp,
}: {
  format: CustomMarkFormat;
  children: React.ReactNode;
  audioTimeStamp: React.MutableRefObject<number>;
}) => {
  const editor = useSlate();
  const mark = Editor.marks(editor) || {};
  return (
    <div
      className={
        (isMarkActive(editor, format)
          ? `border-b-2 border-black`
          : "border-b-2 border-light-mint ") + " relative cursor-pointer [&:hover>div]:block"
      }
      onMouseDown={(event) => event.preventDefault()}
    >
      {children}
      <div className="absolute left-[50%] top-[100%] z-50 hidden w-[300px] -translate-x-[50%] pt-2">
        <ColorChooser
          mark={mark}
          getTime={() => audioTimeStamp.current}
          setSync={() => {
            if (editor.selection && Range.isCollapsed(editor.selection)) return;
            const currentMark = Editor.marks(editor);
            if (currentMark && currentMark["sync"]) return Editor.removeMark(editor, "sync");
            Editor.addMark(editor, "sync", true);
          }}
          setTimeStamp={(timestamp: number) => {
            if (editor.selection && Range.isCollapsed(editor.selection)) return;
            Editor.addMark(editor, "timeStamp", timestamp);
          }}
          setAnimate={() => {
            if (editor.selection && Range.isCollapsed(editor.selection)) return;
            const currentMark = Editor.marks(editor);
            if (currentMark && currentMark["animate"]) return Editor.removeMark(editor, "animate");
            Editor.addMark(editor, "animate", true);
          }}
          setColor={(color: string) => {
            if (editor.selection && Range.isCollapsed(editor.selection)) return;
            const currentMark = Editor.marks(editor);
            if (currentMark && currentMark[format] && currentMark[format] === color)
              return Editor.removeMark(editor, format);
            Editor.addMark(editor, format, color);
          }}
          removeColor={() => {
            if (editor.selection && Range.isCollapsed(editor.selection)) return;
            Editor.removeMark(editor, format);
            Editor.removeMark(editor, "timeStamp");
            Editor.removeMark(editor, "sync");
            Editor.removeMark(editor, "animate");
          }}
        />
      </div>
    </div>
  );
};

export const ColorMarkButton = ({
  format,
  children,
  audioTimeStamp,
}: {
  format: CustomMarkFormat;
  children: React.ReactNode;
  audioTimeStamp: React.MutableRefObject<number>;
}) => {
  const editor = useSlate();
  const mark = Editor.marks(editor) || {};
  return (
    <div
      className={
        (isMarkActive(editor, format)
          ? `border-b-2 border-black`
          : "border-b-2 border-light-mint ") + " relative cursor-pointer [&:hover>div]:block"
      }
      onMouseDown={(event) => event.preventDefault()}
    >
      {children}
      <div className="absolute left-[50%] top-[100%] z-50 hidden w-[300px] -translate-x-[50%] pt-2">
        <ColorChooser
          canSync={false}
          canAnimate={false}
          mark={mark}
          getTime={() => audioTimeStamp.current}
          setSync={() => {
            if (editor.selection && Range.isCollapsed(editor.selection)) return;
            const currentMark = Editor.marks(editor);
            if (currentMark && currentMark["sync"]) return Editor.removeMark(editor, "sync");
            Editor.addMark(editor, "sync", true);
          }}
          setTimeStamp={(timestamp: number) => {
            if (editor.selection && Range.isCollapsed(editor.selection)) return;
            Editor.addMark(editor, "timeStamp", timestamp);
          }}
          setAnimate={() => {
            if (editor.selection && Range.isCollapsed(editor.selection)) return;
            const currentMark = Editor.marks(editor);
            if (currentMark && currentMark["animate"]) return Editor.removeMark(editor, "animate");
            Editor.addMark(editor, "animate", true);
          }}
          setColor={(color: string) => {
            if (editor.selection && Range.isCollapsed(editor.selection)) return;
            const currentMark = Editor.marks(editor);
            if (currentMark && currentMark[format] && currentMark[format] === color)
              return Editor.removeMark(editor, format);
            Editor.addMark(editor, format, color);
          }}
          removeColor={() => {
            if (editor.selection && Range.isCollapsed(editor.selection)) return;
            Editor.removeMark(editor, format);
            Editor.removeMark(editor, "timeStamp");
            Editor.removeMark(editor, "sync");
            Editor.removeMark(editor, "animate");
          }}
        />
      </div>
    </div>
  );
};

export const TextMarkButton = ({ children }: { children: React.ReactNode }) => {
  const defaultSize = useRef(18);
  const defaultFamily = useRef("Varela_Round");
  const defaultSpacing = useRef(0);
  const editor = useSlate();
  const ref = useRef<any>();
  const ref2 = useRef<any>();
  const mark = Editor.marks(editor) || {};
  const [fontSize, setFontSize] = useState(mark.fontSize || defaultSize.current);
  const [fontSpacing, setFontSpacing] = useState(mark.fontSpacing || defaultSpacing.current);
  const [fontFamily, setFontFamily] = useState(mark.fontFamily || defaultFamily.current);

  useEffect(() => {
    setFontSize(mark.fontSize || defaultSize.current);
    setFontSpacing(mark.fontSpacing || defaultSpacing.current);
    setFontFamily(mark.fontFamily || defaultFamily.current);
  }, [mark.fontSize, mark.fontSpacing, mark.fontFamily]);

  const [showSelection, setShowSelection] = useState(false);
  return (
    <div
      className={
        (isMarkActive(editor, "fontSize") || isMarkActive(editor, "fontFamily")
          ? `border-b-2 border-black`
          : "border-b-2 border-light-mint ") + " relative cursor-pointer [&:hover>div]:block"
      }
      onMouseDown={(event) => event.preventDefault()}
    >
      {children}
      <div className="absolute left-[50%] top-[100%] z-50 hidden w-[300px] -translate-x-[50%] pt-2">
        <div className="flex cursor-context-menu flex-col gap-3 rounded-md border-2 border-primary-dark-gray bg-white p-3">
          <div className="flex gap-3">
            <div className="flex cursor-pointer items-center justify-center gap-2 p-2">
              <p>Font Size: </p>

              <input
                onClick={() => ref.current && ref.current.focus()}
                ref={ref}
                type="number"
                step="1"
                min="0"
                className="w-[50px] border-b-2 border-primary-dark-gray pl-2 text-sm tracking-wide text-primary-dark-gray outline-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:hidden [&::-webkit-inner-spin-button]:[-webkit-appearance:none] [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:hidden [&::-webkit-outer-spin-button]:[-webkit-appearance:none]"
                id="ColorChooserTimeStamp"
                value={fontSize}
                onChange={(e) => {
                  if (editor.selection && Range.isCollapsed(editor.selection)) return;
                  Editor.addMark(editor, "fontSize", Number(e.target.value));
                  setFontSize(Number(e.target.value));
                }}
              />
            </div>
            <div className="ml-auto flex gap-1">
              <button
                onClick={() => {
                  if (ref.current) {
                    if (editor.selection && Range.isCollapsed(editor.selection)) return;
                    Editor.addMark(editor, "fontSize", Number(ref.current.value) + 1);
                    setFontSize(Number(ref.current.value) + 1);
                  }
                }}
                className="p-1"
              >
                <ArrowUp size={15} />
              </button>
              <button
                onClick={() => {
                  if (ref.current && Number(ref.current.value) > 0) {
                    if (editor.selection && Range.isCollapsed(editor.selection)) return;
                    Editor.addMark(editor, "fontSize", Number(ref.current.value) - 1);
                    setFontSize(Number(ref.current.value) - 1);
                  }
                }}
                className="p-1"
              >
                <ArrowDown size={15} />
              </button>
              <button
                onClick={() => {
                  if (ref.current) {
                    if (editor.selection && Range.isCollapsed(editor.selection)) return;
                    Editor.addMark(editor, "fontSize", defaultSize.current);
                    setFontSize(defaultSize.current);
                  }
                }}
                className="p-1"
              >
                <RotateCcw size={15} />
              </button>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex cursor-pointer items-center justify-center gap-2 p-2">
              <p>Font Family: </p>
              <div className="relative w-[120px] text-sm tracking-wide underline decoration-wavy underline-offset-4">
                <span
                  onClick={() => setShowSelection(!showSelection)}
                  style={{ fontFamily }}
                  className="px-2"
                >
                  {fontFamily}
                </span>
                {showSelection && (
                  <ul
                    className="absolute left-0 top-[calc(100%+8px)] flex w-[120px] flex-col bg-white text-sm tracking-wide"
                    aria-labelledby="dropdownDefaultButton"
                  >
                    <li className="border-l-2 border-r-2 border-t-2 border-primary-dark-gray p-1">
                      <button
                        onClick={() => {
                          if (editor.selection && Range.isCollapsed(editor.selection)) return;
                          Editor.addMark(editor, "fontFamily", "Varela_Round");
                          setFontFamily("Varela_Round");
                          setShowSelection(false);
                        }}
                        className="block px-4 py-2 text-left"
                        style={{ fontFamily: "Varela_Round" }}
                      >
                        Varela Round
                      </button>
                    </li>
                    <li className="border-l-2 border-r-2 border-t-2 border-primary-dark-gray p-1">
                      <button
                        onClick={() => {
                          if (editor.selection && Range.isCollapsed(editor.selection)) return;
                          Editor.addMark(editor, "fontFamily", "mosk");
                          setFontFamily("mosk");
                          setShowSelection(false);
                        }}
                        className="block px-4 py-2 text-left"
                        style={{ fontFamily: "mosk" }}
                      >
                        mosk
                      </button>
                    </li>
                    <li className="border-l-2 border-r-2 border-t-2 border-primary-dark-gray p-1">
                      <button
                        onClick={() => {
                          if (editor.selection && Range.isCollapsed(editor.selection)) return;
                          Editor.addMark(editor, "fontFamily", "Consolas");
                          setFontFamily("Consolas");
                          setShowSelection(false);
                        }}
                        className="block px-4 py-2 text-left"
                        style={{ fontFamily: "Consolas" }}
                      >
                        Consolas
                      </button>
                    </li>
                    <li className="border-2 border-primary-dark-gray p-1">
                      <button
                        onClick={() => {
                          if (editor.selection && Range.isCollapsed(editor.selection)) return;
                          Editor.addMark(editor, "fontFamily", "Cascadia Code");
                          setFontFamily("Cascadia Code");
                          setShowSelection(false);
                        }}
                        className="block px-4 py-2 text-left"
                        style={{ fontFamily: "Cascadia Code" }}
                      >
                        Cascadia Code
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            </div>
            <div className="ml-auto flex gap-1">
              <button
                onClick={() => {
                  if (editor.selection && Range.isCollapsed(editor.selection)) return;
                  Editor.addMark(editor, "fontFamily", defaultFamily.current);
                  setFontFamily(defaultFamily.current);
                }}
                className="p-1"
              >
                <RotateCcw size={15} />
              </button>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex cursor-pointer items-center justify-center gap-2 p-2">
              <p>Font Spacing: </p>

              <input
                onClick={() => ref2.current && ref2.current.focus()}
                ref={ref2}
                type="number"
                step="1"
                min="0"
                className="w-[50px] border-b-2 border-primary-dark-gray pl-2 text-sm tracking-wide text-primary-dark-gray outline-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:hidden [&::-webkit-inner-spin-button]:[-webkit-appearance:none] [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:hidden [&::-webkit-outer-spin-button]:[-webkit-appearance:none]"
                id="ColorChooserTimeStamp"
                value={fontSpacing}
                onChange={(e) => {
                  if (editor.selection && Range.isCollapsed(editor.selection)) return;
                  Editor.addMark(editor, "fontSpacing", Number(e.target.value));
                  setFontSpacing(Number(e.target.value));
                }}
              />
            </div>
            <div className="ml-auto flex gap-1">
              <button
                onClick={() => {
                  if (ref2.current) {
                    if (editor.selection && Range.isCollapsed(editor.selection)) return;
                    Editor.addMark(editor, "fontSpacing", Number(ref2.current.value) + 1);
                    setFontSpacing(Number(ref2.current.value) + 1);
                  }
                }}
                className="p-1"
              >
                <ArrowUp size={15} />
              </button>
              <button
                onClick={() => {
                  if (ref2.current && Number(ref2.current.value) > 0) {
                    if (editor.selection && Range.isCollapsed(editor.selection)) return;
                    Editor.addMark(editor, "fontSpacing", Number(ref2.current.value) - 1);
                    setFontSpacing(Number(ref2.current.value) - 1);
                  }
                }}
                className="p-1"
              >
                <ArrowDown size={15} />
              </button>
              <button
                onClick={() => {
                  if (ref2.current) {
                    if (editor.selection && Range.isCollapsed(editor.selection)) return;
                    Editor.addMark(editor, "fontSpacing", defaultSpacing.current);
                    setFontSpacing(defaultSpacing.current);
                  }
                }}
                className="p-1"
              >
                <RotateCcw size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const toggleMark = (editor: Editor, format: CustomMarkFormat, value?: any) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, value || true);
  }
};
export const isMarkActive = (editor: Editor, format: CustomMarkFormat) => {
  const marks = Editor.marks(editor);
  return marks ? Object.prototype.hasOwnProperty.call(marks, format) : false;
};