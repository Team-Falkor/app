import "webtorrent";

declare module "webtorrent" {
  interface Options {
    blocklist?: string[] | string;
    downloadLimit?: number;
    uploadLimit?: number;
  }
  interface Instance {
    throttleDownload(rate: number): boolean | undefined;

    throttleUpload(rate: number): boolean | undefined;
  }
}
