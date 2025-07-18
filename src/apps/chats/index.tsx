import { BaseApp } from "../base/types";
import { ChatsAppComponent } from "./components/ChatsAppComponent";

export const helpItems = [
  {
    icon: "💬",
    title: "Ryoとチャット",
    description:
      "Ryoと会話したり、コードを生成したり、ryoのサポートを受けたりできます。",
  },
  {
    icon: "#️⃣",
    title: "チャットルームに参加",
    description:
      "公開チャットルームで他のユーザーと交流できます。",
  },
  {
    icon: "🎤",
    title: "プッシュ・トゥ・トーク",
    description:
      "スペースキーを押すかマイクボタンをタップして、音声メッセージを録音・送信します。",
  },
  {
    icon: "📝",
    title: "テキストエディタの操作",
    description:
      "Ryoに依頼して、開いているテキストエディタのドキュメントの読み取り、行の挿入・置換・削除ができます。",
  },
  {
    icon: "🚀",
    title: "アプリの操作",
    description:
      "Ryoに依頼して、Internet Explorerやビデオプレーヤーなどの他のアプリケーションを起動・終了できます。",
  },
  {
    icon: "💾",
    title: "トーク履歴を保存",
    description:
      "現在のRyoとの会話をMarkdownファイルとして保存できます。",
  },
];

export const appMetadata = {
  name: "チャット",
  version: "1.0",
  creator: {
    name: "Ryo Lu",
    url: "https://ryo.lu",
  },
  github: "https://github.com/ryokun6/ryo",
  icon: "/icons/internet.png",
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
