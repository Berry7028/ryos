import { BaseApp, InternetExplorerInitialData } from "../base/types";
import { InternetExplorerAppComponent } from "./components/InternetExplorerAppComponent";

export const helpItems = [
  {
    icon: "🌐",
    title: "ウェブを閲覧",
    description:
      "URLを入力し、ナビゲーションボタン（戻る、進む、更新、停止）を使用します。",
  },
  {
    icon: "🌌",
    title: "時を旅する",
    description:
      "ドロップダウンから年を選択して、過去や未来のウェブサイトを表示します。",
  },
  {
    icon: "✨",
    title: "再現された歴史",
    description:
      "AIが非常に古いサイト（1996年以前）を再構築し、将来のウェブ体験を想像します。",
  },
  {
    icon: "⭐",
    title: "お気に入りに保存",
    description:
      "サイトや特定の年をお気に入りバーに追加して、簡単にアクセスできます。",
  },
  {
    icon: "🔮",
    title: "タイムノードを探索",
    description:
      "アドレスバーの時計アイコンをクリックして、現在のサイトの時系列のスナップショットを確認します。",
  },
  {
    icon: "🔗",
    title: "共有する",
    description:
      "共有ボタンを使用して、表示中の正確なページと年のリンクを生成します。",
  },
];

export const appMetadata = {
  version: "1.02",
  name: "インターネット エクスプローラー",
  creator: {
    name: "Ryo Lu",
    url: "https://ryo.lu",
  },
  github: "https://github.com/ryokun6/ryo",
  icon: "/icons/ie.png",
};

export const InternetExplorerApp: BaseApp<InternetExplorerInitialData> = {
  id: "internet-explorer",
  name: "インターネット エクスプローラー",
  description: "レトロなWebブラウザ",
  icon: { type: "image", src: "/icons/ie.png" },
  component: InternetExplorerAppComponent,
  helpItems,
  metadata: appMetadata,
};
