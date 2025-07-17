import { BaseApp } from "../base/types";
import { ChatsAppComponent } from "./components/ChatsAppComponent";

export const helpItems = [
  {
    icon: "💬",
    title: "Chat with Ryo",
    description:
      "Type your message to chat with Ryo, generate code, or help with ryo.",
  },
  {
    icon: "#️⃣",
    title: "Join Chat Rooms",
    description:
      "Connect with netizens in public chat rooms.",
  },
  {
    icon: "🎤",
    title: "Push to Talk",
    description:
      "Hold Space or tap the microphone button to record and send voice messages.",
  },
  {
    icon: "📝",
    title: "Control TextEdit",
    description:
      "Ask Ryo to read, insert, replace, or delete lines in your open TextEdit document.",
  },
  {
    icon: "🚀",
    title: "Control Apps",
    description:
      "Ask Ryo to launch or close other applications like Internet Explorer or Video Player.",
  },
  {
    icon: "💾",
    title: "Save Transcript",
    description:
      "Save your current chat conversation with Ryo as a Markdown file.",
  },
];

export const appMetadata = {
  name: "Chats",
  version: "1.0",
  creator: {
    name: "Ryo Lu",
    url: "https://ryo.lu",
  },
  github: "https://github.com/ryokun6/ryo",
  icon: "/icons/question.png",
};

export const ChatsApp: BaseApp = {
  id: "chats",
  name: "チャット",
  icon: { type: "image", src: "/icons/internet.png" },
  description: "Ryoと他のAIモデルとの会話",
  component: ChatsAppComponent,
  helpItems,
  metadata: appMetadata,
};
