import { Response } from "@/@types";
import os from "node:os";

export const getOS = () => {
  switch (os.type().toLowerCase()) {
    case "darwin":
      return "macos";
    case "windows_nt":
      return "windows";
    case "linux":
    default:
      return "linux";
  }
};

// Utility function to sanitize filenames
export const sanitizeFilename = (filename: string): string => {
  // Remove disallowed characters
  const sanitized = filename.replace(/[^a-zA-Z0-9._-]/g, "").trim();

  // Enforce a reasonable length
  const maxLength = 255;
  const trimmed = sanitized.slice(0, maxLength);

  // Check for reserved names (Windows-specific)
  const reservedNames = [
    "CON",
    "PRN",
    "AUX",
    "NUL",
    "COM1",
    "COM2",
    "COM3",
    "COM4",
    "COM5",
    "COM6",
    "COM7",
    "COM8",
    "COM9",
    "LPT1",
    "LPT2",
    "LPT3",
    "LPT4",
    "LPT5",
    "LPT6",
    "LPT7",
    "LPT8",
    "LPT9",
  ];
  if (reservedNames.includes(trimmed.toUpperCase())) {
    return "untitled";
  }

  return trimmed || "untitled";
};

export const createResponse = <T>(
  message: string,
  error: boolean,
  data: T | null = null
): Response<T> => ({
  message,
  error,
  data,
});
