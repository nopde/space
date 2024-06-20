export function checkTooltipElements() {
    const tooltipElements = document.querySelectorAll("[tooltip]");
    const tooltips = document.querySelector(".tooltips");

    tooltipElements.forEach(tooltipElement => {
        const tooltip = document.createElement("div");
        tooltip.classList.add("tooltip");
        tooltip.classList.add("hidden");

        tooltip.innerHTML = tooltipElement.getAttribute("data-tooltip");

        tooltips.appendChild(tooltip);

        tooltipElement.addEventListener("mouseenter", event => {
            const tooltipRect = tooltip.getBoundingClientRect();
            const tooltipElementRect = tooltipElement.getBoundingClientRect();
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;

            let x = tooltipElementRect.x + Math.round(tooltipElementRect.width) / 2 - Math.round(tooltipRect.width) / 2;
            let y = tooltipElementRect.y + tooltipElementRect.height + 5;

            if (x > windowWidth) {
                x = windowWidth - tooltipRect.width - 5;
            }

            if (tooltipElementRect.bottom + tooltipRect.height + 5 > windowHeight) {
                y = windowHeight - tooltipRect.height - 5;
            }

            tooltip.style.left = x + "px";
            tooltip.style.top = y + "px";

            tooltip.classList.remove("hidden");
        });

        tooltipElement.addEventListener("mouseleave", () => { tooltip.classList.add("hidden"); });
    });
}