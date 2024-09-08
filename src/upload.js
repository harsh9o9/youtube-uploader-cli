import chalk from "chalk";
import fs from "fs";
import { google } from "googleapis";
import ora from "ora";
import path from "path";
import { logError, logSuccess } from "./utils/logger.js";

export async function uploadVideo(auth, filePath) {
  const youtube = google.youtube({ version: "v3", auth });
  const fileName = path.basename(filePath);
  const fileSize = fs.statSync(filePath).size; // Get the file size for progress tracking
  // Initialize the ora spinner for upload progress
  const spinner = ora({
    text: `Uploading: ${chalk.green(fileName)} - 0%`,
    color: "blue",
  }).start();

  try {
    const res = await youtube.videos.insert(
      {
        part: "snippet,status",
        requestBody: {
          snippet: {
            title: fileName,
            description: "Uploaded via CLI",
            categoryId: "22",
          },
          status: { privacyStatus: "unlisted" },
        },
        media: { body: fs.createReadStream(filePath) },
      },
      {
        // Track the progress of the video upload
        onUploadProgress: (evt) => {
          const progress = (evt.bytesRead / fileSize) * 100;
          spinner.text = `Uploading: ${chalk.green(fileName)} - ${chalk.yellow(
            progress.toFixed(2)
          )}%`;
        },
      }
    );
    spinner.succeed(`Upload complete for: ${chalk.green(fileName)}`);
    logSuccess(`Uploaded video with id: ${res.data.id}`);
    return res.data.id;
  } catch (error) {
    spinner.fail("Upload failed.");
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
