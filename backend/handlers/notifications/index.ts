import { Notification, type NotificationConstructorOptions } from "electron";
import { createWriteStream, existsSync } from "fs";
import https from "https";
import { join } from "path";
import { constants } from "../../utils";
import { settings } from "../../utils/settings/settings";

class NotificationsHandler {
  // Creates and returns a new Electron notification with the provided options.
  public static constructNotification = (
    options?: NotificationConstructorOptions,
    show: boolean = true
  ) => {
    try {
      const setting = settings.get("notifications");
      if (!setting) {
        console.log("Notifications are disabled in settings");
        return;
      }

      const notification = new Notification(options);

      if (!show) {
        console.log("show is false");
        return notification;
      }

      notification.show();
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
    if (!url) return undefined; // Return undefined if the URL is invalid.

    try {
      // Determine the file name, prioritizing the extra parameter, then URL path, with a default fallback.
      const fileName =
        extra?.fileName ||
        new URL(url).pathname.split("/").pop() ||
        "image.png";
      const output = join(constants.cachePath, fileName); // Build the output file path.

      // Check if the file already exists.
      if (existsSync(output)) {
        console.log("File already exists:", output);
        return output; // Return the path to the existing file.
      }

      // If the file doesn't exist, download and save the image.
      return await this.downloadImage(url, output);
    } catch (error) {
      console.error("Error creating image:", error); // Log any unexpected errors.
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
      // Perform an HTTPS GET request to fetch the image.
      https
        .get(url, { timeout: 10000 }, (response) => {
          if (response.statusCode !== 200) {
            // Reject if the response status code is not successful.
            reject(
              new Error(
                `Failed to fetch image. Status code: ${response.statusCode}`
              )
            );
            return;
          }

          const writeStream = createWriteStream(output); // Create a writable stream to save the file.
          response.pipe(writeStream); // Pipe the response data to the write stream.

          // Resolve the promise when the write operation finishes successfully.
          writeStream.on("finish", () => resolve(output));

          // Reject the promise if an error occurs during file writing.
          writeStream.on("error", (error) =>
            reject(new Error(`File write error: ${error.message}`))
          );
        })
        .on("error", (error) =>
          reject(new Error(`Request error: ${error.message}`))
        ); // Handle request-level errors.
    });
  }
}

export { NotificationsHandler };
