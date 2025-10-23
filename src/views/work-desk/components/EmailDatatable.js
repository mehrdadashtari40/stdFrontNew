import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { get_emails } from "../_redux/workDeskCrud";
import { actions } from "../_redux/workDeskRedux";
import { Button, Box, CircularProgress } from "@mui/material";
import EmailSearch from "./EmailSearch";
import EmailContentModal from "./EmailContentModal";
import { receptionsFormatter } from "./columnFormatters/receptionsFormatter";
import { CreatedDateFormatter } from "./columnFormatters/dateFormatter";

// MUI compatible formatters
const MUIReceptionsFormatter = (value) => {
  return receptionsFormatter(value, { receptions: value });
};

const MUICreatedDateFormatter = (value) => {
  return CreatedDateFormatter(value, { created_at: value });
};

export default () => {
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const { state } = useSelector(
    (state) => ({
      state: state.workDeskReducer,
    }),
    shallowEqual
  );

  const token = localStorage.getItem("access_token");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = (params = {}) => {
    setIsLoading(true);
    const defaultParams = { offset: page + 1, limit };
    get_emails(token, { ...defaultParams, ...params })
      .then((res) => {
        const data = res.data?.data || [];
        const processedData = data.map((row, index) => ({
          ...row,
          id: row.id || row._id || `row-${index}`
        }));
        dispatch(actions.handle_variables("emails", processedData));
        dispatch(actions.handle_variables("document_length", res.data?.length || 0));
        setIsLoading(false);
      })
      .catch(() => {
        dispatch(actions.handle_variables("emails", []));
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

  const handleViewEmail = (content) => {
    dispatch(actions.handle_variables("emailContentModal", true));
    dispatch(actions.handle_variables("currentContent", content));
  };

  const columns = [
    {
      field: "subject",
      headerName: "موضوع ایمیل",
      flex: 1,
    },
    {
      field: "receptions",
      headerName: "گیرندگان",
      flex: 1,
      renderCell: (params) => MUIReceptionsFormatter(params.value)
    },
    {
      field: "tc_title",
      headerName: "کمیته فنی",
      flex: 1,
    },
    {
      field: "sc_title",
      headerName: "کمیته فرعی",
      flex: 1,
    },
    {
      field: "created_at",
      headerName: "تاریخ ارسال",
      flex: 1,
      renderCell: (params) => MUICreatedDateFormatter(params.value)
    },
    {
      field: "action",
      headerName: "عملیات",
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="success"
          fullWidth
          onClick={() => handleViewEmail(params.row?.content)}
          sx={{ height: "3.5rem" }}
        >
          مشاهده
        </Button>
      ),
    },
  ];

  const rows = (state.emails || []).map((row, index) => ({
    ...row,
    id: row.id || row._id || `row-${index}`
  }));

  return (
    <>
      <EmailSearch />
      <EmailContentModal />
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
    </>
  );
};