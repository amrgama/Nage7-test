import React, { useContext, useState } from "react";
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

import storeServices from "Services/store";
import useQueryService from "Hooks/useQueryService";
import strings from "Assets/Local/Local";
import { routePath } from "AppConstants";
import styles from "CommonStyles/ViewStyles";
import PhoneField from "Components/PhoneField";
import EmailField from "Components/EmailField";
import dayjs from "dayjs";
import { UserContext } from "App";

const rowsPerPageOptions = [5, 10, 20, 25, 50, 100];
const accessor = {
  name: "name",
  price: "price",
  saleType: "saleType",
  term: "term",
  type: "type",
};
const useStyles = makeStyles(styles);

const ViewAssistants = () => {
  const [selectedRow, setSelectedRow] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [pageSize, setPageSize] = useState(rowsPerPageOptions[0]);
  const [page, setPage] = useState(1);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { user } = useContext(UserContext);
  const classes = useStyles();

  const {
    data: tableData,
    isLoading: isLoadingData,
    isError,
    error,
    refetch: refetchData,
  } = useQueryService({
    key: ["storeServices.getAll", { limit: pageSize, page }],
    fetcher: () => storeServices.getAll({ limit: pageSize, page }),
  });

  if (isError) {
    toast.error(error?.message);
  }

  const handleDeleteRow = async () => {
    setDeleteLoading(true);
    try {
      await storeServices.deleteById(selectedRow);
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
          to={`${routePath}store/add`}
          variant="contained"
        >
          {strings.addProduct}
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
              headerName: strings.productName,
              field: accessor.name,
              flex: 0.8,
              minWidth: 150,
              type: "string",
            },
            {
              headerName: strings.price,
              field: accessor.price,
              flex: 0.8,
              minWidth: 150,
              type: "string",
            },

            {
              headerName: strings.saleType,
              field: accessor.saleType,
              flex: 0.8,
              minWidth: 120,
              type: "singleSelect",
              valueOptions: [
                { value: "FREE", label: strings.FREE },
                { value: "PAID", label: strings.PAID },
              ],
            },
            {
              headerName: strings.term,
              field: accessor.term,
              flex: 0.8,
              minWidth: 120,
              type: "singleSelect",
              valueOptions: [
                { value: "FIRST", label: strings.FIRST },
                { value: "SEC", label: strings.SEC },
              ],
            },

            {
              headerName: strings.productType,
              field: accessor.type,
              flex: 0.8,
              minWidth: 120,
              type: "singleSelect",
              valueOptions: [
                { value: "PDF", label: strings.PDF },
                { value: "LESSON", label: strings.LESSON },
                { value: "EXAM", label: strings.EXAM },
                { value: "PlAYLIST", label: strings.PlAYLIST },
              ],
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
                    to={`${routePath}assistants/view/${params.id}`}
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    className={classes.editButton}
                    LinkComponent={Link}
                    // to={`${routePath}store/edit/${params.id}`}
                    to={`${routePath}store/edit/132`}
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
    </>
  );
};

export default ViewAssistants;
