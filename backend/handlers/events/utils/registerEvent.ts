import { app, ipcMain } from "electron";

/**
 * Registers an event handler with IPC Main.
 *
 * @param eventName The name of the event to handle.
 * @param handler The function to call when the event is received.
 * @returns A strongly typed function that can be used to handle the event.
 */
export function registerEvent<
  HandlerArgs extends Array<unknown>,
  HandlerOutput,
>(
  eventName: string,
  handler: (
    event: Electron.IpcMainInvokeEvent,
    ...args: HandlerArgs
  ) => HandlerOutput | Promise<HandlerOutput>
): void {
  if (!app.isPackaged) {
    console.log(`[EVENT] registering: ${eventName}`);
  }
  ipcMain.handle(
    eventName,
    async (
      event: Electron.IpcMainInvokeEvent,
      ...args: HandlerArgs
    ): Promise<HandlerOutput> => {
      return handler(event, ...args);
    }
  );
}
