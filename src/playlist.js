import { google } from "googleapis";
import { logSuccess } from "./utils/logger.js";

export async function createPlaylist(auth, title, playlistDesc) {
  console.log("title: ", title);

  const youtube = google.youtube({ version: "v3", auth });
  const res = await youtube.playlists.insert({
    part: "snippet,status",
    requestBody: {
      snippet: {
        title,
        description: playlistDesc ?? "Unlisted playlist created via CLI",
      },
      status: { privacyStatus: "unlisted" },
    },
  });
  logSuccess(`Created playlist with id: ${res.data.id}`);
  return res.data.id;
}

export async function addToPlaylist(auth, videoId, playlistId) {
  const youtube = google.youtube({ version: "v3", auth });
  await youtube.playlistItems.insert({
    part: "snippet",
    requestBody: {
      snippet: { playlistId, resourceId: { kind: "youtube#video", videoId } },
    },
  });
  logSuccess(
    `Added video with id: ${videoId} to playlist with id: ${playlistId}`
  );
}

// Function to get all playlists of the user
export async function getAllPlaylists(auth) {
  const youtube = google.youtube({ version: "v3", auth });
  const playlists = [];
  let nextPageToken = null;

  do {
    const res = await youtube.playlists.list({
      part: "snippet",
      mine: true,
      maxResults: 50,
      pageToken: nextPageToken,
    });

    res.data.items.forEach((item) => {
      playlists.push({
        id: item.id,
        title: item.snippet.title,
      });
    });

    nextPageToken = res.data.nextPageToken;
  } while (nextPageToken);

  return playlists;
}
