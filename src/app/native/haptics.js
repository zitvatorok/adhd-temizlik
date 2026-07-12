import { Capacitor } from "@capacitor/core";
import { Haptics, ImpactStyle, NotificationType } from "@capacitor/haptics";

/** Mühür basıldığında hafif "tak". Web'de sessizce atlanır. */
export async function stampTap() {
  if (!Capacitor.isNativePlatform()) return;
  try {
    await Haptics.impact({ style: ImpactStyle.Light });
  } catch {
    // Haptik desteklenmiyorsa sessiz kal.
  }
}

/** Günün 3 adımı tamamlandığında başarı geri bildirimi. */
export async function dayComplete() {
  if (!Capacitor.isNativePlatform()) return;
  try {
    await Haptics.notification({ type: NotificationType.Success });
  } catch {
    // Haptik desteklenmiyorsa sessiz kal.
  }
}
