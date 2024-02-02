/** @jsxImportSource react */
import { Trash, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { BaseRange } from "slate";
import { Editor, Range, Element as SlateElement, Transforms } from "slate";
import type { RenderElementProps } from "slate-react";
import { ReactEditor, useFocused, useSlate } from "slate-react";
import { isBlockActive } from "~/components/ContentEditor/blockFn";
import type { QuizBlockElement, QuizOptionElement } from "~/components/ContentEditor/types";

export const QuizOption = ({ attributes, children, element }: RenderElementProps) => {
  const optionValue = (element as QuizOptionElement).optionValue;
  const name = (element as QuizOptionElement).formName;
  return (
    <div
      // type="button"
      data-formname={name}
      // onClick={function (e) {
      //   const name = (e.currentTarget as HTMLElement).getAttribute("data-formname");
      //   if (!name) return;
      //   const formInputs = Array.from(document.querySelectorAll(`input[name=${name}]`));
      //   formInputs.forEach((el) => {
      //     (el as HTMLInputElement).checked = false;
      //     const quizOption = (el as HTMLInputElement).parentElement?.getElementsByClassName(
      //       "quizOption"
      //     )[0] as HTMLElement | undefined;
      //     if (!quizOption) return;
      //     quizOption.style.width = "12px";
      //     quizOption.style.height = "12px";
      //   });
      //   const inputEl = (e.currentTarget as HTMLElement).getElementsByTagName("input")[0] as
      //     | HTMLInputElement
      //     | undefined;
      //   if (!inputEl) return;
      //   inputEl.checked = true;
      //   const quizOption = (e.currentTarget as HTMLElement).getElementsByClassName(
      //     "quizOption"
      //   )[0] as HTMLElement | undefined;
      //   if (!quizOption) return;
      //   quizOption.style.width = "8px";
      //   quizOption.style.height = "8px";
      // }}
      className="flex items-center gap-4"
    >
      <input hidden className="hidden" type="radio" name={name} value={optionValue} />
      <div
        contentEditable={false}
        className="flex h-4 w-4 items-center justify-center rounded-full bg-lilac"
      >
        <div className="quizOption h-3 w-3 rounded-full bg-light-lilac"></div>
      </div>
      <span>{children}</span>
    </div>
  );
};

export const QuizBlock = ({ attributes, children, element }: RenderElementProps) => {
  return (
    <div {...attributes} className="border-l-4 border-lilac bg-light-lilac p-4 tracking-wide">
      <h3 className="mb-3 mt-0" contentEditable={false}>
        {(element as QuizBlockElement).quizTitle}
      </h3>
      <form
        data-ans={(element as QuizBlockElement).ans}
        data-formname={(element as QuizBlockElement).formName}
        onSubmit={(e) => {
          e.preventDefault();
          // const val = Object.fromEntries(new FormData(e.target as HTMLFormElement).entries());
          // const ans = (e.target as HTMLFormElement).getAttribute("data-ans");
          // const formname = (e.target as HTMLFormElement).getAttribute("data-formname");
          // if (!ans || !formname) return;
          // let correctAns = false;
          // if (val[formname] === ans) correctAns = true;

          // // save to db

          // const check = (e.currentTarget as HTMLFormElement).getElementsByClassName(
          //   "formCheck"
          // )[0] as HTMLElement | undefined;
          // const correct = (e.currentTarget as HTMLFormElement).getElementsByClassName(
          //   "formCorrect"
          // )[0] as HTMLElement | undefined;
          // const wrong = (e.currentTarget as HTMLFormElement).getElementsByClassName(
          //   "formWrong"
          // )[0] as HTMLElement | undefined;
          // if (!check || !correct || !wrong) return;
          // check.style.display = "none";
          // if (correctAns) correct.style.display = "block";
          // else {
          //   wrong.style.display = "wrong";
          //   const correctAns = e.currentTarget as HTMLFormElement;
          //   wrong.getElementsByTagName("p");
          // }
        }}
        className="quizBlock flex flex-col items-start gap-3"
      >
        {children}
        <button
          contentEditable={false}
          className="formCheck rounded-lg bg-lilac px-6 py-2 text-light-lilac shadow-lg"
        >
          Check
        </button>
        <div
          contentEditable={false}
          className="formCorrect hidden rounded-lg bg-mint-down px-6 py-2 text-light-mint shadow-lg"
        >
          Correct
        </div>
        <div contentEditable={false} className="formWrong hidden">
          <div className="inline-block rounded-lg bg-tomato px-6 py-2 text-light-tomato shadow-lg">
            Wrong
          </div>
          <p className="m-0 pt-1 text-sm text-tomato">sads aDA SD asd asd sa</p>
        </div>
      </form>
    </div>
  );
};

export const withQuiz = (editor: Editor) => {
  const { insertBreak } = editor;
  editor.insertBreak = (...args) => {
    if (isBlockActive(editor, "quizBlock", "type")) {
      const parent = editor.above({
        match: (n) => SlateElement.isElement(n) && n.type === "quizBlock",
      });
      if (!parent) return insertBreak(...args);
      const noOfChildren = parent[0].children.length;
      editor.insertNode({
        type: "quizOption",
        formName: (parent[0] as QuizBlockElement).formName,
        optionValue: (noOfChildren + 1).toString(),
        children: [{ text: "" }],
      });
      return;
    }
    insertBreak(...args);
  };
  return editor;
};

export const CenterQuizBlockSettings = ({
  editor,
  setShowQuizBlockSettings,
}: {
  editor: Editor;
  setShowQuizBlockSettings: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const matching = editor.above({
    match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "quizBlock",
  });
  if (!matching) {
    setShowQuizBlockSettings(false);
    return null;
  }
  const quizBlock = matching[0] as QuizBlockElement;
  const [quizTitle, setQuizTitle] = useState(quizBlock.quizTitle || "");
  const [quizAns, setQuizAns] = useState(quizBlock.ans || "");
  const noOfOptions = quizBlock.children.length;
  console.log(noOfOptions);
  return (
    <div className="fixed left-0 top-0 z-[999] flex h-[100vh] w-[100vw] items-center justify-center backdrop-blur-sm">
      <div className="relative flex w-[80vw] flex-col items-center justify-center rounded-lg border-2 border-primary-dark-gray bg-light-mint p-8">
        <h2 className="py-8 font-mosk text-[2rem] font-bold tracking-wider">Configure Codeblock</h2>
        <button
          onClick={() => setShowQuizBlockSettings(false)}
          className="absolute right-8 top-8 p-2"
        >
          <X size={20} />
        </button>
        <div>
          <label htmlFor="QuizTitle" className="cursor-pointer text-lg">
            Quiz Title
          </label>
          <div className="pt-1">
            <input
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
              id="QuizTitle"
              name="QuizTitle"
              type="text"
              className={"block w-[300px] rounded-md border-2 border-primary-dark-gray px-3 py-2"}
            />
          </div>
        </div>
        <br />
        <div>
          <label htmlFor="QuizAnswer" className="cursor-pointer text-lg">
            Quiz Answer
          </label>
          <div className="pt-1">
            <select
              value={quizAns}
              onChange={(e) => setQuizAns(e.target.value)}
              id="QuizAnswer"
              className={"block w-[300px] rounded-md border-2 border-primary-dark-gray px-3 py-2"}
            >
              {Array.from(Array(noOfOptions)).map((_, index) => (
                <option key={`quizBlockSettingsOption${index}`} value={(index + 1).toString()}>
                  Option {index + 1}
                </option>
              ))}
              {/* {languageList.map((language) => (
                <option key={`codeBlockSettings${language}`} value={language}>
                  {languageListDisplayNames[language]}
                </option>
              ))} */}
            </select>
          </div>
        </div>
        <button
          onClick={() => {
            editor.setNodes(
              { quizTitle, ans: quizAns },
              {
                match: (n) =>
                  SlateElement.isElement(n) && Editor.isBlock(editor, n) && n.type === "quizBlock",
              }
            );
            setShowQuizBlockSettings(false);
          }}
          className="my-8 inline-block rounded-lg bg-primary-dark-gray px-8 py-4 text-background-light-gray"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export const HoveringQuizBlock = ({
  parentRef,
  setShowQuizBlockSettings,
  offsetX = 0,
  offsetY = 10,
}: {
  parentRef: React.MutableRefObject<any>;
  setShowQuizBlockSettings: React.Dispatch<React.SetStateAction<boolean>>;
  offsetX?: number;
  offsetY?: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const editor = useSlate();
  const inFocus = useFocused();

  const prevSelection = useRef<BaseRange | null>();

  useEffect(() => {
    const el = ref.current;
    const { selection } = editor;

    if (!el || !selection) {
      if (el && !selection) el.style.display = "none";
      return;
    }

    prevSelection.current = selection;
    const node = Editor.above(editor, {
      match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "quizBlock",
    });
    if (!node) {
      el.style.display = "none";
      return;
    }
    const linkDOMNode = ReactEditor.toDOMNode(editor, node[0]);

    const {
      x: nodeX,
      height: nodeHeight,
      y: _nodeY,
      width: nodeWidth,
    } = linkDOMNode.getBoundingClientRect();

    const nodeY = _nodeY + document.documentElement.scrollTop;

    let parentNodeX: number = 0;
    if (parentRef.current) parentNodeX = parentRef.current.getBoundingClientRect().x;

    if (
      (!inFocus &&
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        (prevSelection.current === undefined || prevSelection.current === null)) ||
      !Range.isCollapsed(selection)
    ) {
      el.style.display = "none";
      return;
    }

    el.style.display = "flex";
    el.style.top = `${nodeY + nodeHeight + offsetY}px`;
    el.style.left = `${nodeX + nodeWidth / 2 + offsetX - parentNodeX}px`;
    el.style.transform = "translateX(-50%)";
  });

  return (
    <>
      {isBlockActive(editor, "quizBlock", "type") && (
        <div
          ref={ref}
          className="absolute z-[60] flex flex-col items-center justify-start bg-light-yellow shadow-xl"
          role="group"
        >
          <div className="inline-flex rounded-md" role="group">
            <button
              onClick={() => setShowQuizBlockSettings(true)}
              type="button"
              className="rounded-s-lg border border-yellow bg-light-yellow/50 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-yellow"
            >
              Settings
            </button>
            <button
              onClick={() => toggleQuizBlockAtSelection(editor)}
              type="button"
              className="rounded-e-lg border border-yellow bg-light-yellow/50 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-yellow"
            >
              <Trash strokeWidth={1.5} size={20} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export function toggleQuizBlockAtSelection(editor: Editor) {
  Transforms.removeNodes(editor, {
    match: (n) => SlateElement.isElement(n) && n.type === "quizBlock",
  });
}
