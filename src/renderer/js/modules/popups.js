import { renameSpaceFn, deleteSpaceFn } from "./preload_functions.js";

export function createPopup(name, content) {
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

// Custom popups

export function renamePopup(spaceName) {
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

export function deletePopup(spaceName) {
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