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

function createRipple(rippleElement) {
    const existingSurface = rippleElement.querySelector(":scope > ripple-surface");
    if (existingSurface) {
        return;
    }

    const rippleSurface = document.createElement("ripple-surface");

    rippleElement.appendChild(rippleSurface);

    rippleElement.addEventListener("pointerdown", event => {
        const ripple = document.createElement("ripple");

        var rect = rippleSurface.getBoundingClientRect(),
            offsetX = event.clientX - rect.left,
            offsetY = event.clientY - rect.top;

        const size = Math.max(rect.height, rect.width);
        const min = Math.min(rect.height, rect.width);
        let properSize = 0;

        if (min <= size / 2) {
            properSize = size * 1.5;
        }
        else {
            properSize = size * (1 + min / size);
        }

        ripple.style.width = `${properSize}px`;
        ripple.style.height = `${properSize}px`;

        ripple.style.left = `${offsetX}px`;
        ripple.style.top = `${offsetY}px`;

        ripple.animate([{ left: "50%", top: "50%" }], { duration: 500, easing: "cubic-bezier(0.25, 1, 0.5, 1)", fill: "forwards" });

        let animationEnded = false;

        ripple.addEventListener("animationend", event => {
            animationEnded = true;
        });

        rippleElement.addEventListener("pointerup", event => {
            if (animationEnded) {
                ripple.style.opacity = 0;
                setTimeout(() => {
                    ripple.remove();
                }, 300);
            }
            else {
                ripple.addEventListener("animationend", event => {
                    ripple.style.opacity = 0;
                    setTimeout(() => {
                        ripple.remove();
                    }, 300);
                });
            }
        });

        rippleElement.addEventListener("pointerleave", event => {
            if (animationEnded) {
                ripple.style.opacity = 0;
                setTimeout(() => {
                    ripple.remove();
                }, 300);
            }
            else {
                ripple.addEventListener("animationend", event => {
                    ripple.style.opacity = 0;
                    setTimeout(() => {
                        ripple.remove();
                    }, 300);
                });
            }
        });

        rippleSurface.appendChild(ripple);

        event.stopPropagation();
    });
}

function checkRippleElements() {
    const rippleElements = document.querySelectorAll("[ripple]");

    rippleElements.forEach(rippleElement => {
        createRipple(rippleElement);
    });
}

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

const renameSpaceFn = async (old_name, new_name) => {
    await window.electronAPI.renameSpace(old_name, new_name);
}

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

const tooltip = document.querySelector(".tooltip");

function checkTooltipElements() {
    const tooltipElements = document.querySelectorAll("[tooltip]");

    tooltipElements.forEach(tooltipElement => {
        tooltipElement.addEventListener("mouseenter", event => {
            tooltip.innerHTML = tooltipElement.getAttribute("data-tooltip");
            tooltip.classList.remove("hidden");

            const tooltipRect = tooltip.getBoundingClientRect();
            const tooltipElementRect = tooltipElement.getBoundingClientRect();
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;

            let x = tooltipElementRect.x;
            let y = tooltipElementRect.y + tooltipElementRect.height + 5;

            if (tooltipElementRect.x + tooltipRect.width > windowWidth) {
                x = windowWidth - tooltipRect.width - 5;
            }

            if (tooltipElementRect.bottom + tooltipRect.height > windowHeight) {
                y = windowHeight - tooltipRect.height - 5;
            }

            tooltip.style.left = x + "px";
            tooltip.style.top = y + "px";
        });

        tooltipElement.addEventListener("mouseleave", event => {
            tooltip.classList.add("hidden");
        });
    });
}

function createPopup(name, content) {
    const popupContainer = document.createElement("div");
    popupContainer.classList.add("popup-container");

    popupContainer.innerHTML = `
        <div class="popup">
            <div class="popup-title">
                <p>${name}</p>

                <button>Close</button>
            </div>
            <div class="popup-content"></div>
        </div>
    `;

    const popupContent = popupContainer.querySelector(".popup-content");

    popupContent.attachShadow({ mode: "open" });
    popupContent.shadowRoot.innerHTML = content;

    document.body.appendChild(popupContainer);

    const popup = popupContainer.querySelector(".popup");
    const popupTitle = popup.querySelector(".popup-title");
    const popupButton = popupTitle.querySelector("button");

    popupButton.addEventListener("click", () => {
        const animation = popupContainer.animate([{ opacity: 0 }], { duration: 100, easing: "cubic-bezier(0.25, 1, 0.5, 1)", fill: "forwards" });

        animation.onfinish = () => {
            popupContainer.remove();
        }
    });

    return popupContainer;
}

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

    confirmButton.addEventListener("click", event => {
        deleteSpaceFn(spaceName);

        const animation = popupContainer.animate([{ opacity: 0 }], { duration: 100, easing: "cubic-bezier(0.25, 1, 0.5, 1)", fill: "forwards" });

        animation.onfinish = () => {
            popupContainer.remove();
            updateSpaces();
        }
    });
}