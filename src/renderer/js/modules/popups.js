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