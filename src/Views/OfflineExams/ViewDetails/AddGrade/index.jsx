import React, { useState, useContext } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { /* useNavigate,  */ useParams } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import useScanDetection from "use-scan-detection";
import {
  Button,
  Grid,
  Typography,
  TextField,
  Autocomplete,
} from "@mui/material";
import examGradeServices from "Services/exam-grades";
import studentServices from "Services/student";
import strings from "Assets/Local/Local";
import { LangContext } from "App";
// import { API_ENDPOINT /* , routePath */ } from "AppConstants";
import Validation from "./validations";
import styles from "CommonStyles/AddStyles";
import useQueryService from "Hooks/useQueryService";
import { toast } from "react-toastify";

const useStyles = makeStyles(styles);

const AddGrade = () => {
  const [loading, setLoading] = useState(false);
  const [barcodeSerial, setBarcodeSerial] = useState(0);

  const { lang } = useContext(LangContext);

  // const navigate = useNavigate();
  const classes = useStyles();
  const { examId } = useParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setError,
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(Validation),
    mode: "all",
  });

  const { data: studentsData } = useQueryService({
    key: ["studentServices.getAll", { all: true }],
    fetcher: () => studentServices.getAll({ all: true }),
  });

  useScanDetection({
    // ignoreIfFocusOn: true,
    // stopPropagation: true,
    // preventuDefalt: true,
    // averageWaitTime:(time)=>{console.log("time ===>",time);},
    onComplete: (code) => {
      console.log("barcodeSerial", barcodeSerial, code);
      if (barcodeSerial !== code) {
        setBarcodeSerial(code);
        handleScan(code, "barcodeScanner");
      }
    },
  });

  const students = studentsData?.data;
  const handleScan = async (code, type) => {
    console.log("code===>", code);
    setLoading(true);
    try {
      let data = {
        code: code,
        group: group?.id,
      };
      let userInfo = await examGradeServices.scan(data);
      console.log("test===>", userInfo);
      if (
        userInfo?.data?.exist === false &&
        userInfo?.data?.details === "notRegistered"
      ) {
        const message = {
          ar: "الطالب لم يسجل بعد",
          en: "Student not register",
        };
        toast.error(message[lang]);
        return;
      }
      if (type === "barcodeScanner") {
        setValue("student", userInfo?.data?.studentGroup?.student);
      }
    } catch (error) {
      console.log("error when add ", error);
      error?.response?.data?.errors?.forEach?.(({ param, msg }) => {
        if (param in values)
          setError(param, { type: "custom", message: { ar: msg, en: msg } });
      });
    } finally {
      setLoading(false);
    }
  };
  const handleAdd = async (values) => {
    setLoading(true);
    try {
      await examGradeServices.add({ ...values, exam: examId });
      const message = {
        ar: "تم تسجيل درجة الطالب",
        en: "Student Grade assigned successfully",
      };
      toast.success(message[lang]);

      // navigate(`${routePath}groups/view/${group}/attendance`);
    } catch (error) {
      console.log("error when add ", error);
      error?.response?.data?.errors?.forEach?.(({ param, msg }) => {
        if (param in values)
          setError(param, { type: "custom", message: { ar: msg, en: msg } });
      });
    } finally {
      setLoading(false);
      setBarcodeSerial(0);
      setValue("student", "");
    }
  };
  return (
    <Grid
      container
      classes={{ root: classes.wrapper }}
      component="form"
      onSubmit={handleSubmit(handleAdd)}
      spacing={3}
    >
      <Grid item xs={12}>
        <Typography variant="h5">{strings.addGrade}</Typography>
      </Grid>
      <Grid item md={6} xs={12}>
        <Controller
          name="student"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <Autocomplete
              defaultValue={"options"}
              disablePortal
              value={field.value}
              options={students ?? []}
              isOptionEqualToValue={(option, value) => value === option?.id}
              getOptionLabel={(option) =>
                `${option?.code ?? "..."} - ${option?.name ?? "..."} - ${
                  option?.phone ?? "..."
                }`
              }
              clearOnBlur={false}
              clearOnEscape={false}
              onChange={(e, v) => {
                let student = v
                  ? students.filter((el) => el.id === v?.id)[0]
                  : null;
                field.onChange(student?.id ?? "");
                if (student) handleScan(student?.barCode);
              }}
              renderInput={(params) => (
                <TextField
                  label={strings.StudentName}
                  fullWidth
                  helperText={error?.message[lang]}
                  error={!!error}
                  {...params}
                />
              )}
            />
          )}
        />
      </Grid>
      <Grid item md={6} xs={12}>
        <div>
          <TextField
            label={strings.grade}
            placeholder={strings.grade}
            fullWidth
            type="number"
            {...register("grade")}
          />
          {errors.grade && (
            <Typography variant="subtitle2" className="error_message">
              {errors.grade.message[lang]}
            </Typography>
          )}
        </div>
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

export default AddGrade;
