import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { get_all_documents } from "../_redux/workDeskCrud";
import { actions } from "../_redux/workDeskRedux";
import { ExpiredFormatter } from "./columnFormatters/dateFormatter";
import { documentStatsFormatter } from "./columnFormatters/documentStatsDormatter";
import { Button, Box, CircularProgress } from "@mui/material";
import moment from "moment-jalaali";

// Updated ExpiredFormatter for Material-UI
const MUIExpiredFormatter = (value) => {
  if (!value) return <span>نامشخص</span>;
  try {
    const persianDate = moment(value.substring(0, 10)).format("jYYYY/jMM/jDD");
    return <span>{persianDate}</span>;
  } catch (error) {
    return <span>نامشخص</span>;
  }
};

// Updated documentStatsFormatter for Material-UI
const MUIDocumentStatsFormatter = (value) => {
  return documentStatsFormatter(value, {}); // Pass empty object as row
};

export default () => {
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem("access_token");
  const dispatch = useDispatch();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = (params = {}) => {
    setIsLoading(true);
    const defaultParams = { archive: 1, offset: page + 1, limit };
    get_all_documents(token, { ...defaultParams, ...params })
      .then((res) => {
        const data = res.data?.data || [];
        const processedData = data.map((row, index) => ({
          ...row,
          id: row.id || row._id || `row-${index}`
        }));
        dispatch(actions.handle_variables("expiredDocuments", processedData));
        dispatch(actions.handle_variables("expiredDocument_length", res.data?.length || 0));
        setIsLoading(false);
      })
      .catch(() => {
        dispatch(actions.handle_variables("expiredDocuments", []));
        dispatch(actions.handle_variables("expiredDocument_length", 0));
        setIsLoading(false);
      });
  };

  const { state } = useSelector(
    (state) => ({ state: state.workDeskReducer }),
    shallowEqual
  );

  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetchData({ offset: newPage + 1, limit });
  };

  const handlePageSizeChange = (newPageSize) => {
    setLimit(newPageSize);
    setPage(0);
    fetchData({ offset: 1, limit: newPageSize });
  };

  const handleViewDocument = (row) => {
    dispatch(actions.handle_variables("currentDocument", row));
    dispatch(actions.handle_variables("tableType", "detail"));
    dispatch(actions.handle_variables("modalOpen", false));
  };

  const columns = [
    { field: "category", headerName: "دسته بندی محتوایی", flex: 1 },
    { field: "organization_title", headerName: "سازمان", flex: 1 },
    { field: "tc_title", headerName: "TC", flex: 1 },
    { field: "sc_title", headerName: "SC", flex: 1 },
    { 
      field: "is_comment_available", 
      headerName: "وضعیت مستند", 
      flex: 1,
      renderCell: (params) => MUIDocumentStatsFormatter(params.value)
    },
    { 
      field: "expire_date", 
      headerName: "تاریخ اعتبار", 
      flex: 1,
      renderCell: (params) => MUIExpiredFormatter(params.value)
    },
    {
      field: "action",
      headerName: "عملیات",
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="contained"
          fullWidth
          onClick={() => handleViewDocument(params.row)}
          sx={{ height: "3.5rem",backgroundColor:"#00a594",color:"white"}}
        >
          مشاهده
        </Button>
      ),
    },
  ];

  // Ensure rows have proper IDs
  const rows = (state.expiredDocuments || []).map((row, index) => ({
    ...row,
    id: row.id || row._id || `row-${index}`
  }));

  return (
    <Box sx={{ height: 600, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={limit}
        rowsPerPageOptions={[5, 10, 20, 50]}
        rowCount={state.expiredDocument_length || 0}
        paginationMode="server"
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        loading={isLoading}
        pagination
        disableSelectionOnClick
        sx={{
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "rgba(0, 0, 0, 0.05)",
          },
        }}
        components={{
          LoadingOverlay: () => (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
              <CircularProgress />
            </Box>
          ),
        }}
      />
    </Box>
  );
};