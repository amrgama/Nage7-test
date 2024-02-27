import { Controller } from "react-hook-form";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";

const ControlSelect = ({
  name,
  control,
  defaultValue = "",
  formControl,
  inputLabel,
  labelId,
  children,
  ...props
}) => {
  return (
    <Controller
      defaultValue={defaultValue}
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl
          error={!!error}
          fullWidth={!!props.fullWidth}
          {...formControl}
        >
          {props.label ? (
            <InputLabel {...inputLabel} id={labelId || name}>
              {props.label}
            </InputLabel>
          ) : null}
          <Select
            name={field.name}
            onBlur={field.onBlur}
            onChange={field.onChange}
            inputRef={field.ref}
            value={field.value}
            labelId={labelId || name}
            {...props}
          >
            {children}
          </Select>
        </FormControl>
      )}
    />
  );
};
export default ControlSelect;
