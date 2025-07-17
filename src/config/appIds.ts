export const appIds = [
  "finder",
  "soundboard",
  "internet-explorer",
  "chats",
  "textedit",
  "paint",
  "photo-booth",
  "videos",
  "ipod",
  "synth",
  "terminal",
  "control-panels",
] as const;

export type AppId = typeof appIds[number]; 