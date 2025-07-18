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
import { toast } from "sonner";
import { generateAppShareUrl } from "@/utils/sharedUrl";

interface Video {
  id: string;
  url: string;
  title: string;
  artist?: string;
}

interface VideosMenuBarProps {
  onClose: () => void;
  onShowHelp: () => void;
  onShowAbout: () => void;
  videos: Video[];
  currentVideoId: string | null;
  onPlayVideo: (videoId: string) => void;
  onClearPlaylist: () => void;
  onShufflePlaylist: () => void;
  onToggleLoopAll: () => void;
  onToggleLoopCurrent: () => void;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onAddVideo: () => void;
  onOpenVideo: () => void;
  onResetPlaylist: () => void;
  isLoopAll: boolean;
  isLoopCurrent: boolean;
  isPlaying: boolean;
  isShuffled: boolean;
  onFullScreen: () => void;
  onShareVideo: () => void;
}

export function VideosMenuBar({
  onClose,
  onShowHelp,
  onShowAbout,
  videos,
  currentVideoId,
  onPlayVideo,
  onClearPlaylist,
  onShufflePlaylist,
  onToggleLoopAll,
  onToggleLoopCurrent,
  onTogglePlay,
  onNext,
  onPrevious,
  onAddVideo,
  onOpenVideo,
  onResetPlaylist,
  isLoopAll,
  isLoopCurrent,
  isPlaying,
  isShuffled,
  onFullScreen,
  onShareVideo,
}: VideosMenuBarProps) {
  // Group videos by artist
  const videosByArtist = videos.reduce<Record<string, Video[]>>(
    (acc, video) => {
      const artist = video.artist || 'アーティスト不明';
      if (!acc[artist]) {
        acc[artist] = [];
      }
      acc[artist].push(video);
      return acc;
    },
    {}
  );

  // Get sorted list of artists
  const artists = Object.keys(videosByArtist).sort();

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
            onClick={onOpenVideo}
            className="text-md h-6 px-3 active:bg-gray-900 active:text-white"
          >
            動画を開く...
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onShareVideo}
            className="text-md h-6 px-3 active:bg-gray-900 active:text-white"
            disabled={videos.length === 0}
          >
            動画を共有...
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
            onClick={onTogglePlay}
            className="text-md h-6 px-3 active:bg-gray-900 active:text-white"
            disabled={videos.length === 0}
          >
            {isPlaying ? "一時停止" : "再生"}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onPrevious}
            className="text-md h-6 px-3 active:bg-gray-900 active:text-white"
            disabled={videos.length === 0}
          >
            前へ
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onNext}
            className="text-md h-6 px-3 active:bg-gray-900 active:text-white"
            disabled={videos.length === 0}
          >
            次へ
          </DropdownMenuItem>
          <DropdownMenuSeparator className="h-[2px] bg-black my-1" />
          <DropdownMenuItem
            onClick={onFullScreen}
            className="text-md h-6 px-3 active:bg-gray-900 active:text-white"
          >
            フルスクリーン
          </DropdownMenuItem>
          <DropdownMenuSeparator className="h-[2px] bg-black my-1" />
          <DropdownMenuItem
            onClick={onShufflePlaylist}
            className="text-md h-6 px-3 active:bg-gray-900 active:text-white"
          >
            <span className={cn(!isShuffled && "pl-4")}>
              {isShuffled ? "✓ シャッフル" : "シャッフル"}
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onToggleLoopAll}
            className="text-md h-6 px-3 active:bg-gray-900 active:text-white"
          >
            <span className={cn(!isLoopAll && "pl-4")}>
              {isLoopAll ? "✓ すべてリピート" : "すべてリピート"}
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onToggleLoopCurrent}
            className="text-md h-6 px-3 active:bg-gray-900 active:text-white"
          >
            <span className={cn(!isLoopCurrent && "pl-4")}>
              {isLoopCurrent ? "✓ 1曲リピート" : "1曲リピート"}
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
        <DropdownMenuContent align="start" sideOffset={1} className="px-0 max-w-[180px] sm:max-w-[220px]">
          <DropdownMenuItem
            onClick={onAddVideo}
            className="text-md h-6 px-3 active:bg-gray-900 active:text-white"
          >
            ライブラリに追加...
          </DropdownMenuItem>
          
          {videos.length > 0 && (
            <>
              <DropdownMenuSeparator className="h-[2px] bg-black my-1" />
              
              {/* All Videos section */}
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="text-md h-6 px-3 active:bg-gray-900 active:text-white">
                  <div className="flex justify-between w-full items-center overflow-hidden">
                    <span className="truncate min-w-0">すべての動画</span>
                  </div>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="px-0 max-w-[180px] sm:max-w-[220px]">
                  {videos.map((video) => (
                    <DropdownMenuItem
                      key={`all-${video.id}`}
                      onClick={() => onPlayVideo(video.id)}
                      className={cn(
                        "text-md h-6 px-3 active:bg-gray-900 active:text-white max-w-[220px] truncate",
                        video.id === currentVideoId && "bg-gray-200"
                      )}
                    >
                      <div className="flex items-center w-full">
                        <span
                          className={cn(
                            "flex-none whitespace-nowrap",
                            video.id === currentVideoId ? "mr-1" : "pl-5"
                          )}
                        >
                          {video.id === currentVideoId ? "♪ " : ""}
                        </span>
                        <span className="truncate min-w-0">{video.title}</span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              
              {/* Individual Artist submenus */}
              {artists.map((artist) => (
                <DropdownMenuSub key={artist}>
                  <DropdownMenuSubTrigger className="text-md h-6 px-3 active:bg-gray-900 active:text-white">
                    <div className="flex justify-between w-full items-center overflow-hidden">
                      <span className="truncate min-w-0">{artist}</span>
                    </div>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="px-0 max-w-[180px] sm:max-w-[220px]">
                    {videosByArtist[artist].map((video) => (
                      <DropdownMenuItem
                        key={`${artist}-${video.id}`}
                        onClick={() => onPlayVideo(video.id)}
                        className={cn(
                          "text-md h-6 px-3 active:bg-gray-900 active:text-white max-w-[160px] sm:max-w-[200px] truncate",
                          video.id === currentVideoId && "bg-gray-200"
                        )}
                      >
                        <div className="flex items-center w-full">
                          <span
                            className={cn(
                              "flex-none whitespace-nowrap",
                              video.id === currentVideoId ? "mr-1" : "pl-5"
                            )}
                          >
                            {video.id === currentVideoId ? "♪ " : ""}
                          </span>
                          <span className="truncate min-w-0">{video.title}</span>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              ))}
              
              <DropdownMenuSeparator className="h-[2px] bg-black my-1" />
            </>
          )}
          
          <DropdownMenuItem
            onClick={onClearPlaylist}
            className="text-md h-6 px-3 active:bg-gray-900 active:text-white"
          >
            プレイリストをクリア...
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onResetPlaylist}
            className="text-md h-6 px-3 active:bg-gray-900 active:text-white"
          >
            ライブラリをリセット...
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
            ビデオプレーヤーのヘルプ
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={async () => {
              const appId = "videos"; // Specific app ID
              const shareUrl = generateAppShareUrl(appId);
              if (!shareUrl) return;
              try {
                await navigator.clipboard.writeText(shareUrl);
                toast.success("アプリのリンクをコピーしました!", {
                  description: `アプリのリンクをクリップボードにコピーしました。`,
                });
              } catch (err) {
                console.error("アプリのリンクをコピーできませんでした: ", err);
                toast.error("アプリのリンクをコピーできませんでした", {
                  description: "クリップボードにアプリのリンクをコピーできませんでした。",
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
            ビデオプレーヤーについて
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </MenuBar>
  );
}
