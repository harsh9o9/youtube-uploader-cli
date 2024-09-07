import fs from "fs";
import { google } from "googleapis";
import path from "path";
import { logError, logSuccess } from "./utils/logger.js";

export async function uploadVideo(auth, filePath) {
  const youtube = google.youtube({ version: "v3", auth });
  const fileName = path.basename(filePath);

  try {
    const res = await youtube.videos.insert({
      part: "snippet,status",
      requestBody: {
        snippet: {
          title: fileName,
          description: "Uploaded via CLI",
          categoryId: "22",
        },
        status: { privacyStatus: "private" },
      },
      media: { body: fs.createReadStream(filePath) },
    });

    logSuccess(`Uploaded video with id: ${res.data.id}`);
    return res.data.id;
  } catch (error) {
    if (
      error.response &&
      error.response.status === 403 &&
      error.response.data.error.errors[0].reason === "quotaExceeded"
    ) {
      logError(
        "Quota exceeded. Please check your quota usage and request an increase if necessary."
      );
    } else {
      logError(`An error occurred: ${error.message}`);
    }
    throw error; // Rethrow the error after logging
  }
}
