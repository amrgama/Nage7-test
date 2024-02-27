import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { DataGrid, getGridStringOperators } from "@mui/x-data-grid";
import { makeStyles } from "@mui/styles";
import { IconButton, Box, Drawer, Typography } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CustomToolbar from "Components/DataGrid/Toolbar";
import NoData from "Components/DataGrid/NoData";
import { request as requestService } from "Services";
import useQueryService from "Hooks/useQueryService";
import strings from "Assets/Local/Local";
import { API_ENDPOINT, UserName } from "AppConstants";
import styles from "CommonStyles/ViewStyles";

const rowsPerPageOptions = [5, 10, 20, 25, 50, 100];
const accessor = {
  code: "code",
  name: "name",
  email: "email",
  phone: "phone",
};
const useStyles = makeStyles(styles);
const STATUS = {
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED",
};
const ViewStudentAcceptedRequest = () => {
  let teacher = JSON.parse(localStorage.getItem(UserName));
  const [openViewDetails, setOpenViewDetails] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(rowsPerPageOptions[0]);
  const [request, setRequest] = useState(null);
  const classes = useStyles();

  const {
    data: tableData,
    isLoading: isLoadingData,
    isError,
    error,
    refetch: refetchData,
  } = useQueryService({
    key: [
      "requestService.getAll",
      {
        target: teacher.id,
        status: "ACCEPTED",
        creatorType: "STUDENT",
        page,
        limit: pageSize,
      },
    ],
    fetcher: () =>
      requestService.getAll({
        target: teacher.id,
        status: "ACCEPTED",
        creatorType: "STUDENT",
        page,
        limit: pageSize,
      }),
  });

  if (isError) {
    toast.error(error?.message);
  }

  return (
    <>
      <Drawer
        anchor={"right"}
        open={openViewDetails}
        onClose={() => setOpenViewDetails(false)}
        classes={{ paperAnchorRight: classes.customDrawer }}
      >
        <Box py={2} pl={2} pr={0.5}>
          <Box textAlign={"center"}>
            <img
              src={`${API_ENDPOINT}${request?.creator?.image}`}
              style={{ width: "50px", height: "50px", borderRadius: "50%" }}
            />
          </Box>

          <Typography
            color={"#000"}
            fontWeight={700}
            fontSize={"17px"}
            textAlign={"center"}
          >
            {request?.creator?.name}
          </Typography>
          <Typography
            color={"#333533"}
            fontWeight={500}
            fontSize={"12px"}
            textAlign={"center"}
          >
            {request?.creator?.code}
          </Typography>
          <Typography color={"#1F5CA9"} fontWeight={500} fontSize={"16px"}>
            {strings.phone}:{request?.creator?.phone}
          </Typography>
          <Typography color={"#1F5CA9"} fontWeight={500} fontSize={"16px"}>
            {strings.parentNumber}:{request?.creator?.parentNumber}
          </Typography>
        </Box>
      </Drawer>
      <Box>
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
              headerName: strings.code,
              field: accessor.code,
              flex: 0.8,
              minWidth: 150,
              type: "string",
            },
            {
              headerName: strings.name,
              field: accessor.name,
              flex: 0.8,
              minWidth: 150,
              type: "string",
            },

            {
              headerName: strings.email,
              field: accessor.email,
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
                    onClick={() => {
                      setRequest(
                        tableData.data.filter((el) => el.id === params?.id)?.[0]
                      );
                      setOpenViewDetails(true);
                    }}
                  >
                    <VisibilityIcon />
                  </IconButton>
                </Box>
              ),
            },
          ]}
          rows={
            tableData?.data?.map((creator) => ({
              id: creator.id,
              [accessor.code]: creator?.creator?.code,
              [accessor.name]: creator?.creator?.name,
              [accessor.email]: creator?.creator?.email,
              [accessor.phone]: creator?.creator?.phone,
              activated: creator?.creator?.activated,
            })) || []
          }
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

export default ViewStudentAcceptedRequest;
