import React, { useState } from "react";
import { DataGrid, getGridStringOperators } from "@mui/x-data-grid";
import { makeStyles } from "@mui/styles";
import {  Box } from "@mui/material";
import CustomToolbar from "Components/DataGrid/Toolbar";
import NoData from "Components/DataGrid/NoData";
import strings from "Assets/Local/Local";
import styles from "CommonStyles/ViewStyles";


const rowsPerPageOptions = [5, 10, 20, 25, 50, 100];

const useStyles = makeStyles(styles);

const ViewGroups = ({groups}) => {
    console.log('groups===>',groups)
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(rowsPerPageOptions[0]);
  const classes = useStyles();
  return (
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
        rowCount={groups?.length}
        onPageChange={(params) => {
          setPage(params.page);
        }}
        onPaginationModelChange={(params) => {
          setPageSize(params.pageSize);
          setPage(params.page + 1);
        }}
        pageSize={pageSize}
        onPageSizeChange={({ pageSize: newPageSize }) =>
          setPageSize(newPageSize)
        }
        getRowId={(row) => JSON.stringify(row._id)}
        columns={[
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
            headerName: strings.groupPrice,
            field: "price",
            flex: 0.8,
            minWidth: 120,
            valueFormatter: ({ value }) => `${value} EGP`,
            type: "singleSelect",
            },
        ]}
        // rows={groups ?? []}
        rows={groups.map((groups, index) => ({
            index: index + 1,
            _id: groups.id,
            group: groups?.group,
            price: groups?.price,
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
  );
};

export default ViewGroups;
