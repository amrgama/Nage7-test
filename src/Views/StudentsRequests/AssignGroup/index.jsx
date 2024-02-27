import React, { useState, useContext } from "react";
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
} from "@mui/material";
import strings from "Assets/Local/Local";
import { LangContext } from "App";
import { routePath } from "AppConstants";
import Validation from "./validations";

import styles from "CommonStyles/AddStyles";
import useQueryService from "Hooks/useQueryService";
import requestService from "Services/request";
import groupServices from "Services/group";
import DeleteIcon from "@mui/icons-material/Delete";
import { useParams } from "react-router-dom";


const useStyles = makeStyles(styles);

const AddStudent = () => {
  const [loading, setLoading] = useState(false);
  const { lang } = useContext(LangContext);
  const location = useLocation();
  const navigate = useNavigate();
  const classes = useStyles();
  const { id ,level} = useParams();

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
    },
  });
  const groupsInput = useFieldArray({ name: "groups", control });
  const { data: groupsData } = useQueryService({
    key: ["groupServices.getAll",{subLevel:level, all: true },],
    fetcher: () =>
      groupServices.getAll({ all: true,subLevel:level }),
    enabled: !!level,
  });
  const groups = groupsData?.data;
  
  // const students = studentsData?.data;
  const handleAdd = async (values) => {
    setLoading(true);
    const data = {
      groups: values.groups,
      status:"ACCEPTED",
    };
  
    try {
      await  requestService.updateById(id, data);;
      navigate(location.state?.navigateTo ?? `${routePath}student-requests`);
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
        <Typography variant="h5">{strings.AssignStudent}</Typography>
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
      <Grid item xs={12} className={classes.buttonContainer}>
        <Button
          type="submit"
          disabled={loading}
          variant={loading ? "outlined" : "contained"}
          sx={{backgroundColor:'#1d7204'}}
        >
          {loading ? strings.loading : strings.accept}
        </Button>
      </Grid>
    </Grid>
  );
};

export default AddStudent;
