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
  FormGroup,
  FormLabel,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import groupServices from "Services/group";
import levelServices from "Services/level";
import useQueryService from "Hooks/useQueryService";
import strings from "Assets/Local/Local";
import { LangContext, UserContext } from "App";
import { Loading } from "routes";
import { routePath } from "AppConstants";
import Validation from "./validations";

import styles from "CommonStyles/AddStyles";

const useStyles = makeStyles(styles);

const EditGroup = () => {
  const [subject, setSubject] = useState();
  const [level, setLevel] = useState();
  const [loading, setLoading] = useState(false);
  const { lang } = useContext(LangContext);
  const { user } = useContext(UserContext);
  const { id } = useParams();

  const navigate = useNavigate();
  const classes = useStyles();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    setValue,
    setError,
  } = useForm({
    resolver: yupResolver(Validation),
    mode: "all",
  });

  const { isLoading: isLoadingGroup } = useQueryService({
    key: ["groupServices.getById", id],
    fetcher: () => groupServices.getById(id),
    enabled: !!id,
    onSuccess: (data) => {
      const subjects = (user?.subjects ?? []).filter((el) => el.id === data.subject.id);
      if (subjects.length) {
        setSubject(subjects)
      } else {
        setSubject([{ name: { ar: 'لا يوجد مواد في هذة المرحلة للمدرس', en: 'There is no Subjects for Teacher' } }])
      }
      const values = {
        name: data.name,
        subject: data.subject.id,
        level: data.subLevel.level,
        subLevel: data.subLevel.id,
        daysPerWeek: data.daysPerWeek,
        selectedDays: data.selectedDays ?? [],
      };
    
      setLevel(values.level);
      reset(values);
    },
  });

  // const subjects = user?.subjects ?? [];
  const { data: levelsData, isLoading: isLoadingLevels } = useQueryService({
    key: ["levelServices.getLevels", { all: true }],
    fetcher: () => levelServices.getLevels({ all: true }),
    onSuccess: () => {
      if (level) setValue("level", level);
    },
    // enabled: !!subject,
  });
  const levels = levelsData?.data;
  const { data: subLevelsData, isLoading: isLoadingSubLevels } =
    useQueryService({
      key: ["levelServices.getSubLevels", { level, all: true }],
      fetcher: () => levelServices.getSubLevels({ level, all: true }),
      // onSuccess: () => {
      //   if (subject && level) setValue("level", level)
      // },
      enabled: !!level,
    });
  const subLevels = subLevelsData?.data;
  const handleEdit = async (values) => {
    setLoading(true);
    try {
      await groupServices.updateById(id, values);
      navigate(`${routePath}groups`);
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
  const isLoading = isLoadingGroup || isLoadingLevels || isLoadingSubLevels;
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
        <Typography variant="h5">{strings.editGroup}</Typography>
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
                  setLevel(e.target.value)
                  const subjects = (user?.subjects ?? []).filter((el) => el.level.id === e.target.value);
                  if (subjects.length) {
                    setSubject(subjects)
                  } else {
                    setSubject([{ name: { ar: 'لا يوجد مواد في هذة المرحلة للمدرس', en: 'There is no Subjects for Teacher' } }])
                  }
                  field.onChange(e);
                  setValue("subject", "");
                  setValue("subLevel", "");

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
                  field.onChange(e);
                }}
                onBlur={field.onBlur}
                value={field.value}
                inputRef={field.ref}
                name={field.name}
              >
                {subject?.map((subject) => (
                  <MenuItem value={subject.id} key={subject.id}>
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
      <Grid item xs={12} md={6}>
        <TextField
          InputLabelProps={{ shrink: true }}
          label={strings.daysPerWeek}
          placeholder={strings.daysPerWeek}
          fullWidth
          error={Boolean(errors.daysPerWeek)}
          type="number"
          {...register("daysPerWeek")}
        />
        {errors.daysPerWeek && (
          <Typography variant="subtitle2" className="error_message">
            {errors.daysPerWeek.message[lang]}
          </Typography>
        )}
      </Grid>
      <Grid item xs={12} md={6} />
      <Grid item xs={12} md={6}>
        <Controller
          name="selectedDays"
          defaultValue={[]}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <FormControl fullWidth>
              <FormLabel component="legend">{strings.lessonDays}</FormLabel>
              <FormGroup>
                {strings.days.map((day, idx) => (
                  <FormControlLabel
                    key={day}
                    control={
                      <Checkbox
                        checked={field.value.includes(idx)}
                        onChange={(_, checked) => {
                          if (checked) field.onChange(field.value.concat(idx));
                          else
                            field.onChange(field.value.filter((v) => v != idx));
                        }}
                      />
                    }
                    label={day}
                  />
                ))}
                {error && (
                  <Typography variant="subtitle2" className="error_message">
                    {error.message[lang]}
                  </Typography>
                )}
              </FormGroup>
            </FormControl>
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
export default EditGroup;
