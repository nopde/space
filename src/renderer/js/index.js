import { renamePopup, deletePopup } from "./modules/popups.js";
import { checkRippleElements } from "./modules/ripples.js";
import { checkTooltipElements } from "./modules/tooltips.js";
import { SearchBar } from "./modules/searchbar.js";
import { createSpaceFolder, createSpaceFn, openSpaceFolderFn, openSpacesFolderFn, codeSpaceFn } from "./modules/preload_functions.js";

// Variables

const quitBtn = document.getElementById("quit");
const minimizeBtn = document.getElementById("minimize");
const createSpaceBtn = document.getElementById("create");
const refreshSpacesBtn = document.getElementById("refresh");
const openSpacesFolderBtn = document.getElementById("openFolder");
const searchBar = document.getElementById("search");
const search = new SearchBar(searchBar);
const spaces = document.querySelector(".spaces");

// Functions

const updateSpaces = async () => {
    const spaces = await window.electronAPI.getSpaces();

    const spacesContainer = document.querySelector(".spaces");
    spacesContainer.innerHTML = "";

    spaces.forEach(spaceName => {
        const spaceHTML = `
            <div class="space" id="${spaceName}" ripple>
                <p>${spaceName}</p>
                <button id="${spaceName} rename" tooltip data-tooltip="Edit" ripple><span class="material-symbols-outlined">edit</span></button>
                <button id="${spaceName} delete" tooltip data-tooltip="Delete" ripple><span class="material-symbols-outlined">delete</span></button>
                <button id="${spaceName} openFolder" tooltip data-tooltip="Open folder" ripple><span class="material-symbols-outlined">folder</span></button>
            </div>
        `
        const spaceContainer = document.createElement("div");

        spaceContainer.innerHTML = spaceHTML;

        const space = spaceContainer.querySelector(":scope > .space");

        spacesContainer.appendChild(space);

        const renameBtn = document.getElementById(`${spaceName} rename`);
        const deleteBtn = document.getElementById(`${spaceName} delete`);
        const openFolderBtn = document.getElementById(`${spaceName} openFolder`);

        renameBtn.addEventListener("click", (event) => {
            renamePopup(spaceName);
            event.stopPropagation();
        });

        deleteBtn.addEventListener("click", (event) => {
            deletePopup(spaceName);
            event.stopPropagation();
        });

        openFolderBtn.addEventListener("click", (event) => {
            openSpaceFolderFn(spaceName);
            event.stopPropagation();
        });

        space.addEventListener("click", (event) => {
            codeSpaceFn(spaceName);
            event.stopPropagation();
        });
    });

    checkRippleElements();
    checkTooltipElements();

    const searchBar = document.getElementById("search");
    const inputEvent = new Event("input", {
        bubbles: true,
        cancelable: true,
    });

    searchBar.dispatchEvent(inputEvent);
}

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