import axios from "axios";

async function add(data) {
    const response = await axios.post("/group", data, {
        // _opts: { noToast: false },
    });
    return response;
}

async function updateById(id, data) {
    const response = await axios.put(`/group/${id}`, data, {
        // _opts: { noToast: false },
    });
    return response;
}
async function deleteById(id) {
    const response = await axios.delete(`/group/${id}`, {
        // _opts: { noToast: false },
    });
    return response;
}

async function getAll(params) {
    const response = await axios.get("/group", { params });
    return response;
}
async function getById(id) {
    const response = await axios.get(`/group/${id}`);
    return response;
}

const groupServices = {
    add,
    updateById,
    deleteById,
    getAll,
    getById,
};
export default groupServices;