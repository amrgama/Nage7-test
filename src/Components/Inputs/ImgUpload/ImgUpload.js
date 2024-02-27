import React, { useContext } from "react";
import { LangContext } from "../../../App";
import strings from "../../../Assets/Local/Local";
import styles from "../inputs.module.css";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
const ImgUpload = ({
  register,
  name,
  id,
  label,
  value,
  changeHandel,
  deleteImgHandel,
  NodeleteButton
}) => {
  const { lang } = useContext(LangContext);
  strings.setLanguage(lang);
  return (
    <div className={` ${styles.img__input__container} form-group`}>
      {value && value.imgUrl ? (
        <div className={styles.img__preview}>
          <img src={value.imgUrl} alt={"upload"} />
          {NodeleteButton?null:
          <HighlightOffIcon
            onClick={() => {
              deleteImgHandel(value.imgUrl);
            }}
            sx={{ color: "red", cursor: "pointer" }}
          />}
        </div>
      ) : null}
      {!value?.imgUrl ? (
        <label className={`${styles.custom__file__upload}`}>
          <input
            type="file"
            accept="image/*"
            {...register(name)}
            onChange={(e) => {
              if (changeHandel) {
                changeHandel(e, name);
              }
            }}
          />
          <FileUploadIcon /> <span> {label}</span>
        </label>
      ) : null}
    </div>
  );
};

export default ImgUpload;
