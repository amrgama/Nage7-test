import React, { useState, useContext } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
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

import assistantServices from "Services/assistant";
import levelServices from "Services/level";

import strings from "Assets/Local/Local";
import { LangContext, UserContext } from "App";
import { routePath } from "AppConstants";
import Validation from "./validations";

import styles from "CommonStyles/AddStyles";
import ImgUpload from "Components/Inputs/ImgUpload/ImgUpload";
import useQueryService from "Hooks/useQueryService";

const useStyles = makeStyles(styles);

const AddAssistant = () => {
  const [loading, setLoading] = useState(false);
  const { lang } = useContext(LangContext);
  const { user } = useContext(UserContext);

  const navigate = useNavigate();
  const classes = useStyles();
  const { data: levelsData } = useQueryService({
    key: ["levelServices.getLevels", { all: true }],
    fetcher: () => levelServices.getLevels({ all: true }),
    // enabled: !!subject,
  });
  const subjects = user?.subjects ?? [];
  let levels = levelsData?.data?.filter((el) =>
    subjects.some((s) => s.level.id === el.id)
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setError,
  } = useForm({
    resolver: yupResolver(Validation),
    mode: "all",
    defaultValues: {
      image: { imgUrl: "", file: "" },
    },
  });
  const handleUploadImgLocal = (e) => {
    const imgFile = e.target.files[0];
    if (!imgFile) return { imgUrl: "", file: "" };
    let imgUrl = URL.createObjectURL(imgFile);
    return { imgUrl: imgUrl, file: imgFile };
  };
  const handleAdd = async ({ confirmPassword, image, ...values }) => {
    setLoading(true);
    const data = new FormData();
    Object.keys(values).forEach((key) => {
      data.append(key, values[key]);
    });
    if (image.file) {
      data.append("image", image.file);
    }
    try {
      await assistantServices.add(data);
      navigate(`${routePath}assistants`);
    } catch (error) {
      console.log("error when add user ", error);
      error?.response?.data?.errors?.forEach?.(({ param, msg }) => {
        if (param in values)
          setError(param, { type: "custom", message: { ar: msg, en: msg } });
      });
    } finally {
      setLoading(false);
    }
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
        <Typography variant="h5">{strings.addAssistant}</Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label={strings.name}
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
        <FormControl fullWidth>
          <InputLabel id="add-user-assistantLevel">
            {strings.assistantRole}
          </InputLabel>
          <MuiSelect
            fullWidth
            labelId="add-user-assistantLevel"
            id="select-add-user-assistantLevel"
            label={strings.assistantRole}
            error={Boolean(errors.assistantLevel)}
            {...register("assistantLevel")}
          >
            {strings.taRoles.map((role, idx) => (
              <MenuItem value={idx} key={role}>
                {role}
              </MenuItem>
            ))}
          </MuiSelect>
        </FormControl>
        {errors.assistantLevel && (
          <Typography variant="subtitle2" className="error_message">
            {errors.assistantLevel.message[lang]}
          </Typography>
        )}
      </Grid>
      <Grid item xs={12} md={6}>
        <Controller
          name="level"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <FormControl fullWidth>
              <InputLabel id="add-user-level">{strings.level}</InputLabel>
              <MuiSelect
                fullWidth
                labelId="add-user-level"
                id="select-add-user-level"
                label={strings.level}
                error={Boolean(error)}
                onChange={(e) => {
                  field.onChange(e);
                }}
                onBlur={field.onBlur}
                value={field.value}
                inputRef={field.ref}
                name={field.name}
              >
                {levels?.map((level) => (
                  <MenuItem value={level.id} key={level.id}>
                    {level.name}
                  </MenuItem>
                ))}
              </MuiSelect>
              {error && (
                <Typography variant="subtitle2" className="error_message">
                  {error.message[lang]}
                </Typography>
              )}
            </FormControl>
          )}
        />
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
      <Grid item xs={12} md={6}>
        {" "}
      </Grid>
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

export default AddAssistant;
