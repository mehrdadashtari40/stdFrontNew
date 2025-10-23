import React, { useContext, useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useHistory } from "react-router-dom";
import { withTranslation } from "react-i18next";
import moment from "jalali-moment";
import { Button, Box, CircularProgress, Modal, Typography, Chip, Checkbox, Menu, MenuItem, IconButton } from "@mui/material";
import { MoreVert as MoreVertIcon, StarBorder as StarBorderIcon, Star as StarIcon } from "@mui/icons-material";
import { AppConfig } from "../../../appConfig";
import {
  get_assigned_tags,
  get_case_info,
  get_custom_fields,
  get_history_info,
  get_inbox_tasks,
  post_assigned_tags,
} from "../_redux/supervisorCrud";
import { get_inbox_filters, get_tag_list } from "../../../common/layout/_redux/layoutCrud";
import { smallBox } from "../../../common/utils/functions";
import postAuthonticatedJSON from "../../../common/utils/functions/postAuthenticatedJSON";
import { config } from "../../../config/config";
import CaseHistory from "../../inbox/components/CaseHistory";
import TaskInfo from "../../inbox/components/TaskInfo";
import Spinner from "../../../common/Spinner/Spinner";

// Redux actions mapping (simplified version)
const mapStateToProps = (state) => ({
  state: state.supervisor,
});

const mapDispatchToProps = (dispatch) => ({
  handle_variables: (key, value) => dispatch({ type: 'SUPERVISOR_HANDLE_VARIABLES', payload: { key, value } }),
  tasks_loaded: (data) => dispatch({ type: 'SUPERVISOR_TASKS_LOADED', payload: data }),
  filters_loaded: (data) => dispatch({ type: 'SUPERVISOR_FILTERS_LOADED', payload: data }),
  set_custom_fields: (data) => dispatch({ type: 'SUPERVISOR_SET_CUSTOM_FIELDS', payload: data }),
  handle_history_modal: (open) => dispatch({ type: 'SUPERVISOR_HANDLE_HISTORY_MODAL', payload: open }),
  history_loaded: (data) => dispatch({ type: 'SUPERVISOR_HISTORY_LOADED', payload: data }),
  handle_info_modal: (open) => dispatch({ type: 'SUPERVISOR_HANDLE_INFO_MODAL', payload: open }),
  info_loaded: (data) => dispatch({ type: 'SUPERVISOR_INFO_LOADED', payload: data }),
  handle_tag_modal: (open) => dispatch({ type: 'SUPERVISOR_HANDLE_TAG_MODAL', payload: open }),
});

function Supervisor(props) {
  const { apiServer } = useContext(AppConfig);
  const dispatch = useDispatch();
  const history = useHistory();
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentRow, setCurrentRow] = useState(null);

  const { state } = useSelector(
    (state) => ({
      state: state.supervisor,
    }),
    shallowEqual
  );

  useEffect(() => {
    if (state?.is_inbox_loading === 0) {
      props.handle_variables('is_inbox_loading', 1);
      props.handle_variables('is_datatable_loading', true);
      let filters = {
        search_text: state.search_text,
        action: state.current_action,
        pro_uid: state.current_pro_uid,
        from_date: state.from_date,
        to_date: state.to_date,
        date_range: state.date_range,
      };
      get_inbox_tasks(apiServer, state.pg_current_page, state.pg_per_page, filters).then(res => {
        props.tasks_loaded(res);
      });
      get_inbox_filters(state.current_action).then(res => {
        let items = [];
        res.map(x => {
          if (items[x.PRO_UID] === undefined)
            items[x.PRO_UID] = {
              "PRO_UID": x.PRO_UID,
              "APP_PRO_TITLE": x.APP_PRO_TITLE,
              "ITEMS": [
                {
                  "APP_TAS_TITLE": x.APP_TAS_TITLE,
                  "TAS_UID": x.TAS_UID
                }
              ]
            };
          else {
            let item = items[x.PRO_UID];
            item.ITEMS.push({
              "APP_TAS_TITLE": x.APP_TAS_TITLE,
              "TAS_UID": x.TAS_UID
            });
            items[x.PRO_UID] = item;
          }
        });
        items = Object.values(items);
        props.filters_loaded(items);
      });
      if (state.current_pro_uid !== "") {
        get_custom_fields(apiServer, state.current_pro_uid).then(res => {
          props.set_custom_fields(res);
        });
      } else if (state.custom_fields?.length > 0) {
        props.set_custom_fields([]);
      }
      if (state.tags_loaded === false) {
        get_tag_list(apiServer).then(res => {
          props.handle_variables('tags', Object.keys(res).map(x => res[x]));
        });
      }
    }
  }, [state, apiServer]);

  const handle_filter_change = (checked, id) => {
    let filters = state.filter_types || [];
    if (checked) {
      filters.push(id);
    } else {
      filters = filters.filter(x => x !== id);
    }
    props.handle_variables('filter_types', filters);
  };

  const handle_open_case = (item) => {
    if (item.action === 'unassigned') {
      postAuthonticatedJSON(
        config.apiServer + 'extrarest/case/' + item.app_uid + '/claim'
      ).then(res => { });
      history.push('/newInbox/detail/' + item.app_uid + '/' + item.del_index);
    } else {
      history.push('/newInbox/detail/' + item.app_uid + '/' + item.del_index);
    }
  };

  const show_process_map = (item) => {
    history.push('/newInbox/processMap/' + item.app_uid + '/' + item.pro_uid);
  };

  const show_history = (item) => {
    props.handle_history_modal(true);
    get_history_info(apiServer, item.app_uid).then(res => {
      props.history_loaded(res);
    }).catch(error => {
      console.error("Error fetching history:", error);
    });
  };

  const show_info = (item) => {
    props.handle_info_modal(true);
    get_case_info(item).then(res => {
      props.info_loaded(res);
    }).catch(error => {
      console.error("Error fetching info:", error);
    });
  };

  const show_tags = (item, uid) => {
    props.handle_tag_modal(true);
    getSelectedTag(uid);
  };

  const handleClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setCurrentRow(row);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setCurrentRow(null);
  };

  const getSelectedTag = (id) => {
    get_assigned_tags(apiServer, id).then(res => {
      let ids = [];
      Object.values(res).map(d => {
        ids.push(d.ID);
      });
      props.handle_variables('existing_tag_ids', ids);
      props.handle_variables('current_app_uid', id);
    });
  };

  const handelAssignTags = (selected) => {
    let forAssign = selected.filter(data => {
      return state.existing_tag_ids?.indexOf(data) < 0;
    });
    let forUnAssign = state.existing_tag_ids?.filter(data => {
      return selected.indexOf(data) < 0;
    });
    if (forAssign.length > 0 || forUnAssign.length > 0) {
      post_assigned_tags(apiServer, state.current_app_uid, selected).then(res => {
        props.handle_variables('existing_tag_ids', selected);
        // handle_on_page_change(state.pg_current_page, state.pg_per_page)
        smallBox({
          title: props.t('Successfully'),
          content: '<i>' + props.t('Data has been saved successfully') + '</i>',
          color: '#659265',
          iconSmall: 'fa fa-check fa-2x fadeInRight animated',
          timeout: 4000,
        });
      });
    }
  };

  // Base columns
  const baseColumns = [
    {
      field: 'app_uid',
      headerName: 'ردیف',
      width: 80,
      headerAlign: 'center',
      align: 'center',
      renderHeader: () => (
        <Box sx={{ position: 'relative' }}>
          <IconButton 
            size="small"
            onClick={(e) => {
              props.handle_variables('filter_type_open', !state.filter_type_open);
            }}
          >
            {state.filter_types?.length > 2 ? (
              <StarIcon fontSize="small" />
            ) : (
              state.filter_types?.length === 0 ? (
                <StarBorderIcon fontSize="small" />
              ) : (
                <StarBorderIcon fontSize="small" />
              )
            )}
          </IconButton>
          {/* Filter dropdown would go here if needed */}
        </Box>
      ),
      renderCell: () => (
        <Box sx={{ textAlign: 'center' }}>
          <StarBorderIcon fontSize="small" />
        </Box>
      ),
    },
    {
      field: 'app_pro_title',
      headerName: props.t('Task Name'),
      flex: 2,
      renderCell: (params) => (
        <Box 
          sx={{ cursor: 'pointer' }} 
          onClick={() => handle_open_case(params.row)}
        >
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
      field: 'app_tas_title',
      headerName: props.t('Process Name'),
      flex: 2,
      renderCell: (params) => (
        <Box 
          sx={{ cursor: 'pointer' }} 
          onClick={() => handle_open_case(params.row)}
        >
          <Typography variant="body2">
            {params.row.app_pro_title}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'tags',
      headerName: '',
      flex: 1.5,
      renderCell: (params) => {
        const tags = Object.values(params.row.tags || {});
        return (
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            {tags.map((tag, index) => (
              <Chip
                key={index}
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

  // Custom fields columns
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
      return temp;
    },
  }));

  const actionColumns = [
    {
      field: 'previous_user',
      headerName: props.t("Erja"),
      flex: 1,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2">{params.row.previous_user}</Typography>
          <Typography variant="caption">
            {moment(params.row.del_delegate_date, 'YYYY-M-D HH:mm:ss').locale('fa').format('YYYY/MM/DD')}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'actions',
      headerName: props.t("Action"),
      width: 80,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton
            size="small"
            onClick={(e) => handleClick(e, params.row)}
          >
            <MoreVertIcon />
          </IconButton>
        </>
      ),
    },
  ];

  const columns = [...baseColumns, ...customFieldColumns, ...actionColumns];

  const rows = (state.tasks || []).map((row, index) => ({
    ...row,
    id: row.app_uid || index
  }));

  const getRowClassName = (params) => {
    return row.del_init_date !== null ? '' : 'unread-row';
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

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={state.pg_per_page || 10}
          rowsPerPageOptions={[5, 10, 20, 50]}
          rowCount={state.pg_total_size || 0}
          paginationMode="server"
          pagination
          loading={state.is_datatable_loading}
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

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={() => { show_process_map(currentRow); handleCloseMenu(); }}>
          {props.t("ProcessMap")}
        </MenuItem>
        <MenuItem onClick={() => { show_history(currentRow); handleCloseMenu(); }}>
          {props.t("ProcessHistory")}
        </MenuItem>
        <MenuItem onClick={() => { show_info(currentRow); handleCloseMenu(); }}>
          {props.t("ProcessInfo")}
        </MenuItem>
        <MenuItem onClick={() => { show_tags(true, currentRow?.app_uid); handleCloseMenu(); }}>
          {props.t("ProcessTag")}
        </MenuItem>
      </Menu>

      {/* History Modal */}
      <Modal
        open={state.open_history_modal || false}
        onClose={() => props.handle_history_modal(false)}
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
              onClick={() => props.handle_history_modal(false)}
            >
              {props.t("Return")}
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Info Modal */}
      <Modal
        open={state.open_info_modal || false}
        onClose={() => props.handle_info_modal(false)}
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
              onClick={() => props.handle_info_modal(false)}
            >
              {props.t("Return")}
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Tag Modal */}
      <Modal
        open={state.open_tag_modal || false}
        onClose={() => props.handle_tag_modal(false)}
      >
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
            {props.t("ProcessTag")}
          </Typography>
          {/* Note: You'll need to replace DualListBox with a MUI equivalent */}
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              onClick={() => props.handle_tag_modal(false)}
            >
              {props.t("Return")}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

export default withTranslation()(Supervisor);