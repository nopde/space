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

export const openTerminalFn = async (name = "") => {
    await window.electronAPI.openTerminal(name);
}

export const getSpaceWeightFn = async (name) => {
    try {
        const weight = await window.electronAPI.getSpaceWeight(name);
        return weight;
    }
    catch (error) {
        console.error("Error fetching space weight:", error);
        throw error;
    }
}

export const getGithubRepoFn = async (name) => {
    try {
        const repo = await window.electronAPI.getGithubRepo(name);
        return repo;
    }
    catch (error) {
        console.error("Error fetching GitHub repo:", error);
        throw error;
    }
}

export const getGithubBranchFn = async (name) => {
    try {
        const branch = await window.electronAPI.getGithubBranch(name);
        return branch;
    }
    catch (error) {
        console.error("Error fetching GitHub branch:", error);
        throw error;
    }
}

export const openExternalURLFn = async (url) => {
    await window.electronAPI.openExternalURL(url);
}

export const getGitStatsFn = async (name) => {
    try {
        const stats = await window.electronAPI.getGitStats(name);
        return stats;
    }
    catch (error) {
        console.error("Error fetching Git stats:", error);
        throw error;
    }
}

export const getGithubProjectsURLFn = async (name) => {
    try {
        const url = await window.electronAPI.getGithubProjectsURL(name);
        return url;
    }
    catch (error) {
        console.error("Error fetching GitHub projects URL:", error);
        throw error;
    }
}