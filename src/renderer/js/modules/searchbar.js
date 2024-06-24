export class SearchBar {
    constructor(inputElement) {
        this.inputElement = inputElement;
        this.itemList = [];
        this.itemNames = [];
    }

    initialize(spaceContainer) {
        this.inputElement.addEventListener("input", (event) => {
            this.itemList.splice(0, this.itemList.length);
            this.itemList = Array.from(spaceContainer.querySelectorAll(".space"));

            this.itemNames.splice(0, this.itemNames.length);
            this.itemList.forEach(spaceCard => {
                this.itemNames.push(spaceCard.id);
            });

            try {
                const searchValue = this.inputElement.value.trim().toLowerCase();
                const searchWords = searchValue.split(" ").filter(word => word !== "");

                this.itemNames.forEach((item, index) => {
                    const itemText = item.toLowerCase();
                    const result = this.itemList[index];

                    let match = true;

                    searchWords.forEach(word => {
                        if (!itemText.includes(word)) {
                            match = false;
                        }
                    });

                    if (match) {
                        result.classList.remove("hidden");
                    } else {
                        result.classList.add("hidden");
                    }
                });
            } catch (error) {
                console.error(error);
            }
        });
    }
}