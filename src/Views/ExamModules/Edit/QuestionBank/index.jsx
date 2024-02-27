import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import strings from "Assets/Local/Local";
import Box from "@mui/material/Box";

import { routePath } from "AppConstants";
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

const QuestionBank = ({
  handleQuestionBank,
  handleBack,
  questions,
  selectedQuestions,
  setSelectedQuestion,
}) => {
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleQuestionChange = (e, question) => {
    if (e.target.checked) {
      setSelectedQuestion((prevState) => [...prevState, question]);
    } else {
      setSelectedQuestion((prevState) =>
        prevState.filter((item) => item.id !== question.id)
      );
    }
  };
  const handleForward = () => {
    if (selectedQuestions.length === 0) {
      setErrorMessage(strings.noQuestionsSelected);
      return;
    }
    handleQuestionBank();
  };
  return (
    <Grid item container spacing={3}>
      <Grid
        item
        xs={12}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6">{strings.selectQuestions}</Typography>
        <Button
          variant="contained"
          onClick={() =>
            navigate(`${routePath}bank-Question/add?examModule=true`)
          }
        >
          {strings.addNewQuestion}
        </Button>
      </Grid>
      <Grid item xs={12}>
        {questions?.map((question) => (
          <div key={question}>
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
          </div>
        ))}
      </Grid>
      {errorMessage ? (
        <Grid item xs={12}>
          <Typography variant="subtitle2" className="error_message">
            {errorMessage}
          </Typography>
        </Grid>
      ) : null}
      <Grid
        item
        xs={12}
        sx={{ display: "flex", gap: "15px", alignItems: "center" }}
      >
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleBack}
          size="large"
        >
          {strings.back}
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleForward}
        >
          {strings.next}
        </Button>
      </Grid>
    </Grid>
  );
};

export default QuestionBank;
