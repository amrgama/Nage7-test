import React, { useState, useContext } from "react";
import { useParams } from "react-router-dom";
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
import assistantServices from "Services/assistant";
import levelServices from "Services/level";
import useQueryService from "Hooks/useQueryService";
import strings from "Assets/Local/Local";
import { LangContext, UserContext } from "App";
import { Loading } from "routes";
import { API_ENDPOINT, routePath } from "AppConstants";
import Validation from "./validations";
import styles from "CommonStyles/AddStyles";
import ImgUpload from "Components/Inputs/ImgUpload/ImgUpload";

const useStyles = makeStyles(styles);

const EditAssistant = () => {
  const [loading, setLoading] = useState(false);
  const { lang } = useContext(LangContext);
  const { user } = useContext(UserContext);

  const { id } = useParams();

  const navigate = useNavigate();
  const classes = useStyles();
  // if (levelsData?.data) {
  //   for (let i = 0; i < subjects.length; i++) {
  //     let subDataId = subjects[i].level.id;
  //     // console.log('levels',subDataId,subjects[i].level.id,levelsData?.data)
  //     const res = levelsData?.data?.filter((el) => el.id === subDataId);
  //     console.log("levels res", res);

  //     if (res.length) {
  //       levels.push(res[0]);
  //     }
  //     console.log("levels 1", levels);
  //   }
  // }

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    setError,
    getValues,
    setValue,
  } = useForm({
    resolver: yupResolver(Validation),
    mode: "all",
    defaultValues: {
      image: { imgUrl: "", file: "" },
    },
  });
  const { data: levelsData, isLoading: loadingLevels } = useQueryService({
    key: ["levelServices.getLevels", { all: true }],
    fetcher: () => levelServices.getLevels({ all: true }),
    // enabled: !!subject,
  });
  const subjects = user?.subjects ?? [];
  let levels = levelsData?.data?.filter((el) =>
    subjects.some((s) => s.level.id === el.id)
  );
  const { isLoading: isLoadingAssistant } = useQueryService({
    key: ["assistantServices.getById", id],
    fetcher: () => assistantServices.getById(id),
    enabled: !!id,
    onSuccess: (data) => {
      const { user } = data;

      const values = {
        name: user.name,
        userName: user.userName,
        assistantLevel: user.assistantLevel,
        level: user.level,
        email: user.email,
        phone: user.phone,
        gender: "" + user.gender,
        image: {
          imgUrl: `${API_ENDPOINT}${user.image}`,
          imgFile: "",
        },
      };
      if (user.birthDate) values.birthDate = user.birthDate;
      reset(values);
    },
  });
  const handleUploadImgLocal = (e) => {
    const imgFile = e.target.files[0];
    if (!imgFile) return { imgUrl: "", file: "" };
    let imgUrl = URL.createObjectURL(imgFile);
    return { imgUrl: imgUrl, file: imgFile };
  };
  const handleEdit = async ({ image, ...values }) => {
    setLoading(true);
    try {
      const data = new FormData();
      Object.keys(values).forEach((key) => {
        data.append(key, values[key]);
      });
      if (image.file) {
        data.append("image", image.file);
      }
      await assistantServices.updateById(id, data);
      navigate(`${routePath}assistants`);
    } catch (error) {
      console.log("error when update user ", error);
      error?.response?.data?.errors?.forEach?.(({ param, msg }) => {
        if (param in values)
          setError(param, { type: "custom", message: { ar: msg, en: msg } });
      });
    } finally {
      setLoading(false);
    }
  };
  const isLoading = isLoadingAssistant || loadingLevels;
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
        <Typography variant="h5">{strings.editAssistant}</Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          InputLabelProps={{ shrink: true }}
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
          InputLabelProps={{ shrink: true }}
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
          InputLabelProps={{ shrink: true }}
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
          InputLabelProps={{ shrink: true }}
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
        <Controller
          name="gender"
          defaultValue=""
          control={control}
          render={({ field, fieldState: { error } }) =>
            console.log("gender", field.value) || (
              <FormControl fullWidth>
                <InputLabel id="add-user-gender">{strings.gender}</InputLabel>
                <MuiSelect
                  fullWidth
                  labelId="add-user-gender"
                  id="select-add-user-gender"
                  label={strings.gender}
                  error={Boolean(error)}
                  name={field.name}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  ref={field.ref}
                  value={field.value}
                >
                  <MenuItem value={"MALE"}>{strings.male}</MenuItem>
                  <MenuItem value={"FEMALE"}>{strings.female}</MenuItem>
                </MuiSelect>
                {error && (
                  <Typography variant="subtitle2" className="error_message">
                    {error.message[lang]}
                  </Typography>
                )}
              </FormControl>
            )
          }
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Controller
          defaultValue=""
          name="assistantLevel"
          control={control}
          render={({ field, fieldState: { error } }) => (
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
                name={field.name}
                onChange={field.onChange}
                onBlur={field.onBlur}
                value={field.value}
                ref={field.ref}
              >
                {strings.taRoles.map((role, idx) => (
                  <MenuItem
                    selected={field.value == idx}
                    value={idx}
                    key={role}
                  >
                    {role}
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
        <Controller
          defaultValue=""
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
                ref={field.ref}
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
export default EditAssistant;
