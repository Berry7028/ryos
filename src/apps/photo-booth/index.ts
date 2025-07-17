import { BaseApp } from "../base/types";
import { PhotoBoothComponent } from "./components/PhotoBoothComponent";

export const appMetadata = {
  name: "Photo Booth",
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
    title: "Taking a Photo",
    description:
      "Click the large red camera button to capture a single image.",
  },
  {
    icon: "⏱️",
    title: "Quick Snaps",
    description:
      "Click the timer button (left of the camera button) to start a sequence of four photos taken one second apart.",
  },
  {
    icon: "🎨",
    title: "Applying Effects",
    description:
      "Click the 'Effects' button (right of the camera button) to open the effects panel and apply fun filters to your live camera view.",
  },
  {
    icon: "🖼️",
    title: "Viewing Photos",
    description:
      "Click the photo stack button (far left) to show or hide the photo strip at the bottom, displaying all your saved photos.",
  },
  {
    icon: "💾",
    title: "Downloading Photos",
    description:
      "Photos are automatically saved. Click on a photo in the photo strip to download it.",
  },
  {
    icon: "📷",
    title: "Switching Cameras",
    description:
      "Use the 'View' menu in the menu bar to switch between available cameras if you have more than one connected.",
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
