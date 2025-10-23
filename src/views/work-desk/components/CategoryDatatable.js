import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { delete_category, get_all_categories } from "../_redux/workDeskCrud";
import { actions } from "../_redux/workDeskRedux";
import { Button, Box, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";

export default () => {
  const [page, setPage] = useState(0);
  const [current, setCurrent] = useState(null);
  const [limit, setLimit] = useState(10);
  const [delModal, setDelModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const token = localStorage.getItem("access_token");
  const dispatch = useDispatch();

  const { state } = useSelector(
    (state) => ({
      state: state.workDeskReducer,
    }),
    shallowEqual
  );

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = (params = {}) => {
    setIsLoading(true);
    const defaultParams = { offset: page + 1, limit };
    get_all_categories(token, { ...defaultParams, ...params })
      .then(async (res) => {
        const obj = {};
        const result = [];
        res.data.data.map((el) => {
          const {
            category_title,
            id,
            sc_app_uid,
            sc_code,
            tc_app_uid,
            tc_code,
          } = el;
          if (!obj[el.id]) {
            obj[el.id] = {
              category_title,
              id,
              tcs: [{ tc_app_uid, tc_code, scs: [{ sc_app_uid, sc_code }] }],
            };
          } else if (obj[el.id]) {
            obj[el.id]?.tcs.push({
              tc_app_uid,
              tc_code,
              scs: [{ sc_app_uid, sc_code }],
            });
          }
        });
        const keys = Object.keys(obj);
        keys.map((es) => {
          result.push(obj[es]);
        });
        result.map((le, idx) => {
          const obj2 = {};
          const secRes = [];
          le.tcs.map((v) => {
            if (!obj2[v.tc_app_uid]) {
              obj2[v.tc_app_uid] = v;
            }
          });
          const kes = Object.keys(obj2);
          kes.map((n) => {
            secRes.push(obj2[n]);
          });
          result[idx].tcs = secRes;
        });
        
        dispatch(actions.handle_variables("rawCategories", res.data.data));
        dispatch(actions.handle_variables("categories", result));
        dispatch(actions.handle_variables("category_length", res.data.total));
        setIsLoading(false);
      })
      .catch(() => {
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

  const deleteHandler = () => {
    delete_category(current).then((res) => {
      const filtered = state.rawCategories.filter((el) => {
        return el?.id !== current;
      });
      dispatch(actions.handle_variables("rawCategories", filtered));
      handleClose();
    });
  };

  const handleClose = () => {
    setDelModal(false);
  };

  const delModalOpen = (row) => {
    setCurrent(row?.id);
    setDelModal(true);
  };

  const handleEdit = (row) => {
    dispatch(actions.handle_variables("currentData", row));
    dispatch(actions.handle_variables("submitType", "edit"));
    dispatch(actions.handle_variables("tableType", "category"));
    dispatch(actions.handle_variables("modalOpen", true));
  };

  const handleAdd = () => {
    dispatch(
      actions.handle_variables("currentData", { expire_date: null })
    );
    dispatch(actions.handle_variables("modalOpen", true));
    dispatch(actions.handle_variables("submitType", "create"));
  };

  const columns = [
    {
      field: "category_title",
      headerName: "دسته بندی",
      flex: 1,
    },
    {
      field: "action",
      headerName: "عملیات",
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          {/* <Button
            variant="contained"
            color="error"
            size="small"
            startIcon={<DeleteIcon />}
            onClick={() => delModalOpen(params.row)}
          >
            حذف
          </Button> */}
          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={<EditIcon />}
            onClick={() => handleEdit(params.row)}
          >
            ویرایش
          </Button>
        </Box>
      ),
    },
  ];

  const rows = (state.categories || []).map((row, index) => ({
    ...row,
    id: row.id || `row-${index}`
  }));

  return (
    <Box sx={{ width: "100%", p: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 2 }}>
        <Button
          variant="contained"
          color="success"
          onClick={handleAdd}
          sx={{ color: "white" }}
        >
          افزودن دسته بندی
        </Button>
      </Box>
      
      <Box sx={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={limit}
          rowsPerPageOptions={[5, 10, 20, 50]}
          rowCount={state.category_length || 0}
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

      <Dialog open={delModal} onClose={handleClose}>
        <DialogTitle>حذف دسته بندی</DialogTitle>
        <DialogContent>
          <Typography>آیا از حذف این دسته بندی اطمینان دارید؟</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            انصراف
          </Button>
          <Button onClick={deleteHandler} color="error" variant="contained">
            حذف
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};