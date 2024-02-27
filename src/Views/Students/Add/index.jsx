import React, { useState, useContext, useDeferredValue } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
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
  FormLabel,
  FormGroup,
  Autocomplete,
} from "@mui/material";

import DatePicker from "Components/DatePicker";

import studentService from "Services/student";
import strings from "Assets/Local/Local";
import { LangContext } from "App";
import { routePath } from "AppConstants";
import Validation from "./validations";

import styles from "CommonStyles/AddStyles";
import useQueryService from "Hooks/useQueryService";
import levelServices from "Services/level";
import groupServices from "Services/group";
import DeleteIcon from "@mui/icons-material/Delete";
import studentServices from "Services/student";
import groupStudentServices from "Services/groupStudent";

const useStyles = makeStyles(styles);

const AddStudent = () => {
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState();
  const { lang } = useContext(LangContext);
  const location = useLocation();
  const navigate = useNavigate();
  const classes = useStyles();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    setError,
    watch,
  } = useForm({
    resolver: yupResolver(Validation),
    mode: "all",
    defaultValues: {
      groups: [{ group: location.state?.group }],
      level: location.state?.level,
      subLevel: location.state?.subLevel,
    },
  });
  const groupsInput = useFieldArray({ name: "groups", control });
  const { data: levelsData } = useQueryService({
    key: ["levelServices.getLevels", { all: true }],
    fetcher: () => levelServices.getLevels({ all: true }),
  });
  const levels = levelsData?.data;
  const levelId = watch("level");
  const subLevelId = watch("subLevel");
  const { data: subLevelsData } = useQueryService({
    key: ["levelServices.getSubLevels", { level: levelId, all: true }],
    fetcher: () => levelServices.getSubLevels({ level: levelId, all: true }),
    enabled: !!levelId,
  });
  const subLevels = subLevelsData?.data;
  const { data: groupsData } = useQueryService({
    key: [
      "groupServices.getAll",
      { level: levelId, subLevel: subLevelId, all: true },
    ],
    fetcher: () =>
      groupServices.getAll({ level: levelId, subLevel: subLevelId, all: true }),
    enabled: !!levelId && !!subLevelId,
  });
  const groups = groupsData?.data;
  const phoneno = useDeferredValue(watch("phone")) ?? 0;
  let studentPhone = 0;
  if (phoneno?.length >= 10) {
    studentPhone = phoneno;
  }
  console.log("phonessss=>", studentPhone, phoneno, phoneno.length);

  const { data: studentsData, isLoading: isLoadingStudents } = useQueryService({
    key: ["studentServices.getPhoneList", { phone: studentPhone }],
    fetcher: () => studentServices.getPhoneList(studentPhone),
    enabled: !!studentPhone,
  });
  const students = studentsData?.data;
  const handleAdd = async (values) => {
    setLoading(true);
    const data = {
      groups: values.groups,
      name: values.name,
      phone: values.phone,
      type: "STUDENT",
      parentNumber: values.parentNumber,
      gender: values.gender,
      level: values.subLevel,
    };
    if (values.email) {
      data.email = values.email;
    }
    if (values.schoolName) {
      data.schoolName = values.schoolName;
    }
    if (values.birthDate) {
      data.birthDate = values.birthDate;
    }
    try {
      await studentService.add(data);
      navigate(location.state?.navigateTo ?? `${routePath}students`);
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
        <Typography variant="h5">{strings.addStudent}</Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <Controller
          name="phone"
          control={control}
          render={({ field, fieldState: { error } }) =>
            console.log(students) || (
              <Autocomplete
                disablePortal
                value={field.value && { name: field.value, id: field.value }}
                filterOptions={(options) => options}
                options={field.value ? students ?? [] : []}
                isOptionEqualToValue={(option, value) =>
                  option.phone === value.phone
                }
                loading={(isLoadingStudents || !studentPhone) && !!field.value}
                getOptionLabel={(option) =>
                  option.phone === field.value
                    ? field.value
                    : `${option.phone} - ${option.name}`
                }
                clearOnBlur={false}
                clearOnEscape={false}
                onChange={(e, v) => {
                  if (!v) {
                    field.onChange("");
                    setSelected(null);
                    return;
                  }
                  setSelected({ id: v.id });
                  setValue("name", v.name);
                  setValue("parentNumber", v.parentNumber);
                  setValue("birthDate", v.birthDate);
                  setValue("gender", v.gender, { shouldTouch: true });
                  field.onChange(v.phone);
                  if (v.level?.id) {
                    setValue("subLevel", v.level.id);
                    if (v.level.level?.id) {
                      setValue("level", v.level.level.id);
                    }
                  }
                  if (v.email) setValue("email", v.email);
                  if (v.schoolName) setValue("schoolName", v.schoolName);
                }}
                renderInput={(params) => (
                  <TextField
                    label={strings.phone}
                    placeholder={"01000000000"}
                    fullWidth
                    helperText={error?.message[lang]}
                    error={!!error}
                    {...params}
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setSelected(null);
                    }}
                  />
                )}
              />
            )
          }
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          InputLabelProps={{ shrink: true }}
          label={strings.StudentName}
          placeholder={strings.StudentName}
          fullWidth
          error={Boolean(errors.name)}
          disabled={!!selected}
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
          label={strings.email}
          placeholder={"username@mail.com"}
          fullWidth
          type="email"
          error={Boolean(errors.email)}
          disabled={!!selected}
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
          label={strings.parentNumber}
          placeholder={"01000000000"}
          InputLabelProps={{ shrink: true }}
          fullWidth
          error={Boolean(errors.parentNumber)}
          // disabled={!!selected}
          {...register("parentNumber")}
        />
        {errors.parentNumber && (
          <Typography variant="subtitle2" className="error_message">
            {errors.parentNumber.message[lang]}
          </Typography>
        )}
      </Grid>

      <Grid item xs={12} md={6}>
        <DatePicker
          control={control}
          name={"birthDate"}
          label={strings.selectBirthDate}
          fullWidth
          disabled={!!selected}
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
          control={control}
          defaultValue=""
          render={({ field, fieldState: { error } }) => (
            <FormControl fullWidth disabled={!!selected}>
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
                <MenuItem selected={field.value === "MALE"} value={"MALE"}>
                  {strings.male}
                </MenuItem>
                <MenuItem selected={field.value === "FEMALE"} value={"FEMALE"}>
                  {strings.female}
                </MenuItem>
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
          name="level"
          control={control}
          defaultValue=""
          render={({ field, fieldState: { error } }) => (
            <FormControl fullWidth disabled={!!selected}>
              <InputLabel id="add-user-level">{strings.level}</InputLabel>
              <MuiSelect
                fullWidth
                labelId="add-user-level"
                id="select-add-user-level"
                label={strings.level}
                error={Boolean(errors.level)}
                value={field.value}
                name={field.name}
                inputRef={field.ref}
                onBlur={field.onBlur}
                onChange={(e) => {
                  setValue("subLevel", "");
                  setValue("group", "");
                  field.onChange(e);
                }}
              >
                {levels?.map((level) => (
                  <MenuItem
                    selected={field.value === level.id}
                    value={level.id}
                    key={level.id}
                  >
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
          defaultValue=""
          render={({ field, fieldState: { error } }) => (
            <FormControl fullWidth disabled={!!selected}>
              <InputLabel id="add-user-subLevel">
                {strings.StudentLevel}
              </InputLabel>
              <MuiSelect
                fullWidth
                labelId="add-user-subLevel"
                id="select-add-user-subLevel"
                label={strings.StudentLevel}
                error={Boolean(errors.subLevel)}
                value={field.value}
                name={field.name}
                inputRef={field.ref}
                onBlur={field.onBlur}
                onChange={(e) => {
                  setValue("group", "");
                  field.onChange(e);
                }}
              >
                {subLevels?.map((level) => (
                  <MenuItem
                    selected={field.value === level.id}
                    value={level.id}
                    key={level.id}
                  >
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
        <TextField
          InputLabelProps={{ shrink: true }}
          label={strings.schoolName}
          placeholder={strings.schoolName}
          fullWidth
          disabled={!!selected}
          {...register("schoolName")}
        />
      </Grid>
      <Grid item xs={12}>
        <FormControl fullWidth>
          <FormLabel
            component="legend"
            sx={{ fontSize: "1.5rem", marginBottom: "1rem" }}
          >
            {strings.groups}
          </FormLabel>
          <FormGroup sx={{ gap: "2rem" }}>
            {groupsInput.fields.map((field, idx) => {
              const prefix = `groups.${idx}.`;
              return (
                <Grid
                  container
                  key={field.id}
                  alignItems={"center"}
                  spacing={4}
                >
                  <Grid item xs={12} md={5}>
                    <Controller
                      name={`${prefix}group`}
                      control={control}
                      render={({
                        field: { ref, ...field },
                        fieldState: { error },
                      }) => (
                        <FormControl fullWidth>
                          <InputLabel id={`add-user-group-${idx}`}>
                            {strings.group}
                          </InputLabel>
                          <MuiSelect
                            fullWidth
                            labelId={`add-user-group-${idx}`}
                            id={`select-add-user-group-${idx}`}
                            label={strings.group}
                            error={Boolean(errors.group)}
                            {...field}
                            inputRef={ref}
                          >
                            {groups?.map((group) => (
                              <MenuItem value={group.id} key={group.id}>
                                {group.name}
                              </MenuItem>
                            ))}
                          </MuiSelect>
                          {error && (
                            <Typography
                              variant="subtitle2"
                              className="error_message"
                            >
                              {error.message[lang]}
                            </Typography>
                          )}
                        </FormControl>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={5}>
                    <TextField
                      label={strings.groupPrice}
                      placeholder={strings.groupPrice}
                      fullWidth
                      type="number"
                      error={Boolean(errors.price)}
                      {...register(`${prefix}price`)}
                    />
                    {errors.groups?.[idx]?.price && (
                      <Typography variant="subtitle2" className="error_message">
                        {errors.groups[idx].price.message[lang]}
                      </Typography>
                    )}
                  </Grid>
                  <Grid item>
                    <Button
                      disabled={groupsInput.fields.length === 1}
                      title={
                        (groupsInput.fields.length === 1
                          ? {
                              ar: "يجب أن يكون الطالب مشترك في مجموعة واحدة على الأقل",
                              en: "Student must have one group at least",
                            }
                          : { ar: "حذف المجموعة", en: "Remove group" })[lang]
                      }
                      type="button"
                      onClick={() => groupsInput.remove(idx)}
                    >
                      <DeleteIcon />
                    </Button>
                  </Grid>
                  {groupsInput.fields.length - 1 === idx && (
                    <Grid item xs={12}>
                      <Button
                        type="button"
                        onClick={() => groupsInput.append({})}
                        variant="outlined"
                        sx={{
                          marginInline: "auto",
                          mt: "1rem",
                          display: "block",
                        }}
                      >
                        {strings.addGroup}
                      </Button>
                    </Grid>
                  )}
                </Grid>
              );
            })}
          </FormGroup>
        </FormControl>
      </Grid>
      {/* <Grid item xs={12} md={6} /> */}
      {/* <Grid item xs={12} md={6}>
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
      </Grid> */}
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

export default AddStudent;
