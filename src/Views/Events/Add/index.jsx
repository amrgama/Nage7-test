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
  Autocomplete,
} from "@mui/material";

import DatePicker from "Components/DatePicker";

import eventServices from "Services/events";
import strings from "Assets/Local/Local";
import { LangContext, UserContext } from "App";
import { routePath } from "AppConstants";
import Validation from "./validations";

import styles from "CommonStyles/AddStyles";
import groupServices from "Services/group";
// import studentServices from "Services/student";
import useQueryService from "Hooks/useQueryService";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const useStyles = makeStyles(styles);

const AddEvent = () => {
  const [loading, setLoading] = useState(false);
  const { lang } = useContext(LangContext);
  const navigate = useNavigate();
  const classes = useStyles();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(Validation),
    mode: "all",
  });

  const { data: groupsData, isLoading: loadingGroups } = useQueryService({
    key: ["groupServices.getAll", { all: true }],
    fetcher: () => groupServices.getAll({ all: true }),
  });
  // const { data: studentsData, isLoading: loadingStudents } = useQueryService({
  //   key: ["studentServices.getAll", { all: true }],
  //   fetcher: () => studentServices.getAll({ all: true }),
  // });
  const handleAdd = async (values) => {
    // console.log('valuesss===>',values)
    setLoading(true);
    try {
      let data = {
        ...values,
      };

      if (values.groupsType === "SPECIFIC" && values.groups?.length > 0) {
        data.groups = values.groups.map((v) => v.id);
      } else {
        delete data.groups;
      }
      // console.log('valuesss===>',data,values.students.length,values?.groups?.length)
      const response = await eventServices.add(data);

      if (response.status === 200) {
        navigate(`${routePath}events`);
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
  const groups = groupsData?.data || [];
  const groupType = watch("groupsType");
  return (
    <Grid
      container
      classes={{ root: classes.wrapper }}
      component="form"
      onSubmit={handleSubmit(handleAdd)}
      spacing={3}
    >
      <Grid item xs={12}>
        <Typography variant="h5">{strings.events.add}</Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label={strings.events.name}
          placeholder={strings.events.name}
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
          name="type"
          defaultValue=""
          control={control}
          render={({ field, fieldState: { error } }) => (
            <FormControl fullWidth>
              <InputLabel id="add-event-type">{strings.events.type}</InputLabel>
              <MuiSelect
                fullWidth
                labelId="add-event-type"
                id="select-add-event-type"
                label={strings.events.type}
                error={Boolean(error)}
                {...field}
              >
                {Object.entries(strings.events.types).map(([value, label]) => (
                  <MenuItem value={value} key={value}>
                    {label}
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
          name="date"
          control={control}
          defaultValue={new Date()}
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <div>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label={strings.events.date}
                  value={value}
                  onChange={onChange}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
              {error && (
                <Typography variant="subtitle2" className="error_message">
                  {error.message[lang]}
                </Typography>
              )}
            </div>
          )}
        />
      </Grid>
      <Grid lg={6} xs={12} />
      <Grid item xs={12} md={6}>
        <Controller
          name="regisiterPrice"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <div>
              <TextField
                label={strings.events.registerPrice}
                placeholder={strings.events.registerPrice}
                fullWidth
                type="number"
                error={Boolean(error)}
                {...field}
                onChange={(e) => field.onChange(+e.target.value)}
              />
              {error && (
                <Typography variant="subtitle2" className="error_message">
                  {error.message[lang]}
                </Typography>
              )}
            </div>
          )}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Controller
          name="eventPrice"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <div>
              <TextField
                label={strings.events.price}
                placeholder={strings.events.price}
                fullWidth
                type="number"
                error={Boolean(error)}
                {...field}
                onChange={(e) => field.onChange(+e.target.value)}
              />
              {error && (
                <Typography variant="subtitle2" className="error_message">
                  {error.message[lang]}
                </Typography>
              )}
            </div>
          )}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Controller
          name="groupsType"
          defaultValue="ALL"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <FormControl fullWidth>
              <InputLabel id="add-group-type">
                {strings.events.groupType}
              </InputLabel>
              <MuiSelect
                fullWidth
                labelId="add-group-type"
                id="select-add-group-type"
                label={strings.events.groupType}
                error={Boolean(error)}
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  setValue("groups", undefined);
                }}
              >
                {Object.entries(strings.events.groupTypes).map(
                  ([value, label]) => (
                    <MenuItem value={value} key={value}>
                      {label}
                    </MenuItem>
                  )
                )}
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
        {groupType === "SPECIFIC" ? (
          <Controller
            name="groups"
            defaultValue={[]}
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Autocomplete
                {...field}
                multiple
                options={groups}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) =>
                  option.id === value?.id
                }
                loading={loadingGroups}
                onChange={(e, value) => field.onChange(value)}
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={strings.addGroup}
                    placeholder={strings.addGroup}
                    error={Boolean(error)}
                    helperText={error && error.message[lang]}
                  />
                )}
              />
            )}
          />
        ) : null}
      </Grid>
      <Grid item lg={6} xs={12}>
        <TextField
          multiline
          rows={3}
          label={strings.events.location}
          placeholder={strings.events.location}
          fullWidth
          {...register("location")}
          error={!!errors?.location}
        />
        {errors?.location && (
          <Typography variant="subtitle2" className="error_message">
            {errors?.location.message[lang]}
          </Typography>
        )}
      </Grid>
      <Grid item lg={6} xs={12}>
        <TextField
          multiline
          rows={3}
          label={strings.events.details}
          placeholder={strings.events.details}
          fullWidth
          {...register("details")}
          error={!!errors?.details}
        />
        {errors?.details && (
          <Typography variant="subtitle2" className="error_message">
            {errors?.details.message[lang]}
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

export default AddEvent;
