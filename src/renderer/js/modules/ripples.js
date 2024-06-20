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

export function checkRippleElements() {
    const rippleElements = document.querySelectorAll("[ripple]");

    rippleElements.forEach(rippleElement => {
        createRipple(rippleElement);
    });
}