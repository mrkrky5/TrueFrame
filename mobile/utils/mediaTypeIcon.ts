import type { Ionicons } from "@expo/vector-icons";
import type { MediaType } from "../../types/index";

export function mediaTypeIconName(mediaType: MediaType): keyof typeof Ionicons.glyphMap {
  switch (mediaType) {
    case "game":
      return "game-controller-outline";
    case "film":
      return "film-outline";
    case "series":
      return "tv-outline";
    case "book":
      return "book-outline";
    default:
      return "albums-outline";
  }
}
