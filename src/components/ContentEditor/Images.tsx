/* eslint-disable qwik/jsx-img */
/** @jsxImportSource react */
import imageExtensions from "image-extensions";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { Editor, Element as SlateElement, Transforms } from "slate";
import type { RenderElementProps } from "slate-react";
import { ReactEditor, useFocused, useSelected, useSlateStatic } from "slate-react";
import uploadToCloudinary from "~/components/ContentEditor/uploadToCloudinaryContentEditor";
import { CLOUDINARY_MAX_IMG_SIZE, CLOUDINARY_MAX_PIXEL_COUNT } from "~/const/cloudinary";
import type { CloudinaryPublicPic } from "~/types/Cloudinary";
import { isUrl } from "~/utils/isUrl";

// export const withImages = (editor: Editor) => {
//   const { insertData, isVoid } = editor;

//   editor.isVoid = (element) => {
//     return element.type === "image" ? true : isVoid(element);
//   };

//   editor.insertData = (data) => {
//     const text = data.getData("text/plain");
//     const { files } = data;

//     if (files && files.length > 0) {
//       for (const file of files) {
//         const reader = new FileReader();
//         const [mime] = file.type.split("/");

//         if (mime === "image") {
//           reader.addEventListener("load", () => {
//             const url = reader.result;
//             if (!url) return;
//             insertImage(editor, url.toString());
//           });

//           reader.readAsDataURL(file);
//         }
//       }
//     } else if (isImageUrl(text)) {
//       insertImage(editor, text);
//     } else {
//       insertData(data);
//     }
//   };

//   return editor;
// };

export const ImageBlock = ({ attributes, children, element }: RenderElementProps) => {
  const editor = useSlateStatic();
  const path = ReactEditor.findPath(editor, element);

  const selected = useSelected();
  const focused = useFocused();
  return (
    <div {...attributes}>
      {children}
      <div contentEditable={false}>
        <img src={element.url} />
      </div>
    </div>
  );
};
export const isImageUrl = (url: string) => {
  if (!url) return false;
  if (!isUrl(url)) return false;
  const ext = new URL(url).pathname.split(".").pop();
  if (!ext) return false;
  return imageExtensions.includes(ext);
};

export const CenterImageChooser = ({
  editor,
  userImages,
  userId,
  setShowImageChooser,
}: {
  editor: Editor;
  userImages: [Promise<string>, CloudinaryPublicPic][];
  userId: string;
  setShowImageChooser: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [resolvedUserImages, setResolvedUserImages] = useState<[string, CloudinaryPublicPic][]>([]);
  const [isUploading, setIsUploading] = useState(false);
  useEffect(() => {
    (async () => {
      const t = await Promise.allSettled(userImages.map((x) => x[0]));
      const t2 = t.map((res, index) => [res, userImages[index][1]]) as [
        PromiseSettledResult<string>,
        CloudinaryPublicPic,
      ][];
      setResolvedUserImages(
        t2
          .filter((r) => r[0].status === "fulfilled")
          .map((r) => [(r[0] as PromiseFulfilledResult<string>).value, r[1]]) as [
          string,
          CloudinaryPublicPic,
        ][]
      );
    })();
  }, []);
  return (
    <div className="absolute left-[50%] top-[50%] z-[100] flex w-[80vw] -translate-x-[50%] -translate-y-[50%] flex-col items-center justify-center rounded-lg border-2 border-primary-dark-gray bg-light-mint p-8">
      <h2 className="pb-8 font-mosk text-[2rem] font-bold tracking-wider">Select Image</h2>
      <button onClick={() => setShowImageChooser(false)} className="absolute right-8 top-8 p-2">
        <X size={20} />
      </button>
      {resolvedUserImages.length === 0 && (
        <div className="text-lg tracking-wide">
          Uh Oh. It seems like you haven't uploaded any images yet.
        </div>
      )}
      {resolvedUserImages.length > 0 && (
        <div className="mx-auto grid max-h-[60vh] w-full  items-start justify-center gap-6 overflow-auto [grid-template-columns:repeat(auto-fill,220px)] [grid-template-rows:repeat(auto-fit,220px)]">
          {resolvedUserImages.map(([blobUrl, imgData]) => (
            <button
              key={`resolvedUserImages${blobUrl}`}
              className="flex h-[220px] w-[220px] flex-col items-stretch justify-stretch rounded-lg border-2 border-light-mint p-2 hover:border-pink hover:bg-light-pink"
              onClick={() => {
                ReactEditor.focus(editor);
                if (!editor.selection) return;
                const block = Editor.above(editor, {
                  match: (n) => SlateElement.isElement(n) && Editor.isBlock(editor, n),
                });
                const path = block ? block[1] : [];
                const start = Editor.start(editor, path);
                const end = Editor.end(editor, path);
                const w1 = Editor.string(editor, { anchor: editor.selection.anchor, focus: start });
                const w2 = Editor.string(editor, { anchor: editor.selection.anchor, focus: end });
                if (w1 === "" && w2 === "") {
                  Transforms.unwrapNodes(editor);
                }
                editor.insertNode(
                  {
                    type: "image",
                    url: blobUrl,
                    public_id: imgData.public_id,
                    children: [{ text: "" }],
                  },
                  {
                    at: editor.selection,
                  }
                );
                setShowImageChooser(false);
                // ReactEditor.deselect(editor);
              }}
            >
              <img
                width={220}
                height={220}
                className="h-full w-full object-contain object-center"
                src={blobUrl}
                key={`CenterImageChooser${blobUrl}`}
              />
            </button>
          ))}
        </div>
      )}
      <div className="pt-8">
        <label htmlFor="uploadImage">
          {!isUploading ? (
            <p className="cursor-pointer text-lg underline decoration-wavy underline-offset-8">
              {resolvedUserImages.length === 0
                ? "start by uploading an image"
                : "or upload a new picture"}
            </p>
          ) : (
            <span>
              <svg
                aria-hidden="true"
                className="inline-block h-4 w-4 animate-spin fill-background-light-gray text-primary-dark-gray"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
            </span>
          )}
          <input
            onChange={(e) => {
              if (!e.target.files || e.target.files.length === 0) return;
              const file = e.target.files[0];
              const reader = new FileReader();
              reader.readAsDataURL(file);
              reader.onabort = () => alert("Cannot load image!");
              reader.onerror = () => alert("Cannot load image!");
              reader.onload = () => {
                if (!reader.result) {
                  alert("Cannot load image!");
                  return;
                }
                const img = new Image();
                img.src = reader.result as string;
                img.onload = async () => {
                  if (
                    file.size > CLOUDINARY_MAX_IMG_SIZE ||
                    img.width * img.height > CLOUDINARY_MAX_PIXEL_COUNT
                  ) {
                    alert("The picture is too large!");
                    return;
                  }
                  setIsUploading(true);
                  try {
                    const res = (await uploadToCloudinary(
                      reader.result as string,
                      userId
                    )) as CloudinaryPublicPic;
                    console.log("URL", res.secure_url);
                    const blob = await fetch(res.secure_url)
                      .then((res) => res.blob())
                      .then((blob) => URL.createObjectURL(blob));
                    console.log("BLOB", blob);
                    // put the new image at front since we sorted it by created_at desc
                    setResolvedUserImages([[blob, res], ...resolvedUserImages]);
                    setIsUploading(false);
                  } catch (e) {
                    alert(e);
                    setIsUploading(false);
                  }
                };
              };
            }}
            type="file"
            className="hidden"
            id="uploadImage"
          ></input>
        </label>
      </div>
    </div>
  );
};
