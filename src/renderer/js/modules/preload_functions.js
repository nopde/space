import { updateSpaces } from "./spaces.js";

export const createSpaceFolder = async () => {
    await window.electronAPI.createSpaceFolder();
}

export const deleteSpaceFn = async (name) => {
    await window.electronAPI.deleteSpace(name);
    updateSpaces();
}

export const createSpaceFn = async (name) => {
    await window.electronAPI.createSpace(name);
}

export const openSpaceFolderFn = async (name) => {
    await window.electronAPI.openSpaceFolder(name);
}

export const openSpacesFolderFn = async () => {
    await window.electronAPI.openSpacesFolder();
}

export const codeSpaceFn = async (name) => {
    await window.electronAPI.codeSpace(name);
}

export const renameSpaceFn = async (old_name, new_name) => {
    await window.electronAPI.renameSpace(old_name, new_name);
}

async function getSpacesFn() {
    return await window.electronAPI.getSpaces();
}

export async function getSpaces() {
    try {
        const folders = await getSpacesFn();
        return folders;
    } catch (error) {
        console.error("Error fetching spaces:", error);
        throw error;
    }
}