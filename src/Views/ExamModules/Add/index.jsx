import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { Grid, Typography, Stepper, Step, StepLabel } from "@mui/material";
import { makeStyles } from "@mui/styles";

import strings from "Assets/Local/Local";
import useQueryService from "Hooks/useQueryService";
import { bankQuestionServices, examModuleServices } from "Services";
import { EXAM_DETAILS, QUESTION_BANK, routePath } from "AppConstants";
import ExamDetails from "./ExamDetails";
import QuestionBank from "./QuestionBank";
import Summary from "./Summary";
import styles from "CommonStyles/AddStyles";

const useStyles = makeStyles(styles);

const AddExamModule = () => {
  const location = useLocation();
  const activeStepFromSearchQuery = useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get("activeStep");
  }, [location.search]);

  const defaultQuestionBank = useMemo(() => {
    return localStorage.getItem(QUESTION_BANK)
      ? JSON.parse(localStorage.getItem(QUESTION_BANK))
      : [];
  }, [localStorage.getItem(QUESTION_BANK)]);

  const [activeStep, setActiveStep] = useState(+activeStepFromSearchQuery || 1);
  const [selectedQuestions, setSelectedQuestion] = useState(
    defaultQuestionBank ?? []
  );
  const [loading, setLoading] = useState(false);

  const classes = useStyles();
  const navigate = useNavigate();

  const subjectId = useMemo(() => {
    const examDetails = localStorage.getItem(EXAM_DETAILS);
    if (examDetails) {
      return JSON.parse(examDetails).subject;
    }
    return null;
  }, [localStorage.getItem(EXAM_DETAILS)]);

  const { data: questions } = useQueryService({
    key: ["bankQuestionServices.getAll", { subject: subjectId, all: true }],
    fetcher: () =>
      bankQuestionServices.getAll({ subject: subjectId, all: true }),
    enabled: !!subjectId,
  });

  const handleExamDetails = (values) => {
    localStorage.setItem(EXAM_DETAILS, JSON.stringify(values));
    setActiveStep((prevState) => prevState + 1);
  };

  const handleQuestionBank = () => {
    localStorage.setItem(QUESTION_BANK, JSON.stringify(selectedQuestions));
    setActiveStep((prevState) => prevState + 1);
  };
  const handleBack = () => {
    setActiveStep((prevState) => prevState - 1);
  };

  const handelAddExamModule = async () => {
    try {
      setLoading(true);
      const examDetails = JSON.parse(localStorage.getItem(EXAM_DETAILS));
      const questions = JSON.parse(localStorage.getItem(QUESTION_BANK));
      const payload = {
        ...examDetails,
        questions: questions.map((question) => question.id),
      };
      await examModuleServices.createExamModule(payload);
      localStorage.removeItem(EXAM_DETAILS);
      localStorage.removeItem(QUESTION_BANK);
      setLoading(false);
      navigate(`${routePath}exam-modules`);
    } catch (error) {
      setLoading(false);
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeStep) {
      navigate(`${routePath}exam-modules/add?activeStep=${activeStep}`);
    }
  }, [activeStep]);

  return (
    <Grid container classes={{ root: classes.wrapper }} spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h5">{strings.addNewExam}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Stepper activeStep={activeStep}>
          <Step>
            <StepLabel>{strings.fillExamDetails}</StepLabel>
          </Step>
          <Step>
            <StepLabel>{strings.selectQuestions}</StepLabel>
          </Step>
          <Step>
            <StepLabel>{strings.summary}</StepLabel>
          </Step>
        </Stepper>
      </Grid>
      {activeStep === 1 && (
        <ExamDetails handleExamDetails={handleExamDetails} />
      )}
      {activeStep === 2 && (
        <QuestionBank
          handleQuestionBank={handleQuestionBank}
          handleBack={handleBack}
          questions={questions?.data ?? []}
          selectedQuestions={selectedQuestions}
          setSelectedQuestion={setSelectedQuestion}
        />
      )}
      {activeStep === 3 && (
        <Summary
          selectedQuestions={selectedQuestions}
          setSelectedQuestion={setSelectedQuestion}
          handleBack={handleBack}
          handelSubmit={handelAddExamModule}
          loading={loading}
        />
      )}
    </Grid>
  );
};

export default AddExamModule;
