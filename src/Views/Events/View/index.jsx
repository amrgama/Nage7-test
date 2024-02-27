import React, { useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { DataGrid, getGridStringOperators } from "@mui/x-data-grid";
import { makeStyles } from "@mui/styles";
import { Box, Button, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CustomToolbar from "Components/DataGrid/Toolbar";
import NoData from "Components/DataGrid/NoData";
import DeleteModal from "Components/Modal/DeleteModal";
import eventServices from "Services/events";
import useQueryService from "Hooks/useQueryService";
import strings from "Assets/Local/Local";
import { routePath } from "AppConstants";
import styles from "CommonStyles/ViewStyles";
import dayjs from "dayjs";

const rowsPerPageOptions = [5, 10, 20, 25, 50, 100];
const useStyles = makeStyles(styles);

const ViewEvents = () => {
  const [selectedRow, setSelectedRow] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(rowsPerPageOptions[0]);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const classes = useStyles();
  const {
    data: tableData,
    isLoading: isLoadingData,
    isError,
    error,
    refetch: refetchData,
  } = useQueryService({
    key: ["eventServices.getAll", { page, limit: pageSize }],
    fetcher: () => eventServices.getAll({ page, limit: pageSize }),
  });

  if (isError) {
    toast.error(error?.message);
  }

  const handleDeleteRow = async () => {
    setDeleteLoading(true);
    try {
      await eventServices.deleteById(selectedRow);
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
    <>
      <DeleteModal
        openDeleteModal={openModal}
        deleteTitle={strings.deleteConfirm}
        handleClose={() => setOpenModal(false)}
        handleDelete={handleDeleteRow}
        loading={deleteLoading}
      />
      <Box>
        <Button
          className={classes.addButton}
          endIcon={<AddIcon />}
          LinkComponent={Link}
          to={`${routePath}events/add`}
          variant="contained"
        >
          {strings.events.add}
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
              headerName: strings.events.name,
              field: "name",
              flex: 0.8,
              minWidth: 150,
            },
            {
              headerName: strings.events.type,
              field: "type",
              valueFormatter: ({ value }) => strings.events.types[value],
              valueOptions: Object.entries(strings.events.types).map(
                ([value, label]) => ({ label, value })
              ),
              type: "singleSelect",
            },
            {
              headerName: strings.events.registerPrice,
              field: "regisiterPrice",
              type: "number",
              valueFormatter: ({ value }) => `${value} EGP`,
            },
            {
              headerName: strings.events.price,
              field: "eventPrice",
              type: "number",
              valueFormatter: ({ value }) => `${value} EGP`,
            },
            {
              headerName: strings.events.date,
              field: "date",
              flex: 0.8,
              minWidth: 150,
              type: "date",
              valueGetter: ({ value }) => new Date(value),
              valueFormatter: ({ value }) =>
                value != "Invalid Date"
                  ? dayjs(value).format("YYYY/MM/DD hh:mm")
                  : "",
            },
            {
              headerName: strings.events.location,
              field: "location",
              flex: 0.8,
              minWidth: 150,
            },
            {
              headerName: strings.events.details,
              field: "details",
              flex: 0.8,
              minWidth: 150,
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
                  {/* <IconButton
          className={classes.viewButton}
          LinkComponent={Link}
          to={`${routePath}students/view/${params.id}`}
        >
          <VisibilityIcon />
        </IconButton> */}
                  {/* <IconButton
                    className={classes.editButton}
                    LinkComponent={Link}
                    to={`${routePath}students/edit/${params.row.studentId}`}
                  >
                    <EditIcon />
                  </IconButton> */}
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
    </>
  );
};

export default ViewEvents;
