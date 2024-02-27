import React, { useState, useContext } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import {
  Button,
  Grid,
  Typography,
  TextField,
} from "@mui/material";
import payementCodeServices from "Services/paymentCode";
import strings from "Assets/Local/Local";
import { LangContext } from "App";
import { routePath } from "AppConstants";
import Validation from "./validations";
import styles from "CommonStyles/AddStyles";



const useStyles = makeStyles(styles);

const AddPaymentCode = () => {
  const [loading, setLoading] = useState(false);
  const { lang } = useContext(LangContext);
  const navigate = useNavigate();
  const classes = useStyles();
 

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setError,
    setValue,
  } = useForm({
    resolver: yupResolver(Validation),
    mode: "all",
  });

  const handleAdd = async (values) => {
    setLoading(true);
    try {
      const result = await payementCodeServices.add(values);
      navigate(`${routePath}payment-Code`);
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

  console.log(errors);
  return (
    <Grid
      container
      classes={{ root: classes.wrapper }}
      component="form"
      onSubmit={handleSubmit(handleAdd)}
      spacing={3}
    >
      <Grid item xs={12}>
        <Typography variant="h5">{strings.addpaymentCode}</Typography>
      </Grid>
      <Grid item md={6} xs={12}>
        <div>
          <TextField
            label={strings.amount}
            placeholder={strings.amount}
            fullWidth
            error={Boolean(errors.amount)}
            {...register("amount")}
          />
          {errors.amount && (
            <Typography variant="subtitle2" className="error_message">
              {errors.amount.message[lang]}
            </Typography>
          )}
        </div>
      </Grid>
      <Grid item md={6} xs={12}>
        <div>
          <TextField
            label={strings.count}
            placeholder={strings.count}
            fullWidth
            error={Boolean(errors.count)}
            {...register("count")}
          />
          {errors.count && (
            <Typography variant="subtitle2" className="error_message">
              {errors.count.message[lang]}
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

export default AddPaymentCode;
