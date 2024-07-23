import { renameSpaceFn, deleteSpaceFn, getSpaceWeightFn, getGithubBranchFn, getGithubRepoFn, openExternalURLFn, getGitStatsFn, getGithubProjectsURLFn } from "./preload_functions.js";
import { updateSpaces } from "./spaces.js";

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
                background-color: rgb(255, 255, 255, .1);
                border: 1px solid rgba(255, 255, 255, .1);
                border-radius: 10px;
                padding: 20px;
                min-width: 300px;
                max-width: 400px;
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
                margin-inline: -20px;
                padding-inline: 20px;
                border-bottom: 1px solid rgba(255, 255, 255, .1);
            }

            .modal-title p {
                width: max-content;
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
                background-color: rgb(255, 255, 255, .1);
                border: none;
                padding: 10px 20px;
                border-radius: 999px;
                cursor: pointer;
                transition: background-color .1s cubic-bezier(0.25, 1, 0.5, 1);
            }

            .modal-title button:hover {
                background-color: rgb(255, 255, 255, .2);
            }

            .modal-content {
                padding: 10px;
                padding-top: 20px;
                font-size: 16px;
                font-weight: normal;
                max-height: 400px;
                overflow-y: auto;
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

export async function infoModal(spaceName) {
    const modalHTML = `
        <style>
            .additional-info {
                margin-top: 5px;
                display: flex;
                flex-direction: column;
                gap: 15px;
                font-size: 16px;
                font-weight: normal;
            }

            .additional-info #weight {
                padding: 5px 10px;
                border-radius: 999px;
                background-color: rgba(255, 255, 255, .25);
            }

            .additional-info .github-info {
                display: flex;
                flex-direction: column;
                gap: 5px;
            }

            .additional-info .github-info a {
                text-decoration: none;
                color: rgb(208, 188, 255);
            }

            .additional-info .github-info a[href] {
                text-decoration: underline;
                text-underline-offset: 3px;
                text-decoration-thickness: 1px;
                text-decoration-style: dotted;
                transition: color .15s cubic-bezier(0.25, 1, 0.5, 1);
            }

            .additional-info .github-info a[href]:hover {
                color: rgb(228, 208, 255);
            }

            .additional-info .git-stats {
                width: 100%;
                margin-top: 10px;
                display: flex;
                flex-wrap: wrap;
                gap: 5px;
            }

            .additional-info .git-stats span {
                flex-grow: 1;
                padding: 5px 10px;
                border-radius: 999px;
                color: white;
                font-size: 14px;
                text-align: center;
                border: 1px solid rgba(255, 255, 255, .1);
                background-color: rgba(255, 255, 255, .1);
            }
        </style>

        <div class="additional-info">
            <p>Weight: <span id="weight">Loading...</span></p>
            <div class="github-info">
                <p>Repository: <a id="github">Loading...</a></p>
                <p id="branch-paragraph">Branch: <a id="branch">Loading...</a></p>
                <p id="github-projects-paragraph">Projects: <a id="github-projects">Loading...</a></p>
                <div class="git-stats"></div>
            </div>
        </div>
    `;

    const modalContainer = createModal(spaceName, modalHTML);

    const weightSpan = modalContainer.shadowRoot.querySelector(".modal-content").shadowRoot.getElementById("weight");
    const weight = await getSpaceWeightFn(spaceName);
    let fixedWeight = (weight / (1024 * 1024)).toFixed(2);

    if (fixedWeight <= 0.00) {
        fixedWeight = (weight / 1024).toFixed(2);
        weightSpan.innerHTML = `${fixedWeight} KB`;
    }
    else if (fixedWeight <= 1024) {
        weightSpan.innerHTML = `${fixedWeight} MB`;
    }
    else {
        fixedWeight = (weight / (1024 * 1024 * 1024)).toFixed(2);
        weightSpan.innerHTML = `${fixedWeight} GB`;
    }

    const githubContainer = modalContainer.shadowRoot.querySelector(".modal-content").shadowRoot.querySelector(".github-info");
    const githubAnchor = githubContainer.querySelector("#github");
    const branchAnchor = githubContainer.querySelector("#branch");
    const branchParagraph = githubContainer.querySelector("#branch-paragraph");
    const gitStatsContainer = githubContainer.querySelector(".git-stats");
    const githubProjectsAnchor = githubContainer.querySelector("#github-projects");
    const githubProjectsParagraph = githubContainer.querySelector("#github-projects-paragraph");

    const githubRepo = await getGithubRepoFn(spaceName);

    githubAnchor.innerHTML = githubRepo;

    const gitStats = await getGitStatsFn(spaceName);
    const languages = gitStats["languages"]["results"];

    for (const language in languages) {
        const languageElement = document.createElement("span");

        function hexToRgb(hex) {
            hex = hex.replace(/^#/, "");

            let r = parseInt(hex.substring(0, 2), 16);
            let g = parseInt(hex.substring(2, 4), 16);
            let b = parseInt(hex.substring(4, 6), 16);

            return [r, g, b];
        }

        function adjustColor(color) {
            let r = color[0];
            let g = color[1];
            let b = color[2];

            if (r < 50) {
                r = Math.min(r + 100, 255);
            }
            else if (r < 150) {
                r = Math.min(r + 50, 255);
            }

            if (g < 50) {
                g = Math.min(g + 100, 255);
            }
            else if (g < 150) {
                g = Math.min(g + 50, 255);
            }

            if (b < 50) {
                b = Math.min(b + 100, 255);
            }
            else if (b < 150) {
                b = Math.min(b + 50, 255);
            }

            return `rgb(${r}, ${g}, ${b})`;
        }

        if (languages[language]["color"]) {
            languageElement.style.color = adjustColor(hexToRgb(languages[language]["color"]));
        }

        languageElement.innerHTML = `${language}`;

        gitStatsContainer.appendChild(languageElement);
    }

    if (githubRepo === "Git repository not found") {
        branchParagraph.remove();
        branchAnchor.remove();
        githubProjectsParagraph.remove();
        githubProjectsAnchor.remove();
        return;
    }

    githubAnchor.setAttribute("href", githubRepo);
    githubAnchor.setAttribute("target", "_blank");

    githubAnchor.addEventListener("click", event => {
        event.preventDefault();

        openExternalURLFn(githubRepo);
    });

    const githubProjectsURL = await getGithubProjectsURLFn(spaceName);

    githubProjectsAnchor.innerHTML = "Open projects";

    githubProjectsAnchor.setAttribute("href", githubProjectsURL);
    githubProjectsAnchor.setAttribute("target", "_blank");

    githubProjectsAnchor.addEventListener("click", async (event) => {
        event.preventDefault();

        openExternalURLFn(githubProjectsURL);
    });

    const githubBranch = await getGithubBranchFn(spaceName);

    branchAnchor.innerHTML = githubBranch;
}