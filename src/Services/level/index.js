import axios from "axios";

async function addLevel(data) {
    const response = await axios.post("/levels", data, {
        // _opts: { noToast: false },
    });
    return response;
}

async function updateLevel(id, data) {
    const response = await axios.put(`/levels/${id}`, data, {
        // _opts: { noToast: false },
    });
    return response;
}
async function deleteLevel(id) {
    const response = await axios.delete(`/levels/${id}`, {
        // _opts: { noToast: false },
    });
    return response;
}

async function getLevels(params) {
    const response = await axios.get("/levels", { params });
    return response;
}
async function getLevelById(id) {
    const response = await axios.get(`/levels/${id}`);
    return response;
}

async function addSubLevel(data) {
    const response = await axios.post("/sublevels", data, {
        // _opts: { noToast: false },
    });
    return response;
}

async function updateSubLevel(id, data) {
    const response = await axios.put(`/sublevels/${id}`, data, {
        // _opts: { noToast: false },
    });
    return response;
}
async function deleteSubLevel(id) {
    const response = await axios.delete(`/sublevels/${id}`, {
        // _opts: { noToast: false },
    });
    return response;
}

async function getSubLevels(params) {
    const response = await axios.get("/sublevels", { params });
    return response;
}
async function getSubLevelById(id) {
    const response = await axios.get(`/sublevels/${id}`);
    return response;
}

const levelServices = {
    addLevel,
    updateLevel,
    deleteLevel,
    getLevels,
    getLevelById,
    addSubLevel,
    updateSubLevel,
    deleteSubLevel,
    getSubLevels,
    getSubLevelById
};
export default levelServices;