import { Button } from "@/components/ui/button";
import { MenuBar } from "@/components/layout/MenuBar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { FileItem } from "./FileList";
import { toast } from "sonner";
import { generateAppShareUrl } from "@/utils/sharedUrl";

export type ViewType = "small" | "large" | "list";
export type SortType = "name" | "date" | "size" | "kind";

export interface FinderMenuBarProps {
  onClose: () => void;
  onShowHelp: () => void;
  onShowAbout: () => void;
  viewType: ViewType;
  onViewTypeChange: (viewType: ViewType) => void;
  sortType: SortType;
  onSortTypeChange: (sortType: SortType) => void;
  selectedFile?: FileItem;
  onMoveToTrash: (file: FileItem) => void;
  onEmptyTrash: () => void;
  onRestore: () => void;
  isTrashEmpty: boolean;
  isInTrash: boolean;
  onNavigateBack?: () => void;
  onNavigateForward?: () => void;
  canNavigateBack?: boolean;
  canNavigateForward?: boolean;
  onNavigateToPath?: (path: string) => void;
  onImportFile?: () => void;
  onRename?: () => void;
  onDuplicate?: () => void;
  onNewFolder?: () => void;
  canCreateFolder?: boolean;
  rootFolders?: FileItem[];
  onNewWindow?: () => void;
}

export function FinderMenuBar({
  onClose,
  onShowHelp,
  onShowAbout,
  viewType,
  onViewTypeChange,
  sortType,
  onSortTypeChange,
  selectedFile,
  onMoveToTrash,
  onEmptyTrash,
  onRestore,
  isTrashEmpty,
  isInTrash,
  onNavigateBack,
  onNavigateForward,
  canNavigateBack = false,
  canNavigateForward = false,
  onNavigateToPath,
  onImportFile,
  onRename,
  onDuplicate,
  onNewFolder,
  canCreateFolder = false,
  rootFolders,
  onNewWindow,
}: FinderMenuBarProps) {
  const canMoveToTrash =
    selectedFile &&
    selectedFile.path !== "/Trash" &&
    !selectedFile.path.startsWith("/Trash/") &&
    // Prevent root folders from being moved to trash
    selectedFile.path !== "/Applications" &&
    selectedFile.path !== "/Documents" &&
    // Prevent applications from being moved to trash
    !selectedFile.path.startsWith("/Applications/");

  const canRename = selectedFile && onRename && canMoveToTrash;
  const canDuplicate = selectedFile && onDuplicate && !selectedFile.isDirectory;

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
            onClick={onNewWindow}
            className="text-md h-6 px-3 active:bg-gray-900 active:text-white"
          >
            新規Finderウィンドウ
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onNewFolder}
            disabled={!canCreateFolder}
            className="text-md h-6 px-3 active:bg-gray-900 active:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            新規フォルダ...
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onImportFile}
            className="text-md h-6 px-3 active:bg-gray-900 active:text-white"
          >
            デバイスからインポート...
          </DropdownMenuItem>
          <DropdownMenuSeparator className="h-[2px] bg-black my-1" />
          <DropdownMenuItem
            onClick={onRename}
            disabled={!canRename}
            className="text-md h-6 px-3 active:bg-gray-900 active:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            名前を変更...
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onDuplicate}
            disabled={!canDuplicate}
            className="text-md h-6 px-3 active:bg-gray-900 active:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            複製
          </DropdownMenuItem>
          <DropdownMenuSeparator className="h-[2px] bg-black my-1" />
          {isInTrash ? (
            <DropdownMenuItem
              onClick={onRestore}
              className="text-md h-6 px-3 active:bg-gray-900 active:text-white"
            >
              戻す
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onClick={() => canMoveToTrash && onMoveToTrash(selectedFile!)}
              disabled={!canMoveToTrash}
              className="text-md h-6 px-3 active:bg-gray-900 active:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ゴミ箱に入れる
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            onClick={onEmptyTrash}
            disabled={isTrashEmpty}
            className="text-md h-6 px-3 active:bg-gray-900 active:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ゴミ箱を空にする...
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

      {/* Edit Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="default"
            className="h-6 text-md px-2 py-1 border-none hover:bg-gray-200 active:bg-gray-900 active:text-white focus-visible:ring-0"
          >
            編集
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" sideOffset={1} className="px-0">
          <DropdownMenuItem className="text-md h-6 px-3 active:bg-gray-900 active:text-white">
            取り消す
          </DropdownMenuItem>
          <DropdownMenuSeparator className="h-[2px] bg-black my-1" />
          <DropdownMenuItem className="text-md h-6 px-3 active:bg-gray-900 active:text-white">
            カット
          </DropdownMenuItem>
          <DropdownMenuItem className="text-md h-6 px-3 active:bg-gray-900 active:text-white">
            コピー
          </DropdownMenuItem>
          <DropdownMenuItem className="text-md h-6 px-3 active:bg-gray-900 active:text-white">
            ペースト
          </DropdownMenuItem>
          <DropdownMenuItem className="text-md h-6 px-3 active:bg-gray-900 active:text-white">
            削除
          </DropdownMenuItem>
          <DropdownMenuSeparator className="h-[2px] bg-black my-1" />
          <DropdownMenuItem className="text-md h-6 px-3 active:bg-gray-900 active:text-white">
            すべてを選択
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* View Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="default"
            className="h-6 text-md px-2 py-1 border-none hover:bg-gray-200 active:bg-gray-900 active:text-white focus-visible:ring-0"
          >
            表示
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" sideOffset={1} className="px-0">
          <DropdownMenuCheckboxItem
            checked={viewType === "small"}
            onCheckedChange={() => onViewTypeChange("small")}
            className="text-md h-6 px-3 pl-8 active:bg-gray-900 active:text-white flex justify-between items-center"
          >
            <span>小さいアイコン</span>
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={viewType === "large"}
            onCheckedChange={() => onViewTypeChange("large")}
            className="text-md h-6 px-3 pl-8 active:bg-gray-900 active:text-white flex justify-between items-center"
          >
            <span>アイコン</span>
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={viewType === "list"}
            onCheckedChange={() => onViewTypeChange("list")}
            className="text-md h-6 px-3 pl-8 active:bg-gray-900 active:text-white flex justify-between items-center"
          >
            <span>リスト</span>
          </DropdownMenuCheckboxItem>
          <DropdownMenuSeparator className="h-[2px] bg-black my-1" />
          <DropdownMenuCheckboxItem
            checked={sortType === "name"}
            onCheckedChange={() => onSortTypeChange("name")}
            className="text-md h-6 px-3 pl-8 active:bg-gray-900 active:text-white flex justify-between items-center"
          >
            <span>名前</span>
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={sortType === "date"}
            onCheckedChange={() => onSortTypeChange("date")}
            className="text-md h-6 px-3 pl-8 active:bg-gray-900 active:text-white flex justify-between items-center"
          >
            <span>変更日</span>
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={sortType === "size"}
            onCheckedChange={() => onSortTypeChange("size")}
            className="text-md h-6 px-3 pl-8 active:bg-gray-900 active:text-white flex justify-between items-center"
          >
            <span>サイズ</span>
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={sortType === "kind"}
            onCheckedChange={() => onSortTypeChange("kind")}
            className="text-md h-6 px-3 pl-8 active:bg-gray-900 active:text-white flex justify-between items-center"
          >
            <span>種類</span>
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Go Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="default"
            className="h-6 text-md px-2 py-1 border-none hover:bg-gray-200 active:bg-gray-900 active:text-white focus-visible:ring-0"
          >
            移動
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" sideOffset={1} className="px-0">
          <DropdownMenuItem
            onClick={onNavigateBack}
            disabled={!canNavigateBack}
            className="text-md h-6 px-3 active:bg-gray-900 active:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onNavigateForward}
            disabled={!canNavigateForward}
            className="text-md h-6 px-3 active:bg-gray-900 active:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Forward
          </DropdownMenuItem>
          <DropdownMenuSeparator className="h-[2px] bg-black my-1" />

          {/* Root directory folders */}
          {rootFolders?.map((folder) => (
            <DropdownMenuItem
              key={folder.path}
              onClick={() => onNavigateToPath?.(folder.path)}
              className="text-md h-6 px-3 active:bg-gray-900 active:text-white flex items-center gap-2"
            >
              <img
                src={folder.icon || "/icons/folder.png"}
                alt=""
                className="w-4 h-4 [image-rendering:pixelated]"
              />
              {folder.name}
            </DropdownMenuItem>
          ))}

          {/* Always show Trash at the end */}
          <DropdownMenuItem
            onClick={() => onNavigateToPath?.("/Trash")}
            className="text-md h-6 px-3 active:bg-gray-900 active:text-white flex items-center gap-2"
          >
            <img
              src={
                isTrashEmpty
                  ? "/icons/trash-empty.png"
                  : "/icons/trash-full.png"
              }
              alt=""
              className="w-4 h-4 [image-rendering:pixelated]"
            />
            Trash
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Help Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="default"
            className="h-6 text-md px-2 py-1 border-none hover:bg-gray-200 active:bg-gray-900 active:text-white focus-visible:ring-0"
          >
            Help
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" sideOffset={1} className="px-0">
          <DropdownMenuItem
            onClick={onShowHelp}
            className="text-md h-6 px-3 active:bg-gray-900 active:text-white"
          >
            Finder Help
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={async () => {
              const appId = "finder"; // Specific app ID
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
            Share App...
          </DropdownMenuItem>
          <DropdownMenuSeparator className="h-[2px] bg-black my-1" />
          <DropdownMenuItem
            onClick={onShowAbout}
            className="text-md h-6 px-3 active:bg-gray-900 active:text-white"
          >
            About Finder
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </MenuBar>
  );
}
