/** @jsxImportSource react */
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Baseline,
  Bold,
  Code,
  FileCode,
  Film,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Image,
  Italic,
  Link2,
  List,
  ListOrdered,
  PaintBucket,
  Pilcrow,
  Quote,
  Strikethrough,
  Subscript,
  Superscript,
  Underline,
} from "lucide-react";
import {
  BlockButton,
  CodeBlockButton,
  EmbedButton,
  ImageButton,
  LinkButton,
} from "~/components/ContentEditor/blockFn";
import {
  BackgroundMarkButton,
  ColorMarkButton,
  MarkButton,
  UnderlineMarkButton,
} from "~/components/ContentEditor/markFn";

const Toolbar = ({
  setShowImageChooser,
}: {
  setShowImageChooser: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <div className="absolute left-0 top-0 z-[100] flex w-full flex-wrap items-center justify-center gap-4 rounded-lg border-2 border-mint bg-light-mint p-4">
      <MarkButton format="bold" children={<Bold size={20} />} />
      <MarkButton format="italic" children={<Italic size={20} />} />
      <MarkButton format="strikethrough" children={<Strikethrough size={20} />} />
      <UnderlineMarkButton format="underline" children={<Underline size={20} />} />
      <BackgroundMarkButton format="background" children={<PaintBucket size={20} />} />
      <ColorMarkButton format="color" children={<Baseline size={20} />} />
      <MarkButton format="code" children={<Code size={20} />} />
      <MarkButton format="superscript" children={<Superscript size={20} />} />
      <MarkButton format="subscript" children={<Subscript size={20} />} />
      <BlockButton format="paragraph" children={<Pilcrow size={20} />} />
      <BlockButton format="heading-one" children={<Heading1 size={20} />} />
      <BlockButton format="heading-two" children={<Heading2 size={20} />} />
      <BlockButton format="heading-three" children={<Heading3 size={20} />} />
      <BlockButton format="heading-four" children={<Heading4 size={20} />} />
      <BlockButton format="block-quote" children={<Quote size={18} />} />
      <BlockButton format="numbered-list" children={<ListOrdered size={20} />} />
      <BlockButton format="bulleted-list" children={<List size={20} />} />
      <BlockButton format="left" children={<AlignLeft size={20} />} />
      <BlockButton format="center" children={<AlignCenter size={20} />} />
      <BlockButton format="right" children={<AlignRight size={20} />} />
      <LinkButton format="link" children={<Link2 size={20} />} />
      <ImageButton
        setShowImageChooser={setShowImageChooser}
        format="image"
        children={<Image size={20} />}
      />
      <EmbedButton format="embed" children={<Film size={20} />} />
      <CodeBlockButton format="codeBlock" children={<FileCode size={20} />} />
    </div>
  );
};

export default Toolbar;