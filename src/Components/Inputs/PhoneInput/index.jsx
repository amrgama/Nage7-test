import { Controller } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import Box from "@mui/material/Box";
import { makeStyles } from "@mui/styles";

import "react-phone-input-2/lib/style.css";
import styles from "./styles";

const useStyles = makeStyles(styles);

const PhoneInputControlled = ({ name, control, handleCountryCode }) => {
  const classes = useStyles();

  return (
    <Box className={classes.phoneContainer}>
      <Controller
        name={name}
        control={control}
        render={({ field: { value, onChange } }) => (
          <PhoneInput
            specialLabel={" "}
            value={value}
            onChange={(phone, data) => {
              handleCountryCode({
                countryCode: data.countryCode,
                dialCode: data.dialCode,
              });
              onChange(phone);
            }}
            country="eg"
            className="phoneinput__wrapper"
            inputClass={"phoneinput"}
          />
        )}
      />
    </Box>
  );
};

export default PhoneInputControlled;
