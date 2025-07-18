import { BaseApp } from "../base/types";
import { SynthAppComponent } from "./components/SynthAppComponent";

export const helpItems = [
  {
    icon: "🎹",
    title: "バーチャルキーボード",
    description: "画面上のキーまたはコンピュータのキーボードで演奏",
  },
  {
    icon: "🎛️",
    title: "コントロールパネル",
    description: "CONTROLSを切り替えてオシレーター、エンベロープ、エフェクトを調整",
  },
  {
    icon: "🔊",
    title: "プリセット",
    description: "カスタムサウンドプリセットの保存、読み込み、管理",
  },
  {
    icon: "🌈",
    title: "3Dウェーブフォーム",
    description: "コントロールパネルを開いている間のライブアニメーション波形",
  },
  {
    icon: "🎚️",
    title: "エフェクト",
    description: "リバーブ、ディレイ、ディストーション、コーラス、フェイザー、ビットクラッシャー",
  },
  {
    icon: "🎛️",
    title: "MIDI入力",
    description: "MIDIキーボードを接続してすぐに演奏",
  },
];

export const appMetadata = {
  name: "シンセサイザー",
  version: "0.1",
  creator: {
    name: "Ryo Lu",
    url: "https://ryo.lu",
  },
  github: "https://github.com/ryokun6/ryo",
  icon: "/icons/synth.png",
};

export const SynthApp: BaseApp = {
  id: "synth",
  name: "シンセサイザー",
  icon: { type: "image", src: "/icons/synth.png" },
  description: "シンプルなシンセサイザーとサウンド生成",
  component: SynthAppComponent,
  helpItems,
  metadata: appMetadata,
};
