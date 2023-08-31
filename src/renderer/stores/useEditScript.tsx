import { create } from 'zustand';
import { EditScriptState } from '../../../@types';

const defaultContent =
  '<h2 style="text-align: center;">Welcome to Shortcut Wizard rich text editor</h2><p><code>RichTextEditor</code> component let you create note quickly and access with a button so you never forget real important information. </p>supports all of its features:</p><ul><li>General text formatting: <strong>bold</strong>, <em>italic</em>, <u>underline</u>, <s>strike-through</s> </li><li>Headings (h1-h6)</li><li>Sub and super scripts (<sup>&lt;sup /&gt;</sup> and <sub>&lt;sub /&gt;</sub> tags)</li><li>Ordered and bullet lists</li><li>Text align&nbsp;</li><li>And more...</li>';

const useEditScriptStore = create<EditScriptState>((set) => ({
  content: defaultContent,
  setContent: (content) => set({ content }),
}));

export default useEditScriptStore;
