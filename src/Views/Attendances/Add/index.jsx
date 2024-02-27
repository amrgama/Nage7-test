import React, { useState, useContext } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import useScanDetection from "use-scan-detection";
import {
  Button,
  Grid,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
  Stack,
  Card,
  CardHeader,
  CardContent,
  Avatar,
  Autocomplete,
  Box,
} from "@mui/material";
import attendanceService from "Services/attendance";
import studentServices from "Services/student";
import strings from "Assets/Local/Local";
import { LangContext } from "App";
import { API_ENDPOINT, routePath } from "AppConstants";
import Validation from "./validations";
import Moment from "react-moment";
import moment from "moment";
import styles from "CommonStyles/AddStyles";
import useQueryService from "Hooks/useQueryService";
import { toast } from "react-toastify";
import "./attendance.css";
import lectureServices from "Services/lectures";

const useStyles = makeStyles(styles);

const AddAttendance = () => {
  const [loading, setLoading] = useState(false);
  const [barcodeSerial, setBarcodeSerial] = useState(0);
  const [price, setPrice] = useState(0);
  const [baanace, setBalance] = useState(0);
  const [studentInfo, setStudentInfo] = useState(null);
  const [studentData, setStudent] = useState(null);

  const { lang } = useContext(LangContext);

  // const navigate = useNavigate();
  const classes = useStyles();
  const { lecture: attendanceLecture } = useParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setError,
    setValue,
    getValues,
    watch,
    reset,
  } = useForm({
    resolver: yupResolver(Validation),
    mode: "all",
  });
  // const listOfDays = [
  //   "Saturday",
  //   "Sunday",
  //   "Monday",
  //   "Tuesday",
  //   "Wednesday",
  //   "Thursday",
  //   "Friday",
  // ];
  // const day = moment().format("dddd"); // Thursday Feb 2015
  const { data: groupData } = useQueryService({
    key: ["lectureServices.getById", attendanceLecture],
    fetcher: () => lectureServices.getById(attendanceLecture),
    enabled: !!attendanceLecture,
  });
  const group = groupData?.attendanceLecture?.group;
  const { data: studentsData } = useQueryService({
    key: ["studentServices.getAll", { all: true }],
    fetcher: () => studentServices.getAll({ all: true }),
    enabled: !!group,
  });

  useScanDetection({
    // ignoreIfFocusOn: true,
    // stopPropagation: true,
    // preventuDefalt: true,
    // averageWaitTime:(time)=>{console.log("time ===>",time);},
    onComplete: (code) => {
      console.log("barcodeSerial", barcodeSerial, code);
      if (barcodeSerial === code) {
        handleAdd({
          code: code,
          student: getValues("student"),
          paid: getValues("paid"),
        });
      } else {
        setBarcodeSerial(code);
        // let student = students.filter((el) => el.student.barCode === code)[0];
        handleScan(code, "barcodeScanner");
        // setPrice(student?.price);
        // setBalance(student?.student?.balance);
        // console.log("BarcodeSerial ===>", code, students, student);
        // setValue("student", student?.student?.id);
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
      let userInfo = await attendanceService.scan(data);
      console.log("test===>", userInfo);
      if (
        userInfo?.data?.exist === false &&
        userInfo?.data?.details === "notRegistered"
      ) {
        const message = {
          ar: "الطالب لم يسجل بعد",
          en: "Student not register",
        };
        setStudentInfo(null);
        toast.error(message[lang]);
        return;
      }
      setStudentInfo(userInfo?.data);
      setPrice(userInfo?.data?.studentGroup?.price);
      setBalance(userInfo?.data?.studentGroup?.balance);
      setValue("paid", userInfo?.data?.studentGroup?.price);
      if (type === "barcodeScanner") {
        setStudent(userInfo?.data?.user);
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
      await attendanceService.add({
        ...values,
        attendanceLecture,
        group: group?.id,
      });
      const message = {
        ar: "تم تسجيل الطالب بالحضور",
        en: "Student signned in attendance successfully",
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
      setStudentInfo(null);
      setBalance(0);
      setBarcodeSerial(0);
      setValue("paid", "");
      reset({
        student: null,
        paid: "",
      });
      setValue("student", "");
      setStudent("");
    }
  };

  console.log(errors);
  const student = watch("student");
  // const studentInfo = students?.find((s) => s.student.id == student);
  return (
    <Grid
      container
      classes={{ root: classes.wrapper }}
      component="form"
      onSubmit={handleSubmit(handleAdd)}
      spacing={3}
    >
      <Grid item xs={12}>
        <Typography variant="h5">
          {strings.addAttendance}
          {/* {barcodeSerial} */}
        </Typography>
      </Grid>
      <Grid item md={6} xs={12}>
        <Stack spacing={3}>
          <Controller
            name="student"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Autocomplete
                defaultValue={"options"}
                disablePortal
                value={studentData}
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
                  console.log("change", v);
                  let student = v
                    ? students.filter((el) => el.id === v?.id)[0]
                    : null;
                  console.log("change", student, v);
                  setStudent(v);
                  field.onChange(student?.id ?? "");
                  if (student) handleScan(student?.barCode);
                  else setStudentInfo(null);
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
          <div>
            <TextField
              label={strings.groupPrice}
              placeholder={strings.groupPrice}
              fullWidth
              error={Boolean(errors.paid)}
              {...register("paid")}
              value={price}
              type="number"
              onKeyPress={(e) => console.log("event input", e.key)}
              onChange={(e) => {
                setPrice(e.target.value);
                if (studentInfo) {
                  setBalance(
                    studentInfo?.studentGroup?.balance +
                      ((e.target.value ?? 0) - studentInfo?.studentGroup?.price)
                  );
                } else {
                  setBalance(baanace + e.target.value ?? 0);
                }
              }}
            />
            {errors.paid && (
              <Typography variant="subtitle2" className="error_message">
                {errors.paid.message[lang]}
              </Typography>
            )}
          </div>
          <div>
            <TextField
              sx={{ textAlign: "end", direction: "ltr" }}
              InputLabelProps={{ shrink: true }}
              disabled
              label={strings.balancePrice}
              placeholder={strings.balancePrice}
              fullWidth
              value={baanace}
              type="number"
            />
          </div>
        </Stack>
      </Grid>
      <Grid item md={6} xs={12}>
        {studentInfo && studentInfo?.exist && (
          <Card>
            <CardHeader
              sx={{ flexDirection: "column" }}
              avatar={
                <Avatar
                  src={
                    studentInfo?.user?.image
                      ? `${API_ENDPOINT}${studentInfo.user.image}`
                      : `/images/cards/${studentInfo.gender}_STUDENT.png`
                  }
                  alt=""
                />
              }
              title={studentInfo?.user?.name}
              subheader={studentInfo?.user?.code}
            />
            <CardContent
              sx={{ flexDirection: "column", textAlign: "start", mx: 5 }}
            >
              <Typography>
                {strings.phone} : {studentInfo?.user?.phone}
              </Typography>
              <Typography>
                {strings.parentNumber} : {studentInfo?.user?.parentNumber}
              </Typography>
              <Typography display="flex">
                {strings.balancePrice} :<span></span>
                <Typography
                  direction="ltr"
                  color={
                    studentInfo?.studentGroup?.balance >= 0
                      ? "#07943F"
                      : "#9D0101"
                  }
                >
                  {studentInfo?.studentGroup?.balance}
                </Typography>
              </Typography>
              <Typography>
                {strings.groupPrice} : {studentInfo?.studentGroup?.price}EGP
              </Typography>
              <Typography fontWeight={"600"} color={"#036BB9"} mt={2} mb={1}>
                {strings.LatestAttendance}
              </Typography>
              <Box>
                {studentInfo?.attendances?.length ? (
                  studentInfo.attendances.map((el) => {
                    return (
                      <Box display={"flex"} justifyContent={"space-between"}>
                        <Typography>
                          <Moment date={el.createdAt} format="DD/MM/YYYY  " />
                        </Typography>
                        <Typography sx={{ display: "block", width: "30%" }}>
                          {el?.groupStudent?.group?.name?.slice(0, 13)}
                          {el?.groupStudent?.group?.name?.length > 13 ? (
                            <>...</>
                          ) : (
                            ""
                          )}
                          {/* {groupsData?.data.filter((i) => i.id === el?.group)?.[0]?.name.slice(0, 13)}
                        {groupsData?.data.filter((i) => i.id === el?.group)?.[0]?.name.length > 13 ? <>...</> : ''} */}
                        </Typography>
                        <Typography
                          sx={{ display: "block", width: "15%" }}
                          color={el.status === "ATTEND" ? "#07943F" : "#9D0101"}
                        >
                          {el?.status === "ATTEND"
                            ? lang === "ar"
                              ? "حضر"
                              : "Attend"
                            : lang === "ar"
                            ? "غائب"
                            : "Absence"}
                        </Typography>
                        <Typography
                          color={"#036BB9"}
                          sx={{
                            direction: "ltr",
                            display: "block",
                            width: "15%",
                          }}
                        >
                          {el?.paid} EGP
                        </Typography>
                      </Box>
                    );
                  })
                ) : (
                  <Typography
                    color={"#9D0101"}
                    fontWeight={"700"}
                    textAlign={"center"}
                  >
                    {lang === "ar"
                      ? "لا يوجد حضور حاليا"
                      : "There is No Attendance"}
                  </Typography>
                )}
              </Box>

              <Typography fontWeight={"600"} color={"#036BB9"} mt={2} mb={1}>
                {strings.LatestHomeWork}
              </Typography>
              <Box>
                {studentInfo?.homeworks?.map((el) => {
                  return (
                    <Box display={"flex"} justifyContent={"space-between"}>
                      <Typography>
                        <Moment date={el.createdAt} format="DD/MM/YYYY  " />
                      </Typography>
                      <Typography>{el?.name ?? "..."}</Typography>
                      <Typography color={el.answer ? "#07943F" : "#9D0101"}>
                        {el?.answer
                          ? lang === "ar"
                            ? "تم الحل"
                            : "Solved"
                          : lang === "ar"
                          ? "لم يتم الحل"
                          : "Not Solved"}
                      </Typography>
                      <Typography color={"#036BB9"} sx={{ direction: "ltr" }}>
                        {" "}
                        {el?.grade ?? 0}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            </CardContent>
          </Card>
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

export default AddAttendance;
