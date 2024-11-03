import { getInfoHashFromMagnet } from "@/lib/utils";
import { Torrents } from "./torrents";
import { Unrestrict } from "./unrestrict";
import { User } from "./user";

class RealDebridClient {
  private static instance: RealDebridClient | null = null;
  private readonly accessToken: string;

  public readonly unrestrict: Unrestrict;
  public readonly user: User;
  public readonly torrents: Torrents;

  private constructor(accessToken: string) {
    if (!accessToken) {
      throw new Error(
        "Access token not provided. Please provide a valid access token."
      );
    }
    this.accessToken = accessToken;
    this.unrestrict = new Unrestrict(accessToken);
    this.user = new User(accessToken);
    this.torrents = new Torrents(accessToken);
  }

  public static getInstance(accessToken: string): RealDebridClient {
    if (
      RealDebridClient.instance &&
      RealDebridClient.instance.accessToken !== accessToken
    ) {
      throw new Error(
        "A different instance with a conflicting access token already exists."
      );
    }
    if (!RealDebridClient.instance) {
      RealDebridClient.instance = new RealDebridClient(accessToken);
    }
    return RealDebridClient.instance;
  }

  private async getOrCreateTorrent(magnetLink: string): Promise<string> {
    const infoHash = getInfoHashFromMagnet(magnetLink);
    const existingTorrents = await this.user.torrents();
    const foundTorrent = existingTorrents?.length
      ? existingTorrents?.find((torrent) => torrent.hash === infoHash)
      : null;

    if (foundTorrent) {
      return foundTorrent.id;
    }

    // If torrent does not exist, add it and return the new ID
    const addedTorrent = await this.torrents.addMagnet(magnetLink);
    console.log(addedTorrent);
    if (!addedTorrent?.id) {
      throw new Error("Failed to add torrent. No ID returned.");
    }
    return addedTorrent.id;
  }

  public async downloadTorrentFromMagnet(
    magnetLink: string,
    fileSelection: string | "all" = "all"
  ): Promise<string> {
    console.log({
      magnetLink,
      decodedMagnetLink: decodeURIComponent(magnetLink),
    });
    const torrentId = await this.getOrCreateTorrent(
      decodeURIComponent(magnetLink)
    );
    let torrentInfo = await this.torrents.info(torrentId);

    // Select files if necessary
    if (torrentInfo.status === "waiting_files_selection") {
      await this.torrents.selectFiles(torrentId, fileSelection);
      torrentInfo = await this.torrents.info(torrentId); // Refresh info after selection
    }

    // Check download status
    if (torrentInfo.status !== "downloaded") {
      throw new Error("Torrent has not completed downloading.");
    }

    // Ensure links are available
    const [firstLink] = torrentInfo.links || [];
    if (!firstLink) {
      throw new Error("No links available for the completed torrent.");
    }

    // Unrestrict the first available link
    try {
      const unrestrictedLink = await this.unrestrict.link(firstLink);
      return unrestrictedLink.download;
    } catch (error) {
      throw new Error(`Failed to unrestrict link: ${(error as Error).message}`);
    }
  }
}

export default RealDebridClient;
