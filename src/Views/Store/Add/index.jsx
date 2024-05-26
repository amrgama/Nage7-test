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

import storeServices from "Services/store";
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
  const [level, setLevel] = useState();
  const [subject, setSubject] = useState();

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
  const { data: subLevelsData } = useQueryService({
    key: ["levelServices.getSubLevels", { level, all: true }],
    fetcher: () => levelServices.getSubLevels({ level, all: true }),
    enabled: !!level,
  });
  const subLevels = subLevelsData?.data;

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
  const handleUploadImgLocal = async (e) => {
    const imgFile = e.target.files[0];
    if (!imgFile) return { imgUrl: "", file: "" };
    let imgUrl = URL.createObjectURL(imgFile);
    const data = new FormData();
    data.append("image", imgFile);
    const result = await storeServices.uploadFile(data);
    console.log("result===>", result);
    return { imgUrl: result.data.link, file: result.data.link };
  };
  const handleAdd = async ({ image, ...values }) => {
    setLoading(true);
    const data = values;
    data.file = image.file;

    try {
      await storeE.add(data);
      navigate(`${routePath}store`);
    } catch (error) {
      console.log("error when add product ", error);
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
        <Typography variant="h5">{strings.addProduct}</Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label={strings.productName}
          placeholder={strings.productName}
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
          label={strings.price}
          placeholder={strings.price}
          fullWidth
          error={Boolean(errors.price)}
          {...register("price")}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel id="sale-Type">{strings.saleType}</InputLabel>
          <MuiSelect
            fullWidth
            labelId="sale-Type"
            id="select-sale-Type"
            label={strings.saleType}
            error={Boolean(errors.saleType)}
            {...register("saleType")}
          >
            <MenuItem value={"FREE"}>{strings.FREE}</MenuItem>
            <MenuItem value={"PAID"}>{strings.PAID}</MenuItem>
          </MuiSelect>
        </FormControl>
        {errors.saleType && (
          <Typography variant="subtitle2" className="error_message">
            {errors.saleType.message[lang]}
          </Typography>
        )}
      </Grid>
      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel id="term">{strings.term}</InputLabel>
          <MuiSelect
            fullWidth
            labelId="term"
            id="select-term"
            label={strings.term}
            error={Boolean(errors.term)}
            {...register("term")}
          >
            <MenuItem value={"FIRST"}>{strings.FIRST}</MenuItem>
            <MenuItem value={"SEC"}>{strings.SEC}</MenuItem>
          </MuiSelect>
        </FormControl>
        {errors.term && (
          <Typography variant="subtitle2" className="error_message">
            {errors.term.message[lang]}
          </Typography>
        )}
      </Grid>
      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel id="type">{strings.productType}</InputLabel>
          <MuiSelect
            fullWidth
            labelId="type"
            id="select-type"
            label={strings.productType}
            error={Boolean(errors.type)}
            {...register("type")}
          >
            <MenuItem value={"PDF"}>{strings.PDF}</MenuItem>
            <MenuItem value={"LESSON"}>{strings.LESSON}</MenuItem>
            <MenuItem value={"EXAM"}>{strings.EXAM}</MenuItem>
            <MenuItem value={"PlAYLIST"}>{strings.PlAYLIST}</MenuItem>
          </MuiSelect>
        </FormControl>
        {errors.type && (
          <Typography variant="subtitle2" className="error_message">
            {errors.type.message[lang]}
          </Typography>
        )}
      </Grid>
      <Grid item xs={12} md={6}></Grid>
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
                  setLevel(e.target.value);

                  const subjects = (user?.subjects ?? []).filter(
                    (el) => el.level.id === e.target.value
                  );
                  if (subjects.length) {
                    setSubject(subjects);
                  } else {
                    setSubject([
                      {
                        name: {
                          ar: "لا يوجد مواد في هذة المرحلة للمدرس",
                          en: "There is no Subjects for Teacher",
                        },
                      },
                    ]);
                  }
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
        <Controller
          name="subLevel"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <FormControl fullWidth>
              <InputLabel id="add-user-subLevel">{strings.subLevel}</InputLabel>
              <MuiSelect
                fullWidth
                labelId="add-user-subLevel"
                id="select-add-user-subLevel"
                label={strings.subLevel}
                error={Boolean(error)}
                onChange={field.onChange}
                onBlur={field.onBlur}
                value={field.value}
                inputRef={field.ref}
                name={field.name}
              >
                {subLevels?.map((subLevel) => (
                  <MenuItem value={subLevel.id} key={subLevel.id}>
                    {subLevel.name}
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
          name="subject"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <FormControl fullWidth>
              <InputLabel id="add-user-subject">{strings.subject}</InputLabel>
              <MuiSelect
                fullWidth
                labelId="add-user-subject"
                id="select-add-user-subject"
                label={strings.subject}
                error={Boolean(error)}
                onChange={(e) => {
                  console.log("changes===>", e);
                  // setSubject(e.target.value);
                  // setLevel();
                  // setValue("level", "");
                  field.onChange(e);
                }}
                onBlur={field.onBlur}
                value={field.value}
                inputRef={field.ref}
                name={field.name}
              >
                {subject?.map((subject) => (
                  <MenuItem value={subject?.id} key={subject?.id}>
                    {subject.name[lang]}
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
      <Grid item xs={12} md={12}></Grid>
      <Grid item xs={12} md={12}>
        <TextField
          multiline
          rows={2}
          label={strings.details}
          placeholder={strings.details}
          fullWidth
          error={Boolean(errors.details)}
          {...register("details")}
        />
        {errors.details && (
          <Typography variant="subtitle2" className="error_message">
            {errors.details.message[lang]}
          </Typography>
        )}
      </Grid>
      <Grid item xs={12} md={6}>
        <Typography variant="subtitle1" color={"secondary"}>
          {strings.doc}
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
