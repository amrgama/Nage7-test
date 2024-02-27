import axios from "axios";

async function getAll(params) {
    const response = await axios.get("/requests", { params });
    return response;
}
async function getById(id) {
    const response = await axios.get(`/requests/${id}`);
    return response;
}

async function updateById(id, data) {
    const response = await axios.put(`/requests/${id}`, data, {
        // _opts: { noToast: false },
    });
    return response;
}
const requestService = {
    updateById,
    getById,
    getAll,
};
export default requestService;