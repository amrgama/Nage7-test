import React, { useState, useRef, useContext } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { DataGrid, getGridStringOperators } from "@mui/x-data-grid";
import Grid from "@mui/material/Grid";
import { makeStyles } from "@mui/styles";
import { IconButton, Box, Button } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import CustomToolbar from "Components/DataGrid/Toolbar";
import NoData from "Components/DataGrid/NoData";
import DeleteModal from "Components/Modal/DeleteModal";
import DeleteIcon from "@mui/icons-material/Delete";
import { StudentCardBack } from "Components/StudentCard";
import { StudentCardCode } from "Components/StudentCode";

import useQueryService from "Hooks/useQueryService";
import strings from "Assets/Local/Local";
import styles from "CommonStyles/ViewStyles";
import dayjs from "dayjs";
import groupStudentServices from "Services/groupStudent";
import payementCodeServices from "Services/paymentCode";

import { useReactToPrint } from "react-to-print";
import { UserContext } from "App";
import { API_ENDPOINT } from "AppConstants";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
const rowsPerPageOptions = [5, 10, 20, 25, 50, 100];
const accessor = {
  amount: "amount",
  code: "code",
  createdAt: "createdAt",
};
const useStyles = makeStyles(styles);

const ViewCodes = () => {
  const divToPrint1 = useRef();
  const divToPrint2 = useRef();

  const { user } = useContext(UserContext);

  const [cards, setCards] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRow, setSelectedRow] = useState();

  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(rowsPerPageOptions[0]);
  const [printLoading, setPrintLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { type: cardType } = useParams();

  const classes = useStyles();

  const {
    data: tableData,
    isLoading: isLoadingData,
    error,
    refetch: refetchData,
  } = useQueryService({
    key: ["payementCodeServices.getAll", { page, limit: pageSize }],
    fetcher: () => payementCodeServices.getAll({ page, limit: pageSize }),
    onError: (err) => toast.error(error?.message),
  });
  const printDocument = () => {
    print();
  };
  const print = useReactToPrint({
    content: () => {
      const input = document.getElementById("divToPrint1");
      const i = input.cloneNode(true);
      i.style.display = "block";
      return i;
    },
    copyStyles: true,
    documentTitle: `code-Front-card`,
    pageStyle: `
    @media print {
      
      @page {
        ${
          cardType === "Barcode"
            ? "size: 144px 95.5px; margin:0;"
            : `size: 210mm 297mm; 
            /* Chrome sets own margins, we change these printer settings */
            margin: 5mm  3.55555556mm 0mm  10.1587302mm;`
        }
      }
      html, body {
        direction: ltr;
        height: auto;
        margin: 0 !important; 
        padding: 0 !important;
        overflow: hidden;
        page-break-after: avoid;
        page-break-before: avoid;
      }
      .divToPrint1 {
        display: block;
        scale: 100%;
      }
      #divToPrint1:last-child{
        page-break-after: avoid !important;
        page-break-inside: avoid !important;
        margin-bottom: 0px !important;
    }
    }
  `,
  });
  const printBack = useReactToPrint({
    content: () => {
      const input = document.getElementById("divToPrint2");
      const i = input.cloneNode(true);
      i.style.display = "block";
      return i;
    },
    copyStyles: true,
    documentTitle: `code-Back-card`,
    pageStyle: `
    @media print {
      @page {
        ${
          cardType === "Barcode"
            ? "size: 144px 95.5px; margin:0;"
            : `size: 210mm 297mm; margin: 5mm  3.55555556mm 0mm  10.1587302mm;`
        }
      }
      html, body {
        direction: ltr;
        height: auto;
        margin: 0 !important; 
        padding: 0 !important;
        overflow: hidden;
        page-break-after: avoid;
        page-break-before: avoid;
      }
      .divToPrint1 {
        display: block;
        scale: 100%;
      }
      #divToPrint1:last-child{
        page-break-after: avoid !important;
        page-break-inside: avoid !important;
        margin-bottom: 0px !important;
    }
    }
  `,
  });
  const handlePrint = async () => {
    setPrintLoading(true);
    try {
      await new Promise((res) => {
        setTimeout(async () => {
          await printDocument();
          res();
        }, 500);
      });
      toast.success(strings.printSuccess);
    } catch (error) {
      console.log(error);
    } finally {
      setPrintLoading(false);
      if (cardType === "Barcode") {
        setOpenModal(false);
      }
    }
  };
  const handleDeleteRow = async () => {
    setDeleteLoading(true);
    try {
      await payementCodeServices.deleteById(selectedRow);
      toast.success(strings.deleteSuccess);
      refetchData();
    } catch (error) {
      console.log(error);
    } finally {
      setDeleteLoading(false);
      setOpenDeleteModal(false);
    }
  };
  console.log("data", tableData);
  return (
    <>
      <Box>
        <DeleteModal
          openDeleteModal={openDeleteModal}
          deleteTitle={strings.deleteConfirm}
          handleClose={() => setOpenDeleteModal(false)}
          handleDelete={handleDeleteRow}
          loading={deleteLoading}
        />
        <DeleteModal
          openDeleteModal={openModal}
          deleteTitle={""}
          button={cardType !== "Barcode" ? strings.printFront : strings.print}
          buttonBack={cardType !== "Barcode" ? strings.printBack : null}
          handleClose={() => {
            setOpenModal(false);
            setSelectedRows([]);
          }}
          handleDelete={handlePrint}
          handlePrintBack={printBack}
          loading={printLoading}
          icon={
            <PrintIcon
              sx={{
                width: "200px !important",
                height: "200px !important",
                color: "#6784ed !important",
              }}
            />
          }
        />
        <Button
          className={classes.addButton}
          endIcon={<PrintIcon />}
          variant="contained"
          disabled={!selectedRows.length}
          onClick={() => setOpenModal(!!selectedRows.length)}
        >
          {strings.print}
        </Button>
        <DataGrid
          pagination
          autoHeight
          checkboxSelection
          keepNonExistentRowsSelected
          onRowSelectionModelChange={(selection) => {
            let list = [];
            for (let i = 0; i < selection.length; i++) {
              let obj = tableData?.data.filter((el) => el.id === selection[i]);
              list.push(obj[0]);
            }
            console.log("selection===>", list);
            setCards(list);
            setSelectedRows(selection);
          }}
          rowSelectionModel={selectedRows}
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
          getRowId={(row) => row.id}
          columns={[
            {
              headerName: strings.code,
              field: accessor.code,
              flex: 0.8,
              minWidth: 150,
              type: "string",
            },
            {
              headerName: strings.amount,
              field: accessor.amount,
              flex: 0.8,
              minWidth: 150,
              type: "string",
            },

            {
              headerName: strings.createdAt,
              field: accessor.createdAt,
              flex: 0.8,
              minWidth: 120,
              type: "date",
              valueGetter: ({ value }) => new Date(value),
              valueFormatter: ({ value }) =>
                value != "Invalid Date"
                  ? dayjs(value).format("DD/MM/YYYY")
                  : "",
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
                    className={classes.deleteButton}
                    onClick={() => {
                      setSelectedRow(params.id);
                      setOpenDeleteModal(true);
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
      <div
        ref={divToPrint1}
        className="divToPrint1"
        id="divToPrint1"
        style={{ display: "none" }}
      >
        {
          <Grid container columnSpacing={5.5} rowSpacing={0.8}>
            {cards.map((el) => {
              return (
                <Grid xs={6} item>
                  <StudentCardCode amount={el.amount} code={el.code} />
                </Grid>
              );
            })}
          </Grid>
        }
      </div>
      <div
        ref={divToPrint2}
        className="divToPrint2"
        id="divToPrint2"
        style={{ display: "none" }}
      >
        {cardType === "Barcode" ? null : (
          <Grid container columnSpacing={5.5} rowSpacing={1.4}>
            {[1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map((el) => {
              return (
                <Grid xs={6} item>
                  <div style={{}}>
                    <StudentCardBack
                      teacher={{
                        name: user?.name,
                        phone: user?.phone,
                        phone2: user?.phoneNumber_2,
                      }}
                      cardType={"Default"}
                    />
                  </div>
                </Grid>
              );
            })}
          </Grid>
        )}
      </div>
    </>
  );
};

export default ViewCodes;
