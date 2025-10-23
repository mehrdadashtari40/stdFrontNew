import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { get_all_documents } from "../_redux/workDeskCrud";
import { actions } from "../_redux/workDeskRedux";
import { DateFormatter, ExpiredFormatter } from "./columnFormatters/dateFormatter";
import { Button, Box, CircularProgress } from "@mui/material";
import DocumentSearch from "./DocumentSearch";
import { fixNumbers } from "./functions";

// MUI compatible formatters
const MUIDateFormatter = (value) => {
  return DateFormatter(value, { submit_date: value });
};

const MUIExpiredFormatter = (value) => {
  return ExpiredFormatter(value, { expire_date: value });
};

export default () => {
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  const token = localStorage.getItem("access_token");

  const { state } = useSelector(
    (state) => ({
      state: state.workDeskReducer,
    }),
    shallowEqual
  );

  const dispatch = useDispatch();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = (params = {}) => {
    setIsLoading(true);
    const defaultParams = { archive: 0, offset: page + 1, limit };
    get_all_documents(token, { ...defaultParams, ...params })
      .then((res) => {
        const data = res.data?.data || [];
        const processedData = data.map((row, index) => ({
          ...row,
          id: row.id || row._id || `row-${index}`
        }));
        dispatch(actions.handle_variables("documents", processedData));
        dispatch(actions.handle_variables("document_length", res.data?.length || 0));
        setIsLoading(false);
      })
      .catch(() => {
        dispatch(actions.handle_variables("documents", []));
        dispatch(actions.handle_variables("document_length", 0));
        setIsLoading(false);
      });
  };

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
  };

  const handleEditDocument = (row) => {
    try {
      const persianDate = new Date(row.expire_date).toLocaleDateString("fa-IR");
      const splittedExpiredDate = persianDate.split("/");
      
      dispatch(
        actions.handle_variables("currentData", {
          ...row,
          expire_date: {
            year: +fixNumbers(splittedExpiredDate[0]),
            month: +fixNumbers(splittedExpiredDate[1]),
            day: +fixNumbers(splittedExpiredDate[2]),
          },
        })
      );
      dispatch(actions.handle_variables("modalOpen", true));
      dispatch(actions.handle_variables("submitType", "edit"));
    } catch (error) {
      console.error("Error processing date:", error);
    }
  };

  const handleAddDocument = () => {
    dispatch(
      actions.handle_variables("currentData", { expire_date: null })
    );
    dispatch(actions.handle_variables("modalOpen", true));
    dispatch(actions.handle_variables("submitType", "create"));
  };

  const columns = [
    {
      field: "organization_title",
      headerName: "سازمان",
      flex: 1,
    },
    {
      field: "tc_title",
      headerName: "کمیته فنی متناظر",
      flex: 1,
    },
    {
      field: "title",
      headerName: "عنوان",
      flex: 1,
    },
    {
      field: "submit_date",
      headerName: "تاریخ ثبت",
      flex: 1,
      renderCell: (params) => MUIDateFormatter(params.value)
    },
    {
      field: "expire_date",
      headerName: "تاریخ اعتبار",
      flex: 1,
      renderCell: (params) => MUIExpiredFormatter(params.value)
    },
    {
      field: "submit_user",
      headerName: "درج کننده",
      flex: 1,
    },
    {
      field: "action",
      headerName: "عملیات",
      flex: 2,
      sortable: false,
      renderCell: (params) => {
        const row = params.row;
        const isExpired = new Date(row.expire_date) < new Date();
        const canEdit = state?.userId === row?.user_uid;
        
        return (
          <Box sx={{ display: "flex", gap: 1, width: "100%" }}>
            <Button
              variant="contained"
              color="success"
              size="small"
              disabled={isExpired}
              onClick={() => handleViewDocument(row)}
              sx={{ flex: 1, height: "3.5rem" }}
            >
              مشاهده
            </Button>
            <Button
              variant="contained"
              color="success"
              size="small"
              disabled={!canEdit}
              onClick={() => handleEditDocument(row)}
              sx={{ flex: 1, height: "3.5rem" }}
            >
              ویرایش
            </Button>
          </Box>
        );
      },
    },
  ];

  const rows = (state.documents || []).map((row, index) => ({
    ...row,
    id: row.id || row._id || `row-${index}`
  }));

  return (
    <Box sx={{ width: "100%", p: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Box sx={{ width: "20%" }}>
          {state.hasAccess && (
            <Button
              variant="contained"
              color="success"
              onClick={handleAddDocument}
              sx={{ color: "white" }}
            >
              افزودن مستند
            </Button>
          )}
        </Box>
      </Box>
      
      <DocumentSearch />
      
      <Box sx={{ height: 600, width: "100%", mt: 2 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={limit}
          rowsPerPageOptions={[5, 10, 20, 50]}
          rowCount={state.document_length || 0}
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
    </Box>
  );
};