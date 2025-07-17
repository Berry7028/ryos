import { BaseApp, ControlPanelsInitialData } from "../base/types";
import { ControlPanelsAppComponent } from "./components/ControlPanelsAppComponent";

export const helpItems = [
  {
    icon: "🎨",
    title: "Appearance",
    description:
      "Choose photos, patterns, or shader effects for your desktop wallpaper",
  },
  {
    icon: "🔊",
    title: "Sounds",
    description: "Toggle UI sounds, typing synth, and Terminal / IE effects",
  },
  {
    icon: "🤖",
    title: "AI Model",
    description: "Select the AI model used by Chats and Terminal assistant",
  },
  {
    icon: "🌌",
    title: "Shader Effects",
    description: "Enable CRT, Galaxy, or Aurora visual effects",
  },
  {
    icon: "📦",
    title: "Backup & Restore",
    description: "Export or restore all settings and files",
  },
  {
    icon: "⚙️",
    title: "System",
    description: "Reset preferences or format the virtual file system",
  },
];

export const appMetadata = {
  name: "Control Panels",
  version: "1.0.0",
  creator: {
    name: "System",
    url: "https://github.com/ryokun6",
  },
  github: "https://github.com/ryokun6/ryo",
  icon: "/icons/control-panels/appearance-manager/app.png",
};

const ControlPanelsApp: BaseApp<ControlPanelsInitialData> = {
  id: "control-panels",
  name: "コントロールパネル",
  description: "システム設定とコントロールパネル",
  component: ControlPanelsAppComponent,
  icon: {
    type: "image",
    src: "/icons/control-panels/appearance-manager/app.png",
  },
  helpItems,
  metadata: appMetadata,
};

export default ControlPanelsApp;
