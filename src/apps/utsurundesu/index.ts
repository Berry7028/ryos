import { BaseApp } from "../base/types";
import { UtsurundesuAppComponent } from "./components/UtsurundesuAppComponent";

const helpItems = [
  {
    icon: "📸",
    title: "写真を撮る",
    description: "カメラボタンを押して写真を撮影します。自動的にレトロなフィルターが適用されます。",
  },
  {
    icon: "🖼️",
    title: "写真をダウンロード",
    description: "撮影後、ダウンロードボタンで写真を保存できます。",
  },
  {
    icon: "🔄",
    title: "撮り直し",
    description: "「撮り直す」ボタンで、もう一度写真を撮り直せます。",
  },
  {
    icon: "🔍",
    title: "フィルターについて",
    description: "レトロな雰囲気のフィルターが自動で適用され、ビンテージカメラで撮影したような味わいになります。",
  },
];

const metadata: BaseApp = {
  id: "utsurundesu" as const,
  name: "写るんです",
  description: "レトロなフィルターで写真を撮影できるカメラアプリ",
  icon: { type: "image", src: "/icons/utsurundesu.png" }, // ユーザーがアイコンを提供するまで仮のパス
  component: UtsurundesuAppComponent,
  helpItems,
  windowConstraints: {
    minWidth: 600,
    minHeight: 800,
  },
};

export const utsurundesuApp = {
  ...metadata,
  metadata,
} as const;
