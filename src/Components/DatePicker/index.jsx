import React from "react";
import { Controller } from "react-hook-form";

import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const DatePickerComponent = ({ name, control, label, fullWidth, ...props }) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={new Date()}
      render={({ field: { value, onChange } }) => (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label={label}
            value={value}
            onChange={onChange}
            renderInput={(params) => (
              <TextField {...params} fullWidth={fullWidth} />
            )}
            {...props}
          />
        </LocalizationProvider>
      )}
    />
  );
};

export default DatePickerComponent;
