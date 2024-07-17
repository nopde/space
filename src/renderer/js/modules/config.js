import { settingsModal } from "./modals.js";

export function initializeConfig(configBtn) {
    configBtn.addEventListener("click", () => {
        settingsModal();
    });
}