import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { DataGrid, getGridStringOperators } from "@mui/x-data-grid";
import { makeStyles } from "@mui/styles";
import { IconButton, Box, Button, Switch } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

import CustomToolbar from "Components/DataGrid/Toolbar";
import NoData from "Components/DataGrid/NoData";
import DeleteModal from "Components/Modal/DeleteModal";

import { userServices, admin as adminServices } from "Services";
import useQueryService from "Hooks/useQueryService";
import strings from "Assets/Local/Local";
import { routePath } from "AppConstants";
import styles from "CommonStyles/ViewStyles";

const rowsPerPageOptions = [5, 10, 20, 25, 50, 100];
const accessor = {
  code: "code",
  name: "name",
  email: "email",
  phone: "phone",
};
const useStyles = makeStyles(styles);

const ViewStudents = () => {
  const [selectedUserId, setSelectedUserId] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [pageSize, setPageSize] = useState(rowsPerPageOptions[1]);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const navigate = useNavigate();
  const classes = useStyles();

  const {
    data: usersData,
    isLoading: isLoadingUsers,
    isError,
    error,
    refetch: refetchUsers,
  } = useQueryService({
    key: ["userServices.getUsers", { type: "STUDENT" }],
    fetcher: () => userServices.getAllUsers({ type: "STUDENT" }),
  });

  if (isError) {
    toast.error(error?.message);
  }

  const handleDeleteUser = async () => {
    setDeleteLoading(true);
    try {
      await adminServices.adminDeleteUser({ userId: selectedUserId });
      toast.success(strings.deleteSuccess);
      refetchUsers();
    } catch (error) {
      console.log(error);
    } finally {
      setDeleteLoading(false);
      setOpenModal(false);
    }
  };
  const handleUserState = async (userId, status) => {
    console.log("status", status);
    const data = {
      activated: status,
      userId: userId,
    };
    try {
      await adminServices.changeUserStatus(data);
      refetchUsers();
      toast.success(strings.statusChangedSuccessfully);
    } catch (error) {
      console.log(error);
    }
  };
  console.log("users", usersData);
  return (
    <>
      <DeleteModal
        openDeleteModal={openModal}
        deleteTitle={strings.deleteConfirm}
        handleClose={() => setOpenModal(false)}
        handleDelete={handleDeleteUser}
        loading={deleteLoading}
      />
      <Box>
        <Button
          className={classes.addButton}
          endIcon={<AddIcon />}
          onClick={() => navigate(`${routePath}teachers/add`)}
          variant="contained"
        >
          {strings.addStudent}
        </Button>
        <DataGrid
          pagination
          autoHeight
          disableRowSelectionOnClick
          rowsPerPageOptions={rowsPerPageOptions}
          loading={isLoadingUsers}
          pageSize={pageSize}
          onPageSizeChange={({ pageSize: newPageSize }) =>
            setPageSize(newPageSize)
          }
          columns={[
            {
              headerName: strings.code,
              field: accessor.code,
              flex: 0.8,
              minWidth: 150,
              type: "string",
            },
            {
              headerName: strings.name,
              field: accessor.name,
              flex: 0.8,
              minWidth: 150,
              type: "string",
            },

            {
              headerName: strings.email,
              field: accessor.email,
              flex: 0.8,
              minWidth: 150,
              type: "string",
            },
            {
              headerName: strings.phone,
              field: accessor.phone,
              flex: 0.8,
              minWidth: 120,
              type: "string",
            },
            {
              headerName: strings.actions,
              field: "actions",
              flex: 1,
              minWidth: 150,
              type: "string",
              filterable: false,
              sortable: false,
              renderCell: (params) => (
                <Box className={classes.actionsContainer}>
                  <IconButton
                    className={classes.viewButton}
                    onClick={() =>
                      navigate(`${routePath}teachers/view/${params.id}`)
                    }
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    className={classes.editButton}
                    onClick={() =>
                      navigate(`${routePath}teachers/edit/${params.id}`)
                    }
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    className={classes.deleteButton}
                    onClick={() => {
                      setSelectedUserId(params.id);
                      setOpenModal(true);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ),
            },
          ]}
          rows={
            usersData?.map((user) => ({
              id: user.id,
              [accessor.code]: user.code,
              [accessor.name]: user.name,
              [accessor.email]: user.email,
              [accessor.phone]: user.phone,
              activated: user.activated,
            })) || []
          }
          columnTypes={{
            string: {
              filterOperators: getGridStringOperators().filter((operator) => {
                return operator.value === "contains";
              }),
            },
          }}
          components={{
            Toolbar: CustomToolbar,
            NoRowsOverlay: NoData,
          }}
          localeText={{
            toolbarColumns: strings.Columns,
            toolbarFilters: strings.Filters,
            toolbarDensity: strings.Density,
            columnsPanelTextFieldLabel: strings.FindColumn,
            columnsPanelShowAllButton: strings.ShowAll,
            columnsPanelHideAllButton: strings.HideAll,
            checkboxSelectionHeaderName: strings.CheckboxSelection,
            columnsPanelTextFieldPlaceholder: strings.ColumnTitle,
            filterPanelInputPlaceholder: strings.FilterValue,
            filterPanelColumns: strings.Columns,
            filterPanelInputLabel: strings.Value,
            filterOperatorContains: strings.Contains,
          }}
          componentsProps={{
            pagination: {
              labelRowsPerPage: strings.RowsPerPage,
            },
          }}
        />
      </Box>
    </>
  );
};

export default ViewStudents;
