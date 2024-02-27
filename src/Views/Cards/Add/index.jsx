import React, { useState, useContext } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import {
  Button,
  Grid,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
} from "@mui/material";

import DatePicker from "Components/DatePicker";
import ImgUpload from "Components/Inputs/ImgUpload/ImgUpload";

import { admin as adminService } from "Services";
import strings from "Assets/Local/Local";
import { LangContext } from "App";
import { routePath } from "AppConstants";
import Validation from "./validations";

import styles from "CommonStyles/AddStyles";

const useStyles = makeStyles(styles);

const AddTeacher = () => {
  const [loading, setLoading] = useState(false);
  const { lang } = useContext(LangContext);

  const navigate = useNavigate();
  const classes = useStyles();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: yupResolver(Validation),
    mode: "all",
  });

  const handleAdd = async (values) => {
    setLoading(true);
    const data = new FormData();
    Object.keys(values).forEach((key) => {
      data.append(key, values[key]);
    });
    data.append("type", "TEACHER");
    data.delete("image");
    data.delete("confirmPassword");
    if (values.image.file) {
      data.append("image", values.image.file);
    }
    try {
      const response = await adminService.adminAddTeacher(data);
      if (response.status === 200) {
        navigate(`${routePath}teachers`);
      } else {
        reject(response);
      }
    } catch (error) {
      console.log("error when add user ", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadImgLocal = (e) => {
    const imgFile = e.target.files[0];
    if (!imgFile) return { imgUrl: "", file: "" };
    let imgUrl = URL.createObjectURL(imgFile);
    return { imgUrl: imgUrl, file: imgFile };
  };
  console.log(errors);

  return (
    <Grid
      container
      classes={{ root: classes.wrapper }}
      component="form"
      onSubmit={handleSubmit(handleAdd)}
      spacing={3}
    >
      <Grid item xs={12}>
        <Typography variant="h5">{strings.addStudent}</Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label={strings.StudentName}
          placeholder={strings.name}
          fullWidth
          error={Boolean(errors.name)}
          {...register("name")}
        />
        {errors.name && (
          <Typography variant="subtitle2" className="error_message">
            {errors.name.message[lang]}
          </Typography>
        )}
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label={strings.nickName}
          placeholder={strings.nickName}
          fullWidth
          error={Boolean(errors.nickName)}
          {...register("nickName")}
        />
        {errors.nickName && (
          <Typography variant="subtitle2" className="error_message">
            {errors.nickName.message[lang]}
          </Typography>
        )}
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label={strings.userName}
          placeholder={strings.userName}
          fullWidth
          error={Boolean(errors.userName)}
          {...register("userName")}
        />
        {errors.userName && (
          <Typography variant="subtitle2" className="error_message">
            {errors.userName.message[lang]}
          </Typography>
        )}
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          label={strings.email}
          placeholder={"username@mail.com"}
          fullWidth
          type="email"
          error={Boolean(errors.email)}
          {...register("email")}
        />
        {errors.email && (
          <Typography variant="subtitle2" className="error_message">
            {errors.email.message[lang]}
          </Typography>
        )}
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label={strings.phone}
          placeholder={"01000000000"}
          fullWidth
          error={Boolean(errors.phone)}
          {...register("phone")}
        />
        {errors.phone && (
          <Typography variant="subtitle2" className="error_message">
            {errors.phone.message[lang]}
          </Typography>
        )}
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label={strings.phone2}
          placeholder={"01000000000"}
          fullWidth
          error={Boolean(errors.phoneNumber_2)}
          {...register("phoneNumber_2")}
        />
        {errors.phoneNumber_2 && (
          <Typography variant="subtitle2" className="error_message">
            {errors.phoneNumber_2.message[lang]}
          </Typography>
        )}
      </Grid>

      <Grid item xs={12} md={6}>
        <DatePicker
          control={control}
          name={"birthDate"}
          label={strings.selectBirthDate}
          fullWidth
        />
        {errors.birthDate && (
          <Typography variant="subtitle2" className="error_message">
            {errors.birthDate.message[lang]}
          </Typography>
        )}
      </Grid>
      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel id="add-user-gender">{strings.gender}</InputLabel>

          <MuiSelect
            fullWidth
            labelId="add-user-gender"
            id="select-add-user-gender"
            label={strings.gender}
            error={Boolean(errors.gender)}
            {...register("gender")}
          >
            <MenuItem value={"MALE"}>{strings.male}</MenuItem>
            <MenuItem value={"FEMALE"}>{strings.female}</MenuItem>
          </MuiSelect>
        </FormControl>
        {errors.gender && (
          <Typography variant="subtitle2" className="error_message">
            {errors.gender.message[lang]}
          </Typography>
        )}
      </Grid>
      <Grid item xs={12} md={6}>
        <Typography variant="subtitle1" color={"secondary"}>
          {strings.imgProfile}
        </Typography>
        <Controller
          name={`image`}
          control={control}
          defaultValue={{ imgUrl: "", file: "" }}
          render={({ field, fieldState: { error } }) => (
            <>
              <ImgUpload
                name={"image"}
                label={strings.uploadImage}
                register={register}
                changeHandel={(e) => {
                  field.onChange(handleUploadImgLocal(e));
                }}
                deleteImgHandel={() => {
                  field.onChange({ imgUrl: "", file: "" });
                }}
                value={field.value}
              />
              {error && (
                <Typography variant="subtitle2" className="error_message">
                  {error?.imgUrl?.message[lang]}
                </Typography>
              )}
            </>
          )}
        />
      </Grid>
      <Grid item xs={12} md={6} />
      <Grid item xs={12} md={6}>
        <TextField
          label={strings.password}
          placeholder={"********"}
          fullWidth
          type="password"
          error={Boolean(errors.password)}
          {...register("password")}
        />
        {errors.password && (
          <Typography variant="subtitle2" className="error_message">
            {errors.password.message[lang]}
          </Typography>
        )}
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label={strings.confirmPassword}
          placeholder={"********"}
          fullWidth
          type="password"
          error={Boolean(errors.confirmPassword)}
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <Typography variant="subtitle2" className="error_message">
            {errors.confirmPassword.message[lang]}
          </Typography>
        )}
      </Grid>

      <Grid item xs={12} className={classes.buttonContainer}>
        <Button
          type="submit"
          disabled={loading}
          variant={loading ? "outlined" : "contained"}
        >
          {loading ? strings.loading : strings.add}
        </Button>
      </Grid>
    </Grid>
  );
};

export default AddTeacher;
