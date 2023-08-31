import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';
import './editor.css';
import useEditScriptStore from 'renderer/stores/useEditScript';
import { useEffect } from 'react';
import { Button, Paper } from '@mantine/core';
import { useDebouncedState, useDebouncedValue } from '@mantine/hooks';

export default function TextEditor() {
  const [content, setContent] = useEditScriptStore((state) => [
    state.content,
    state.setContent,
  ]);

  const [debouncedContent] = useDebouncedValue(content, 10000);
  const [showSaveBtn, setShowSaveBtn] = useDebouncedState(true, 5000, {
    leading: true,
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content,
  });

  useEffect(() => {
    editor?.on('update', ({ editor: e }) => {
      setContent(e.getHTML());
      setShowSaveBtn(false);
      setShowSaveBtn(true);
    });
  }, [setShowSaveBtn, setContent, editor]);

  useEffect(() => {
    // todo: debounced save to local
    console.log('should save to local');
  }, [debouncedContent]);

  return (
    <Paper className="relative p-2">
      <RichTextEditor editor={editor}>
        <RichTextEditor.Toolbar sticky stickyOffset={60}>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold />
            <RichTextEditor.Italic />
            <RichTextEditor.Underline />
            <RichTextEditor.Strikethrough />
            <RichTextEditor.ClearFormatting />
            <RichTextEditor.Highlight />
            <RichTextEditor.Code />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.H1 />
            <RichTextEditor.H2 />
            <RichTextEditor.H3 />
            <RichTextEditor.H4 />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Blockquote />
            <RichTextEditor.Hr />
            <RichTextEditor.BulletList />
            <RichTextEditor.OrderedList />
            <RichTextEditor.Subscript />
            <RichTextEditor.Superscript />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Link />
            <RichTextEditor.Unlink />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.AlignLeft />
            <RichTextEditor.AlignCenter />
            <RichTextEditor.AlignJustify />
            <RichTextEditor.AlignRight />
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>

        <RichTextEditor.Content />
      </RichTextEditor>
      {showSaveBtn && (
        <Button.Group className="absolute bottom-4 right-4">
          <Button variant="default">Save</Button>
        </Button.Group>
      )}
    </Paper>
  );
}
