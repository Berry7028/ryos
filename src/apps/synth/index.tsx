import { BaseApp } from "../base/types";
import { SynthAppComponent } from "./components/SynthAppComponent";

export const helpItems = [
  {
    icon: "🎹",
    title: "Virtual Keyboard",
    description: "Play notes with on-screen keys or computer keyboard",
  },
  {
    icon: "🎛️",
    title: "Controls Panel",
    description: "Toggle CONTROLS to tweak oscillators, envelope & effects",
  },
  {
    icon: "🔊",
    title: "Presets",
    description: "Save, load & manage custom sound presets",
  },
  {
    icon: "🌈",
    title: "3D Waveform",
    description: "Live animated waveform when controls panel is open",
  },
  {
    icon: "🎚️",
    title: "Effects",
    description: "Reverb, delay, distortion, chorus, phaser & bit-crusher",
  },
  {
    icon: "�",
    title: "MIDI Input",
    description: "Plug in a MIDI keyboard and play instantly",
  },
];

export const appMetadata = {
  name: "Synth",
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
