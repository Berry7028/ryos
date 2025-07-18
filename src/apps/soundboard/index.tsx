import { BaseApp } from "../base/types";
import { SoundboardAppComponent } from "./components/SoundboardAppComponent";

export const helpItems = [
  {
    icon: "🎙️",
    title: "録音スロット",
    description: "スロットをクリックして録音を開始、もう一度クリックで停止します",
  },
  {
    icon: "▶️",
    title: "キーボード再生",
    description: "1-9のキーを押して即座にサウンドを再生",
  },
  {
    icon: "🌊",
    title: "波形表示",
    description: "録音・再生中にリアルタイムで波形を確認",
  },
  {
    icon: "✏️",
    title: "スロットのカスタマイズ",
    description: "絵文字とタイトルを追加してサンプルを簡単に識別",
  },
  {
    icon: "📂",
    title: "複数ボード",
    description: "サウンドセットごとにボードを作成・切り替え",
  },
  {
    icon: "🌍",
    title: "インポート / エクスポート",
    description: "ボードをファイルとして共有、ドラッグ&ドロップでインポート",
  },
];

export const appMetadata = {
  name: "サウンドボード",
  version: "0.2",
  creator: {
    name: "Ryo Lu",
    url: "https://ryo.lu",
  },
  github: "https://github.com/ryokun6/ryo",
  icon: "/icons/cdrom.png",
};

export const SoundboardApp: BaseApp = {
  id: "soundboard",
  name: "サウンドボード",
  icon: { type: "image", src: "/icons/sounds.png" },
  description: "効果音とサウンドの再生",
  component: SoundboardAppComponent,
  helpItems,
  metadata: appMetadata,
};
