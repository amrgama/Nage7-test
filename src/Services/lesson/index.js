import axios from "axios";

async function add(data) {
    const response = await axios.post("/lesson", data, {
        // _opts: { noToast: false },
    });
    return response;
}

async function updateById(id, data) {
    const response = await axios.put(`/lesson/${id}`, data, {
        // _opts: { noToast: false },
    });
    return response;
}
async function deleteById(id) {
    const response = await axios.delete(`/lesson/${id}`, {
        // _opts: { noToast: false },
    });
    return response;
}

async function getAll(params) {
    const response = await axios.get("/lesson", { params });
    return response;
}
async function getById(id) {
    const response = await axios.get(`/lesson/${id}`);
    return response;
}

const lessonServices = {
    add,
    updateById,
    deleteById,
    getAll,
    getById,
};
export default lessonServices;