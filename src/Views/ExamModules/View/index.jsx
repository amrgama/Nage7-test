import React, { useMemo, useState, useEffect } from "react";
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

import { examModuleServices } from "Services";
import useQueryService from "Hooks/useQueryService";
import strings from "Assets/Local/Local";
import { routePath, QUESTION_BANK, EXAM_DETAILS } from "AppConstants";
import styles from "CommonStyles/ViewStyles";

const rowsPerPageOptions = [5, 10, 20, 25, 50, 100];
const accessor = {
  id: "id",
  name: "name",
  firstGrade: "firstGrade",
  secondGrade: "secondGrade",
  thirdGrade: "thirdGrade",
  fourthGrade: "fourthGrade",
  fourthGrade: "fourthGrade",
  questions: "questions",
  type: "type",
  subject: "subject",
};
const useStyles = makeStyles(styles);

const ViewExamModule = () => {
  const [selectedExam, setSelectedExam] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [pageSize, setPageSize] = useState(rowsPerPageOptions[1]);
  const [page, setPage] = useState(0);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const navigate = useNavigate();
  const classes = useStyles();
  const params = useMemo(() => {
    let pageParam = page + 1;
    return {
      page: pageParam,
      limit: pageSize,
    };
  }, [page, pageSize]);
  useEffect(() => {
    localStorage.removeItem(QUESTION_BANK);
    localStorage.removeItem(EXAM_DETAILS);
  }, []);
  const {
    data: examModules,
    isLoading: isLoadingExamModules,
    isError,
    error,
    refetch: refetchExamModules,
  } = useQueryService({
    key: ["examModuleServices.getExamModules", params],
    fetcher: () => examModuleServices.getExamModules(params),

    keepPreviousData: true,
  });

  if (isError) {
    toast.error(error?.message);
  }

  const handleDeleteExamModule = async () => {
    setDeleteLoading(true);
    try {
      await examModuleServices.deleteExamModule(selectedExam);
      toast.success(strings.deleteSuccess);
      refetchExamModules();
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
  console.log("examModules", examModules);

  return (
    <>
      <DeleteModal
        openDeleteModal={openModal}
        deleteTitle={strings.deleteConfirm}
        handleClose={() => setOpenModal(false)}
        handleDelete={handleDeleteExamModule}
        loading={deleteLoading}
      />
      <Box>
        <Button
          className={classes.addButton}
          endIcon={<AddIcon />}
          onClick={() => navigate(`${routePath}exam-modules/add`)}
          variant="contained"
        >
          {strings.addExamModule}
        </Button>
        <DataGrid
          pagination
          autoHeight
          disableRowSelectionOnClick
          pageSizeOptions={rowsPerPageOptions}
          loading={isLoadingExamModules}
          paginationMode="server"
          rowCount={examModules?.totalCount || 0}
          initialState={{
            pagination: {
              paginationModel: { pageSize, page },
            },
          }}
          onPaginationModelChange={(param) => {
            setPage(param.page);
            setPageSize(param.pageSize);
          }}
          columns={[
            {
              headerName: strings.examName,
              field: accessor.name,
              flex: 0.8,
              minWidth: 150,
              type: "string",
            },
            {
              headerName: strings.firstGrade,
              field: accessor.firstGrade,
              flex: 0.8,
              minWidth: 150,
              type: "string",
            },

            {
              headerName: strings.secondGrade,
              field: accessor.secondGrade,
              flex: 0.8,
              minWidth: 150,
              type: "string",
            },
            {
              headerName: strings.thirdGrade,
              field: accessor.thirdGrade,
              flex: 0.8,
              minWidth: 120,
              type: "string",
            },
            {
              headerName: strings.fourthGrade,
              field: accessor.fourthGrade,
              flex: 0.8,
              minWidth: 120,
              type: "string",
            },
            {
              headerName: strings.questionsNumber,
              field: accessor.questions,
              flex: 0.8,
              minWidth: 120,
              type: "string",
              valueFormatter: (params) => {
                return params.value?.length;
              },
            },
            {
              headerName: strings.type,
              field: accessor.type,
              flex: 0.8,
              minWidth: 120,
              type: "string",
              valueFormatter: (params) => {
                return strings[params.value];
              },
            },
            {
              headerName: strings.subject,
              field: accessor.subject,
              flex: 0.8,
              minWidth: 120,
              type: "string",
              valueFormatter: (params) => {
                return params.value?.name;
              },
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
                      navigate(`${routePath}exam-modules/view/${params.id}`)
                    }
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    className={classes.editButton}
                    onClick={() =>
                      navigate(`${routePath}exam-modules/edit/${params.id}`)
                    }
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    className={classes.deleteButton}
                    onClick={() => {
                      setSelectedExam(params.id);
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
            examModules?.data.map((exam) => ({
              id: exam.id,
              [accessor.name]: exam.name,
              [accessor.firstGrade]: exam.firstGrade,
              [accessor.secondGrade]: exam.secondGrade,
              [accessor.thirdGrade]: exam.thirdGrade,
              [accessor.fourthGrade]: exam.fourthGrade,
              [accessor.questions]: exam.questions,
              [accessor.type]: exam.type,
              [accessor.subject]: exam.subject,
            })) || []
          }
          slots={{
            toolbar: CustomToolbar,
            noRowsOverlay: NoData,
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
          slotProps={{
            pagination: {
              labelRowsPerPage: strings.RowsPerPage,
            },
          }}
        />
      </Box>
    </>
  );
};

export default ViewExamModule;
