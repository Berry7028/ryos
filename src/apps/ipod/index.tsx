import { BaseApp, IpodInitialData } from "../base/types";
import { IpodAppComponent } from "./components/IpodAppComponent";

export const helpItems = [
  {
    icon: "🎵",
    title: "楽曲を追加",
    description: "YouTubeのURLを貼り付けてiPodに音楽を追加します。",
  },
  {
    icon: "🔄",
    title: "ホイール操作",
    description: "クリックホイールを使ってメニューや音楽ライブラリを操作します。",
  },
  {
    icon: "⏯️",
    title: "再生コントロール",
    description: "再生、一時停止、曲のスキップなど、現在の曲をコントロールします。",
  },
  {
    icon: "🎤",
    title: "歌詞同期表示",
    description: "時間同期された歌詞を表示し、即座に翻訳を取得できます。",
  },
  {
    icon: "⚙️",
    title: "再生モード",
    description: "シャッフル再生、リピート再生、プレイリスト再生などの設定が可能です。",
  },
  {
    icon: "📺",
    title: "表示設定",
    description: "バックライトの調整、テーマの変更、フルスクリーンビデオへの切り替えができます。",
  },
];

export const appMetadata = {
  name: "iPod",
  version: "1.0",
  creator: {
    name: "Ryo Lu",
    url: "https://ryo.lu",
  },
  github: "https://github.com/ryokun6/ryo",
  icon: "/icons/ipod.png",
};

export const IpodApp: BaseApp<IpodInitialData> = {
  id: "ipod",
  name: "アイポッド",
  icon: { type: "image", src: "/icons/ipod.png" },
  description: "音楽プレーヤー",
  component: IpodAppComponent,
  helpItems,
  metadata: appMetadata,
};
