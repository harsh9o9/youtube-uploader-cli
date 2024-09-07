import dotenv from "dotenv";
import { google } from "googleapis";
import readlineSync from "readline-sync";
import { logError, logInfo, logSuccess } from "./utils/logger.js";

dotenv.config();
const { YOUTUBE_CLIENT_ID, YOUTUBE_CLIENT_SECRET } = process.env;

const REDIRECT_URI = "urn:ietf:wg:oauth:2.0:oob";
const SCOPES = [
  "https://www.googleapis.com/auth/youtube.upload",
  "https://www.googleapis.com/auth/youtube",
];

const oauth2Client = new google.auth.OAuth2(
  YOUTUBE_CLIENT_ID,
  YOUTUBE_CLIENT_SECRET,
  REDIRECT_URI
);

export async function getAuthToken() {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  logInfo(`Authorize this app by visiting this URL:\n${authUrl}`);

  const code = readlineSync.question("Enter the code from that page here: ");
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    logSuccess("Authentication successful!");
    return oauth2Client;
  } catch (err) {
    logError("Error during authentication", err);
  }
}
