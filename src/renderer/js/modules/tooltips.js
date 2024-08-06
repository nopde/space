export function checkTooltipElements() {
    const tooltipElements = document.querySelectorAll("[tooltip]");
    const tooltips = document.querySelector(".tooltips");

    tooltips.innerHTML = "";

    tooltipElements.forEach(tooltipElement => {
        const tooltipContainer = document.createElement("div");
        tooltipContainer.classList.add("tooltip-container");

        const tooltip = document.createElement("div");
        tooltip.classList.add("tooltip");
        tooltip.classList.add("hidden");

        tooltipContainer.appendChild(tooltip);

        tooltip.innerHTML = tooltipElement.getAttribute("data-tooltip");

        tooltips.appendChild(tooltipContainer);

        tooltipElement.addEventListener("mouseenter", event => {
            const tooltipRect = tooltipContainer.getBoundingClientRect();
            const tooltipElementRect = tooltipElement.getBoundingClientRect();
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;

            let x = Math.round(tooltipElementRect.x) + Math.round(tooltipElementRect.width) / 2 - Math.round(tooltipRect.width) / 2;
            let y = Math.round(tooltipElementRect.y) + Math.round(tooltipElementRect.height) + 5;

            if (x > windowWidth) {
                x = windowWidth - Math.round(tooltipRect.width) - 5;
            }

            if (tooltipElementRect.bottom + Math.round(tooltipRect.height) + 5 > windowHeight) {
                y = windowHeight - Math.round(tooltipRect.height) - 5;
            }

            tooltipContainer.style.left = x + "px";
            tooltipContainer.style.top = y + "px";

            tooltip.classList.remove("hidden");
        });

        tooltipElement.addEventListener("mouseleave", () => { tooltip.classList.add("hidden"); });
    });
}