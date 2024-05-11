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

        ripple.style.width = `${size}px`;
        ripple.style.height = `${size}px`;

        ripple.style.left = `${offsetX}px`;
        ripple.style.top = `${offsetY}px`;

        let animationEnded = false;

        ripple.addEventListener("animationend", event => {
            animationEnded = true;
        });

        rippleElement.addEventListener("pointerup", event => {
            if (animationEnded) {
                ripple.style.opacity = 0;
            }
            else {
                ripple.addEventListener("animationend", event => {
                    ripple.style.opacity = 0;
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
                <button id="${spaceName}.rename" tooltip data-tooltip="Edit" ripple><span class="material-symbols-outlined">edit</span></button>
                <button id="${spaceName}.delete" tooltip data-tooltip="Delete" ripple><span class="material-symbols-outlined">delete</span></button>
                <button id="${spaceName}.openFolder" tooltip data-tooltip="Open folder" ripple><span class="material-symbols-outlined">folder</span></button>
            </div>
        `
        const spaceContainer = document.createElement("div");

        spaceContainer.innerHTML = spaceHTML;

        const space = spaceContainer.querySelector(":scope > .space");

        spacesContainer.appendChild(space);

        const renameBtn = document.getElementById(`${spaceName}.rename`);
        const deleteBtn = document.getElementById(`${spaceName}.delete`);
        const openFolderBtn = document.getElementById(`${spaceName}.openFolder`);

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

function deletePopup(spaceName) {
    const popupHTML = `
        <form class="popup" onsubmit="return false">
            <p class="title">Delete <b>${spaceName}</b></p>
            <div class="controls">
                <button type="submit" id="popup confirm" ripple><span class="material-symbols-outlined">check</span></button>
                <button id="popup cancel" ripple><span class="material-symbols-outlined">close</span></button>
            </div>
        </form>
    `;

    const container = document.createElement("div");
    container.classList.add("popup-container");

    container.innerHTML = popupHTML;

    document.body.appendChild(container);

    const confirm = document.getElementById("popup confirm");
    const cancel = document.getElementById("popup cancel");

    confirm.focus();

    confirm.addEventListener("click", event => {
        deleteSpaceFn(spaceName);

        let animation = container.animate([{ opacity: 0 }], { fill: "forwards", duration: 250, easing: "ease" });
        animation.addEventListener("finish", function() {
            updateSpaces();
            container.remove();
        });
    });

    cancel.addEventListener("click", event => {
        let animation = container.animate([{ opacity: 0 }], { fill: "forwards", duration: 250, easing: "ease" });
        animation.addEventListener("finish", function() {
            updateSpaces();
            container.remove();
        });
    });
}

function renamePopup(spaceName) {
    const popupHTML = `
        <form class="popup" onsubmit="return false">
            <p class="title">Rename space</p>
            <input id="popup input" type="text" placeholder="Space name" spellcheck="false" autocomplete="off" required>
            <div class="controls">
                <button type="submit" id="popup confirm" ripple><span class="material-symbols-outlined">check</span></button>
                <button id="popup cancel" ripple><span class="material-symbols-outlined">close</span></button>
            </div>
        </form>
    `;

    const container = document.createElement("div");
    container.classList.add("popup-container");

    container.innerHTML = popupHTML;

    document.body.appendChild(container);

    const confirm = document.getElementById("popup confirm");
    const cancel = document.getElementById("popup cancel");
    const input = document.getElementById("popup input");

    input.value = spaceName;
    input.focus();

    confirm.addEventListener("click", event => {
        renameSpaceFn(spaceName, input.value.replace(/ /g, "-"));

        let animation = container.animate([{ opacity: 0 }], { fill: "forwards", duration: 250, easing: "ease" });
        animation.addEventListener("finish", function() {
            updateSpaces();
            container.remove();
        });
    });

    cancel.addEventListener("click", event => {
        let animation = container.animate([{ opacity: 0 }], { fill: "forwards", duration: 250, easing: "ease" });
        animation.addEventListener("finish", function() {
            updateSpaces();
            container.remove();
        });
    });
}

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
    
            if (tooltipElementRect.y + tooltipRect.height > windowHeight) {
                y = windowHeight - tooltipRect.height + tooltipElementRect.height + 5;
            }
    
            tooltip.style.left = x + "px";
            tooltip.style.top = y + "px";
        });
    
        tooltipElement.addEventListener("mouseleave", event => {
            tooltip.classList.add("hidden");
        });
    });
}