import axios from "axios";


async function changePassword(data) {
  const response = await axios.put(`/user/changepassword`, data, {
  });
  return response;
}
async function updateProfile(data) {
    const response = await axios.put(`/user/updateInfo`, data, {
    });
    return response;
  }



const myProfileServices = {

  changePassword,
  updateProfile
 
};
export default myProfileServices;
