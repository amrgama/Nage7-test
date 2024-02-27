import React, { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { makeStyles } from "@mui/styles";
import { IconButton, Box, Button } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

import CustomToolbar from "Components/DataGrid/Toolbar";
import NoData from "Components/DataGrid/NoData";
import DeleteModal from "Components/Modal/DeleteModal";

import useQueryService from "Hooks/useQueryService";
import strings from "Assets/Local/Local";
import { routePath } from "AppConstants";
import styles from "CommonStyles/ViewStyles";
import examServices from "Services/exams";

const rowsPerPageOptions = [5, 10, 20, 25, 50, 100];
const accessor = {
  id: "id",
  name: "name",
  type: "type",
  subject: "subject",
  from: "from",
  to: "to",
  duration: "duration",
  lesson: "lesson",
};
const useStyles = makeStyles(styles);

const ViewExams = () => {
  const [selectedExam, setSelectedRow] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [pageSize, setPageSize] = useState(rowsPerPageOptions[1]);
  const [page, setPage] = useState(0);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const classes = useStyles();
  const params = useMemo(() => {
    let pageParam = page + 1;
    return {
      page: pageParam,
      limit: pageSize,
      type: "OFFLINE_EXAM",
    };
  }, [page, pageSize]);

  const {
    data: tableData,
    isLoading: isLoadingData,
    isError,
    error,
    refetch: refetchData,
  } = useQueryService({
    key: ["examServices.getAll", params],
    fetcher: () => examServices.getAll(params),

    keepPreviousData: true,
  });

  if (isError) {
    toast.error(error?.message);
  }

  const handleDeleteRow = async () => {
    setDeleteLoading(true);
    try {
      await examServices.deleteById(selectedExam);
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
          to={`${routePath}offline-exams/add`}
          variant="contained"
        >
          {strings.addNewExam}
        </Button>
        <DataGrid
          pagination
          autoHeight
          disableRowSelectionOnClick
          pageSizeOptions={rowsPerPageOptions}
          loading={isLoadingData}
          paginationMode="server"
          rowCount={tableData?.totalCount || 0}
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
              headerName: strings.subject,
              field: accessor.subject,
              flex: 0.8,
              minWidth: 120,
              type: "string",
              valueFormatter: (params) => {
                return params.value?.name;
              },
            },
            // {
            //   headerName: strings.type,
            //   field: accessor.type,
            //   flex: 0.8,
            //   minWidth: 120,
            //   type: "singleSelect",
            //   valueOptions: [
            //     { label: strings.HOME_WORK, value: "HOME_WORK" },
            //     { label: strings.EXAM, value: "EXAM" },
            //   ],
            //   valueFormatter: (params) => {
            //     return strings[params.value];
            //   },
            // },
            // {
            //   headerName: strings.startDate,
            //   field: accessor.from,
            //   flex: 0.8,
            //   minWidth: 120,
            //   type: "date",
            //   valueGetter: ({ value }) => new Date(value),
            // },
            // {
            //   headerName: strings.endDate,
            //   field: accessor.to,
            //   flex: 0.8,
            //   minWidth: 120,
            //   type: "date",
            //   valueGetter: ({ value }) => new Date(value),
            // },
            {
              headerName: strings.totalGrades,
              field: "maxGrade",
              flex: 0.8,
              minWidth: 120,
              type: "number",
            },
            // {
            //   headerName: strings.lesson,
            //   field: "attendanceLecture",
            //   flex: 0.8,
            //   minWidth: 120,
            //   type: "number",
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
                    to={`${routePath}offline-exams/view/${params.id}`}
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    className={classes.editButton}
                    LinkComponent={Link}
                    to={`${routePath}offline-exams/edit/${params.id}`}
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
          rows={tableData?.data || []}
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

export default ViewExams;
