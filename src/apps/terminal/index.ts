import { BaseApp } from "../base/types";
import { TerminalAppComponent } from "./components/TerminalAppComponent";

export const TerminalApp: BaseApp = {
  id: "terminal",
  name: "ターミナル",
  icon: {
    type: "image",
    src: "/icons/terminal.png",
  },
  description: "Unixライクなターミナルでシステムとやり取り",
  component: TerminalAppComponent,
  helpItems: [
    {
      icon: "💻",
      title: "基本コマンド",
      description:
        "ls、cd、cat、pwd、clear、touchなどのコマンドを使用して、ファイルを操作・管理します。",
    },
    {
      icon: "🧭",
      title: "ナビゲーション",
      description:
        "Finderと同じ仮想ファイルシステムを、おなじみのUnixコマンドで操作できます。",
    },
    {
      icon: "⌨️",
      title: "コマンド履歴",
      description:
        "↑ / ↓ キーで以前のコマンドを表示し、素早く再実行できます。",
    },
    {
      icon: "🤖",
      title: "AIアシスタント",
      description:
        '"ryo &lt;プロンプト&gt;"と入力して、ターミナル内でRyo AIとチャットできます。',
    },
    {
      icon: "📝",
      title: "ファイル編集",
      description:
        "コマンドプロンプトから直接、テキストエディタ（edit）またはVimスタイルのエディタ（vim）でドキュメントを開けます。",
    },
    {
      icon: "🔊",
      title: "ターミナルサウンド",
      description:
        "出力、エラー、AIの返答に異なるサウンドが再生されます。表示 ▸ サウンド で切り替えられます。",
    },
  ],
  metadata: {
    name: "ターミナル",
    version: "1.0",
    creator: {
      name: "Ryo Lu",
      url: "https://github.com/ryokun6/ryo",
    },
    github: "https://github.com/ryokun6/ryo",
    icon: "/icons/terminal.png",
  },
};

export const appMetadata = TerminalApp.metadata;
export const helpItems = TerminalApp.helpItems;
