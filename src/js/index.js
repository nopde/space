/**
 * Search bar class.
 * 
 * @param {*} inputElement - The input element.
 */
class SearchBar {
    constructor(inputElement) {
        this.inputElement = inputElement;
        this.itemList = [];
        this.itemNames = [];
    }

    spaceSearch(spaceContainer) {
        this.inputElement.addEventListener("input", (event) => {
            this.itemList.splice(0, this.itemList.length);
            this.itemList = Array.from(spaceContainer.querySelectorAll(".space"));

            this.itemNames.splice(0, this.itemNames.length);
            this.itemList.forEach(spaceCard => {
                this.itemNames.push(spaceCard.id);
            });

            try {
                const searchValue = this.inputElement.value.trim().toLowerCase();
                const searchWords = searchValue.split(" ").filter(word => word !== "");

                this.itemNames.forEach((item, index) => {
                    const itemText = item.toLowerCase();
                    const result = this.itemList[index];

                    let match = true;

                    searchWords.forEach(word => {
                        if (!itemText.includes(word)) {
                            match = false;
                        }
                    });

                    if (match) {
                        result.classList.remove("hidden");
                    } else {
                        result.classList.add("hidden");
                    }
                });
            } catch (error) {
                console.error(error);
            }
        });
    }
}

const rippleElements = document.querySelectorAll("[ripple]");

rippleElements.forEach(rippleElement => {
    rippleElement.addEventListener("pointerdown", (event) => {
        const ripple = document.createElement("div");
        ripple.classList.add("ripple");

        var rect = event.currentTarget.getBoundingClientRect(),
            offsetX = event.clientX - rect.left,
            offsetY = event.clientY - rect.top;

        ripple.style.left = `${offsetX}px`;
        ripple.style.top = `${offsetY}px`;

        ripple.addEventListener("animationend", () => {
            ripple.remove();
        });

        rippleElement.appendChild(ripple);

        event.stopPropagation();
    });
});

const quitBtn = document.getElementById("quit");
const minimizeBtn = document.getElementById("minimize");

quitBtn.addEventListener("click", async (event) => {
    await window.electronAPI.quit();
});

minimizeBtn.addEventListener("click", async (event) => {
    await window.electronAPI.minimize();
});

const createSpaceFolder = async () => {
    await window.electronAPI.createSpaceFolder();
}

const deleteSpaceFn = async (name) => {
    await window.electronAPI.deleteSpace(name);
    updateSpaces();
}

const createSpaceFn = async (name) => {
    await window.electronAPI.createSpace(name);
}

const openSpaceFolderFn = async (name) => {
    await window.electronAPI.openSpaceFolder(name);
}

const openSpacesFolderFn = async () => {
    await window.electronAPI.openSpacesFolder();
}

const codeSpaceFn = async (name) => {
    await window.electronAPI.codeSpace(name);
}

const updateSpaces = async () => {
    const spaces = await window.electronAPI.getSpaces();

    const spacesContainer = document.querySelector(".spaces");
    spacesContainer.innerHTML = "";

    spaces.forEach(spaceName => {
        const spaceHTML = `
            <div class="space" id="${spaceName}" ripple>
                <p>${spaceName}</p>
                <button id="${spaceName}.delete" ripple><span class="material-symbols-outlined">delete</span></button>
                <button id="${spaceName}.openFolder" ripple><span class="material-symbols-outlined">folder</span></button>
            </div>
        `
        const spaceContainer = document.createElement("div");

        spaceContainer.innerHTML = spaceHTML;

        const space = spaceContainer.querySelector(":scope > .space");

        spacesContainer.appendChild(space);

        const deleteBtn = document.getElementById(`${spaceName}.delete`);
        const openFolderBtn = document.getElementById(`${spaceName}.openFolder`);

        deleteBtn.addEventListener("click", (event) => {
            deleteSpaceFn(spaceName);
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