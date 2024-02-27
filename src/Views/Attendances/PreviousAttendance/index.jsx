import React, { useContext, useState } from "react";
// import { toast } from "react-toastify";
import { Link, useParams } from "react-router-dom";
import { DataGrid, getGridStringOperators } from "@mui/x-data-grid";
import { makeStyles } from "@mui/styles";
import { IconButton, Box, Button } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
// import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

import CustomToolbar from "Components/DataGrid/Toolbar";
import NoData from "Components/DataGrid/NoData";
import DeleteModal from "Components/Modal/DeleteModal";
import useQueryService from "Hooks/useQueryService";
import strings from "Assets/Local/Local";
import { routePath } from "AppConstants";
import styles from "CommonStyles/ViewStyles";
import dayjs from "dayjs";
import lectureServices from "Services/lectures";
import { LangContext } from "App";

const rowsPerPageOptions = [5, 10, 20, 25, 50, 100];

const useStyles = makeStyles(styles);

const ViewPreviousAttendance = () => {
  const [selectedRow, setSelectedRow] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(rowsPerPageOptions[0]);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const classes = useStyles();
  const { lang } = useContext(LangContext);
  const {
    data: tableData,
    isLoading: isLoadingData,
    refetch: refetchData,
  } = useQueryService({
    key: ["lectureServices.getAll", { page, limit: pageSize }],
    fetcher: () => lectureServices.getAll({ page, limit: pageSize }),
  });

  const handleDeleteRow = async () => {
    setDeleteLoading(true);
    try {
      await lectureServices.deleteById(selectedRow);
      toast.success(strings.deleteSuccess);
    } catch (error) {
      console.log(error);
    } finally {
      setDeleteLoading(false);
      setOpenModal(false);
      refetchData();
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
        to={`${routePath}attendances/add`}
        variant="contained"
      >
        {strings.addLecture}
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
        columns={[
          {
            headerName: strings.level,
            field: "subLevel",
            flex: 0.8,
            minWidth: 120,
            valueFormatter: ({ value }) => value.name[lang],
            valueOptions: [],
            type: "singleSelect",
          },
          {
            headerName: strings.group,
            field: "group",
            flex: 0.8,
            minWidth: 120,
            valueFormatter: ({ value }) => value.name,
            valueOptions: [],
            type: "singleSelect",
          },
          {
            headerName: strings.date,
            field: "date",
            flex: 0.8,
            minWidth: 120,
            type: "date",
            valueGetter: ({ value }) => new Date(value),
            valueFormatter: ({ value }) =>
              value != "Invalid Date" ? dayjs(value).format("DD/MM/YYYY") : "",
          },
          {
            headerName: strings.lesson,
            field: "lesson",
            flex: 0.8,
            minWidth: 120,
          },
          {
            headerName: strings.actions,
            field: "actions",
            flex: 1,
            minWidth: 150,
            filterable: false,
            sortable: false,
            renderCell: (params) => (
              <Box className={classes.actionsContainer}>
                <IconButton
                  className={classes.viewButton}
                  LinkComponent={Link}
                  to={`${routePath}attendances/view/${params.row.id}`}
                >
                  <VisibilityIcon />
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

export default ViewPreviousAttendance;
