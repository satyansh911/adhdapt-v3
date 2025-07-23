"use client";

import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  UnderlineIcon,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  LinkIcon,
  Unlink,
} from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  initialContent?: string;
  onContentChange: (content: string) => void;
  editable?: boolean;
  placeholder?: string;
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  initialContent = "",
  onContentChange,
  editable = true,
  placeholder = "Start writing your journal entry...",
  className,
}) => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const editor = useEditor(
    isClient
      ? {
          extensions: [
            StarterKit.configure({
              heading: {
                levels: [1, 2, 3],
              },
            }),
            Underline,
            Link.configure({
              openOnClick: false,
              autolink: true,
            }),
            Placeholder.configure({
              placeholder,
            }),
          ],
          content: initialContent,
          onUpdate: ({ editor }) => {
            onContentChange(editor.getHTML());
          },
          editable: editable,
          editorProps: {
            attributes: {
              class: cn(
                "prose dark:prose-invert max-w-none focus:outline-none",
                "min-h-[200px] p-4 border border-input rounded-md",
                !editable && "bg-muted/50 cursor-not-allowed"
              ),
            },
          },
          immediatelyRender: false,
        }
      : {
          editable: false,
          extensions: [],
          immediatelyRender: false,
        }
  );

  useEffect(() => {
    if (editor && initialContent !== editor.getHTML()) {
      editor.commands.setContent(initialContent, false);
    }
  }, [editor, initialContent]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty string was set
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    // update link
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className={cn("w-full", className)}>
      {editable && (
        <div className="flex flex-wrap gap-1 p-2 border border-input rounded-t-md bg-muted">
          <Toggle
            size="sm"
            pressed={editor.isActive("heading", { level: 1 })}
            onPressedChange={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            aria-label="Toggle H1"
          >
            <Heading1 className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive("heading", { level: 2 })}
            onPressedChange={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            aria-label="Toggle H2"
          >
            <Heading2 className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive("heading", { level: 3 })}
            onPressedChange={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            aria-label="Toggle H3"
          >
            <Heading3 className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive("bold")}
            onPressedChange={() => editor.chain().focus().toggleBold().run()}
            aria-label="Toggle bold"
          >
            <Bold className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive("italic")}
            onPressedChange={() => editor.chain().focus().toggleItalic().run()}
            aria-label="Toggle italic"
          >
            <Italic className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive("underline")}
            onPressedChange={() =>
              editor.chain().focus().toggleUnderline().run()
            }
            aria-label="Toggle underline"
          >
            <UnderlineIcon className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive("bulletList")}
            onPressedChange={() =>
              editor.chain().focus().toggleBulletList().run()
            }
            aria-label="Toggle bullet list"
          >
            <List className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive("orderedList")}
            onPressedChange={() =>
              editor.chain().focus().toggleOrderedList().run()
            }
            aria-label="Toggle ordered list"
          >
            <ListOrdered className="h-4 w-4" />
          </Toggle>
          <Popover>
            <PopoverTrigger asChild>
              <Toggle
                size="sm"
                pressed={editor.isActive("link")}
                aria-label="Toggle link"
              >
                <LinkIcon className="h-4 w-4" />
              </Toggle>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2">
              <div className="grid gap-2">
                <Label htmlFor="link-url" className="sr-only">
                  URL
                </Label>
                <Input
                  id="link-url"
                  type="url"
                  placeholder="https://example.com"
                  defaultValue={editor.getAttributes("link").href || ""}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const url = (e.target as HTMLInputElement).value;
                      if (url) {
                        editor.chain().focus().setLink({ href: url }).run();
                      } else {
                        editor.chain().focus().unsetLink().run();
                      }
                      (e.target as HTMLInputElement).blur(); // Close popover
                    }
                  }}
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => editor.chain().focus().unsetLink().run()}
                    disabled={!editor.isActive("link")}
                  >
                    <Unlink className="h-4 w-4 mr-2" /> Unlink
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      const url = (
                        document.getElementById("link-url") as HTMLInputElement
                      ).value;
                      if (url) {
                        editor.chain().focus().setLink({ href: url }).run();
                      } else {
                        editor.chain().focus().unsetLink().run();
                      }
                    }}
                  >
                    Set Link
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}
      <EditorContent
        editor={editor}
        className={cn(!editable && "pointer-events-none")}
      />
    </div>
  );
};

export default RichTextEditor;
