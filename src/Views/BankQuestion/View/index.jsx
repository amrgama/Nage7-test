import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { DataGrid, getGridStringOperators } from "@mui/x-data-grid";
import { makeStyles } from "@mui/styles";
import { Box, Button, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import CustomToolbar from "Components/DataGrid/Toolbar";
import NoData from "Components/DataGrid/NoData";
import DeleteModal from "Components/Modal/DeleteModal";
import bankQuestionServices from "Services/bankQuestion";
import useQueryService from "Hooks/useQueryService";
import strings from "Assets/Local/Local";
import { routePath } from "AppConstants";
import styles from "CommonStyles/ViewStyles";
import { LangContext } from "App";

// import dayjs from "dayjs";

const rowsPerPageOptions = [5, 10, 20, 25, 50, 100];
const useStyles = makeStyles(styles);

const ViewBankQuestion = () => {
  const questionType = [
    { id: "TRUE_FALSE", name: { ar: "صح / خطاء", en: "True / False" } },
    { id: "MCQ", name: { ar: "اختيار متعدد", en: "MCQ" } },
    { id: "TEXT", name: { ar: "مقالي", en: "text" } },
  ];
  const difficultyLevel = [
    { id: "1", name: { ar: "L.V 1", en: "L.V 1" } },
    { id: "2", name: { ar: "L.V 2", en: "L.V 2" } },
    { id: "3", name: { ar: "L.V 3", en: "L.V 3" } },
    { id: "4", name: { ar: "L.V 4", en: "L.V 4" } },
  ];
  const { lang } = useContext(LangContext);
  const [selectedQuestion, setSelectedQuestion] = useState();

  const [questions, setQuestions] = useState([]);
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
    key: ["bankQuestionServices.getAll", { page, limit: pageSize }],
    fetcher: () => bankQuestionServices.getAll({ page, limit: pageSize }),
  });

  useEffect(() => {
    if (tableData?.data) {
      setQuestions(tableData.data);
    }
  }, [tableData]);
  if (isError) {
    toast.error(error?.message);
  }

  const handleDeleteRow = async () => {
    setDeleteLoading(true);
    try {
      await bankQuestionServices.deleteById(selectedQuestion);
      toast.success(strings.deleteSuccess);
      refetchData();
    } catch (error) {
      console.log("error when add user ", error);
      error?.response?.data?.errors?.forEach?.(({ param, msg }) => {
        if (param in values)
          setError(param, { type: "custom", message: { ar: msg, en: msg } });
      });
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
          to={`${routePath}bank-Question/add`}
          variant="contained"
        >
          {strings.addBankQuestion}
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
              headerName: strings.question,
              field: "name",
              flex: 0.8,
              minWidth: 150,
              renderCell: ({ value }) => (
                <div
                  style={{ display: "flex", gap: ".5rem", overflowX: "auto" }}
                >
                  {value}
                </div>
              ),
            },
            {
              headerName: strings.schoolYear,
              field: "subLevel",
              flex: 0.8,
              minWidth: 150,
            },
            {
              headerName: strings.subject,
              field: "subject",
              flex: 0.8,
              minWidth: 150,
            },

            {
              headerName: strings.questionType,
              field: "questionType",
              flex: 0.8,
              minWidth: 150,
            },
            {
              headerName: strings.difficultyLevel,
              field: "difficulty",
              flex: 0.8,
              minWidth: 150,
            },
            // {
            //   headerName: strings.status,
            //   field: "status",
            //   valueFormatter: ({ value }) => strings.attendanceStatus[value],
            //   valueOptions: Object.entries(strings.attendanceStatus).map(
            //     ([value, label]) => ({ label, value })
            //   ),
            //   type: "singleSelect",
            // },
            // {
            //   headerName: strings.price,
            // field: "price",
            // type: "number",
            //   valueFormatter: ({ value }) => `${value} EGP`,
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
                  <IconButton
                    className={classes.viewButton}
                    LinkComponent={Link}
                    to={`${routePath}bank-Question/view/${params.id}`}
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    className={classes.editButton}
                    LinkComponent={Link}
                    to={`${routePath}bank-Question/edit/${params.id}`}
                  >
                    <EditIcon />
                  </IconButton>

                  <IconButton
                    className={classes.deleteButton}
                    onClick={() => {
                      setSelectedQuestion(params.id);
                      setOpenModal(true);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ),
            },
          ]}
          rows={questions.map((question, index) => ({
            index: index + 1,
            id: question.id,
            name: question.name,
            subLevel: question?.subLevel?.name,
            subject: question?.subject?.name,
            questionType: questionType.filter(
              (el) => el.id === question?.type
            )[0].name[lang],
            difficulty: difficultyLevel.filter(
              (el) => el.id === "" + question?.difficultyLevel
            )[0].name[lang],
          }))}
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

export default ViewBankQuestion;
