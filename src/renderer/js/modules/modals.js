function createModal(name, content) {
    const modalContainer = document.createElement("div");
    modalContainer.classList.add("modal-container");

    modalContainer.attachShadow({ mode: "open" });
    modalContainer.shadowRoot.innerHTML = `
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                user-select: none;
                font-family: "Inter", sans-serif;
            }

            @keyframes fadeIn {
                from {
                    opacity: 0;
                }
                to {
                    opacity: 1;
                }
            }

            :host {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, .8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 100;
                backdrop-filter: blur(15px);
                opacity: 0;
                animation: fadeIn .15s cubic-bezier(0.25, 1, 0.5, 1) forwards;
            }

            @keyframes modalGrow {
                to {
                    scale: 1;
                }
            }

            .modal {
                background-color: rgb(255, 255, 255, .25);
                border-radius: 10px;
                padding: 20px;
                min-width: 300px;
                display: flex;
                flex-direction: column;
                scale: .9;
                animation: modalGrow .35s cubic-bezier(0.25, 1, 0.5, 1) forwards;
            }

            .modal-title {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 10px;
                padding-bottom: 10px;
                border-bottom: 1px solid rgba(255, 255, 255, .25);
            }

            .modal-title p {
                max-width: 200px;
                overflow: hidden;
                text-overflow: ellipsis;
                word-break: keep-all;
                white-space: nowrap;
                font-size: 21px;
                font-weight: bold;
            }

            .modal-title button {
                width: max-content;
                height: max-content;
                background-color: rgb(255, 255, 255, .25);
                border: none;
                padding: 10px 20px;
                border-radius: 999px;
                cursor: pointer;
                transition: background-color .1s cubic-bezier(0.25, 1, 0.5, 1);
            }

            .modal-title button:hover {
                background-color: rgb(255, 255, 255, .35);
            }

            .modal-content {
                padding-top: 10px;
                font-size: 16px;
                font-weight: normal;
            }
        </style>

        <div class="modal">
            <div class="modal-title">
                <p>${name}</p>

                <button>Close</button>
            </div>
            <div class="modal-content"></div>
        </div>
    `;

    const modalContent = modalContainer.shadowRoot.querySelector(".modal-content");

    modalContent.attachShadow({ mode: "open" });
    modalContent.shadowRoot.innerHTML += `
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                font-family: "Inter", sans-serif;
                user-select: none;
            }

            :host {
                display: flex;
                gap: 10px;
            }

            button.modal-button {
                flex: 1 1;
                background-color: rgb(255, 255, 255, .25);
                border: none;
                padding: 10px 20px;
                border-radius: 999px;
                cursor: pointer;
                transition: background-color .1s cubic-bezier(0.25, 1, 0.5, 1);
            }

            button.modal-button:hover {
                background-color: rgb(255, 255, 255, .35);
            }

            input.modal-input {
                flex: 1 1;
                background-color: transparent;
                box-shadow: 0 0 0 1px white;
                border: none;
                outline: none;
                padding: 10px 20px;
                border-radius: 999px;
                color: white;
                transition: all .15s cubic-bezier(0.25, 1, 0.5, 1);
            }

            input.modal-input:hover {
                background-color: rgba(255, 255, 255, .1);
            }

            input.modal-input:focus {
                background-color: rgba(255, 255, 255, .2);
                box-shadow: 0 0 0 2px white;
            }

            input.modal-input::placeholder {
                color: rgba(255, 255, 255, .75);
            }
        </style>
    `
    modalContent.shadowRoot.innerHTML += content;

    document.body.appendChild(modalContainer);

    const modal = modalContainer.shadowRoot.querySelector(".modal");
    const modalTitle = modal.querySelector(".modal-title");
    const modalButton = modalTitle.querySelector("button");

    modalButton.focus();

    modalButton.addEventListener("click", () => {
        const animation = modalContainer.animate([{ opacity: 0 }], { duration: 100, easing: "cubic-bezier(0.25, 1, 0.5, 1)", fill: "forwards" });

        animation.onfinish = () => {
            modalContainer.remove();
        }
    });

    return modalContainer;
}

// Custom modals

import { renameSpaceFn, deleteSpaceFn } from "./preload_functions.js";
import { updateSpaces } from "./spaces.js";

export function renameModal(spaceName) {
    const modalHTML = `
        <style>
            form {
                flex: 1 1;
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
        </style>

        <form onsubmit="return false">
            <input class="modal-input" id="popup input" type="text" placeholder="Space name" spellcheck="false" autocomplete="off" required>
            <button class="modal-button" type="submit">Confirm</button>
        </form>
    `;

    let modalContainer = createModal(`Rename ${spaceName}`, modalHTML);

    const confirmButton = modalContainer.shadowRoot.querySelector("div.modal-content").shadowRoot.querySelector("button");
    const input = modalContainer.shadowRoot.querySelector("div.modal-content").shadowRoot.querySelector("input");

    input.value = spaceName;
    input.focus();

    confirmButton.addEventListener("click", event => {
        renameSpaceFn(spaceName, input.value.replace(/ /g, "-"));

        const animation = modalContainer.animate([{ opacity: 0 }], { duration: 100, easing: "cubic-bezier(0.25, 1, 0.5, 1)", fill: "forwards" });

        animation.onfinish = () => {
            modalContainer.remove();
            updateSpaces();
        }
    });
}

export function deleteModal(spaceName) {
    const modalHTML = `
        <button class="modal-button" type="submit">Confirm</button>
    `;

    let modalContainer = createModal(`Delete ${spaceName}`, modalHTML);

    const confirmButton = modalContainer.shadowRoot.querySelector("div.modal-content").shadowRoot.querySelector("button");

    confirmButton.focus();

    confirmButton.addEventListener("click", event => {
        deleteSpaceFn(spaceName);

        const animation = modalContainer.animate([{ opacity: 0 }], { duration: 100, easing: "cubic-bezier(0.25, 1, 0.5, 1)", fill: "forwards" });

        animation.onfinish = () => {
            modalContainer.remove();
            updateSpaces();
        }
    });
}