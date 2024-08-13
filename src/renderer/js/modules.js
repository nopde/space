import { initializeObserver } from "./modules/observer.js";
import { checkRippleElements } from "./modules/ripples.js";
import { checkTooltipElements } from "./modules/tooltips.js";

export function initializeModules(wrapper) {
    console.log("(OBSERVER) Initializing...");

    const callback = () => {
        checkRippleElements();
        checkTooltipElements();
    }

    callback();

	initializeObserver(wrapper, callback);

    console.log("(OBSERVER) Done!");
}