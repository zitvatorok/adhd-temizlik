import { Capacitor } from "@capacitor/core";
import { LocalNotifications } from "@capacitor/local-notifications";

const REMINDER_ID = 1;

export function isReminderSupported() {
  return Capacitor.isNativePlatform();
}

/**
 * Günlük hatırlatmayı cihazla eşitler.
 * reminder: { enabled: boolean, hour: number, minute: number }
 * texts: { title, body } — çağıran taraf aktif dilden çevirir.
 * Dönüş: izin reddedildiyse false (UI toggle'ı geri almalı), aksi halde true.
 */
export async function syncReminder(reminder, texts) {
  if (!isReminderSupported()) return false;

  try {
    await LocalNotifications.cancel({ notifications: [{ id: REMINDER_ID }] });

    if (!reminder?.enabled) return true;

    let permission = await LocalNotifications.checkPermissions();
    if (permission.display !== "granted") {
      permission = await LocalNotifications.requestPermissions();
    }
    if (permission.display !== "granted") return false;

    await LocalNotifications.schedule({
      notifications: [
        {
          id: REMINDER_ID,
          title: texts.title,
          body: texts.body,
          schedule: {
            on: { hour: reminder.hour ?? 19, minute: reminder.minute ?? 0 },
            repeats: true,
          },
        },
      ],
    });
    return true;
  } catch {
    return false;
  }
}
