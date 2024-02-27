import React, { useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { DataGrid, getGridStringOperators } from "@mui/x-data-grid";
import { makeStyles } from "@mui/styles";
import { IconButton, Box, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

import CustomToolbar from "Components/DataGrid/Toolbar";
import NoData from "Components/DataGrid/NoData";
import DeleteModal from "Components/Modal/DeleteModal";

import lessonServices from "Services/lesson";
import useQueryService from "Hooks/useQueryService";
import strings from "Assets/Local/Local";
import { routePath } from "AppConstants";
import styles from "CommonStyles/ViewStyles";

const rowsPerPageOptions = [5, 10, 20, 25, 50, 100];
const accessor = {
  name: "name",
  number: "number",
};
const useStyles = makeStyles(styles);

const ViewLessons = () => {
  const [selectedRow, setSelectedRow] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [pageSize, setPageSize] = useState(rowsPerPageOptions[1]);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const classes = useStyles();

  const {
    data: rows,
    isLoading: isLoadingRows,
    error,
    refetch: refetchRows,
  } = useQueryService({
    key: ["lessonServices.getAll"],
    fetcher: () => lessonServices.getAll(),
    onError: (err) => toast.error(error?.message),
  });

  const handleDeleteUser = async () => {
    setDeleteLoading(true);
    try {
      await lessonServices.deleteById(selectedRow);
      toast.success(strings.deleteSuccess);
      refetchRows();
    } catch (error) {
      console.log(error);
    } finally {
      setDeleteLoading(false);
      setOpenModal(false);
    }
  };
  console.log("data", rows);
  return (
    <Box>
      <DeleteModal
        openDeleteModal={openModal}
        deleteTitle={strings.deleteConfirm}
        handleClose={() => setOpenModal(false)}
        handleDelete={handleDeleteUser}
        loading={deleteLoading}
      />
      <Button
        className={classes.addButton}
        endIcon={<AddIcon />}
        LinkComponent={Link}
        to={`${routePath}lessons/add`}
        variant="contained"
      >
        {strings.addLesson}
      </Button>
      <DataGrid
        pagination
        autoHeight
        disableRowSelectionOnClick
        rowsPerPageOptions={rowsPerPageOptions}
        loading={isLoadingRows}
        pageSize={pageSize}
        onPageSizeChange={({ pageSize: newPageSize }) =>
          setPageSize(newPageSize)
        }
        columns={[
          {
            headerName: "#",
            field: accessor.number,
            flex: 0.8,
            minWidth: 120,
            type: "number",
          },
          {
            headerName: strings.name,
            field: accessor.name,
            flex: 0.8,
            minWidth: 150,
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
                  className={classes.editButton}
                  LinkComponent={Link}
                  to={`${routePath}lessons/edit/${params.id}`}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  className={classes.deleteButton}
                  onClick={() => {
                    setSelectedRow(params.id);
                    setOpenModal(true);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ),
          },
        ]}
        rows={rows ?? []}
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
  );
};

export default ViewLessons;
