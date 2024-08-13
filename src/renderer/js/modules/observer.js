export function initializeObserver(node, callback) {
    const _callback = (mutations, observer) => {
        mutations.forEach(mutation => {
            if (mutation.type === "childList") {
                callback();
            }
        });
    }

    const observer = new MutationObserver(_callback);
	observer.observe(node, { childList: true, subtree: true });

    return observer;
}