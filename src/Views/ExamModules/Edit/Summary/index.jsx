import { Fragment, useMemo } from "react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import strings from "Assets/Local/Local";
import { EXAM_DETAILS } from "AppConstants";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
} from "@mui/material";
// FIXME: Ad type MCQ  and handle it in questionFormatter
const QUESTION_TYPES = {
  TEXT: "TEXT",
  TRUE_FALSE: "TRUE_FALSE",
};
const questionFormatter = (question) => {
  switch (question.type) {
    case QUESTION_TYPES.TEXT:
      return <Typography>{question.correctAnswer}</Typography>;
    case QUESTION_TYPES.TRUE_FALSE:
      return (
        <Typography>{strings[`${question.trueFalseAnswer}-answer`]}</Typography>
      );
    default:
      return <Typography>{""}</Typography>;
  }
};

const Summary = ({
  selectedQuestions,
  setSelectedQuestion,
  handleBack,
  handelSubmit,
  loading,
}) => {
  const examDetails = localStorage.getItem(EXAM_DETAILS)
    ? JSON.parse(localStorage.getItem(EXAM_DETAILS))
    : null;

  const calculateCountOfGrade = useMemo(() => {
    const gradesTypes = {
      firstGrade: 0,
      secondGrade: 0,
      thirdGrade: 0,
      fourthGrade: 0,
    };
    selectedQuestions.forEach((question) => {
      switch (question.difficultyLevel) {
        case 1:
          gradesTypes.firstGrade += 1;
          break;
        case 2:
          gradesTypes.secondGrade += 1;
          break;
        case 3:
          gradesTypes.thirdGrade += 1;
          break;
        case 4:
          gradesTypes.fourthGrade += 1;
          break;
        default:
          break;
      }
    });
    return gradesTypes;
  }, [selectedQuestions]);

  const totalGrades = useMemo(() => {
    if (!examDetails) return 0;
    const _totalGrades =
      calculateCountOfGrade.firstGrade * examDetails.firstGrade +
      calculateCountOfGrade.secondGrade * examDetails.secondGrade +
      calculateCountOfGrade.thirdGrade * examDetails.thirdGrade +
      calculateCountOfGrade.fourthGrade * examDetails.fourthGrade;
    return _totalGrades;
  }, [calculateCountOfGrade, examDetails]);

  const handleQuestionChange = (e, question) => {
    if (e.target.checked) {
      setSelectedQuestion((prevState) => [...prevState, question]);
    } else {
      setSelectedQuestion((prevState) =>
        prevState.filter((item) => item.id !== question.id)
      );
    }
  };
  return (
    <Grid item container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h5" textAlign={"center"}>
          {strings.summary}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography
          variant="subtitle1"
          textAlign={"center"}
          color="text.primary"
        >
          {strings.examName}: {examDetails.name}
        </Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <Typography variant="body1" color="text.info">
          {strings.examQuestions}: {selectedQuestions.length}
        </Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <Typography variant="body1" color="text.info">
          {strings.totalGrades}: {totalGrades}
        </Typography>
      </Grid>
      {Object.keys(calculateCountOfGrade).map((key) => (
        <Grid item xs={6} md={3} key={key}>
          <Typography variant="body1" color="text.info">
            {strings[key]}: {calculateCountOfGrade[key]}
          </Typography>
        </Grid>
      ))}
      <Grid item xs={12}>
        {selectedQuestions?.map((question) => (
          <Fragment key={question.id}>
            <Typography
              variant="subtitle1"
              color="primary"
              sx={{ margin: "25px 15px 5px " }}
            >
              {strings.level}: {question.difficultyLevel ?? ""}
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                marginBottom: "10px",
              }}
            >
              <Checkbox
                onChange={(e) => handleQuestionChange(e, question)}
                checked={selectedQuestions.some(
                  (item) => item.id === question.id
                )}
                name="questions"
                color="primary"
                size="medium"
              />
              <Accordion key={question.id} sx={{ flex: "1 1" }}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`question-${question.id}-content`}
                  id={`panel1a-header-${question.id}`}
                >
                  <Typography>{question.name}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {questionFormatter(question)}
                </AccordionDetails>
              </Accordion>
            </Box>
          </Fragment>
        ))}
      </Grid>
      <Grid
        item
        xs={12}
        sx={{ display: "flex", alignItems: "center", gap: "15px" }}
      >
        <Button variant="outlined" color="secondary" onClick={handleBack}>
          {strings.back}
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handelSubmit}
          disabled={loading}
        >
          {loading ? strings.loading : strings.submit}
        </Button>
      </Grid>
    </Grid>
  );
};

export default Summary;
