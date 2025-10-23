import React, { useContext, useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { withTranslation } from "react-i18next";
import moment from "jalali-moment";
import { Button, Box, CircularProgress, Modal, Typography, Chip, Badge } from "@mui/material";
import { AppConfig } from "../../../appConfig";
import { config } from "../../../config/config";
import {
  get_assigned_tags,
  get_case_info,
  get_custom_fields,
  get_history_info,
  get_inbox_tasks,
  post_assigned_tags,
} from "../_redux/inboxCrud";
import { actions as layActions } from "../../../common/layout/_redux/layoutRedux";
import { actions as workDeskActions } from "../../work-desk/_redux/workDeskRedux";
import { get_inbox_filters, get_tag_list } from "../../../common/layout/_redux/layoutCrud";
import { check_role } from "../../work-desk/_redux/workDeskCrud";
import CaseHistory from "./CaseHistory";
import TaskInfo from "./TaskInfo";
import Spinner from "../../../common/Spinner/Spinner";
import { smallBox } from "../../../common/utils/functions";
import postAuthenticatedJSON from "../../../common/utils/functions/postAuthenticatedJSON";

// --- Action Creators for Inbox ---
// Assuming your inbox reducer handles these types
// Make sure these match the action types defined in your inbox Redux slice/reducer
const INBOX_HANDLE_VARIABLES = 'INBOX_HANDLE_VARIABLES';
const INBOX_TASKS_LOADED = 'INBOX_TASKS_LOADED';
const INBOX_FILTERS_LOADED = 'INBOX_FILTERS_LOADED';
const INBOX_SET_CUSTOM_FIELDS = 'INBOX_SET_CUSTOM_FIELDS';
const INBOX_HANDLE_HISTORY_MODAL = 'INBOX_HANDLE_HISTORY_MODAL';
const INBOX_HISTORY_LOADED = 'INBOX_HISTORY_LOADED';
const INBOX_HANDLE_INFO_MODAL = 'INBOX_HANDLE_INFO_MODAL';
const INBOX_INFO_LOADED = 'INBOX_INFO_LOADED';
const INBOX_HANDLE_TAG_MODAL = 'INBOX_HANDLE_TAG_MODAL';

// Define action creator functions
const handle_variables = (key, value) => ({
  type: INBOX_HANDLE_VARIABLES,
  payload: { key, value }
});

const tasks_loaded = (data) => ({
  type: INBOX_TASKS_LOADED,
  payload: data
});

const filters_loaded = (data) => ({
  type: INBOX_FILTERS_LOADED,
  payload: data
});

const set_custom_fields = (data) => ({
  type: INBOX_SET_CUSTOM_FIELDS,
  payload: data
});

const handle_history_modal = (open) => ({
  type: INBOX_HANDLE_HISTORY_MODAL,
  payload: open
});

const history_loaded = (data) => ({
  type: INBOX_HISTORY_LOADED,
  payload: data
});

const handle_info_modal = (open) => ({
  type: INBOX_HANDLE_INFO_MODAL,
  payload: open
});

const info_loaded = (data) => ({
  type: INBOX_INFO_LOADED,
  payload: data
});

const handle_tag_modal = (open) => ({
  type: INBOX_HANDLE_TAG_MODAL,
  payload: open
});
// --- End Action Creators ---


function Inbox(props) {
  const [isUniqued, setIsUniqued] = useState(false);
  const [registerLink, setRegisterLink] = useState(null);
  const { apiServer } = useContext(AppConfig);
  const dispatch = useDispatch();
  const history = useHistory();

  // Use useSelector to directly access state slices from the Redux store
  // Make sure these paths match your actual store configuration
  const state = useSelector((state) => state.inbox);
  const layout_state = useSelector((state) => state.layout2);
  const workDeskRedux = useSelector((state) => state.workDeskReducer);

  useEffect(() => {
    if (!isUniqued && layout_state?.current_category?.items) {
      const data = layout_state?.current_category?.items;
      const uniquedItems = data.filter(
        (arr, index, self) =>
          index === self.findIndex((t) => t.pro_uid === arr.pro_uid)
      );
      const x =
        uniquedItems.length !== 0 && uniquedItems ? uniquedItems[0] : null;
      if (x) {
        setRegisterLink(x);
      }
    }
    // Use dispatch instead of props.function
    if (state?.is_inbox_loading === 0) {
      dispatch(handle_variables("is_inbox_loading", 1));
      dispatch(handle_variables("is_datatable_loading", true));
      let filters = {
        search_text: state.search_text,
        action: state.current_action,
        pro_uid: state.current_pro_uid,
        from_date: state.from_date,
        to_date: state.to_date,
        date_range: state.date_range,
      };
      get_inbox_tasks(
        apiServer,
        window.localStorage.getItem("currentPage") || state.pg_current_page,
        state.pg_per_page,
        filters,
        "",
        localStorage.getItem("groupId") || null
      ).then((res) => {
        dispatch(tasks_loaded(res)); // Use dispatch
      });
      get_inbox_filters(apiServer, state.current_action).then((res) => {
        let items = [];
        res.forEach((x) => { // Changed map to forEach for side effects
          if (items[x.PRO_UID] === undefined)
            items[x.PRO_UID] = {
              PRO_UID: x.PRO_UID,
              APP_PRO_TITLE: x.APP_PRO_TITLE,
              ITEMS: [
                {
                  APP_TAS_TITLE: x.APP_TAS_TITLE,
                  TAS_UID: x.TAS_UID,
                },
              ],
            };
          else {
            let item = items[x.PRO_UID];
            item.ITEMS.push({
              APP_TAS_TITLE: x.APP_TAS_TITLE,
              TAS_UID: x.TAS_UID,
            });
            items[x.PRO_UID] = item;
          }
        });
        items = Object.values(items);
        dispatch(filters_loaded(items)); // Use dispatch
      });
      if (state.current_pro_uid !== "") {
        get_custom_fields(apiServer, state.current_pro_uid).then((res) => {
          dispatch(set_custom_fields(res)); // Use dispatch
        });
      } else if (state.custom_fields?.length > 0) {
        dispatch(set_custom_fields([])); // Use dispatch
      }
      if (state.tags_loaded === false) {
        get_tag_list(config.apiServer).then((res) => {
          dispatch( // Use dispatch
            handle_variables(
              "tags",
              Object.keys(res).map((x) => res[x])
            )
          );
        });
      }
    }
  }, [state, layout_state, isUniqued, apiServer, dispatch]); // Added dispatch to dependencies

  useEffect(() => {
    if (workDeskRedux.isNew === undefined) {
      check_role().then((res) => {
        // Use dispatch with the correct action creator
        dispatch(workDeskActions.handle_variables("isNew", res.data?.is_new));
        res.data.data.forEach((r) => { // Changed map to forEach
          if (r.ROLE_ID == 8 || r.ROLE_ID == 12) {
            dispatch(workDeskActions.handle_variables("hasAccess", true));
          }
        });
      });
    }
    // Use dispatch with the correct action creator
    dispatch(layActions.handle_variables("isItemsLoaded", false));
    // props.closeSidebarCollapse("is_sidebar_collapsed", false);
    // props.handle_refresh_menu();
  }, [workDeskRedux.isNew, dispatch]); // Added dispatch to dependencies

  const handle_open_case = (item) => {
    if (item.action === "unassigned") {
      postAuthenticatedJSON(
        config.apiServer + "extrarest/case/" + item.app_uid + "/claim"
      ).then((res) => {});
      history.push("/details/" + item.app_uid + "/" + item.del_index);
    } else {
      history.push("/details/" + item.app_uid + "/" + item.del_index);
    }
  };

  const show_process_map = (item) => {
    history.push("/process-map/" + item.app_uid + "/" + item.pro_uid);
  };

  const show_history = (item) => {
    // Use dispatch
    dispatch(handle_history_modal(true));
    get_history_info(apiServer, item.app_uid)
      .then((res) => {
        dispatch(history_loaded(res)); // Use dispatch
      })
      .catch((error) => {
        console.error("Error fetching history:", error);
      });
  };

  const show_info = (item) => {
    // Use dispatch
    dispatch(handle_info_modal(true));
    get_case_info(apiServer, item)
      .then((res) => {
        dispatch(info_loaded(res)); // Use dispatch
      })
      .catch((error) => {
        console.error("Error fetching info:", error);
      });
  };

  const show_tags = (item, uid) => {
    // Use dispatch
    dispatch(handle_tag_modal(true));
    getSelectedTag(uid);
  };

  const getSelectedTag = (id) => {
    get_assigned_tags(apiServer, id).then((res) => {
      let ids = [];
      Object.values(res).forEach((d) => { // Changed map to forEach
        ids.push(d.ID);
      });
      // Use dispatch
      dispatch(handle_variables("existing_tag_ids", ids));
      dispatch(handle_variables("current_app_uid", id));
    });
  };

  const handelAssignTags = (selected) => {
    let forAssign = selected.filter((data) => {
      return state.existing_tag_ids?.indexOf(data) < 0;
    });
    let forUnAssign = state.existing_tag_ids?.filter((data) => {
      return selected.indexOf(data) < 0;
    });
    if (forAssign.length > 0 || forUnAssign.length > 0) {
      post_assigned_tags(apiServer, state.current_app_uid, selected).then(
        (res) => {
          // Use dispatch
          dispatch(handle_variables("existing_tag_ids", selected));
          // handle_on_page_change(state.pg_current_page, state.pg_per_page);
          smallBox({
            title: props.t("Successfully"),
            content:
              "<i>" + props.t("Data has been saved successfully") + "</i>",
            color: "#659265",
            iconSmall: "fa fa-check fa-2x fadeInRight animated",
            timeout: 4000,
          });
        }
      );
    }
  };

  const handle_header_filter = (filter) => {
    // handle_on_page_change(1, state.pg_per_page, filter);
    let all = filter === "all";
    let read = filter === "read";
    let unread = filter === "unread";
    // Use dispatch
    dispatch(handle_variables("filter_flags", { all, read, unread }));
  };

  // Define columns
  const baseColumns = [
    {
      field: "app_pro_title",
      headerName: props.t("Task Name"),
      flex: 2,
      renderCell: (params) => (
        <Box sx={{ cursor: 'pointer' }} onClick={() => handle_open_case(params.row)}>
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            {params.row.app_tas_title}
          </Typography>
          <Typography variant="caption">
            {props.t("TaskNumber")}: {params.row.app_number}
          </Typography>
        </Box>
      ),
    },
    {
      field: "app_tas_title",
      headerName: props.t("Process Name"),
      flex: 2,
      renderCell: (params) => (
        <Box sx={{ cursor: 'pointer' }} onClick={() => handle_open_case(params.row)}>
          <Typography variant="body2">
            {params.row.app_pro_title}
          </Typography>
        </Box>
      ),
    },
    {
      field: "tags",
      headerName: "",
      flex: 1.5,
      renderCell: (params) => {
        const tags = Object.values(params.row.tags || {});
        return (
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            {tags.map((tag, index) => (
              <Chip
                key={index} // Using index as key for tags within a row is generally acceptable if tag order is stable
                label={tag.TITLE}
                size="small"
                sx={{
                  backgroundColor: tag.COLOR,
                  color: 'white',
                  height: '20px'
                }}
              />
            ))}
          </Box>
        );
      },
    },
  ];

  // Add custom fields columns
  const customFieldColumns = (state.custom_fields || []).map((field) => ({
    field: field.var_name,
    headerName: field.var_label,
    flex: 1,
    renderCell: (params) => {
      let temp = "";
      if (params.row.default_variable && params.row.default_variable.var_name === field.var_name) {
        temp = params.row.default_variable.var_value;
      }
      if (params.row.variables) {
        params.row.variables.forEach((y) => {
          if (y.var_name === field.var_name) temp = y.var_value;
        });
      }
      return (
        <Box sx={{ cursor: 'pointer' }} onClick={() => handle_open_case(params.row)}>
          {temp}
        </Box>
      );
    },
  }));

  const actionColumns = [
    {
      field: "previous_user",
      headerName: props.t("Erja"),
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ cursor: 'pointer' }} onClick={() => handle_open_case(params.row)}>
          <Typography variant="body2">{params.row.previous_user}</Typography>
          <Typography variant="caption">
            {moment(params.row.del_delegate_date, "YYYY-M-D HH:mm:ss")
              .locale("fa")
              .format("YYYY/MM/DD")}
          </Typography>
        </Box>
      ),
    },
    {
      field: "actions",
      headerName: props.t("Action"),
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="outlined"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              // Show context menu logic would go here
            }}
          >
            {props.t("Actions")}
          </Button>
        </Box>
      ),
    },
  ];

  const columns = [...baseColumns, ...customFieldColumns, ...actionColumns];

  const rows = (state.tasks || []).map((row, index) => ({
    ...row,
    id: row.app_uid || index // Ensure unique ID for DataGrid row
  }));

  const getRowClassName = (params) => {
    // Use params.row to access the row data
    return params.row.del_init_date !== null ? '' : 'unread-row';
  };

  // Modal styles
  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    maxHeight: '80vh',
    overflow: 'auto',
  };

  if (workDeskRedux.isNew) {
    return (
      <Box sx={{ margin: '5rem 2rem' }}>
        <Typography variant="h6" color="error">
          کاربر گرامی جهت تکمیل ثبت نام روی دکمه{" "}
          {registerLink ? (
            <Button
              variant="contained"
              color="primary"
              onClick={() =>
                history.push(
                  "/newInbox/create/" +
                    registerLink.pro_uid +
                    "/" +
                    registerLink.tas_uid
                )
              }
            >
              شروع تکمیل پروفایل
            </Button>
          ) : (
            "شروع تکمیل پروفایل"
          )}{" "}
          کلیک فرمایید
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ backgroundColor: "#efefef", p: 1, mb: 2 }}>
        <Button
          variant={state.filter_flags?.all ? "contained" : "outlined"}
          size="small"
          onClick={() => handle_header_filter("all")}
          sx={{ mr: 1 }}
          endIcon={<Badge badgeContent={state.total_read + state.total_unread || 0} color="primary" />}
        >
          {props.t("All")}
        </Button>
        <Button
          variant={state.filter_flags?.read ? "contained" : "outlined"}
          size="small"
          onClick={() => handle_header_filter("read")}
          sx={{ mr: 1 }}
          endIcon={<Badge badgeContent={state.total_read || 0} color="primary" />}
        >
          {props.t("Readed")}
        </Button>
        <Button
          variant={state.filter_flags?.unread ? "contained" : "outlined"}
          size="small"
          onClick={() => handle_header_filter("unread")}
          endIcon={<Badge badgeContent={state.total_unread || 0} color="primary" />}
        >
          {props.t("Unreaded")}
        </Button>
      </Box>

      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={state.pg_per_page || 10}
          rowsPerPageOptions={[5, 10, 20, 50]}
          rowCount={state.pg_total_size || 0}
          paginationMode="server"
          pagination
          loading={workDeskRedux.isNew === undefined}
          disableSelectionOnClick
          getRowClassName={getRowClassName}
          sx={{
            '& .unread-row': {
              backgroundColor: '#f5f5f5',
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: 'rgba(0, 0, 0, 0.05)',
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

      {/* History Modal */}
      <Modal
        open={state.open_history_modal || false}
        onClose={() => dispatch(handle_history_modal(false))} // Use dispatch
      >
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
            {props.t("ProcessHistory")}
          </Typography>
          {state.is_modal_loading ? (
            <Spinner />
          ) : (
            <CaseHistory caseHistories={state.history_items} />
          )}
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              onClick={() => dispatch(handle_history_modal(false))} // Use dispatch
            >
              {props.t("Return")}
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Info Modal */}
      <Modal
        open={state.open_info_modal || false}
        onClose={() => dispatch(handle_info_modal(false))} // Use dispatch
      >
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
            {props.t("ProcessInfo")}
          </Typography>
          {state.is_modal_loading ? (
            <Spinner />
          ) : (
            state.info_items && <TaskInfo taskInfo={state.info_items} />
          )}
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              onClick={() => dispatch(handle_info_modal(false))} // Use dispatch
            >
              {props.t("Return")}
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Tag Modal */}
      <Modal
        open={state.open_tag_modal || false}
        onClose={() => dispatch(handle_tag_modal(false))} // Use dispatch
      >
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
            {props.t("ProcessTag")}
          </Typography>
          {/* Note: You'll need to replace DualListBox with a MUI equivalent */}
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              onClick={() => dispatch(handle_tag_modal(false))} // Use dispatch
            >
              {props.t("Return")}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

// Connect the component using withTranslation HOC
export default withTranslation()(Inbox);