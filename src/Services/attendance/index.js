import axios from "axios";

async function add(data) {
    const response = await axios.post("/attendance", data, {
        // _opts: { noToast: false },
    });
    return response;
}
async function scan(data) {
    const response = await axios.post("/scan", data, {
        // _opts: { noToast: false },
    });
    return response;
}
async function updateById(id, data) {
    const response = await axios.put(`/attendance/${id}`, data, {
        // _opts: { noToast: false },
    });
    return response;
}
async function deleteById(id) {
    const response = await axios.delete(`/attendance/${id}`, {
        // _opts: { noToast: false },
    });
    return response;
}

async function getAll(params) {
    const response = await axios.get("/attendance", { params });
    return response;
}
async function getById(id) {
    const response = await axios.get(`/attendance/${id}`);
    return response;
}

async function previous(params) {
    const response = await axios.get(`/attendance/previous-attendance`, { params });
    return response;
}
async function previousLecture(params) {
    const response = await axios.get(`/attendance/lecture-details`, { params });
    return response;
}

const attendanceServices = {
    add,
    updateById,
    deleteById,
    getAll,
    getById,
    previous,
    previousLecture,
    scan
};
export default attendanceServices;