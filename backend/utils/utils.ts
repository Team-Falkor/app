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
