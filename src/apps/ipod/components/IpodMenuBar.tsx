import { Button } from "@/components/ui/button";
import { MenuBar } from "@/components/layout/MenuBar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useIpodStoreShallow } from "@/stores/helpers";
import { toast } from "sonner";
import { generateAppShareUrl } from "@/utils/sharedUrl";
import { LyricsAlignment, ChineseVariant, KoreanDisplay } from "@/types/lyrics";

interface IpodMenuBarProps {
  onClose: () => void;
  onShowHelp: () => void;
  onShowAbout: () => void;
  onClearLibrary: () => void;
  onSyncLibrary: () => void;
  onAddTrack: () => void;
  onShareSong: () => void;
}

const translationLanguages = [
  { label: "オリジナル", code: null },
  { label: "英語", code: "en" },
  { label: "中国語（繁体字）", code: "zh-TW" },
  { label: "日本語", code: "ja" },
  { label: "韓国語", code: "ko" },
  { label: "スペイン語", code: "es" },
  { label: "フランス語", code: "fr" },
  { label: "ドイツ語", code: "de" },
  { label: "ポルトガル語", code: "pt" },
  { label: "イタリア語", code: "it" },
  { label: "ロシア語", code: "ru" },
];

export function IpodMenuBar({
  onClose,
  onShowHelp,
  onShowAbout,
  onClearLibrary,
  onSyncLibrary,
  onAddTrack,
  onShareSong,
}: IpodMenuBarProps) {
  const {
    tracks,
    currentIndex,
    isLoopAll,
    isLoopCurrent,
    isPlaying,
    isShuffled,
    isBacklightOn,
    isVideoOn,
    isLcdFilterOn,
    currentTheme,
    showLyrics,
    isFullScreen,
    lyricsAlignment,
    chineseVariant,
    koreanDisplay,
    // Actions
    setCurrentIndex,
    setIsPlaying,
    toggleLoopAll,
    toggleLoopCurrent,
    toggleShuffle,
    togglePlay,
    nextTrack,
    previousTrack,
    toggleBacklight,
    toggleVideo,
    toggleLcdFilter,
    toggleFullScreen,
    setTheme,
    toggleLyrics,
    setLyricsAlignment,
    setChineseVariant,
    setKoreanDisplay,
    setLyricsTranslationRequest,
    importLibrary,
    exportLibrary,
  } = useIpodStoreShallow((s) => ({
    // State
    tracks: s.tracks,
    currentIndex: s.currentIndex,
    isLoopAll: s.loopAll,
    isLoopCurrent: s.loopCurrent,
    isPlaying: s.isPlaying,
    isShuffled: s.isShuffled,
    isBacklightOn: s.backlightOn,
    isVideoOn: s.showVideo,
    isLcdFilterOn: s.lcdFilterOn,
    currentTheme: s.theme,
    showLyrics: s.showLyrics,
    isFullScreen: s.isFullScreen,
    lyricsAlignment: s.lyricsAlignment ?? LyricsAlignment.FocusThree,
    chineseVariant: s.chineseVariant ?? ChineseVariant.Traditional,
    koreanDisplay: s.koreanDisplay ?? KoreanDisplay.Original,
    // Actions
    setCurrentIndex: s.setCurrentIndex,
    setIsPlaying: s.setIsPlaying,
    toggleLoopAll: s.toggleLoopAll,
    toggleLoopCurrent: s.toggleLoopCurrent,
    toggleShuffle: s.toggleShuffle,
    togglePlay: s.togglePlay,
    nextTrack: s.nextTrack,
    previousTrack: s.previousTrack,
    toggleBacklight: s.toggleBacklight,
    toggleVideo: s.toggleVideo,
    toggleLcdFilter: s.toggleLcdFilter,
    toggleFullScreen: s.toggleFullScreen,
    setTheme: s.setTheme,
    toggleLyrics: s.toggleLyrics,
    setLyricsAlignment: s.setLyricsAlignment,
    setChineseVariant: s.setChineseVariant,
    setKoreanDisplay: s.setKoreanDisplay,
    setLyricsTranslationRequest: s.setLyricsTranslationRequest,
    importLibrary: s.importLibrary,
    exportLibrary: s.exportLibrary,
  }));

  const handlePlayTrack = (index: number) => {
    setCurrentIndex(index);
    setIsPlaying(true);
  };

  // Group tracks by artist
  const tracksByArtist = tracks.reduce<
    Record<string, { track: (typeof tracks)[0]; index: number }[]>
  >((acc, track, index) => {
    const artist = track.artist || "Unknown Artist";
    if (!acc[artist]) {
      acc[artist] = [];
    }
    acc[artist].push({ track, index });
    return acc;
  }, {});

  // Get sorted list of artists
  const artists = Object.keys(tracksByArtist).sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base" })
  );

  const handleExportLibrary = () => {
    try {
      const json = exportLibrary();
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "ipod-library.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Library exported successfully");
    } catch (error) {
      console.error("Failed to export library:", error);
      toast.error("Failed to export library");
    }
  };

  const handleImportLibrary = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const json = event.target?.result as string;
          importLibrary(json);
          toast.success("Library imported successfully");
        } catch (error) {
          console.error("Failed to import library:", error);
          toast.error("Failed to import library: Invalid format");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <MenuBar>
      {/* File Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="default"
            className="h-6 text-md px-2 py-1 border-none hover:bg-gray-200 active:bg-gray-900 active:text-white focus-visible:ring-0"
          >
            ファイル
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" sideOffset={1} className="px-0">
          <DropdownMenuItem
            onClick={onAddTrack}
            className="text-md h-6 px-3 active:bg-gray-900 active:text-white"
          >
            楽曲を追加...
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onShareSong}
            className="text-md h-6 px-3 active:bg-gray-900 active:text-white"
            disabled={tracks.length === 0 || currentIndex === -1}
          >
            楽曲を共有...
          </DropdownMenuItem>
          <DropdownMenuSeparator className="h-[2px] bg-black my-1" />
          <DropdownMenuItem
            onClick={handleExportLibrary}
            className="text-md h-6 px-3 active:bg-gray-900 active:text-white"
            disabled={tracks.length === 0}
          >
            ライブラリをエクスポート...
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleImportLibrary}
            className="text-md h-6 px-3 active:bg-gray-900 active:text-white"
          >
            ライブラリをインポート...
          </DropdownMenuItem>
          <DropdownMenuSeparator className="h-[2px] bg-black my-1" />
          <DropdownMenuItem
            onClick={onClose}
            className="text-md h-6 px-3 active:bg-gray-900 active:text-white"
          >
            閉じる
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Controls Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="default"
            className="h-6 px-2 py-1 text-md focus-visible:ring-0 hover:bg-gray-200 active:bg-gray-900 active:text-white"
          >
            コントロール
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" sideOffset={1} className="px-0">
          <DropdownMenuItem
            onClick={togglePlay}
            className="text-md h-6 px-3 active:bg-gray-900 active:text-white"
            disabled={tracks.length === 0}
          >
            {isPlaying ? "一時停止" : "再生"}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={previousTrack}
            className="text-md h-6 px-3 active:bg-gray-900 active:text-white"
            disabled={tracks.length === 0}
          >
            前の曲
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={nextTrack}
            className="text-md h-6 px-3 active:bg-gray-900 active:text-white"
            disabled={tracks.length === 0}
          >
            次の曲
          </DropdownMenuItem>
          <DropdownMenuSeparator className="h-[2px] bg-black my-1" />
          <DropdownMenuItem
            onClick={toggleShuffle}
            className="text-md h-6 px-3 active:bg-gray-900 active:text-white"
          >
            <span className={cn(!isShuffled && "pl-4")}>
              {isShuffled ? "✓ シャッフル" : "シャッフル"}
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={toggleLoopAll}
            className="text-md h-6 px-3 active:bg-gray-900 active:text-white"
          >
            <span className={cn(!isLoopAll && "pl-4")}>
              {isLoopAll ? "✓ すべてリピート" : "すべてリピート"}
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={toggleLoopCurrent}
            className="text-md h-6 px-3 active:bg-gray-900 active:text-white"
          >
            <span className={cn(!isLoopCurrent && "pl-4")}>
              {isLoopCurrent ? "✓ 1曲リピート" : "1曲リピート"}
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* View Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="default"
            className="h-6 px-2 py-1 text-md focus-visible:ring-0 hover:bg-gray-200 active:bg-gray-900 active:text-white"
          >
            表示
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" sideOffset={1} className="px-0">
          {/* Lyrics Submenu */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="text-md h-6 px-3 active:bg-gray-900 active:text-white">
              歌詞表示
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="px-0">
              <DropdownMenuItem
                onClick={toggleLyrics}
                className="text-md h-6 px-3 active:bg-gray-900 active:text-white"
              >
                <span className={cn(!showLyrics && "pl-4")}>
                  {showLyrics ? "✓ 歌詞を表示" : "歌詞を表示"}
                </span>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="h-[2px] bg-black my-1" />

              {/* Chinese toggle */}
              <DropdownMenuItem
                onClick={() =>
                  setChineseVariant(
                    chineseVariant === ChineseVariant.Traditional
                      ? ChineseVariant.Original
                      : ChineseVariant.Traditional
                  )
                }
                className="text-md h-6 px-3 active:bg-gray-900 active:text-white"
              >
                <span
                  className={cn(
                    chineseVariant !== ChineseVariant.Traditional && "pl-4"
                  )}
                >
                  {chineseVariant === ChineseVariant.Traditional
                    ? "✓ 繁体字"
                    : "繁体字"}
                </span>
              </DropdownMenuItem>

              {/* Korean toggle */}
              <DropdownMenuItem
                onClick={() =>
                  setKoreanDisplay(
                    koreanDisplay === KoreanDisplay.Original
                      ? KoreanDisplay.Romanized
                      : KoreanDisplay.Original
                  )
                }
                className="text-md h-6 px-3 active:bg-gray-900 active:text-white"
              >
                <span
                  className={cn(
                    koreanDisplay !== KoreanDisplay.Original && "pl-4"
                  )}
                >
                  {koreanDisplay === KoreanDisplay.Original ? "✓ ハングル" : "ハングル"}
                </span>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="h-[2px] bg-black my-1" />

              {/* Alignment modes */}
              <DropdownMenuItem
                onClick={() => setLyricsAlignment(LyricsAlignment.FocusThree)}
                className="text-md h-6 px-3 active:bg-gray-900 active:text-white"
              >
                <span
                  className={cn(
                    lyricsAlignment !== LyricsAlignment.FocusThree && "pl-4"
                  )}
                >
                  {lyricsAlignment === LyricsAlignment.FocusThree
                    ? "✓ マルチ"
                    : "マルチ"}
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setLyricsAlignment(LyricsAlignment.Center)}
                className="text-md h-6 px-3 active:bg-gray-900 active:text-white"
              >
                <span
                  className={cn(
                    lyricsAlignment !== LyricsAlignment.Center && "pl-4"
                  )}
                >
                  {lyricsAlignment === LyricsAlignment.Center
                    ? "✓ シングル"
                    : "シングル"}
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setLyricsAlignment(LyricsAlignment.Alternating)}
                className="text-md h-6 px-3 active:bg-gray-900 active:text-white"
              >
                <span
                  className={cn(
                    lyricsAlignment !== LyricsAlignment.Alternating && "pl-4"
                  )}
                >
                  {lyricsAlignment === LyricsAlignment.Alternating
                    ? "✓ 交互表示"
                    : "交互表示"}
                </span>
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          {/* Translate Lyrics Submenu */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="text-md h-6 px-3 active:bg-gray-900 active:text-white">
              翻訳
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="px-0 max-h-[400px] overflow-y-auto">
              {translationLanguages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code || "off"}
                  onClick={() => {
                    const currentTrackId = tracks[currentIndex]?.id;
                    if (currentTrackId && lang.code) {
                      setLyricsTranslationRequest(lang.code, currentTrackId);
                    } else if (!lang.code) {
                      setLyricsTranslationRequest(null, null);
                    }
                  }}
                  className="text-md h-6 px-3 active:bg-gray-900 active:text-white"
                >
                  <span>{lang.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSeparator className="h-[2px] bg-black my-1" />

          <DropdownMenuItem
            onClick={toggleBacklight}
            className="text-md h-6 px-3 active:bg-gray-900 active:text-white"
          >
            <span className={cn(!isBacklightOn && "pl-4")}>
              {isBacklightOn ? "✓ バックライト" : "バックライト"}
            </span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={toggleLcdFilter}
            className="text-md h-6 px-3 active:bg-gray-900 active:text-white"
          >
            <span className={cn(!isLcdFilterOn && "pl-4")}>
              {isLcdFilterOn ? "✓ LCDフィルター" : "LCDフィルター"}
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={toggleVideo}
            className="text-md h-6 px-3 active:bg-gray-900 active:text-white"
            disabled={!isPlaying}
          >
            <span className={cn(!isVideoOn && "pl-4")}>
              {isVideoOn ? "✓ ビデオ" : "ビデオ"}
            </span>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="h-[2px] bg-black my-1" />
          <DropdownMenuItem
            onClick={() => setTheme("classic")}
            className="text-md h-6 px-3 active:bg-gray-900 active:text-white"
          >
            <span className={cn(currentTheme !== "classic" && "pl-4")}>
              {currentTheme === "classic" ? "✓ クラシック" : "クラシック"}
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setTheme("black")}
            className="text-md h-6 px-3 active:bg-gray-900 active:text-white"
          >
            <span className={cn(currentTheme !== "black" && "pl-4")}>
              {currentTheme === "black" ? "✓ ブラック" : "ブラック"}
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setTheme("u2")}
            className="text-md h-6 px-3 active:bg-gray-900 active:text-white"
          >
            <span className={cn(currentTheme !== "u2" && "pl-4")}>
              {currentTheme === "u2" ? "✓ U2" : "U2"}
            </span>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="h-[2px] bg-black my-1" />

          <DropdownMenuItem
            onClick={toggleFullScreen}
            className="text-md h-6 px-3 active:bg-gray-900 active:text-white"
          >
            <span className={cn(!isFullScreen && "pl-4")}>
              {isFullScreen ? "✓ フルスクリーン" : "フルスクリーン"}
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Library Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="default"
            className="h-6 px-2 py-1 text-md focus-visible:ring-0 hover:bg-gray-200 active:bg-gray-900 active:text-white"
          >
            ライブラリ
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          sideOffset={1}
          className="px-0 max-w-[180px] sm:max-w-[220px]"
        >
          <DropdownMenuItem
            onClick={onAddTrack}
            className="text-md h-6 px-3 active:bg-gray-900 active:text-white"
          >
            ライブラリに追加...
          </DropdownMenuItem>

          {tracks.length > 0 && (
            <>
              <DropdownMenuSeparator className="h-[2px] bg-black my-1" />

              {/* All Tracks section */}
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="text-md h-6 px-3 active:bg-gray-900 active:text-white">
                  <div className="flex justify-between w-full items-center overflow-hidden">
                    <span className="truncate min-w-0">すべての曲</span>
                  </div>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="px-0 max-w-[180px] sm:max-w-[220px] max-h-[400px] overflow-y-auto">
                  {tracks.map((track, index) => (
                    <DropdownMenuItem
                      key={`all-${track.id}`}
                      onClick={() => handlePlayTrack(index)}
                      className={cn(
                        "text-md h-6 px-3 active:bg-gray-900 active:text-white max-w-[220px] truncate",
                        index === currentIndex && "bg-gray-200"
                      )}
                    >
                      <div className="flex items-center w-full">
                        <span
                          className={cn(
                            "flex-none whitespace-nowrap",
                            index === currentIndex ? "mr-1" : "pl-5"
                          )}
                        >
                          {index === currentIndex ? "♪ " : ""}
                        </span>
                        <span className="truncate min-w-0">{track.title}</span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              {/* Individual Artist submenus */}
              <div className="max-h-[300px] overflow-y-auto">
                {artists.map((artist) => (
                  <DropdownMenuSub key={artist}>
                    <DropdownMenuSubTrigger className="text-md h-6 px-3 active:bg-gray-900 active:text-white">
                      <div className="flex justify-between w-full items-center overflow-hidden">
                        <span className="truncate min-w-0">{artist}</span>
                      </div>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent className="px-0 max-w-[180px] sm:max-w-[220px] max-h-[200px] overflow-y-auto">
                      {tracksByArtist[artist].map(({ track, index }) => (
                        <DropdownMenuItem
                          key={`${artist}-${track.id}`}
                          onClick={() => handlePlayTrack(index)}
                          className={cn(
                            "text-md h-6 px-3 active:bg-gray-900 active:text-white max-w-[160px] sm:max-w-[200px] truncate",
                            index === currentIndex && "bg-gray-200"
                          )}
                        >
                          <div className="flex items-center w-full">
                            <span
                              className={cn(
                                "flex-none whitespace-nowrap",
                                index === currentIndex ? "mr-1" : "pl-5"
                              )}
                            >
                              {index === currentIndex ? "♪ " : ""}
                            </span>
                            <span className="truncate min-w-0">
                              {track.title}
                            </span>
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                ))}
              </div>

              <DropdownMenuSeparator className="h-[2px] bg-black my-1" />
            </>
          )}

          <DropdownMenuItem
            onClick={onClearLibrary}
            className="text-md h-6 px-3 active:bg-gray-900 active:text-white"
          >
            ライブラリをクリア...
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onSyncLibrary}
            className="text-md h-6 px-3 active:bg-gray-900 active:text-white"
          >
            ライブラリを同期...
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Help Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="default"
            className="h-6 px-2 py-1 text-md focus-visible:ring-0 hover:bg-gray-200 active:bg-gray-900 active:text-white"
          >
            ヘルプ
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" sideOffset={1} className="px-0">
          <DropdownMenuItem
            onClick={onShowHelp}
            className="text-md h-6 px-3 active:bg-gray-900 active:text-white"
          >
            iPodのヘルプ
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={async () => {
              const appId = "ipod"; // Specific app ID
              const shareUrl = generateAppShareUrl(appId);
              if (!shareUrl) return;
              try {
                await navigator.clipboard.writeText(shareUrl);
                toast.success("App link copied!", {
                  description: `Link to ${appId} copied to clipboard.`,
                });
              } catch (err) {
                console.error("Failed to copy app link: ", err);
                toast.error("Failed to copy link", {
                  description: "Could not copy link to clipboard.",
                });
              }
            }}
            className="text-md h-6 px-3 active:bg-gray-900 active:text-white"
          >
            アプリを共有...
          </DropdownMenuItem>
          <DropdownMenuSeparator className="h-[2px] bg-black my-1" />
          <DropdownMenuItem
            onClick={onShowAbout}
            className="text-md h-6 px-3 active:bg-gray-900 active:text-white"
          >
            iPodについて
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </MenuBar>
  );
}
