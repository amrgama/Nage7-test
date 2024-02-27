import React, { useState, useRef, useContext } from "react";
import { toast } from "react-toastify";
import { DataGrid, getGridStringOperators } from "@mui/x-data-grid";
import { makeStyles } from "@mui/styles";
import { IconButton, Box, Chip, Grid } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import { useReactToPrint } from "react-to-print";
import CustomToolbar from "Components/DataGrid/Toolbar";
import NoData from "Components/DataGrid/NoData";
import DeleteModal from "Components/Modal/DeleteModal";

import groupServices from "Services/group";
import useQueryService from "Hooks/useQueryService";
import strings from "Assets/Local/Local";
import styles from "CommonStyles/ViewStyles";
import groupStudentServices from "Services/groupStudent";
import BarCode from "Components/BarCode";
import { useParams } from "react-router-dom";
import { StudentCardBack, StudentCardFront } from "Components/StudentCard";
import { UserContext } from "App";
import { API_ENDPOINT } from "AppConstants";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
const rowsPerPageOptions = [5, 10, 20, 25, 50, 100];
const accessor = {
  name: "name",
  subject: "subject",
  subLevel: "subLevel",
  daysPerWeek: "daysPerWeek",
  selectedDays: "selectedDays",
};
const useStyles = makeStyles(styles);

const ViewGroups = () => {
  const divToPrint1 = useRef();
  const divToPrint2 = useRef();
  const [selectedRow, setSelectedRow] = useState();
  const [cards, setCards] = useState([]);
  const { type: cardType } = useParams();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(rowsPerPageOptions[0]);
  const [printLoading, setPrintLoading] = useState(false);
  const { user } = useContext(UserContext);
  const classes = useStyles();

  const {
    data: tableData,
    isLoading: isLoadingData,
    isError,
    error,
    refetch: refetchData,
  } = useQueryService({
    key: ["groupServices.getAll", { page, limit: pageSize }],
    fetcher: () => groupServices.getAll({ page, limit: pageSize }),
  });

  const printDocument = () => {
    print();
  };
  const printBack = useReactToPrint({
    content: () => {
      const input = document.getElementById("divToPrint2");
      const i = input.cloneNode(true);
      i.style.display = "block";
      return i;
    },
    copyStyles: true,
    documentTitle: `${(cardType ?? "").toLowerCase()}-students-Back-Card`,
    pageStyle: `
    @media print {
      @page {
        ${cardType === "Barcode"
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
  const print = useReactToPrint({
    content: () => {
      const input = document.getElementById("divToPrint1");
      const i = input.cloneNode(true);
      i.style.display = "block";
      return i;
    },
    copyStyles: true,
    documentTitle: `${(cardType ?? "").toLowerCase()}-students-Front-Card`,
    pageStyle: `
    @media print {
      @page {
        ${cardType === "Barcode"
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
  const handlePrint = async () => {
    setPrintLoading(true);
    try {
      const res = await groupStudentServices.print({ group: selectedRow });
      setCards([...res.data.data]);
      await new Promise((res) => {
        setTimeout(async () => {
          await printDocument();

          res();
        }, 500);
      });
      // TODO: Implement Print Below
      // Here
      toast.success(strings.printSuccess);
    } catch (error) {
      console.log(error);
    } finally {
      setPrintLoading(false);
      if (cardType === 'Barcode') {
        setOpenModal(false);
        }
    }
  };

  if (isError) {
    toast.error(error?.message);
  }
  console.log("data", tableData);
  return (
    <>
      <DeleteModal
        openDeleteModal={!!selectedRow}
        deleteTitle={""}
        button={cardType !== 'Barcode'?strings.printFront:strings.print}
        buttonBack={cardType !== 'Barcode'?strings.printBack:null}
        handleClose={() =>{
          setSelectedRow(null)
        } }
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
          rowCount={tableData?.totalCount ?? 0}
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
              headerName: strings.name,
              field: accessor.name,
              flex: 0.8,
              minWidth: 150,
              type: "string",
            },
            {
              headerName: strings.subject,
              field: accessor.subject,
              flex: 0.8,
              minWidth: 150,
              valueFormatter: ({ value }) => value.name,
              type: "singleSelect",
              valueOptions: [],
            },
            {
              headerName: strings.level,
              field: accessor.subLevel,
              flex: 0.8,
              minWidth: 150,
              valueFormatter: ({ value }) => value.name,
              type: "singleSelect",
              valueOptions: [],
            },
            {
              headerName: strings.daysPerWeek,
              field: accessor.daysPerWeek,
              flex: 0.8,
              minWidth: 150,
              type: "number",
            },
            {
              headerName: strings.lessonDays,
              field: accessor.selectedDays,
              flex: 0.8,
              minWidth: 150,
              type: "singleSelect",
              valueOptions: strings.days.map((day, idx) => ({
                label: day,
                value: idx,
              })),
              renderCell: ({ value }) => (
                <div
                  style={{ display: "flex", gap: ".5rem", overflowX: "auto" }}
                >
                  {value?.sort().map((day) => (
                    <Chip label={strings.days[day]} key={`day_${day}`} />
                  ))}
                </div>
              ),
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
                    color="primary"
                    onClick={() => {
                      setSelectedRow(params.id);
                    }}
                  >
                    <PrintIcon />
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
        {cardType === "Barcode" ? (
          cards.map((el) => {
            return (
              <div className="gridCard">
                <Box
                  width={"144px"}
                  height={"95px"}
                  className="boxCard"
                  style={{ direction: "rtl", textAlign: "center" }}
                >
                  <BarCode
                    code={el.student.code}
                    barCode={el.student.barCode}
                    name={el.student.name}
                  />
                </Box>
              </div>
            );
          })
        ) : (
          <Grid container columnSpacing={5.5} rowSpacing={0.8}>
            {cards.map((el) => {
              return (
                <Grid xs={6} item padding={0}>
                  <StudentCardFront
                    student={{
                      ...el.student,
                      image: `${API_ENDPOINT}${el.student.image}`,
                    }}
                    group={el.group}
                    cardType={cardType}
                  />
                </Grid>
              );
            })}
            {/* <Grid xs={12} item>
              <div style={{ height: "80vh", breakInside: "avoid" }}>
                <StudentCardBack
                  teacher={{
                    name: user?.name,
                    phone: user?.phone,
                    phone2: user?.phoneNumber_2,
                  }}
                  cardType={cardType}
                />
              </div>
            </Grid> */}
          </Grid>
        )}
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
                <Grid xs={6} item padding={0} >
                  <div style={{}}>
                    <StudentCardBack
                      teacher={{
                        name: user?.name,
                        phone: user?.phone,
                        phone2: user?.phoneNumber_2,
                      }}
                      cardType={cardType}
                    />
                  </div>
                </Grid>
              )
            })}

          </Grid>
        )}
      </div>
    </>
  );
};

export default ViewGroups;
