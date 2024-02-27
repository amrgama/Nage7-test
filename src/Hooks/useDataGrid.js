import { useState } from "react";

const pageSizeOptions = [5, 10, 20, 25, 50, 100];
/**
 * @param {import("@mui/x-data-grid").DataGridProps} moreProps
 * @returns {{page:number,limit:number, dataGridProps:import("@mui/x-data-grid").DataGridProps}}
 */
export default function useDataGrid(moreProps) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(pageSizeOptions[0]);
  return {
    page: moreProps?.paginationModel?.page ?? page,
    limit:
      moreProps?.paginationModel?.pageSize ?? moreProps?.pageSize ?? pageSize,
    dataGridProps: {
      pagination: true,
      autoHeight: true,
      disableRowSelectionOnClick: true,
      pageSizeOptions,
      initialState: {
        pagination: {
          paginationModel: { pageSize, page },
        },
      },
      paginationMode: "server",
      onPageChange: (params) => {
        setPage(params.page);
      },
      onPaginationModelChange: (params) => {
        setPageSize(params.pageSize);
        setPage(params.page + 1);
      },
      pageSize,
      onPageSizeChange: ({ pageSize: newPageSize }) => {
        setPageSize(newPageSize);
      },
      ...moreProps,
    },
  };
}
