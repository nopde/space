import { renameModal, deleteModal } from "./modals.js";
import { checkRippleElements } from "./ripples.js";
import { checkTooltipElements } from "./tooltips.js";
import { codeSpaceFn, openSpaceFolderFn, getSpaces, openTerminalFn } from "./preload_functions.js";

export const updateSpaces = async () => {
    const spaces = await getSpaces();

    const spacesContainer = document.querySelector(".spaces");
    spacesContainer.innerHTML = "";

    spaces.forEach(spaceName => {
        const spaceHTML = `
            <div class="space" id="${spaceName}" ripple>
                <p>${spaceName}</p>
                <button id="${spaceName} rename" tooltip data-tooltip="Edit" ripple><span class="material-symbols-outlined">edit</span></button>
                <button id="${spaceName} delete" tooltip data-tooltip="Delete" ripple><span class="material-symbols-outlined">delete</span></button>
                <button id="${spaceName} openFolder" tooltip data-tooltip="Open folder" ripple><span class="material-symbols-outlined">folder</span></button>
                <button id="${spaceName} openTerminal" tooltip data-tooltip="Open terminal" ripple><span class="material-symbols-outlined">terminal</span></button>
            </div>
        `
        const spaceContainer = document.createElement("div");

        spaceContainer.innerHTML = spaceHTML;

        const space = spaceContainer.querySelector(":scope > .space");

        spacesContainer.appendChild(space);

        const renameBtn = document.getElementById(`${spaceName} rename`);
        const deleteBtn = document.getElementById(`${spaceName} delete`);
        const openFolderBtn = document.getElementById(`${spaceName} openFolder`);
        const openTerminalBtn = document.getElementById(`${spaceName} openTerminal`);

        renameBtn.addEventListener("click", (event) => {
            renameModal(spaceName);
            event.stopPropagation();
        });

        deleteBtn.addEventListener("click", (event) => {
            deleteModal(spaceName);
            event.stopPropagation();
        });

        openFolderBtn.addEventListener("click", (event) => {
            openSpaceFolderFn(spaceName);
            event.stopPropagation();
        });

        openTerminalBtn.addEventListener("click", (event) => {
            openTerminalFn(spaceName);
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