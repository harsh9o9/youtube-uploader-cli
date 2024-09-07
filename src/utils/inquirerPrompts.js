import inquirer from "inquirer";
import { getRandomInt } from "./randomUtils.js";

export async function promptForPlaylistChoice() {
  const answers = await inquirer.prompt({
    type: "list",
    name: "choice",
    message:
      "Do you want to (1) create a new playlist or (2) upload to an existing playlist?",
    choices: [
      { name: "Create a new playlist", value: "new" },
      { name: "Upload to an existing playlist", value: "existing" },
    ],
  });
  return answers.choice;
}

export async function promptForFolderPath() {
  const answers = await inquirer.prompt({
    type: "input",
    name: "folderPath",
    message: "Enter the path to the folder containing videos:",
    default: ".", // default to current directory
  });
  return answers.folderPath;
}

export async function promptForNewPlaylistName() {
  const defaultPlaylistName = `Playlist ${getRandomInt(1000, 100000)}`;
  const answers = await inquirer.prompt({
    type: "input",
    name: "name",
    message: "Enter new playlist name:",
    default: defaultPlaylistName,
  });
  return answers.name;
}

export async function promptForExistingPlaylist(playlists) {
  const choices = playlists.map((playlist) => ({
    name: playlist.title,
    value: playlist.id,
  }));

  const answers = await inquirer.prompt({
    type: "list",
    name: "playlistId",
    message: "Select a playlist to upload to:",
    choices: choices,
  });
  return answers.playlistId;
}
