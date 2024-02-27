import React, { useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
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
import DeleteIcon from "@mui/icons-material/Delete";
import studentServices from "Services/student";
import useQueryService from "Hooks/useQueryService";
import strings from "Assets/Local/Local";
import { LangContext } from "App";
import { Loading } from "routes";
import { routePath } from "AppConstants";
import Validation from "./validations";

import styles from "CommonStyles/AddStyles";
import groupServices from "Services/group";

const useStyles = makeStyles(styles);

const EditStudent = () => {
  const [level, setLevel] = useState();

  const [loading, setLoading] = useState(false);
  const { lang } = useContext(LangContext);
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const classes = useStyles();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    watch,
    setError,
    setValue,
  } = useForm({
    resolver: yupResolver(Validation),
    mode: "all",
    defaultValues: {
      groups: [{}],
    },
  });
  const groupsInput = useFieldArray({ name: "groups", control });

  const { isLoading, data: student } = useQueryService({
    key: ["studentServices.getById", id],
    fetcher: () => studentServices.getById(id),
    enabled: !!id,
    onSuccess: (data) => {
      const { user } = data;
      setLevel(user?.level)
      const groups = (user.studentGroups ?? []).map(({ id, group, price }) => ({
        id,
        group: group.id,
        price,
        type: "edit",
      }));
      const values = {
        parentNumber: user.parentNumber ?? "",
        groups: groups.length ? groups : [{}],
      };
      reset(values);
    },
  });
  const { data: groupsData, isLoading: isLoadingGroups } = useQueryService({
    key: ["groupServices.getAll", {level:level, all: true }],
    fetcher: () => groupServices.getAll({level:level?.level?.id,subLevel:level?.id, all: true }),
  });
  const groups = groupsData?.data;
  const handleEdit = async (values) => {
    console.log("vals", values);
    setLoading(true);
    try {
      const addGroups = [];
      const deleteGroups = [];
      const updateGroups = [];
      values.groups.forEach(({ type, ...group }) => {
        if (type === "edit") updateGroups.push(group);
        else if (type === "delete") deleteGroups.push(group.id);
        else addGroups.push(group);
      });
      const data = {
        parentNumber: values.parentNumber,
        student: id,
      };
      if (addGroups.length) data.addGroups = addGroups;
      if (deleteGroups.length) data.deleteGroups = deleteGroups;
      if (updateGroups.length) data.updateGroups = updateGroups;
      await studentServices.updateById(data);
      navigate(location.state?.navigateTo ?? `${routePath}students`);
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

  if (isLoading || isLoadingGroups) {
    return <Loading />;
  }
  const groupLength = groupsInput.fields.filter(
    (_, idx) => watch(`groups.${idx}`)?.type !== "delete"
  ).length;
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
          InputLabelProps={{ shrink: true }}
          label={strings.parentNumber}
          placeholder={"01000000000"}
          fullWidth
          error={Boolean(errors.parentNumber)}
          {...register("parentNumber")}
        />
        {errors.parentNumber && (
          <Typography variant="subtitle2" className="error_message">
            {errors.parentNumber.message[lang]}
          </Typography>
        )}
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
              const prefix = `groups.${idx}`;
              const { type, ...group } = watch(prefix) ?? {};
              if (type === "delete") return null;
              return (
                <Grid
                  container
                  key={field.id}
                  alignItems={"center"}
                  spacing={4}
                >
                  <Grid item xs={12} md={5}>
                    <Controller
                      name={`${prefix}.group`}
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
                      {...register(`${prefix}.price`)}
                    />
                    {errors.groups?.[idx]?.price && (
                      <Typography variant="subtitle2" className="error_message">
                        {errors.groups[idx].price.message[lang]}
                      </Typography>
                    )}
                  </Grid>
                  <Grid item>
                    <Button
                      disabled={groupLength === 1}
                      title={
                        (groupLength === 1
                          ? {
                              ar: "يجب أن يكون الطالب مشترك في مجموعة واحدة على الأقل",
                              en: "Student must have one group at least",
                            }
                          : { ar: "حذف المجموعة", en: "Remove group" })[lang]
                      }
                      type="button"
                      onClick={() => {
                        groupsInput.remove(idx);
                        if (type === "edit")
                          groupsInput.prepend({ ...group, type: "delete" });
                      }}
                    >
                      <DeleteIcon />
                    </Button>
                  </Grid>
                  {groupsInput.fields.length - 1 === idx && (
                    <Grid item xs={12}>
                      <Button
                        type="button"
                        onClick={() => groupsInput.append({ type: "add" })}
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
        >
          {loading ? strings.loading : strings.edit}
        </Button>
      </Grid>
    </Grid>
  );
};
export default EditStudent;
