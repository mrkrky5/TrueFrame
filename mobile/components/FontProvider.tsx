import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
  useFonts,
} from "@expo-google-fonts/dm-sans";
import { SourceSerif4_600SemiBold } from "@expo-google-fonts/source-serif-4";

import { AppBootSkeleton } from "@/components/ui/AppSkeleton";

export default function FontProvider({ children }: { children: React.ReactNode }) {
  const [loaded] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
    SourceSerif4_600SemiBold,
  });

  if (!loaded) return <AppBootSkeleton />;
  return children;
}
