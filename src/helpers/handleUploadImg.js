import { userServices } from "Services";
/**
 * @summary upload image to server and return the url
 * @param {object} [image] - image object
 * @returns {object} - response object
 * */

const handleUpload = async (image) => {
  const params = new FormData();
  params.append("image", image);
  try {
    // const data = await userServices.handleUploadImage(params);
    // return data;
  } catch (error) {
    console.log("error when upload image ", error);
  }
};

export default handleUpload;
