import { Language } from "@/stores/useAppStore";

// Translation keys interface for type safety
export interface TranslationKeys {
  // Common terms
  "common.ok": string;
  "common.cancel": string;
  "common.yes": string;
  "common.no": string;
  "common.save": string;
  "common.delete": string;
  "common.edit": string;
  "common.close": string;
  "common.open": string;
  "common.settings": string;
  "common.language": string;
  
  // Control Panels
  "controlPanels.title": string;
  "controlPanels.appearance": string;
  "controlPanels.sound": string;
  "controlPanels.system": string;
  "controlPanels.language.label": string;
  "controlPanels.language.description": string;
  
  // Menu items
  "menu.file": string;
  "menu.edit": string;
  "menu.view": string;
  "menu.help": string;
  "menu.about": string;
  
  // App names
  "apps.finder": string;
  "apps.textEdit": string;
  "apps.paint": string;
  "apps.controlPanels": string;
  "apps.chats": string;
  "apps.terminal": string;
  "apps.internetExplorer": string;
  "apps.ipod": string;
  "apps.videos": string;
  "apps.soundboard": string;
  "apps.synth": string;
  "apps.minesweeper": string;
  "apps.photoBoothe": string;
  "apps.pc": string;
}

// Translations object
const translations: Record<Language, TranslationKeys> = {
  en: {
    // Common terms
    "common.ok": "OK",
    "common.cancel": "Cancel",
    "common.yes": "Yes",
    "common.no": "No",
    "common.save": "Save",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.close": "Close",
    "common.open": "Open",
    "common.settings": "Settings",
    "common.language": "Language",
    
    // Control Panels
    "controlPanels.title": "Control Panels",
    "controlPanels.appearance": "Appearance",
    "controlPanels.sound": "Sound",
    "controlPanels.system": "System",
    "controlPanels.language.label": "Language",
    "controlPanels.language.description": "Choose your preferred language",
    
    // Menu items
    "menu.file": "File",
    "menu.edit": "Edit",
    "menu.view": "View",
    "menu.help": "Help",
    "menu.about": "About",
    
    // App names
    "apps.finder": "Finder",
    "apps.textEdit": "TextEdit",
    "apps.paint": "Paint",
    "apps.controlPanels": "Control Panels",
    "apps.chats": "Chats",
    "apps.terminal": "Terminal",
    "apps.internetExplorer": "Internet Explorer",
    "apps.ipod": "iPod",
    "apps.videos": "Videos",
    "apps.soundboard": "Soundboard",
    "apps.synth": "Synth",
    "apps.minesweeper": "Minesweeper",
    "apps.photoBoothe": "Photo Booth",
    "apps.pc": "PC",
  },
  ja: {
    // Common terms
    "common.ok": "OK",
    "common.cancel": "キャンセル",
    "common.yes": "はい",
    "common.no": "いいえ",
    "common.save": "保存",
    "common.delete": "削除",
    "common.edit": "編集",
    "common.close": "閉じる",
    "common.open": "開く",
    "common.settings": "設定",
    "common.language": "言語",
    
    // Control Panels
    "controlPanels.title": "コントロールパネル",
    "controlPanels.appearance": "外観",
    "controlPanels.sound": "サウンド",
    "controlPanels.system": "システム",
    "controlPanels.language.label": "言語",
    "controlPanels.language.description": "優先言語を選択してください",
    
    // Menu items
    "menu.file": "ファイル",
    "menu.edit": "編集",
    "menu.view": "表示",
    "menu.help": "ヘルプ",
    "menu.about": "について",
    
    // App names
    "apps.finder": "Finder",
    "apps.textEdit": "テキストエディット",
    "apps.paint": "ペイント",
    "apps.controlPanels": "コントロールパネル",
    "apps.chats": "チャット",
    "apps.terminal": "ターミナル",
    "apps.internetExplorer": "Internet Explorer",
    "apps.ipod": "iPod",
    "apps.videos": "ビデオ",
    "apps.soundboard": "サウンドボード",
    "apps.synth": "シンセ",
    "apps.minesweeper": "マインスイーパー",
    "apps.photoBoothe": "Photo Booth",
    "apps.pc": "PC",
  },
};

// Translation function
export function t(key: keyof TranslationKeys, language: Language): string {
  return translations[language][key] || translations.en[key] || key;
}

// Language display names
export const LANGUAGE_NAMES: Record<Language, string> = {
  en: "English",
  ja: "日本語",
};

// Hook to use translations with current language from store
let currentLanguage: Language = "en";

export function setCurrentLanguage(language: Language) {
  currentLanguage = language;
}

export function useT() {
  return (key: keyof TranslationKeys) => t(key, currentLanguage);
}

// Helper to get current language
export function getCurrentLanguage(): Language {
  return currentLanguage;
} 