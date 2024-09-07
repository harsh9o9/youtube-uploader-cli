import fs from "fs-extra";
import ora from "ora";
import path from "path";
import { getAuthToken } from "./auth.js";
import { addToPlaylist, createPlaylist } from "./playlist.js";
import { uploadVideo } from "./upload.js";
import {
  promptForExistingPlaylist,
  promptForFolderPath,
  promptForNewPlaylistName,
  promptForPlaylistChoice,
} from "./utils/inquirerPrompts.js";

async function uploadVideosFromFolder(folderPath) {
  const files = fs
    .readdirSync(folderPath)
    .filter((file) =>
      [".mp4", ".mov", ".avi"].includes(path.extname(file).toLowerCase())
    );

  const auth = await getAuthToken();
  const choice = await promptForPlaylistChoice();

  let playlistId;
  if (choice === "new") {
    const playlistName = await promptForNewPlaylistName();
    console.log("playlistName: ", playlistName);

    playlistId = await createPlaylist(auth, playlistName);
  } else {
    // handle existing playlist logic
    playlistId = await promptForExistingPlaylist(playlists);
  }

  const spinner = ora("Uploading videos...").start();
  for (const file of files) {
    const filePath = path.join(folderPath, file);
    const videoId = await uploadVideo(auth, filePath);
    await addToPlaylist(auth, videoId, playlistId);
  }
  spinner.succeed("Upload complete!");
}

// Prompt for folder path and start the process
(async () => {
  const folderPath = await promptForFolderPath();
  uploadVideosFromFolder(folderPath).catch(console.error);
})();
