import { BaseApp } from "../base/types";
import { FinderAppComponent } from "./components/FinderAppComponent";

export const appMetadata = {
  name: "ファインダー",
  version: "1.0.0",
  creator: {
    name: "Ryo",
    url: "https://github.com/ryokun6",
  },
  github: "https://github.com/ryokun6/ryo",
  icon: "/icons/mac.png",
};

export const helpItems = [
  {
    icon: "🔍",
    title: "ブラウズとナビゲーション",
    description:
      "戻る/進むボタン、アドレスバー、移動メニューで素早くナビゲート",
  },
  {
    icon: "📁",
    title: "ファイル管理",
    description:
      "フォルダの作成、名前変更、移動、ドラッグでの整理が可能",
  },
  {
    icon: "👀",
    title: "表示と並べ替え",
    description:
      "アイコンサイズの変更や、名前、種類、サイズ、日付で並べ替え",
  },
  {
    icon: "📍",
    title: "クイックアクセス",
    description:
      "移動メニューから書類、アプリケーション、ゴミ箱に即座にアクセス",
  },
  {
    icon: "ℹ️",
    title: "ストレージ情報",
    description:
      "ウィンドウ下部で空き容量とアイテム数を確認",
  },
  {
    icon: "🗑️",
    title: "ゴミ箱",
    description:
      "ファイルをゴミ箱にドラッグして空にすると完全に削除",
  },
];

export const FinderApp: BaseApp = {
  id: "finder",
  name: "ファインダー",
  description: "ファイルやフォルダの管理と閲覧",
  icon: {
    type: "image",
    src: "/icons/mac.png",
  },
  component: FinderAppComponent,
  helpItems,
  metadata: appMetadata,
};
