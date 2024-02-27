import { DayPicker } from "react-day-picker";
import { Controller } from "react-hook-form";
import { arEG, enUS } from "date-fns/locale";

import Box from "@mui/material/Box";
import { makeStyles } from "@mui/styles";

import styles from "./styles";
import "react-day-picker/dist/style.css";

const useStyles = makeStyles(styles);

const DayPickerComponent = ({
  togglePicker,
  isOpen,
  lang,
  name,
  control,
  mode = "single",
}) => {
  const classes = useStyles();

  // FIXME: This code is not working, it's not closing the date picker when clicking outside it

  return (
    <Box
      className={`${classes.dateContainer} ${
        isOpen ? classes.open : classes.close
      }`}
    >
      <Controller
        name={name}
        control={control}
        render={({ field: { value, onChange } }) => (
          <DayPicker
            mode={mode}
            selected={value}
            onSelect={onChange}
            locale={lang === "ar" ? arEG : enUS}
            onDayClick={togglePicker}
          />
        )}
      />
    </Box>
  );
};

export default DayPickerComponent;
