import { create } from "zustand";
import { persist } from "zustand/middleware";
import { LyricsAlignment, ChineseVariant, KoreanDisplay } from "@/types/lyrics";
import { LyricLine } from "@/types/lyrics";

// Define the Track type (can be shared or defined here)
export interface Track {
  id: string;
  url: string;
  title: string;
  artist?: string;
  album?: string;
  /** Offset in milliseconds to adjust lyrics timing for this track (positive = lyrics earlier) */
  lyricOffset?: number;
}

type LibraryState = "uninitialized" | "loaded" | "cleared";

interface IpodData {
  tracks: Track[];
  currentIndex: number;
  loopCurrent: boolean;
  loopAll: boolean;
  isShuffled: boolean;
  isPlaying: boolean;
  showVideo: boolean;
  backlightOn: boolean;
  theme: "classic" | "black" | "u2";
  lcdFilterOn: boolean;
  showLyrics: boolean;
  lyricsAlignment: LyricsAlignment;
  chineseVariant: ChineseVariant;
  koreanDisplay: KoreanDisplay;
  lyricsTranslationRequest: { language: string; songId: string } | null;
  currentLyrics: { lines: LyricLine[] } | null;
  isFullScreen: boolean;
  libraryState: LibraryState;
  lastKnownVersion: number;
  playbackHistory: string[]; // Track IDs in playback order for back functionality and avoiding recent tracks
  historyPosition: number; // Current position in playback history (-1 means at the end)
}

async function loadDefaultTracks(): Promise<{
  tracks: Track[];
  version: number;
}> {
  try {
    const res = await fetch("/data/ipod-videos.json");
    const data = await res.json();
    const videos: unknown[] = data.videos || data;
    const version = data.version || 1;
    const tracks = videos.map((v) => {
      const video = v as Record<string, unknown>;
      return {
        id: video.id as string,
        url: video.url as string,
        title: video.title as string,
        artist: video.artist as string | undefined,
        album: (video.album as string | undefined) ?? "",
        lyricOffset: video.lyricOffset as number | undefined,
      };
    });
    return { tracks, version };
  } catch (err) {
    console.error("Failed to load ipod-videos.json", err);
    return { tracks: [], version: 1 };
  }
}

const initialIpodData: IpodData = {
  tracks: [],
  currentIndex: 0,
  loopCurrent: false,
  loopAll: true,
  isShuffled: true,
  isPlaying: false,
  showVideo: false,
  backlightOn: true,
  theme: "classic",
  lcdFilterOn: true,
  showLyrics: true,
  lyricsAlignment: LyricsAlignment.FocusThree,
  chineseVariant: ChineseVariant.Traditional,
  koreanDisplay: KoreanDisplay.Original,
  lyricsTranslationRequest: null,
  currentLyrics: null,
  isFullScreen: false,
  libraryState: "uninitialized",
  lastKnownVersion: 0,
  playbackHistory: [],
  historyPosition: -1,
};

export interface IpodState extends IpodData {
  setCurrentIndex: (index: number) => void;
  toggleLoopCurrent: () => void;
  toggleLoopAll: () => void;
  toggleShuffle: () => void;
  togglePlay: () => void;
  setIsPlaying: (playing: boolean) => void;
  toggleVideo: () => void;
  toggleBacklight: () => void;
  toggleLcdFilter: () => void;
  toggleFullScreen: () => void;
  setTheme: (theme: "classic" | "black" | "u2") => void;
  addTrack: (track: Track) => void;
  clearLibrary: () => void;
  resetLibrary: () => Promise<void>;
  nextTrack: () => void;
  previousTrack: () => void;
  setShowVideo: (show: boolean) => void;
  toggleLyrics: () => void;
  /** Adjust the lyric offset (in ms) for the track at the given index. */
  adjustLyricOffset: (trackIndex: number, deltaMs: number) => void;
  /** Set lyrics alignment mode */
  setLyricsAlignment: (alignment: LyricsAlignment) => void;
  /** Set Chinese character variant */
  setChineseVariant: (variant: ChineseVariant) => void;
  /** Set Korean text display mode */
  setKoreanDisplay: (display: KoreanDisplay) => void;
  /** Set the target language for lyrics translation. Pass null to disable translation. */
  setLyricsTranslationRequest: (
    language: string | null,
    songId: string | null
  ) => void;
  /** Import library from JSON string */
  importLibrary: (json: string) => void;
  /** Export library to JSON string */
  exportLibrary: () => string;
  /** Adds a track from a YouTube video ID or URL, fetching metadata automatically */
  addTrackFromVideoId: (urlOrId: string) => Promise<Track | null>;
  /** Load the default library if no tracks exist */
  initializeLibrary: () => Promise<void>;

  /** Sync library with server - checks for updates and ensures all default tracks are present */
  syncLibrary: () => Promise<{
    newTracksAdded: number;
    tracksUpdated: number;
    totalTracks: number;
  }>;
}

const CURRENT_IPOD_STORE_VERSION = 18; // Incremented version for auto-update feature

// Helper function to get a random track index avoiding recently played songs
function getRandomTrackIndexAvoidingRecent(
  tracks: Track[],
  playbackHistory: string[],
  currentIndex: number,
  maxRecentToAvoid: number = 5
): number {
  if (tracks.length === 0) return -1;
  if (tracks.length === 1) return 0;
  
  // Get the most recent songs to avoid (up to maxRecentToAvoid)
  const recentToAvoid = playbackHistory.slice(-maxRecentToAvoid);
  
  // Create a list of available indices (excluding recently played and current)
  const availableIndices = tracks
    .map((_, index) => index)
    .filter(index => {
      const trackId = tracks[index].id;
      return !recentToAvoid.includes(trackId) && index !== currentIndex;
    });
  
  // If we have available tracks, pick from them
  if (availableIndices.length > 0) {
    const randomIndex = Math.floor(Math.random() * availableIndices.length);
    return availableIndices[randomIndex];
  }
  
  // If all tracks are recently played, just avoid the current one
  const allIndicesExceptCurrent = tracks
    .map((_, index) => index)
    .filter(index => index !== currentIndex);
  
  if (allIndicesExceptCurrent.length > 0) {
    const randomIndex = Math.floor(Math.random() * allIndicesExceptCurrent.length);
    return allIndicesExceptCurrent[randomIndex];
  }
  
  // If we only have one track, return it
  if (tracks.length === 1) return 0;
  
  // Fallback: return a different random index if possible
  const randomIndex = Math.floor(Math.random() * tracks.length);
  return randomIndex !== currentIndex ? randomIndex : (randomIndex + 1) % tracks.length;
}

// Helper function to update playback history
function updatePlaybackHistory(
  playbackHistory: string[],
  trackId: string,
  maxHistory: number = 50
): string[] {
  // Add the track ID to the history
  const updated = [...playbackHistory, trackId];
  // Keep only the most recent tracks
  return updated.slice(-maxHistory);
}

// Helper function to get the previous track from playback history
function getPreviousTrackFromHistory(
  playbackHistory: string[],
  historyPosition: number,
  tracks: Track[]
): { trackIndex: number; newHistoryPosition: number } | null {
  if (playbackHistory.length === 0 || historyPosition <= 0) return null;
  
  // Go back one step in history
  const newHistoryPosition = historyPosition - 1;
  const previousTrackId = playbackHistory[newHistoryPosition];
  
  if (previousTrackId) {
    // Find the index of this track in the tracks array
    const trackIndex = tracks.findIndex(track => track.id === previousTrackId);
    if (trackIndex !== -1) {
      return { trackIndex, newHistoryPosition };
    }
  }
  
  return null;
}

// Helper function to get the next track from playback history (for forward navigation)
function getNextTrackFromHistory(
  playbackHistory: string[],
  historyPosition: number,
  tracks: Track[]
): { trackIndex: number; newHistoryPosition: number } | null {
  if (playbackHistory.length === 0 || historyPosition >= playbackHistory.length - 1) return null;
  
  // Go forward one step in history
  const newHistoryPosition = historyPosition + 1;
  const nextTrackId = playbackHistory[newHistoryPosition];
  
  if (nextTrackId) {
    // Find the index of this track in the tracks array
    const trackIndex = tracks.findIndex(track => track.id === nextTrackId);
    if (trackIndex !== -1) {
      return { trackIndex, newHistoryPosition };
    }
  }
  
  return null;
}

export const useIpodStore = create<IpodState>()(
  persist(
    (set, get) => ({
      ...initialIpodData,
      // --- Actions ---
      setCurrentIndex: (index) =>
        set((state) => {
          // Only update playback history if we're actually changing tracks
          if (index !== state.currentIndex && index >= 0 && index < state.tracks.length) {
            const currentTrackId = state.tracks[state.currentIndex]?.id;
            const newPlaybackHistory = currentTrackId 
              ? updatePlaybackHistory(state.playbackHistory, currentTrackId)
              : state.playbackHistory;
            
            return { 
              currentIndex: index, 
              lyricsTranslationRequest: null,
              playbackHistory: newPlaybackHistory,
              historyPosition: newPlaybackHistory.length - 1,
            };
          }
          
          return { 
            currentIndex: index, 
            lyricsTranslationRequest: null,
          };
        }),
      toggleLoopCurrent: () =>
        set((state) => ({ loopCurrent: !state.loopCurrent })),
      toggleLoopAll: () => set((state) => ({ loopAll: !state.loopAll })),
      toggleShuffle: () => set((state) => {
        const newShuffleState = !state.isShuffled;
        return { 
          isShuffled: newShuffleState,
          // Clear playback history when turning shuffle on to start fresh
          playbackHistory: newShuffleState ? [] : state.playbackHistory,
          historyPosition: newShuffleState ? -1 : state.historyPosition
        };
      }),
      togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
      setIsPlaying: (playing) => set({ isPlaying: playing }),
      toggleVideo: () => set((state) => ({ showVideo: !state.showVideo })),
      toggleBacklight: () =>
        set((state) => ({ backlightOn: !state.backlightOn })),
      toggleLcdFilter: () =>
        set((state) => ({ lcdFilterOn: !state.lcdFilterOn })),
      toggleFullScreen: () =>
        set((state) => ({ isFullScreen: !state.isFullScreen })),
      setTheme: (theme) => set({ theme }),
      addTrack: (track) =>
        set((state) => ({
          tracks: [track, ...state.tracks],
          currentIndex: 0,
          isPlaying: true,
          lyricsTranslationRequest: null,
          libraryState: "loaded",
          playbackHistory: [], // Clear playback history when adding new tracks
          historyPosition: -1,
        })),
      clearLibrary: () =>
        set({
          tracks: [],
          currentIndex: -1,
          isPlaying: false,
          lyricsTranslationRequest: null,
          libraryState: "cleared",
          playbackHistory: [], // Clear playback history when clearing library
          historyPosition: -1,
        }),
      resetLibrary: async () => {
        const { tracks, version } = await loadDefaultTracks();
        set({
          tracks,
          currentIndex: tracks.length > 0 ? 0 : -1,
          isPlaying: false,
          lyricsTranslationRequest: null,
          libraryState: "loaded",
          lastKnownVersion: version,
          playbackHistory: [], // Clear playback history when resetting library
          historyPosition: -1,
        });
      },
      nextTrack: () =>
        set((state) => {
          if (state.tracks.length === 0)
            return { currentIndex: -1, lyricsTranslationRequest: null };
          
          let next: number;
          let newHistoryPosition = state.historyPosition;
          
          if (state.isShuffled) {
            // Check if we can go forward in history first
            const nextFromHistory = getNextTrackFromHistory(
              state.playbackHistory,
              state.historyPosition,
              state.tracks
            );
            
            if (nextFromHistory !== null) {
              next = nextFromHistory.trackIndex;
              newHistoryPosition = nextFromHistory.newHistoryPosition;
            } else {
              // Use improved shuffle algorithm for new tracks
              next = getRandomTrackIndexAvoidingRecent(
                state.tracks,
                state.playbackHistory,
                state.currentIndex
              );
              // When playing a new track, add it to history and move to end
              newHistoryPosition = -1; // Will be updated below
            }
          } else {
            // Sequential playback
            next = (state.currentIndex + 1) % state.tracks.length;
            newHistoryPosition = -1; // Will be updated below
          }
          
          // Update playback history with current track
          const currentTrackId = state.tracks[state.currentIndex]?.id;
          let newPlaybackHistory = state.playbackHistory;
          if (currentTrackId) {
            newPlaybackHistory = updatePlaybackHistory(state.playbackHistory, currentTrackId);
            // If we're adding a new track to history, move to the end
            if (newHistoryPosition === -1) {
              newHistoryPosition = newPlaybackHistory.length - 1;
            }
          }
          
          return {
            currentIndex: next,
            isPlaying: true,
            lyricsTranslationRequest: null,
            playbackHistory: newPlaybackHistory,
            historyPosition: newHistoryPosition,
          };
        }),
      previousTrack: () =>
        set((state) => {
          if (state.tracks.length === 0)
            return { currentIndex: -1, lyricsTranslationRequest: null };
          
          let prev: number;
          let newHistoryPosition = state.historyPosition;
          
          if (state.isShuffled) {
            // Try to get the actual previous track from playback history
            const previousFromHistory = getPreviousTrackFromHistory(
              state.playbackHistory,
              state.historyPosition,
              state.tracks
            );
            
            if (previousFromHistory !== null) {
              prev = previousFromHistory.trackIndex;
              newHistoryPosition = previousFromHistory.newHistoryPosition;
            } else {
              // Fallback to shuffle algorithm if no history
              prev = getRandomTrackIndexAvoidingRecent(
                state.tracks,
                state.playbackHistory,
                state.currentIndex
              );
              newHistoryPosition = -1; // Will be updated below
            }
          } else {
            // Sequential playback
            prev = (state.currentIndex - 1 + state.tracks.length) % state.tracks.length;
            newHistoryPosition = -1; // Will be updated below
          }
          
          // Update playback history with current track
          const currentTrackId = state.tracks[state.currentIndex]?.id;
          let newPlaybackHistory = state.playbackHistory;
          if (currentTrackId) {
            newPlaybackHistory = updatePlaybackHistory(state.playbackHistory, currentTrackId);
            // If we're adding a new track to history, move to the end
            if (newHistoryPosition === -1) {
              newHistoryPosition = newPlaybackHistory.length - 1;
            }
          }
          
          return {
            currentIndex: prev,
            isPlaying: true,
            lyricsTranslationRequest: null,
            playbackHistory: newPlaybackHistory,
            historyPosition: newHistoryPosition,
          };
        }),
      setShowVideo: (show) => set({ showVideo: show }),
      toggleLyrics: () => set((state) => ({ showLyrics: !state.showLyrics })),
      adjustLyricOffset: (trackIndex, deltaMs) =>
        set((state) => {
          if (
            trackIndex < 0 ||
            trackIndex >= state.tracks.length ||
            Number.isNaN(deltaMs)
          ) {
            return {} as Partial<IpodState>;
          }

          const tracks = [...state.tracks];
          const current = tracks[trackIndex];
          const newOffset = (current.lyricOffset || 0) + deltaMs;

          tracks[trackIndex] = {
            ...current,
            lyricOffset: newOffset,
          };

          return { tracks } as Partial<IpodState>;
        }),
      setLyricsAlignment: (alignment) => set({ lyricsAlignment: alignment }),
      setChineseVariant: (variant) => set({ chineseVariant: variant }),
      setKoreanDisplay: (display) => set({ koreanDisplay: display }),
      setLyricsTranslationRequest: (language, songId) =>
        set(
          language && songId
            ? { lyricsTranslationRequest: { language, songId } }
            : { lyricsTranslationRequest: null }
        ),
      importLibrary: (json: string) => {
        try {
          const importedTracks = JSON.parse(json) as Track[];
          if (!Array.isArray(importedTracks)) {
            throw new Error("Invalid library format");
          }
          // Validate each track has required fields
          for (const track of importedTracks) {
            if (!track.id || !track.url || !track.title) {
              throw new Error("Invalid track format");
            }
          }
          set({
            tracks: importedTracks,
            currentIndex: importedTracks.length > 0 ? 0 : -1,
            isPlaying: false,
            lyricsTranslationRequest: null,
            libraryState: "loaded",
            playbackHistory: [], // Clear playback history when importing library
            historyPosition: -1,
          });
        } catch (error) {
          console.error("Failed to import library:", error);
          throw error;
        }
      },
      exportLibrary: () => {
        const { tracks } = get();
        return JSON.stringify(tracks, null, 2);
      },
      initializeLibrary: async () => {
        const current = get();
        // Only initialize if the library is in uninitialized state
        if (current.libraryState === "uninitialized") {
          const { tracks, version } = await loadDefaultTracks();
          set({
            tracks,
            currentIndex: tracks.length > 0 ? 0 : -1,
            libraryState: "loaded",
            lastKnownVersion: version,
            playbackHistory: [], // Clear playback history when initializing library
            historyPosition: -1,
          });
        }
      },
      addTrackFromVideoId: async (urlOrId: string): Promise<Track | null> => {
        // Extract video ID from various URL formats
        const extractVideoId = (input: string): string | null => {
          // If it's already a video ID (11 characters, alphanumeric + hyphens/underscores)
          if (/^[a-zA-Z0-9_-]{11}$/.test(input)) {
            return input;
          }

          try {
            const url = new URL(input);

            // Handle os.ryo.lu/ipod/:id format
            if (
              url.hostname === "os.ryo.lu" &&
              url.pathname.startsWith("/ipod/")
            ) {
              return url.pathname.split("/")[2] || null;
            }

            // Handle YouTube URLs
            if (
              url.hostname.includes("youtube.com") ||
              url.hostname.includes("youtu.be")
            ) {
              // Standard YouTube URL: youtube.com/watch?v=VIDEO_ID
              const vParam = url.searchParams.get("v");
              if (vParam) return vParam;

              // Short YouTube URL: youtu.be/VIDEO_ID
              if (url.hostname === "youtu.be") {
                return url.pathname.slice(1) || null;
              }

              // Embedded or other YouTube formats
              const pathMatch = url.pathname.match(
                /\/(?:embed\/|v\/)?([a-zA-Z0-9_-]{11})/
              );
              if (pathMatch) return pathMatch[1];
            }

            return null;
          } catch {
            // Not a valid URL, might be just a video ID
            return /^[a-zA-Z0-9_-]{11}$/.test(input) ? input : null;
          }
        };

        const videoId = extractVideoId(urlOrId);
        if (!videoId) {
          throw new Error("Invalid YouTube URL or video ID");
        }

        const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
        let rawTitle = `Video ID: ${videoId}`; // Default title
        let authorName: string | undefined = undefined; // Store author_name

        try {
          // Fetch oEmbed data
          const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(
            youtubeUrl
          )}&format=json`;
          const oembedResponse = await fetch(oembedUrl);

          if (oembedResponse.ok) {
            const oembedData = await oembedResponse.json();
            rawTitle = oembedData.title || rawTitle;
            authorName = oembedData.author_name; // Extract author_name
          } else {
            throw new Error(
              `Failed to fetch video info (${oembedResponse.status}). Please check the YouTube URL.`
            );
          }
        } catch (error) {
          console.error(`Error fetching oEmbed data for ${urlOrId}:`, error);
          throw error; // Re-throw to be handled by caller
        }

        const trackInfo = {
          title: rawTitle,
          artist: undefined as string | undefined,
          album: undefined as string | undefined,
        };

        try {
          // Call /api/parse-title
          const parseResponse = await fetch("/api/parse-title", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: rawTitle,
              author_name: authorName,
            }),
          });

          if (parseResponse.ok) {
            const parsedData = await parseResponse.json();
            trackInfo.title = parsedData.title || rawTitle;
            trackInfo.artist = parsedData.artist;
            trackInfo.album = parsedData.album;
          } else {
            console.warn(
              `Failed to parse title with AI (status: ${parseResponse.status}), using raw title from oEmbed/default.`
            );
          }
        } catch (error) {
          console.error("Error calling /api/parse-title:", error);
        }

        const newTrack: Track = {
          id: videoId,
          url: youtubeUrl,
          title: trackInfo.title,
          artist: trackInfo.artist,
          album: trackInfo.album,
          lyricOffset: 1000, // Default 1 second offset for new tracks
        };

        try {
          get().addTrack(newTrack); // Add track to the store
          return newTrack;
        } catch (error) {
          console.error("Error adding track to store:", error);
          return null;
        }
      },

      syncLibrary: async () => {
        try {
          const { tracks: serverTracks, version: serverVersion } =
            await loadDefaultTracks();
          const current = get();
          const wasEmpty = current.tracks.length === 0;

          // Create a map of server tracks by ID for efficient lookup
          const serverTrackMap = new Map(
            serverTracks.map((track) => [track.id, track])
          );

          let newTracksAdded = 0;
          let tracksUpdated = 0;

          // Process existing tracks: update metadata if track exists on server
          const updatedTracks = current.tracks.map((currentTrack) => {
            const serverTrack = serverTrackMap.get(currentTrack.id);
            if (serverTrack) {
              // Track exists on server, check if metadata needs updating
              const hasChanges =
                currentTrack.title !== serverTrack.title ||
                currentTrack.artist !== serverTrack.artist ||
                currentTrack.album !== serverTrack.album ||
                currentTrack.url !== serverTrack.url ||
                currentTrack.lyricOffset !== serverTrack.lyricOffset;

              if (hasChanges) {
                tracksUpdated++;
                // Update with server metadata but preserve any user customizations we want to keep
                return {
                  ...currentTrack,
                  title: serverTrack.title,
                  artist: serverTrack.artist,
                  album: serverTrack.album,
                  url: serverTrack.url,
                  lyricOffset: serverTrack.lyricOffset,
                };
              }
            }
            // Return unchanged track (either no server version or no changes)
            return currentTrack;
          });

          // Find tracks that are on the server but not in the user's library
          const existingIds = new Set(current.tracks.map((track) => track.id));
          const tracksToAdd = serverTracks.filter(
            (track) => !existingIds.has(track.id)
          );
          newTracksAdded = tracksToAdd.length;

          // Combine new tracks (at top) with updated existing tracks
          const finalTracks = [...tracksToAdd, ...updatedTracks];

          // Update store if there were any changes
          if (newTracksAdded > 0 || tracksUpdated > 0) {
            set({
              tracks: finalTracks,
              lastKnownVersion: serverVersion,
              libraryState: "loaded",
              // If library was empty and we added tracks, set first song as current
              currentIndex:
                wasEmpty && finalTracks.length > 0 ? 0 : current.currentIndex,
              // Reset playing state if we're setting a new current track
              isPlaying:
                wasEmpty && finalTracks.length > 0 ? false : current.isPlaying,
            });
          } else {
            // Even if no changes, update the version and state
            set({
              lastKnownVersion: serverVersion,
              libraryState: "loaded",
            });
          }

          return {
            newTracksAdded,
            tracksUpdated,
            totalTracks: finalTracks.length,
          };
        } catch (error) {
          console.error("Error syncing library:", error);
          throw error;
        }
      },
    }),
    {
      name: "ryo:ipod", // Unique name for localStorage persistence
      version: CURRENT_IPOD_STORE_VERSION, // Set the current version
      partialize: (state) => ({
        // Keep tracks and originalOrder here initially for migration
        tracks: state.tracks,
        currentIndex: state.currentIndex,
        loopAll: state.loopAll,
        loopCurrent: state.loopCurrent,
        isShuffled: state.isShuffled,
        theme: state.theme,
        lcdFilterOn: state.lcdFilterOn,
        showLyrics: state.showLyrics, // Persist lyrics visibility
        lyricsAlignment: state.lyricsAlignment,
        chineseVariant: state.chineseVariant,
        koreanDisplay: state.koreanDisplay,
        isFullScreen: state.isFullScreen,
        libraryState: state.libraryState,
        lastKnownVersion: state.lastKnownVersion,
      }),
      migrate: (persistedState, version) => {
        let state = persistedState as IpodState; // Type assertion

        // If the persisted version is older than the current version, update defaults
        if (version < CURRENT_IPOD_STORE_VERSION) {
          console.log(
            `Migrating iPod store from version ${version} to ${CURRENT_IPOD_STORE_VERSION}`
          );
          state = {
            ...state,
            tracks: [],
            currentIndex: 0,
            isPlaying: false,
            isShuffled: state.isShuffled, // Keep shuffle preference maybe? Or reset? Let's keep it for now.
            showLyrics: state.showLyrics ?? true, // Add default for migration
            lyricsAlignment:
              state.lyricsAlignment ?? LyricsAlignment.FocusThree,
            chineseVariant: state.chineseVariant ?? ChineseVariant.Traditional,
            koreanDisplay: state.koreanDisplay ?? KoreanDisplay.Original,
            lyricsTranslationRequest: null, // Ensure this is not carried from old persisted state
            libraryState: "uninitialized" as LibraryState, // Reset to uninitialized on migration
            lastKnownVersion: state.lastKnownVersion ?? 0,
          };
        }
        // Clean up potentially outdated fields if needed in future migrations
        // Example: delete state.someOldField;

        // Ensure the returned state matches the latest IpodStoreState structure
        // Remove fields not present in the latest partialize if necessary
        const partializedState = {
          tracks: state.tracks,
          currentIndex: state.currentIndex,
          loopAll: state.loopAll,
          loopCurrent: state.loopCurrent,
          isShuffled: state.isShuffled,
          theme: state.theme,
          lcdFilterOn: state.lcdFilterOn,
          showLyrics: state.showLyrics, // Persist lyrics visibility
          lyricsAlignment: state.lyricsAlignment,
          chineseVariant: state.chineseVariant,
          koreanDisplay: state.koreanDisplay,
          isFullScreen: state.isFullScreen,
          libraryState: state.libraryState,
        };

        return partializedState as IpodState; // Return the potentially migrated state
      },
      onRehydrateStorage: () => {
        return (state, error) => {
          if (error) {
            console.error("Error rehydrating iPod store:", error);
          } else if (state && state.libraryState === "uninitialized") {
            // Only auto-initialize if library state is uninitialized
            Promise.resolve(state.initializeLibrary()).catch((err) =>
              console.error("Initialization failed on rehydrate", err)
            );
          }
        };
      },
    }
  )
);
