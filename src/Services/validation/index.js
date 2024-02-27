import axios from "axios";
import { string } from "yup";

async function validatePhone(phone) {
    const phoneRegExp =
        /^(01)[0-9]{9}/

    if (!(await string().matches(phoneRegExp).isValid(phone))) return false;
    console.log("valid")
    const response = await axios.post("/check-exist-phone", { phone }, {
        _opts: { noToast: true },
    });
    return !response.data.duplicated;
}

const validationServices = {
    validatePhone,
};
export default validationServices;