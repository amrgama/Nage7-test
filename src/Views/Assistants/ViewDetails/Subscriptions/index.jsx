import { useState, useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import * as yup from "yup";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";

import AddIcon from "@mui/icons-material/Add";
import WarningIcon from "@mui/icons-material/Warning";
import EditIcon from "@mui/icons-material/Edit";

import { useTheme } from "@mui/material/styles";
import Select from "Components/Inputs/Select";
import { LangContext } from "App";
import { subscriptionServices } from "Services";
import useQueryService from "Hooks/useQueryService";
import strings from "Assets/Local/Local";
import styles from "../styles";

const validationSchema = yup.object().shape({
  subscription: yup.object().required(strings.subscriptionRequired),
});

const localizePayment = (payment) => {
  switch (payment) {
    case "CASH":
      return strings.cash;
    case "VISA":
      return strings.visa;
    case "MASTER":
      return strings.master;
    default:
      return payment;
  }
};
const Subscriptions = ({ user, refetchUser }) => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const theme = useTheme();
  const classes = styles(theme);
  const { lang } = useContext(LangContext);

  const { data: subscriptionsData } = useQueryService({
    key: ["subscriptionServices.getSubscriptions"],
    fetcher: () => subscriptionServices.getSubscriptions(),
  });
  const {
    handleSubmit,
    formState: { errors },
    control,
    reset,
    setValue,
  } = useForm({
    mode: "all",
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (values) => {
    setIsLoading(true);
    const data = {
      paymentType: values.subscription.paymentType,
      package: values.subscription.package,
      selectedPlan: values.subscription.selectedPlan,
      teacher: user.id,
    };
    try {
      await subscriptionServices.adminAssignSubscription(data);
      setIsLoading(false);
      refetchUser();
      setIsAddOpen(false);
      toast.success(strings.addedSubscriptionSuccessfully);
      reset();
    } catch (error) {
      setIsLoading(false);
      console.log("error", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (user?.subscription) {
      setValue("subscription", user.subscription);
    }
  }, [user]);
  return (
    <>
      <Dialog
        open={isAddOpen}
        onClose={() => {
          reset();
          setIsAddOpen(false);
        }}
        maxWidth="md"
        fullWidth
      >
        <Box sx={classes.selectDialog}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Typography variant="h6" textAlign={"center"}>
              {strings.selectSubscription}
            </Typography>
            <Select
              name={"subscription"}
              control={control}
              labelId={"assign-subscription"}
              label={strings.selectSubscription}
              fullWidth
              errors={Boolean(errors.subscription)}
            >
              {subscriptionsData?.length ? (
                subscriptionsData.map((subscription) => (
                  <MenuItem value={subscription} key={subscription.id}>
                    {subscription.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value={""}>{strings.noSubscriptions}</MenuItem>
              )}
            </Select>
            {errors.subscription ? (
              <Typography variant="caption" color="error">
                {errors.subscription.message[lang]}
              </Typography>
            ) : null}
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? strings.loading : strings.add}
            </Button>
          </form>
        </Box>
      </Dialog>
      <Grid
        container
        component="section"
        spacing={3}
        sx={classes.documentsContainer}
      >
        {user?.subscription ? (
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="subscriptions table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">{strings.name}</TableCell>
                  <TableCell align="center">{strings.selectedPlan}</TableCell>
                  <TableCell align="center">{strings.price}</TableCell>
                  <TableCell align="center">{strings.paymentType}</TableCell>
                  <TableCell align="center">{strings.features}</TableCell>
                  <TableCell align="center">
                    {strings.subscriptionEndDate}
                  </TableCell>
                  <TableCell align="center">{strings.actions}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell align="center">
                    {user?.subscription.name}
                  </TableCell>
                  <TableCell align="center">
                    {user?.subscription.selectedPlan}
                  </TableCell>
                  <TableCell align="center">
                    {user?.subscription.price}
                  </TableCell>
                  <TableCell align="center">
                    {localizePayment(user?.subscription.paymentType)}
                  </TableCell>
                  <TableCell align="center">
                    {user?.subscription.features.join(",")}
                  </TableCell>
                  <TableCell align="center">
                    {format(
                      new Date(user?.subscription.subscriptionEndDate),
                      "dd/MM/yyyy"
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      onClick={() => setIsAddOpen(true)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setIsAddOpen(true)}
            >
              {strings.addSubscriptions}
            </Button>
            <Typography
              variant="h6"
              textAlign={"center"}
              color="error"
              sx={classes.warningText}
            >
              <WarningIcon /> {strings.thereIsNoSubscriptions}
            </Typography>
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default Subscriptions;
