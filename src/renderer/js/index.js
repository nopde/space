import { SearchBar } from "./modules/searchbar.js";
import { createSpaceFolder, createSpaceFn, openSpacesFolderFn, openTerminalFn } from "./modules/preload_functions.js";
import { updateSpaces } from "./modules/spaces.js";

// Variables

const quitBtn = document.getElementById("quit");
const minimizeBtn = document.getElementById("minimize");
const createSpaceBtn = document.getElementById("create");
const refreshSpacesBtn = document.getElementById("refresh");
const openSpacesFolderBtn = document.getElementById("openFolder");
const terminalBtn = document.getElementById("terminal");
const searchBar = document.getElementById("search");
const search = new SearchBar(searchBar);
const spaces = document.querySelector(".spaces");

// Event listeners

quitBtn.addEventListener("click", async (event) => {
    await window.electronAPI.quit();
});

minimizeBtn.addEventListener("click", async (event) => {
    await window.electronAPI.minimize();
});

createSpaceBtn.addEventListener("click", () => {
    const search = document.getElementById("search");
    if (search.value) {
        createSpaceFn(search.value);
        search.focus();
        updateSpaces();
    }
});

refreshSpacesBtn.addEventListener("click", () => {
    updateSpaces();
});

openSpacesFolderBtn.addEventListener("click", () => {
    openSpacesFolderFn();
});

terminalBtn.addEventListener("click", () => {
    openTerminalFn();
});

// Initialization

window.electronAPI.onResetScroll(() => {
    if (spaces) {
        spaces.scrollTop = 0;
    }
});

searchBar.focus();

search.initialize(spaces);

createSpaceFolder();
updateSpaces();