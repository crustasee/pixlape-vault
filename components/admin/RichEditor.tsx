// components/admin/RichEditor.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { uploadToCloudinary } from "@/app/actions/cloudinary-actions";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Minus,
  Image as ImageIcon,
  Link as LinkIcon,
  Unlink,
  Undo,
  Redo,
  Eraser,
  Upload,
} from "lucide-react";

interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}

function ToolbarButton({
  onClick,
  isActive = false,
  disabled = false,
  title,
  children,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-1.5 rounded text-xs font-mono transition-all flex items-center justify-center cursor-pointer ${
        disabled
          ? "opacity-30 cursor-not-allowed text-gray-400"
          : isActive
          ? "bg-primary text-black-primary border border-black-primary shadow-xs font-bold"
          : "bg-white text-black-secondary border border-transparent hover:border-black-primary hover:text-black-primary"
      }`}
    >
      {children}
    </button>
  );
}

interface RichEditorProps {
  name?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
  className?: string;
}

export default function RichEditor({
  name,
  value,
  defaultValue = "",
  onChange,
  placeholder = "Write description or rich editorial content...",
  minHeight = "180px",
  className = "",
}: RichEditorProps) {
  const initialContent = value !== undefined ? value : defaultValue;
  const [content, setContent] = useState(initialContent);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-emerald-600 underline font-semibold hover:text-emerald-800",
        },
      }),
    ],
    content: initialContent,
    onUpdate: ({ editor: currentEditor }) => {
      const html = currentEditor.getHTML();
      setContent(html);
      onChange?.(html);
    },
    editorProps: {
      attributes: {
        class:
          "prose max-w-none text-xs font-mono text-black-primary leading-relaxed focus:outline-none p-3.5",
        style: `min-height: ${minHeight};`,
      },
    },
  });

  // Sync editor if external value prop updates
  useEffect(() => {
    if (editor && value !== undefined && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) {
    return (
      <div
        className={`border border-black-primary rounded-md bg-white p-4 font-mono text-xs text-black-secondary flex items-center justify-center ${className}`}
        style={{ minHeight }}
      >
        <span>INITIALIZING RICH EDITOR...</span>
      </div>
    );
  }

  const addImageByUrl = () => {
    const url = prompt("Enter Image URL (e.g. /img/... or https://...):");
    if (url && url.trim()) {
      editor.chain().focus().setImage({ src: url.trim() }).run();
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please choose a valid image file.");
      return;
    }

    setIsUploadingImage(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        try {
          const base64 = reader.result as string;
          const result = await uploadToCloudinary(base64, "editor");
          if (result.success && result.url) {
            editor.chain().focus().setImage({ src: result.url }).run();
          } else {
            alert(result.error || "Failed to upload image.");
          }
        } catch (err) {
          console.error("Editor image upload failed:", err);
          alert("Image upload error.");
        } finally {
          setIsUploadingImage(false);
        }
      };
    } catch {
      setIsUploadingImage(false);
    }
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = prompt("Enter URL:", previousUrl);

    if (url === null) return;

    if (url.trim() === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
  };

  return (
    <div
      className={`border border-black-primary rounded-md bg-white overflow-hidden font-mono shadow-xs ${className}`}
    >
      {/* Rich Text Toolbar */}
      <div className="bg-surface border-b border-black-primary px-2.5 py-1.5 flex flex-wrap items-center gap-1">
        {/* Headings */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive("heading", { level: 1 })}
          title="Heading 1"
        >
          <Heading1 size={14} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          <Heading2 size={14} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive("heading", { level: 3 })}
          title="Heading 3"
        >
          <Heading3 size={14} />
        </ToolbarButton>

        <div className="w-px h-4 bg-border mx-1" />

        {/* Text Formatting */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          title="Bold (Ctrl+B)"
        >
          <Bold size={14} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          title="Italic (Ctrl+I)"
        >
          <Italic size={14} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive("strike")}
          title="Strikethrough"
        >
          <Strikethrough size={14} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive("code")}
          title="Inline Code"
        >
          <Code size={14} />
        </ToolbarButton>

        <div className="w-px h-4 bg-border mx-1" />

        {/* Lists & Blockquote */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          title="Bullet List"
        >
          <List size={14} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          title="Numbered List"
        >
          <ListOrdered size={14} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
          title="Blockquote"
        >
          <Quote size={14} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal Divider"
        >
          <Minus size={14} />
        </ToolbarButton>

        <div className="w-px h-4 bg-border mx-1" />

        {/* Media & Links */}
        <div className="relative flex items-center">
          <label
            htmlFor="editor-img-upload"
            className={`p-1.5 rounded text-xs font-mono transition-all flex items-center justify-center cursor-pointer bg-white text-black-secondary border border-transparent hover:border-black-primary hover:text-black-primary ${
              isUploadingImage ? "opacity-50 pointer-events-none" : ""
            }`}
            title="Upload Image to Cloudinary"
          >
            <Upload size={14} />
          </label>
          <input
            id="editor-img-upload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            disabled={isUploadingImage}
          />
        </div>

        <ToolbarButton onClick={addImageByUrl} title="Insert Image by URL">
          <ImageIcon size={14} />
        </ToolbarButton>

        <ToolbarButton
          onClick={setLink}
          isActive={editor.isActive("link")}
          title="Add Link"
        >
          <LinkIcon size={14} />
        </ToolbarButton>

        {editor.isActive("link") && (
          <ToolbarButton
            onClick={() => editor.chain().focus().unsetLink().run()}
            title="Remove Link"
          >
            <Unlink size={14} />
          </ToolbarButton>
        )}

        <ToolbarButton
          onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
          title="Clear Formatting"
        >
          <Eraser size={14} />
        </ToolbarButton>

        <div className="w-px h-4 bg-border mx-1" />

        {/* Undo / Redo */}
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo (Ctrl+Z)"
        >
          <Undo size={14} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo (Ctrl+Y)"
        >
          <Redo size={14} />
        </ToolbarButton>
      </div>

      {/* Editor Content Area */}
      <div className="bg-white min-h-40">
        <EditorContent editor={editor} />
      </div>

      {/* Hidden input for standard form submission */}
      {name && <input type="hidden" name={name} value={content} />}
    </div>
  );
}