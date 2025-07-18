import { BaseApp } from "../base/types";
import { PhotoBoothComponent } from "./components/PhotoBoothComponent";

export const appMetadata = {
  name: "フォトブース",
  version: "1.0.0",
  creator: {
    name: "Ryo",
    url: "https://github.com/ryokun6",
  },
  github: "https://github.com/ryokun6/ryo",
  icon: "/icons/photo-booth.png",
};

export const helpItems = [
  {
    icon: "📸",
    title: "写真を撮る",
    description:
      "赤い大きなカメラボタンをクリックして写真を1枚撮影します。",
  },
  {
    icon: "⏱️",
    title: "連続撮影",
    description:
      "タイマーボタン（カメラボタンの左）をクリックすると、1秒間隔で4枚の写真を連続撮影します。",
  },
  {
    icon: "🎨",
    title: "エフェクトの適用",
    description:
      "「エフェクト」ボタン（カメラボタンの右）をクリックして、ライブカメラの映像に楽しいフィルターを適用できます。",
  },
  {
    icon: "🖼️",
    title: "写真の表示",
    description:
      "写真スタックボタン（一番左）をクリックすると、下部に保存したすべての写真が表示されるフォトストリップが表示/非表示になります。",
  },
  {
    icon: "💾",
    title: "写真のダウンロード",
    description:
      "写真は自動的に保存されます。フォトストリップ内の写真をクリックするとダウンロードできます。",
  },
  {
    icon: "📷",
    title: "カメラの切り替え",
    description:
      "メニューバーの「表示」メニューから、接続されている複数のカメラを切り替えることができます。",
  },
];

export const PhotoBoothApp: BaseApp = {
  id: "photo-booth",
  name: "フォトブース",
  icon: { type: "image", src: "/icons/photo-booth.png" },
  description: "カメラで写真撮影と楽しいエフェクトの適用",
  component: PhotoBoothComponent,
  helpItems,
  metadata: appMetadata,
};
