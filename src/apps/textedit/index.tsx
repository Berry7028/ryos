import { BaseApp } from "../base/types";
import { TextEditAppComponent } from "./components/TextEditAppComponent";

export const helpItems = [
  {
    icon: "📝",
    title: "Rich Editing",
    description: "Type, copy, cut, paste, undo & redo your text with ease",
  },
  {
    icon: "🎨",
    title: "Formatting",
    description: "Bold, italic, underline, headings & alignment options",
  },
  {
    icon: "📋",
    title: "Lists & Tasks",
    description: "Create bullet, numbered & check-box task lists",
  },
  {
    icon: "💾",
    title: "File Management",
    description:
      "Create, open, save, and export files (HTML, MD, TXT) with auto-save",
  },
  {
    icon: "🎤",
    title: "Voice Dictation",
    description: "Dictate text hands-free right into the document",
  },
  {
    icon: "⚡",
    title: "Slash Commands",
    description: "Type / for quick actions or let Ryo AI edit lines remotely",
  },
];

export const appMetadata = {
  name: "TextEdit",
  version: "1.0",
  creator: {
    name: "Ryo Lu",
    url: "https://ryo.lu",
  },
  github: "https://github.com/ryokun6/ryo",
  icon: "/icons/textedit.png",
};

export const TextEditApp: BaseApp = {
  id: "textedit",
  name: "テキストエディタ",
  icon: { type: "image", src: appMetadata.icon },
  description: "シンプルなリッチテキストエディタ",
  component: TextEditAppComponent,
  helpItems,
  metadata: appMetadata,
};
