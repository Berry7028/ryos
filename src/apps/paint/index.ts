import { PaintAppComponent } from "./components/PaintAppComponent";
import type { BaseApp, PaintInitialData } from "../base/types";

export const helpItems = [
  {
    icon: "✏️",
    title: "描画ツール",
    description:
      "左側のツールバーから、鉛筆、ブラシ、図形などの様々な描画ツールを選択できます。",
  },
  {
    icon: "🎨",
    title: "色の選択",
    description:
      "ツールの下にあるカラーパレットから色を選んで、描画色を変更できます。",
  },
  {
    icon: "↩️",
    title: "元に戻す",
    description: "⌘Zを押すか、編集メニューから「元に戻す」を選択して、直前の操作を取り消せます。",
  },
  {
    icon: "💾",
    title: "保存",
    description:
      "ファイルメニューから「保存」を選択して作品を保存するか、「別名で保存」を選んで新しい名前で保存できます。",
  },
  {
    icon: "🔲",
    title: "パターン",
    description:
      "下部のパレットから様々なパターンを選んで、図形や領域を塗りつぶせます。",
  },
  {
    icon: "✨",
    title: "フィルター",
    description:
      "フィルターメニューから、色反転、グレースケール、明るさ調整などの効果を適用できます。",
  },
];

export const appMetadata = {
  name: "MacPaint",
  version: "1.0.4",
  creator: {
    name: "Ryo Lu",
    url: "https://github.com/ryokun6",
  },
  github: "https://github.com/ryokun6/ryo",
  icon: "/icons/paint.png",
};

export const PaintApp: BaseApp<PaintInitialData> = {
  id: "paint",
  name: "ペイント",
  icon: { type: "image", src: "/icons/paint.png" },
  description: "クラシックなMacPaintスタイルの描画アプリ",
  component: PaintAppComponent,
  helpItems,
  metadata: appMetadata,
};
