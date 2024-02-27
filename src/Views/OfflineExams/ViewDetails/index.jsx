import React, { useState, useContext } from "react";
import { LangContext } from "App";
import { toast } from "react-toastify";
import { Link, useParams } from "react-router-dom";
import { DataGrid, getGridStringOperators } from "@mui/x-data-grid";
import { makeStyles } from "@mui/styles";
import { Box, Button, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CustomToolbar from "Components/DataGrid/Toolbar";
import NoData from "Components/DataGrid/NoData";
import DeleteModal from "Components/Modal/DeleteModal";

import examGradeServices from "Services/exam-grades";
import useQueryService from "Hooks/useQueryService";
import strings from "Assets/Local/Local";
// import { routePath } from "AppConstants";
import styles from "CommonStyles/ViewStyles";
import { routePath } from "AppConstants";
// import dayjs from "dayjs";

const rowsPerPageOptions = [5, 10, 20, 25, 50, 100];
const useStyles = makeStyles(styles);

const ViewOfflineExam = () => {
  const { lang } = useContext(LangContext);

  const [selectedRow, setSelectedRow] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(rowsPerPageOptions[0]);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const classes = useStyles();
  const { id: examId } = useParams();
  const {
    data: tableData,
    isLoading: isLoadingData,
    refetch: refetchData,
  } = useQueryService({
    key: ["examGradeServices.getAll", { exam: examId, page, limit: pageSize }],
    fetcher: () =>
      examGradeServices.getAll({ exam: examId, page, limit: pageSize }),
    enabled: !!examId,
  });

  const handleDeleteRow = async () => {
    setDeleteLoading(true);
    try {
      await examGradeServices.deleteById(selectedRow);
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
          to={`${routePath}offline-exams/add-grade/${examId}`}
          variant="contained"
        >
          {strings.addGrade}
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
              headerName: strings.StudentName,
              field: "student",
              flex: 1,
              minWidth: 120,
              valueFormatter: ({ value }) => value.name,
              valueOptions: [],
              type: "singleSelect",
            },
            {
              headerName: strings.grade,
              field: "grade",
              flex: 1,
              minWidth: 120,
              type: "number",
              // valueFormatter: ({ value, api, id }) =>
              //   `${value} / ${api.getRow(id).examModel?.maxGrade}`,
            },
            // {
            //   headerName: strings.correctAnswersCount,
            //   field: "correctAnswersCount",
            //   type: "number",
            //   flex: 1,
            //   minWidth: 120,
            // },
            // {
            //   headerName: strings.wrongAnswersCount,
            //   field: "wrongAnswersCount",
            //   type: "number",
            //   flex: 1,
            //   minWidth: 120,
            // },
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

export default ViewOfflineExam;
