import fs from "fs-extra";
import path from "path";
import { getAuthToken } from "./auth.js";
import { addToPlaylist, createPlaylist, getAllPlaylists } from "./playlist.js";
import { uploadVideo } from "./upload.js";
import {
  promptForExistingPlaylist,
  promptForFolderPath,
  promptForNewPlaylistName,
  promptForPlaylistChoice,
} from "./utils/inquirerPrompts.js";
import { logError, logInfo, logSuccess } from "./utils/logger.js";

async function uploadVideosFromFolder(folderPath) {
  try {
    // Ensure the folder exists and contains video files
    const files = fs
      .readdirSync(folderPath)
      .filter((file) =>
        [".mp4", ".mov", ".avi"].includes(path.extname(file).toLowerCase())
      );

    if (files.length === 0) {
      throw new Error("No video files found in the specified folder.");
    }

    const auth = await getAuthToken();
    const choice = await promptForPlaylistChoice();

    let playlistId;
    if (choice === "new") {
      const playlistName = await promptForNewPlaylistName();
      playlistId = await createPlaylist(auth, playlistName);
    } else if (choice === "existing") {
      // Get all existing playlists
      const playlists = await getAllPlaylists(auth);

      if (playlists.length === 0) {
        logInfo("No existing playlists found. You need to create one.");
        const playlistName = await promptForNewPlaylistName();
        playlistId = await createPlaylist(auth, playlistName);
      } else {
        // Show existing playlists and let the user choose
        playlistId = await promptForExistingPlaylist(playlists);
      }
    } else {
      throw new Error("Invalid choice");
    }

    let filesCount = files.length;
    logInfo(`Found ${filesCount} video files to upload.`);
    for (const file of files) {
      const filePath = path.join(folderPath, file);

      try {
        const videoId = await uploadVideo(auth, filePath);
        await addToPlaylist(auth, videoId, playlistId);
      } catch (err) {
        filesCount--;
        logError(
          `❌ Failed to upload or add video: ${file}. Error: ${err.message}`
        );
      }
    }
    logSuccess(
      `✅ Upload complete!, ${filesCount}/${files.length} files uploaded.`
    );
  } catch (err) {
    logError(`Error during video upload process: ${err.message}`);
  }
}

// Prompt for folder path and start the process
(async () => {
  try {
    const folderPath = await promptForFolderPath();
    await uploadVideosFromFolder(folderPath);
  } catch (err) {
    logError(`Error in main process: ${err.message}`);
  }
})();
