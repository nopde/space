import { createPopup } from "./modules/popups.js";
import { checkRippleElements } from "./modules/ripples.js";
import { checkTooltipElements } from "./modules/tooltips.js";
import { SearchBar } from "./modules/searchbar.js";
import { createSpaceFolder, deleteSpaceFn, createSpaceFn, openSpaceFolderFn, openSpacesFolderFn, codeSpaceFn, renameSpaceFn } from "./modules/preload_functions.js";

const quitBtn = document.getElementById("quit");
const minimizeBtn = document.getElementById("minimize");

quitBtn.addEventListener("click", async (event) => {
    await window.electronAPI.quit();
});

minimizeBtn.addEventListener("click", async (event) => {
    await window.electronAPI.minimize();
});

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

createSpaceFolder();
updateSpaces();

const createSpaceBtn = document.getElementById("create");
const refreshSpacesBtn = document.getElementById("refresh");
const openSpacesFolderBtn = document.getElementById("openFolder");

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

const searchBar = document.getElementById("search");
const search = new SearchBar(searchBar);
const spaces = document.querySelector(".spaces");

searchBar.focus();

search.spaceSearch(spaces);

function renamePopup(spaceName) {
    const popupHTML = `
        <style>
            :host {
                display: flex;
            }

            form {
                flex: 1 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 10px;
            }

            button {
                flex: 1 1;
                width: 100%;
                background-color: rgb(255, 255, 255 .25);
                border: none;
                padding: 10px 20px;
                border-radius: 999px;
                cursor: pointer;
                transition: background-color .1s ease;
            }

            button:hover {
                background-color: rgb(255, 255, 255, .35);
            }

            input {
                flex: 1 1;
                font-family: inherit;
                display: flex;
                align-items: center;
                outline: none;
                border: 0;
                border-radius: 999px;
                background-color: transparent;
                color: rgb(255, 255, 255);
                padding: 15px 20px;
                box-shadow: 0 0 0 1px rgb(255, 255, 255);
                font-size: 16px;
                transition: all .25s ease;
            }

            input:hover {
                background-color: rgb(255, 255, 255, 0.08);
            }

            input:focus {
                background-color: rgb(255, 255, 255, 0.12);
                box-shadow: 0 0 0 1.5px rgb(255, 255, 255);
            }

            input::placeholder {
                color: rgb(255, 255, 255);
            }
        </style>

        <form onsubmit="return false">
            <input id="popup input" type="text" placeholder="Space name" spellcheck="false" autocomplete="off" required>
            <button type="submit">Confirm</button>
        </form>
    `;

    let popupContainer = createPopup(`Rename ${spaceName}`, popupHTML);

    const confirmButton = popupContainer.querySelector("div.popup-content").shadowRoot.querySelector("button");
    const input = popupContainer.querySelector("div.popup-content").shadowRoot.querySelector("input");

    input.value = spaceName;
    input.focus();

    confirmButton.addEventListener("click", event => {
        renameSpaceFn(spaceName, input.value.replace(/ /g, "-"));

        const animation = popupContainer.animate([{ opacity: 0 }], { duration: 100, easing: "cubic-bezier(0.25, 1, 0.5, 1)", fill: "forwards" });

        animation.onfinish = () => {
            popupContainer.remove();
            updateSpaces();
        }
    });
}

function deletePopup(spaceName) {
    const popupHTML = `
        <style>
            :host {
                display: flex;
            }

            form {
                flex: 1 1;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            button {
                flex: 1 1;
                background-color: rgb(255, 255, 255 .25);
                border: none;
                padding: 10px 20px;
                border-radius: 999px;
                cursor: pointer;
                transition: background-color .1s ease;
            }

            button:hover {
                background-color: rgb(255, 255, 255, .35);
            }
        </style>

        <form onsubmit="return false">
            <button type="submit">Confirm</button>
        </form>
    `;

    let popupContainer = createPopup(`Delete ${spaceName}`, popupHTML);

    const confirmButton = popupContainer.querySelector("div.popup-content").shadowRoot.querySelector("button");

    confirmButton.focus();

    confirmButton.addEventListener("click", event => {
        deleteSpaceFn(spaceName);

        const animation = popupContainer.animate([{ opacity: 0 }], { duration: 100, easing: "cubic-bezier(0.25, 1, 0.5, 1)", fill: "forwards" });

        animation.onfinish = () => {
            popupContainer.remove();
            updateSpaces();
        }
    });
}