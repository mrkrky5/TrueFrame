import { Haptics, ImpactStyle } from "@capacitor/haptics";
import { isNativeApp } from "@/lib/native/platform";

export async function lightImpact(): Promise<void> {
  if (!isNativeApp()) return;
  try {
    await Haptics.impact({ style: ImpactStyle.Light });
  } catch {
    // Haptics unavailable on this device
  }
}
