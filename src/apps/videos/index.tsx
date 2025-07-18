import { BaseApp, VideosInitialData } from "../base/types";
import { VideosAppComponent } from "./components/VideosAppComponent";

export const helpItems = [
  {
    icon: "🎥",
    title: "動画を追加",
    description: "YouTubeのURLを貼り付けてプレイリストに追加",
  },
  {
    icon: "▶️",
    title: "再生コントロール",
    description: "再生、一時停止、次へ、前へ",
  },
  {
    icon: "🔁",
    title: "ループ再生",
    description: "現在の動画またはプレイリスト全体をループ",
  },
  {
    icon: "🔀",
    title: "シャッフル",
    description: "プレイリストをランダムに再生",
  },
  {
    icon: "📝",
    title: "プレイリスト",
    description: "動画プレイリストの管理と整理",
  },
  {
    icon: "🎨",
    title: "レトロUI",
    description: "クラシックなQuickTime風デザイン",
  },
];

export const appMetadata = {
  name: "ビデオ",
  version: "0.1",
  creator: {
    name: "Ryo Lu",
    url: "https://ryo.lu",
  },
  github: "https://github.com/ryokun6/ryo",
  icon: "/icons/videos.png",
};

export const VideosApp: BaseApp<VideosInitialData> = {
  id: "videos",
  name: "ビデオ",
  icon: { type: "image", src: "/icons/videos.png" },
  description: "ビデオプレーヤー",
  component: VideosAppComponent,
  helpItems,
  metadata: appMetadata,
};
