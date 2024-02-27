import React, { useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { DataGrid, getGridStringOperators } from "@mui/x-data-grid";
import { makeStyles } from "@mui/styles";
import { IconButton, Box, Button } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

import CustomToolbar from "Components/DataGrid/Toolbar";
import NoData from "Components/DataGrid/NoData";
import DeleteModal from "Components/Modal/DeleteModal";

import studentServices from "Services/student";
import useQueryService from "Hooks/useQueryService";
import strings from "Assets/Local/Local";
import { routePath } from "AppConstants";
import styles from "CommonStyles/ViewStyles";
import PhoneField from "Components/PhoneField";
import dayjs from "dayjs";

const rowsPerPageOptions = [5, 10, 20, 25, 50, 100];
const accessor = {
  name: "name",
  phone: "phone",
  parentNumber: "parentNumber",
  gender: "gender",
  schoolName: "schoolName",
  level: "level",
  birthDate: "birthDate",
};
const useStyles = makeStyles(styles);

const ViewStudents = () => {
  const [selectedRow, setSelectedRow] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(rowsPerPageOptions[0]);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const classes = useStyles();

  const {
    data: tableData,
    isLoading: isLoadingData,
    error,
    refetch: refetchData,
  } = useQueryService({
    key: ["studentServices.getAll", { page, limit: pageSize }],
    fetcher: () => studentServices.getAll({ page, limit: pageSize }),
    onError: (err) => toast.error(error?.message),
  });

  const handleDeleteRow = async () => {
    setDeleteLoading(true);
    try {
      await studentServices.deleteById(selectedRow);
      toast.success(strings.deleteSuccess);
      refetchData();
    } catch (error) {
      console.log(error);
    } finally {
      setDeleteLoading(false);
      setOpenModal(false);
    }
  };
  console.log("data", tableData);
  return (
    <Box>
      <DeleteModal
        openDeleteModal={openModal}
        deleteTitle={strings.deleteConfirm}
        handleClose={() => setOpenModal(false)}
        handleDelete={handleDeleteRow}
        loading={deleteLoading}
      />
      <Button
        className={classes.addButton}
        endIcon={<AddIcon />}
        LinkComponent={Link}
        to={`${routePath}students/add`}
        variant="contained"
      >
        {strings.addStudent}
      </Button>
      <DataGrid
        pagination
        autoHeight
        disableRowSelectionOnClick
        pageSizeOptions={rowsPerPageOptions}
        initialState={{
          pagination: {
            paginationModel: { pageSize, page },
          },
        }}
        paginationMode="server"
        rowCount={tableData?.totalCount}
        onPageChange={(params) => {
          setPage(params.page);
        }}
        onPaginationModelChange={(params) => {
          setPageSize(params.pageSize);
          setPage(params.page + 1);
        }}
        loading={isLoadingData}
        pageSize={pageSize}
        onPageSizeChange={({ pageSize: newPageSize }) =>
          setPageSize(newPageSize)
        }
        getRowId={(row) => row.id}
        columns={[
          {
            headerName: strings.StudentName,
            field: accessor.name,
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
            renderCell: ({ value }) => <PhoneField value={value} />,
          },
          {
            headerName: strings.parentNumber,
            field: accessor.parentNumber,
            flex: 0.8,
            minWidth: 120,
            type: "string",
            renderCell: ({ value }) => <PhoneField value={value} />,
          },
          {
            headerName: strings.gender,
            field: accessor.gender,
            flex: 0.8,
            minWidth: 120,
            type: "singleSelect",
            valueOptions: [
              { value: "MALE", label: strings.male },
              { value: "FEMALE", label: strings.female },
            ],
          },
          {
            headerName: strings.schoolName,
            field: accessor.schoolName,
            flex: 0.8,
            minWidth: 120,
            type: "string",
          },
          {
            headerName: strings.StudentLevel,
            field: accessor.level,
            flex: 0.8,
            minWidth: 120,
            valueFormatter: ({ value }) => value.name,
            valueOptions: [],
            type: "singleSelect",
          },
          {
            headerName: strings.birthDate,
            field: accessor.birthDate,
            flex: 0.8,
            minWidth: 120,
            type: "date",
            valueGetter: ({ value }) => new Date(value),
            valueFormatter: ({ value }) =>
              value != "Invalid Date" ? dayjs(value).format("DD/MM/YYYY") : "",
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
                  LinkComponent={Link}
                  to={`${routePath}students/view/${params.id}`}
                >
                  <VisibilityIcon />
                </IconButton>
                <IconButton
                  className={classes.editButton}
                  LinkComponent={Link}
                  to={`${routePath}students/edit/${params.id}`}
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
        rows={tableData?.data ?? []}
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

export default ViewStudents;
