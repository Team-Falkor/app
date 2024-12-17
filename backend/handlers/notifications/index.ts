import { NotificationType } from "@/@types";
import { Notification, type NotificationConstructorOptions } from "electron";
import { createWriteStream, existsSync } from "fs";
import https from "https";
import { join } from "path";
import { constants, getSoundPath } from "../../utils";
import { playSound } from "../../utils/playsound";
import { settings } from "../../utils/settings/settings";

class NotificationsHandler {
  public static constructNotification = (
    options?: NotificationConstructorOptions & {
      notificationType?: NotificationType;
    },
    show: boolean = true
  ) => {
    try {
      const setting = settings.get("notifications");
      if (!setting) {
        console.log("Notifications are disabled in settings");
        return;
      }

      const notification = new Notification({
        ...options,
        silent: true,
      });

      if (!show) {
        console.log("show is false");
        return notification;
      }

      notification.show();

      let soundPath: string | null = null;
      switch (options?.notificationType) {
        case "download_completed":
          soundPath = getSoundPath("complete.wav");
          break;
        case "achievement_unlocked":
          soundPath = getSoundPath("achievement_unlock.wav");
          break;
        default:
          console.error(
            "Unknown notification type:",
            options?.notificationType
          );
          break;
      }

      if (!soundPath) return;
      playSound(soundPath);
    } catch (error) {
      console.error("Error creating notification:", error);
    }
  };

  /**
   * Downloads an image from the given URL and saves it to the cache path.
   * @param url - The URL of the image to download.
   * @param extra - Optional additional parameters, including a custom file name.
   * @returns The path to the saved image or undefined if an error occurs.
   */
  public static async createImage(
    url: string,
    extra?: {
      fileName?: string;
    }
  ): Promise<string | undefined> {
    if (!url) return undefined;

    try {
      const fileName =
        extra?.fileName ||
        new URL(url).pathname.split("/").pop() ||
        "image.png";
      const output = join(constants.cachePath, fileName);

      if (existsSync(output)) {
        console.log("File already exists:", output);
        return output;
      }

      return await this.downloadImage(url, output);
    } catch (error) {
      console.error("Error creating image:", error);
      return undefined;
    }
  }

  /**
   * Handles downloading an image and saving it to a specified file.
   * @param url - The URL of the image to download.
   * @param output - The path to save the downloaded image.
   * @returns A promise that resolves to the output path on success or rejects on failure.
   */
  private static downloadImage(url: string, output: string): Promise<string> {
    return new Promise((resolve, reject) => {
      https
        .get(url, { timeout: 10000 }, (response) => {
          if (response.statusCode !== 200) {
            reject(
              new Error(
                `Failed to fetch image. Status code: ${response.statusCode}`
              )
            );
            return;
          }

          const writeStream = createWriteStream(output);
          response.pipe(writeStream);

          writeStream.on("finish", () => resolve(output));
          writeStream.on("error", (error) =>
            reject(new Error(`File write error: ${error.message}`))
          );
        })
        .on("error", (error) =>
          reject(new Error(`Request error: ${error.message}`))
        );
    });
  }
}

export { NotificationsHandler };
