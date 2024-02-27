import React, { useState, useContext } from "react";
import { LangContext } from "App";
import { toast } from "react-toastify";
import { Link, useParams } from "react-router-dom";
import { DataGrid, getGridStringOperators } from "@mui/x-data-grid";
import { makeStyles } from "@mui/styles";
import { Box, Button, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CustomToolbar from "Components/DataGrid/Toolbar";
import NoData from "Components/DataGrid/NoData";
import DeleteModal from "Components/Modal/DeleteModal";

import attendanceServices from "Services/attendance";
import useQueryService from "Hooks/useQueryService";
import strings from "Assets/Local/Local";
// import { routePath } from "AppConstants";
import styles from "CommonStyles/ViewStyles";
import { routePath } from "AppConstants";
// import dayjs from "dayjs";

const rowsPerPageOptions = [5, 10, 20, 25, 50, 100];
const useStyles = makeStyles(styles);

const ViewAttendances = () => {
  const { lang } = useContext(LangContext);

  const [selectedRow, setSelectedRow] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(rowsPerPageOptions[0]);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const classes = useStyles();
  const { lecture: attendanceLecture } = useParams();
  const {
    data: tableData,
    isLoading: isLoadingData,
    isError,
    error,
    refetch: refetchData,
  } = useQueryService({
    key: [
      "attendanceServices.getAll",
      { attendanceLecture, page, limit: pageSize },
    ],
    fetcher: () =>
      attendanceServices.getAll({ attendanceLecture, page, limit: pageSize }),
    enabled: !!attendanceLecture,
  });
  const { data: lectureData, isLoading: isLoadingLectureData } =
    useQueryService({
      key: ["attendanceServices.previousLecture", { attendanceLecture }],
      fetcher: () => attendanceServices.previousLecture({ attendanceLecture }),
      enabled: !!attendanceLecture,
    });
  if (isError) {
    toast.error(error?.message);
  }

  const handleDeleteRow = async () => {
    setDeleteLoading(true);
    try {
      await attendanceServices.deleteById(selectedRow);
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
      <Box bgcolor={"#1F5CA9"} padding={2} mb={3}>
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          paddingX={10}
          paddingY={1}
        >
          <Typography color={"white"} fontSize={"20px"} fontWeight={"bold"}>
            {lectureData?.attendanceDate}
          </Typography>
          <Typography color={"white"} fontSize={"20px"} fontWeight={"bold"}>
            {lectureData?.group?.name}
          </Typography>
          <Typography color={"white"} fontSize={"20px"} fontWeight={"bold"}>
            {lang === "ar" ? "الحصة" : "Lessons"} :&nbsp;
            {lectureData?.lesson}
          </Typography>
        </Box>
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          paddingX={10}
          paddingY={1}
        >
          <Typography color={"white"} fontSize={"18px"}>
            {lang === "ar" ? "عدد الطلاب بالمجموعة" : "Total group Student"}{" "}
            :&nbsp;
            {lectureData?.totalGroupStudents}
          </Typography>
          <Typography color={"white"} fontSize={"18px"}>
            {lang === "ar" ? "الحضور" : "Attended"} : &nbsp;
            {lectureData?.attendCount}
          </Typography>
        </Box>
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          paddingX={10}
          paddingY={1}
        >
          <Typography color={"white"} fontSize={"18px"}>
            {lang === "ar" ? "المجموعة الحالية" : "Current Group"} :&nbsp;
            {lectureData?.attendCount - lectureData?.otherCount}
          </Typography>
          <Typography color={"white"} fontSize={"18px"}>
            {lang === "ar" ? "مجموعات اخري" : "Other Groups"} : &nbsp;
            {lectureData?.otherCount}
          </Typography>
        </Box>
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          paddingX={10}
          paddingY={1}
        >
          <Typography color={"white"} fontSize={"18px"}>
            {lang === "ar" ? "اجمالي المبلغ المحصل" : "Total amount collected"}{" "}
            :&nbsp;
            {lectureData?.totalCollected} EGP
          </Typography>
        </Box>
      </Box>
      <Box>
        <Button
          className={classes.addButton}
          endIcon={<AddIcon />}
          LinkComponent={Link}
          to={`${routePath}attendances/add/${attendanceLecture}`}
          variant="contained"
        >
          {strings.addAttendance}
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
              headerName: strings.group,
              field: "groupStudent",
              flex: 1,
              minWidth: 120,
              valueFormatter: ({ value }) => value?.group?.name,
              valueOptions: [],
              type: "singleSelect",
            },
            {
              headerName: strings.status,
              field: "status",
              valueFormatter: ({ value }) => strings.attendanceStatus[value],
              valueOptions: Object.entries(strings.attendanceStatus).map(
                ([value, label]) => ({ label, value })
              ),
              type: "singleSelect",
            },
            {
              headerName: strings.price,
              field: "paid",
              type: "number",
              valueFormatter: ({ value }) => `${value} EGP`,
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
                  {params.row.status === "ATTEND" && (
                    <Button
                      className={classes.deleteButton}
                      onClick={() => {
                        setSelectedRow(params.id);
                        setOpenModal(true);
                      }}
                      startIcon={<DeleteIcon />}
                    >
                      {strings.removeAttendance}
                    </Button>
                  )}
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

export default ViewAttendances;
