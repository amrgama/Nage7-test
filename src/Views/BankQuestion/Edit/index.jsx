import React, { useState, useContext, useDeferredValue, useMemo } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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

import DatePicker from "Components/DatePicker";

import studentService from "Services/student";
import strings from "Assets/Local/Local";
import { LangContext, UserContext } from "App";
import { QUESTION_BANK, routePath, API_ENDPOINT } from "AppConstants";
import Validation from "./validations";

import styles from "CommonStyles/AddStyles";
import useQueryService from "Hooks/useQueryService";
import levelServices from "Services/level";
import groupServices from "Services/group";
import storeServices from "Services/store";
import DeleteIcon from "@mui/icons-material/Delete";
import bankQuestionServices from "Services/bankQuestion";
import ImgUpload from "Components/Inputs/ImgUpload/ImgUpload";

const useStyles = makeStyles(styles);

const EditQuestionBank = () => {
  const [loading, setLoading] = useState(false);
  const [questionTypeList, setQuestionTypeList] = useState([]);
  const [selected, setSelected] = useState();
  const { lang } = useContext(LangContext);
  const { user } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const classes = useStyles();
  const { id } = useParams();

  const examModuleEnabled = useMemo(() => {
    return location?.search.includes("examModule");
  }, [location?.search]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    setError,
    watch,
    reset,
  } = useForm({
    resolver: yupResolver(Validation),
    mode: "all",
    defaultValues: {
      question: [{}],
    },
  });
  const questionType = [
    { id: "TRUE_FALSE", name: { ar: "صح / خطاء", en: "True / False" } },
    { id: "MCQ", name: { ar: "اختيار متعدد", en: "MCQ" } },
    { id: "TEXT", name: { ar: "مقالي", en: "text" } },
  ];
  const trueFalseAnswer = [
    { id: "TRUE", name: { ar: "صح", en: "True" } },
    { id: "FALSE", name: { ar: "خطاء", en: "False" } },
  ];
  const chooseAnswer = [
    { id: "0", name: { ar: "الاختيار الاول", en: "First Answer" } },
    { id: "1", name: { ar: "الاختيار الثاني", en: "Second Answer" } },
    { id: "2", name: { ar: "الاختيار الثالث", en: "Third Answer" } },
    { id: "3", name: { ar: "الاختيار الرابع", en: "Fourth Answer" } },
  ];
  const difficultyLevel = [
    { id: "1", name: { ar: "L.V 1", en: "L.V 1" } },
    { id: "2", name: { ar: "L.V 2", en: "L.V 2" } },
    { id: "3", name: { ar: "L.V 3", en: "L.V 3" } },
    { id: "4", name: { ar: "L.V 4", en: "L.V 4" } },
  ];
  const subjects = user?.subjects ?? [];
  const questionsInput = useFieldArray({ name: "question", control });
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
  const handleUploadImgLocal = async (e) => {
    const imgFile = e.target.files[0];
    if (!imgFile) return { imgUrl: "", file: "" };
    let imgUrl = URL.createObjectURL(imgFile);
    const data = new FormData();
    data.append("image", imgFile);
    const result = await storeServices.uploadFile(data);

    console.log("result===>", result);
    return { imgUrl: imgUrl, file: result.data.link };
  };
  const { data: bankQuestionData, isLoading: isLoadingbankQuestionData } =
    useQueryService({
      key: ["bankQuestionServices.getById", id],
      fetcher: () => bankQuestionServices.getById(id),
      enabled: !!id,
      onSuccess: (data) => {
        const { question } = data;
        const values = {
          level: question.subLevel,
          subject: question.subject,
          type: question.type,
          difficultyLevel: question.difficultyLevel,
          question: question.name,
          trueFalseAnswer: question.trueFalseAnswer,
          correctAnswer: question.correctAnswer,
          correctOption: question?.correctOption,
          choice_1: question?.options?.[0]?.text,
          choice_2: question?.options?.[1]?.text,
          choice_3: question?.options?.[2]?.text,
          choice_4: question?.options?.[3]?.text,
          choice_1Image: {
            file: question?.options?.[0]?.image,
            imgUrl: `${API_ENDPOINT}${question?.options?.[0]?.image}`,
          },
          choice_2Image: {
            file: question?.options?.[1]?.image,
            imgUrl: `${API_ENDPOINT}${question?.options?.[1]?.image}`,
          },
          choice_3Image: {
            file: question?.options?.[2]?.image,
            imgUrl: `${API_ENDPOINT}${question?.options?.[2]?.image}`,
          },
          choice_4Image: {
            file: question?.options?.[3]?.image,
            imgUrl: `${API_ENDPOINT}${question?.options?.[3]?.image}`,
          },
          questionImage: {
            file: question.image,
            imgUrl: `${API_ENDPOINT}${question.image}`,
          },
        };
        setQuestionTypeList([question.type]);
        console.log("images===>", values);
        reset({ question: [values] });
      },
    });
  const handleEdit = async (values) => {
    setLoading(true);
    let data = [];
    for (let i = 0; i < values.question.length; i++) {
      let subQuestion = values?.question?.[i];
      console.log(
        "values====>",
        values,
        subQuestion?.questionImage?.file !== ""
      );

      if (subQuestion.type === "TRUE_FALSE") {
        let obj = {
          name: subQuestion?.question,
          type: "TRUE_FALSE",
          difficultyLevel: Number(subQuestion?.difficultyLevel),
          trueFalseAnswer: subQuestion?.trueFalseAnswer,
          subject: subQuestion?.subject,
          subLevel: subQuestion?.level,
        };

        if (subQuestion?.questionImage?.file !== "") {
          obj.image = subQuestion.questionImage.file;
        }
        if (subQuestion?.correctAnswer) {
          obj.correctAnswer = subQuestion?.correctAnswer;
        }
        obj.id = Number(id);
        data.push(obj);
      } else if (subQuestion.type === "TEXT") {
        let obj = {
          name: subQuestion?.question,
          type: "TEXT",
          difficultyLevel: Number(subQuestion?.difficultyLevel),
          subject: subQuestion?.subject,
          subLevel: subQuestion?.level,
        };

        if (subQuestion?.questionImage?.file !== "") {
          obj.image = subQuestion.questionImage.file;
        }
        if (subQuestion?.correctAnswer) {
          obj.correctAnswer = subQuestion?.correctAnswer;
        }
        obj.id = Number(id);
        data.push(obj);
      } else if (subQuestion.type === "MCQ") {
        let options = [];
        if (subQuestion?.choice_1 || subQuestion?.choice_1Image) {
          let obj = {};
          if (subQuestion?.choice_1Image) {
            obj.image = subQuestion?.choice_1Image?.file;
          }
          if (subQuestion?.choice_1) {
            obj.text = subQuestion?.choice_1;
          }
          options.push(obj);
        }
        if (subQuestion?.choice_2 || subQuestion?.choice_2Image) {
          let obj = {};
          if (subQuestion?.choice_2Image) {
            obj.image = subQuestion?.choice_2Image?.file;
          }
          if (subQuestion?.choice_1) {
            obj.text = subQuestion?.choice_2;
          }
          options.push(obj);
        }
        if (subQuestion?.choice_3 || subQuestion?.choice_3Image) {
          let obj = {};
          if (subQuestion?.choice_3Image) {
            obj.image = subQuestion?.choice_3Image?.file;
          }
          if (subQuestion?.choice_3) {
            obj.text = subQuestion?.choice_3;
          }
          options.push(obj);
        }
        if (subQuestion?.choice_4 || subQuestion?.choice_4Image) {
          let obj = {};
          if (subQuestion?.choice_4Image) {
            obj.image = subQuestion?.choice_4Image?.file;
          }
          if (subQuestion?.choice_4) {
            obj.text = subQuestion?.choice_4;
          }
          obj.id = id;
          options.push(obj);
        }
        let obj = {
          name: subQuestion?.question,
          type: "MCQ",
          difficultyLevel: Number(subQuestion?.difficultyLevel),
          correctOption: subQuestion?.correctOption,
          subject: subQuestion?.subject,
          subLevel: subQuestion?.level,
          options: options,
        };

        if (subQuestion?.questionImage?.file !== "") {
          obj.image = subQuestion.questionImage.file;
        }
        if (subQuestion?.correctAnswer) {
          obj.correctAnswer = subQuestion?.correctAnswer;
        }
        obj.id = Number(id);
        data.push(obj);
      }
    }

    try {
      console.log("values====> result", data[0]);

      const response = await bankQuestionServices.update(data[0]);
      if (!examModuleEnabled) {
        navigate(location.state?.navigateTo ?? `${routePath}bank-Question`);
      } else {
        const selectedQuestions = JSON.parse(
          localStorage.getItem(QUESTION_BANK)
        );

        localStorage.setItem(
          QUESTION_BANK,
          JSON.stringify([...selectedQuestions, ...response?.data?.question])
        );

        navigate(`${routePath}exam-modules/add?activeStep=2`);
      }
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
      onSubmit={handleSubmit(handleEdit)}
      spacing={3}
    >
      {console.log("choice===>", questionTypeList)}
      <Grid item xs={12}>
        <Typography variant="h5">{strings.editBankQuestion}</Typography>
      </Grid>

      <Grid item xs={12}>
        <FormControl fullWidth>
          <FormGroup sx={{ gap: "2rem" }}>
            {questionsInput.fields.map((field, idx) => {
              const prefix = `question.${idx}.`;
              return (
                <Grid
                  container
                  key={field.id}
                  alignItems={"center"}
                  spacing={4}
                >
                  <Grid item xs={12} md={2}>
                    <Controller
                      name={`${prefix}level`}
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <FormControl fullWidth>
                          <InputLabel id="add-user-level">
                            {strings.level}
                          </InputLabel>
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
                              // setValue("subLevel", "");
                              // setValue("group", "");
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

                  <Grid item xs={12} md={3}>
                    <Controller
                      name={`${prefix}subject`}
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <FormControl fullWidth>
                          <InputLabel id="add-user-subject">
                            {strings.subject}
                          </InputLabel>
                          <MuiSelect
                            fullWidth
                            labelId="add-user-subject"
                            id="select-add-user-subject"
                            label={strings.subject}
                            error={Boolean(error)}
                            onChange={(e) => {
                              // setSubject(e.target.value);
                              // setLevel();
                              // setValue("level", "");
                              // setValue("subLevel", "");
                              field.onChange(e);
                            }}
                            onBlur={field.onBlur}
                            value={field.value}
                            inputRef={field.ref}
                            name={field.name}
                          >
                            {subjects?.map((subject) => (
                              <MenuItem value={subject.id} key={subject.id}>
                                {subject.name[lang]}
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

                  <Grid item xs={12} md={3}>
                    <Controller
                      name={`${prefix}type`}
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <FormControl fullWidth>
                          <InputLabel id="add-question-type">
                            {strings.questionType}
                          </InputLabel>
                          <MuiSelect
                            fullWidth
                            labelId="add-question-type"
                            id="select-add-question-type"
                            label={strings.questionType}
                            error={Boolean(error)}
                            onChange={(e) => {
                              console.log("choice===> ch", e, e?.target?.value);
                              // setSubject(e.target.value);
                              let choice = questionTypeList;
                              choice[idx] = e.target.value;
                              console.log("choice===> chin", choice);
                              setQuestionTypeList([...choice]);
                              field.onChange(e);
                            }}
                            onBlur={field.onBlur}
                            value={field.value}
                            inputRef={field.ref}
                            name={field.name}
                          >
                            {questionType?.map((question) => (
                              <MenuItem value={question.id} key={question.id}>
                                {question.name[lang]}
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
                  <Grid item xs={12} md={3}>
                    <Controller
                      name={`${prefix}difficultyLevel`}
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <FormControl fullWidth>
                          <InputLabel id="add-difficulty-level">
                            {strings.difficultyLevel}
                          </InputLabel>
                          <MuiSelect
                            fullWidth
                            labelId="add-difficulty-level"
                            id="select-add-difficulty-level"
                            label={strings.difficultyLevel}
                            error={Boolean(error)}
                            onChange={(e) => {
                              // setSubject(e.target.value);

                              field.onChange(e);
                            }}
                            onBlur={field.onBlur}
                            value={field.value}
                            inputRef={field.ref}
                            name={field.name}
                          >
                            {difficultyLevel?.map((difficultyLevel) => (
                              <MenuItem
                                value={difficultyLevel.id}
                                key={difficultyLevel.id}
                              >
                                {difficultyLevel.name[lang]}
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

                  {/* <Grid item xs={12} md={1}>
                    <Button
                      disabled={questionsInput.fields.length === 1}
                      title={
                        (questionsInput.fields.length === 1
                          ? {
                              ar: "يجب أن يكون الطالب مشترك في مجموعة واحدة على الأقل",
                              en: "Student must have one group at least",
                            }
                          : { ar: "حذف المجموعة", en: "Remove group" })[lang]
                      }
                      type="button"
                      onClick={() => questionsInput.remove(idx)}
                    >
                      <DeleteIcon />
                    </Button>
                  </Grid> */}

                  {questionTypeList[idx] === "TRUE_FALSE" ||
                  questionTypeList[idx] === "MCQ" ||
                  questionTypeList[idx] === "TEXT" ? (
                    <>
                      <Grid item xs={12} md={12}>
                        <TextField
                          InputLabelProps={{ shrink: true }}
                          label={strings.question}
                          placeholder={strings.question}
                          fullWidth
                          error={Boolean(errors[`${prefix}question`])}
                          disabled={!!selected}
                          {...register(`${prefix}question`)}
                        />
                        {errors[`${prefix}question`] && (
                          <Typography
                            variant="subtitle2"
                            className="error_message"
                          >
                            {errors.name.message[lang]}
                          </Typography>
                        )}
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle1" color={"secondary"}>
                          {strings.imgQuestion}
                        </Typography>
                        <Controller
                          name={`${prefix}questionImage`}
                          control={control}
                          defaultValue={{ imgUrl: "", file: "" }}
                          render={({ field, fieldState: { error } }) => (
                            <>
                              <ImgUpload
                                name={`${prefix}questionImage`}
                                label={strings.uploadImage}
                                register={register}
                                changeHandel={async (e) => {
                                  field.onChange(await handleUploadImgLocal(e));
                                }}
                                deleteImgHandel={() => {
                                  field.onChange({ imgUrl: "", file: "" });
                                }}
                                value={field.value}
                              />
                              {error && (
                                <Typography
                                  variant="subtitle2"
                                  className="error_message"
                                >
                                  {error?.imgUrl?.message[lang]}
                                </Typography>
                              )}
                            </>
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}></Grid>

                      {questionTypeList[idx] === "MCQ" ? (
                        <>
                          <Grid item xs={12} md={3} textAlign={"center"}>
                            <Typography variant="subtitle1" color={"secondary"}>
                              {strings.imageConatainer}-{strings.choice_1}
                            </Typography>
                            <Controller
                              name={`${prefix}choice_1Image`}
                              control={control}
                              defaultValue={{ imgUrl: "", file: "" }}
                              render={({ field, fieldState: { error } }) => (
                                <>
                                  <ImgUpload
                                    name={`${prefix}choice_1Image`}
                                    label={strings.uploadImage}
                                    register={register}
                                    changeHandel={async (e) => {
                                      field.onChange(
                                        await handleUploadImgLocal(e)
                                      );
                                    }}
                                    deleteImgHandel={() => {
                                      field.onChange({ imgUrl: "", file: "" });
                                    }}
                                    value={field.value}
                                  />
                                  {error && (
                                    <Typography
                                      variant="subtitle2"
                                      className="error_message"
                                    >
                                      {error?.imgUrl?.message[lang]}
                                    </Typography>
                                  )}
                                </>
                              )}
                            />
                          </Grid>
                          <Grid item xs={12} md={3} textAlign={"center"}>
                            <Typography variant="subtitle1" color={"secondary"}>
                              {strings.imageConatainer}-{strings.choice_2}
                            </Typography>
                            <Controller
                              name={`${prefix}choice_2Image`}
                              control={control}
                              defaultValue={{ imgUrl: "", file: "" }}
                              render={({ field, fieldState: { error } }) => (
                                <>
                                  <ImgUpload
                                    name={`${prefix}choice_2Image`}
                                    label={strings.uploadImage}
                                    register={register}
                                    changeHandel={async (e) => {
                                      field.onChange(
                                        await handleUploadImgLocal(e)
                                      );
                                    }}
                                    deleteImgHandel={() => {
                                      field.onChange({ imgUrl: "", file: "" });
                                    }}
                                    value={field.value}
                                  />
                                  {error && (
                                    <Typography
                                      variant="subtitle2"
                                      className="error_message"
                                    >
                                      {error?.imgUrl?.message[lang]}
                                    </Typography>
                                  )}
                                </>
                              )}
                            />
                          </Grid>
                          <Grid item xs={12} md={3} textAlign={"center"}>
                            <Typography variant="subtitle1" color={"secondary"}>
                              {strings.imageConatainer}-{strings.choice_3}
                            </Typography>
                            <Controller
                              name={`${prefix}choice_3Image`}
                              control={control}
                              defaultValue={{ imgUrl: "", file: "" }}
                              render={({ field, fieldState: { error } }) => (
                                <>
                                  <ImgUpload
                                    name={`${prefix}choice_3Image`}
                                    label={strings.uploadImage}
                                    register={register}
                                    changeHandel={async (e) => {
                                      field.onChange(
                                        await handleUploadImgLocal(e)
                                      );
                                    }}
                                    deleteImgHandel={() => {
                                      field.onChange({ imgUrl: "", file: "" });
                                    }}
                                    value={field.value}
                                  />
                                  {error && (
                                    <Typography
                                      variant="subtitle2"
                                      className="error_message"
                                    >
                                      {error?.imgUrl?.message[lang]}
                                    </Typography>
                                  )}
                                </>
                              )}
                            />
                          </Grid>
                          <Grid item xs={12} md={3} textAlign={"center"}>
                            <Typography variant="subtitle1" color={"secondary"}>
                              {strings.imageConatainer}-{strings.choice_4}
                            </Typography>
                            <Controller
                              name={`${prefix}choice_4Image`}
                              control={control}
                              defaultValue={{ imgUrl: "", file: "" }}
                              render={({ field, fieldState: { error } }) => (
                                <>
                                  <ImgUpload
                                    name={`${prefix}choice_4Image`}
                                    label={strings.uploadImage}
                                    register={register}
                                    changeHandel={async (e) => {
                                      field.onChange(
                                        await handleUploadImgLocal(e)
                                      );
                                    }}
                                    deleteImgHandel={() => {
                                      field.onChange({ imgUrl: "", file: "" });
                                    }}
                                    value={field.value}
                                  />
                                  {error && (
                                    <Typography
                                      variant="subtitle2"
                                      className="error_message"
                                    >
                                      {error?.imgUrl?.message[lang]}
                                    </Typography>
                                  )}
                                </>
                              )}
                            />
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <TextField
                              InputLabelProps={{ shrink: true }}
                              label={strings.choice_1}
                              placeholder={strings.choice_1}
                              fullWidth
                              error={Boolean(errors[`${prefix}choice_1`])}
                              disabled={!!selected}
                              {...register(`${prefix}choice_1`)}
                            />
                            {errors[`${prefix}choice_1`] && (
                              <Typography
                                variant="subtitle2"
                                className="error_message"
                              >
                                {errors.name.message[lang]}
                              </Typography>
                            )}
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <TextField
                              InputLabelProps={{ shrink: true }}
                              label={strings.choice_2}
                              placeholder={strings.choice_2}
                              fullWidth
                              error={Boolean(errors[`${prefix}choice_2`])}
                              disabled={!!selected}
                              {...register(`${prefix}choice_2`)}
                            />
                            {errors[`${prefix}choice_2`] && (
                              <Typography
                                variant="subtitle2"
                                className="error_message"
                              >
                                {errors.name.message[lang]}
                              </Typography>
                            )}
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <TextField
                              InputLabelProps={{ shrink: true }}
                              label={strings.choice_3}
                              placeholder={strings.choice_3}
                              fullWidth
                              error={Boolean(errors[`${prefix}choice_3`])}
                              disabled={!!selected}
                              {...register(`${prefix}choice_3`)}
                            />
                            {errors[`${prefix}choice_3`] && (
                              <Typography
                                variant="subtitle2"
                                className="error_message"
                              >
                                {errors.name.message[lang]}
                              </Typography>
                            )}
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <TextField
                              InputLabelProps={{ shrink: true }}
                              label={strings.choice_4}
                              placeholder={strings.choice_4}
                              fullWidth
                              error={Boolean(errors[`${prefix}choice_4`])}
                              disabled={!!selected}
                              {...register(`${prefix}choice_4`)}
                            />
                            {errors[`${prefix}choice_4`] && (
                              <Typography
                                variant="subtitle2"
                                className="error_message"
                              >
                                {errors.name.message[lang]}
                              </Typography>
                            )}
                          </Grid>
                        </>
                      ) : null}
                      {questionTypeList[idx] === "TRUE_FALSE" ? (
                        <Grid item xs={12} md={3}>
                          <Controller
                            name={`${prefix}trueFalseAnswer`}
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <FormControl fullWidth>
                                <InputLabel id="add-trueFalse-Answer">
                                  {strings.trueFalseAnswer}
                                </InputLabel>
                                <MuiSelect
                                  fullWidth
                                  labelId="add-trueFalse-Answer"
                                  id="select-add-trueFalse-Answer"
                                  label={strings.trueFalseAnswer}
                                  error={Boolean(error)}
                                  onChange={(e) => {
                                    field.onChange(e);
                                  }}
                                  onBlur={field.onBlur}
                                  value={field.value}
                                  inputRef={field.ref}
                                  name={field.name}
                                >
                                  {trueFalseAnswer?.map((answer) => (
                                    <MenuItem value={answer.id} key={answer.id}>
                                      {answer.name[lang]}
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
                      ) : null}
                      {questionTypeList[idx] === "MCQ" ? (
                        <Grid item xs={12} md={3}>
                          <Controller
                            name={`${prefix}correctOption`}
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <FormControl fullWidth>
                                <InputLabel id="add-correctOption-Answer">
                                  {strings.correctAnswer}
                                </InputLabel>
                                <MuiSelect
                                  fullWidth
                                  labelId="add-correctOption-Answer"
                                  id="select-add-correctOption-Answer"
                                  label={strings.correctAnswer}
                                  error={Boolean(error)}
                                  onChange={(e) => {
                                    field.onChange(e);
                                  }}
                                  onBlur={field.onBlur}
                                  value={field.value}
                                  inputRef={field.ref}
                                  name={field.name}
                                >
                                  {chooseAnswer?.map((answer) => (
                                    <MenuItem value={answer.id} key={answer.id}>
                                      {answer.name[lang]}
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
                      ) : null}

                      {/* {questionTypeList[idx] === "TEXT" ? ( */}
                      <Grid item xs={12} md={12}>
                        <TextField
                          InputLabelProps={{ shrink: true }}
                          label={strings.correctAnswer}
                          placeholder={strings.correctAnswer}
                          fullWidth
                          multiline
                          rows={4}
                          error={Boolean(errors[`${prefix}correctAnswer`])}
                          disabled={!!selected}
                          {...register(`${prefix}correctAnswer`)}
                        />
                        {errors[`${prefix}correctAnswer`] && (
                          <Typography
                            variant="subtitle2"
                            className="error_message"
                          >
                            {errors.name.message[lang]}
                          </Typography>
                        )}
                      </Grid>
                      {/* ) : null} */}
                    </>
                  ) : null}
                  {/* {questionsInput.fields.length - 1 === idx && (
                    <Grid item xs={12}>
                      <Button
                        type="button"
                        onClick={() => questionsInput.append({})}
                        variant="outlined"
                        sx={{
                          marginInline: "auto",
                          mt: "1rem",
                          display: "block",
                        }}
                      >
                        {strings.addQuestion}
                      </Button>
                    </Grid>
                  )} */}
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

export default EditQuestionBank;
