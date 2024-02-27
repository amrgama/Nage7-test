import React, { useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { makeStyles } from "@mui/styles";
import { Button, Grid, Typography, TextField, MenuItem } from "@mui/material";
import Select from "Components/Inputs/Select";

import DatePicker from "Components/DatePicker";
import ImgUpload from "Components/Inputs/ImgUpload/ImgUpload";

import { admin as adminService, userServices } from "Services";
import useQueryService from "Hooks/useQueryService";
import strings from "Assets/Local/Local";
import { LangContext } from "App";
import { Loading } from "routes";
import { API_ENDPOINT, routePath } from "AppConstants";
import Validation from "./validations";

import styles from "CommonStyles/AddStyles";

const useStyles = makeStyles(styles);

const EditTeacher = () => {
  const [loading, setLoading] = useState(false);
  const { lang } = useContext(LangContext);
  const { id } = useParams();

  const navigate = useNavigate();
  const classes = useStyles();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm({
    resolver: yupResolver(Validation),
    mode: "all",
  });

  const { isLoading } = useQueryService({
    key: ["userServices.getUserInfo", id],
    fetcher: () => userServices.getUserInfo(id),
    enabled: !!id,
    onSuccess: ({ data }) => {
      const { user } = data;
      handleInit(user);
    },
  });

  const handleInit = (user) => {
    const values = {
      name: user.name ?? "",
      nickName: user.nickName ?? "",
      email: user.email,
      phone: user.phone,
      phoneNumber_2: user.phoneNumber_2 ?? "",
      gender: user.gender,
      birthDate: user.birthDate ?? null,
    };
    if (user.image) {
      values.image = {
        imgUrl: `${API_ENDPOINT}${user.image}`,
        file: user.image,
      };
    }
    Object.keys(values).forEach((key) => {
      setValue(key, values[key]);
    });
  };
  const handleEdit = async (values) => {
    setLoading(true);
    const data = new FormData();
    Object.keys(values).forEach((key) => {
      data.append(key, values[key]);
    });
    data.append("userId", id);
    data.append("type", "TEACHER");
    data.delete("image");
    if (values.image.file) {
      data.append("image", values.image.file);
    }
    data.forEach((value, key) => {
      console.log(key + " " + value);
    });
    try {
      const response = await adminService.adminUpdateTeacher(data);
      if (response.status === 200) {
        navigate(`${routePath}teachers`);
      } else {
        reject(response);
      }
    } catch (error) {
      console.log("error when update user ", error);
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

  if (isLoading) {
    return <Loading />;
  }
  return (
    <Grid
      container
      classes={{ root: classes.wrapper }}
      component="form"
      onSubmit={handleSubmit(handleEdit)}
      spacing={3}
    >
      <Grid item xs={12}>
        <Typography variant="h5">{strings.editStudent}</Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label={strings.StudentName}
          InputLabelProps={{ shrink: true }}
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
          InputLabelProps={{ shrink: true }}
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
          label={strings.email}
          InputLabelProps={{ shrink: true }}
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
          InputLabelProps={{ shrink: true }}
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
          InputLabelProps={{ shrink: true }}
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
        <Select
          name={"gender"}
          control={control}
          labelId={"edit-user-gender"}
          label={strings.gender}
          fullWidth
        >
          <MenuItem value={"MALE"}>{strings.male}</MenuItem>
          <MenuItem value={"FEMALE"}>{strings.female}</MenuItem>
        </Select>

        {errors.gender && (
          <Typography variant="subtitle2" className="error_message">
            {errors.gender.message[lang]}
          </Typography>
        )}
      </Grid>
      <Grid md={6} />
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

      <Grid item xs={12} className={classes.buttonContainer}>
        <Button
          type="submit"
          disabled={loading}
          variant={loading ? "outlined" : "contained"}
        >
          {loading ? strings.loading : strings.edit}
        </Button>
      </Grid>
    </Grid>
  );
};

export default EditTeacher;
