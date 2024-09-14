# YouTube Uploader CLI

A command-line interface (CLI) tool to upload videos to YouTube via the YouTube Data API v3. This project simplifies video uploads and playlist management directly from the terminal.

## Features

- Upload videos to YouTube.
- Create and manage YouTube playlists.
- Add videos to existing playlists.

## Prerequisites

- **Node.js** v20.16.0 or higher.
- **Google Cloud Project** with YouTube Data API v3 enabled.
- **OAuth 2.0 Credentials** (Client ID and Client Secret).

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/youtube-uploader-cli.git
   cd youtube-uploader-cli
   ```
2. Create OAuth 2.0 credentials on Google Cloud Platform (GCP) with YouTube Data API v3 enabled.
3. In the root directory of the project, create a .env file and define the following variables:
   - YOUTUBE_CLIENT_ID = Your OAuth2.0 Client ID
   - YOUTUBE_CLIENT_SECRET = Your OAuth2.0 Client Secret
   - (Refer to .env-sample for guidance)
4. Run below commands:
```
npm install
npm start
```
![youtube-cli-demo](https://github.com/user-attachments/assets/7343d7aa-4e04-4d6d-844c-218cd3517418)
