import { actionTypes as inboxActionTypes } from "../../../views/inbox/_redux/inboxRedux";
export const actionTypes = {
  setVariable: "[layout] setVariable Action",
  setVariables: "[layout] setVariables Action",
  notificationsLoaded: "[layout] notificationsLoaded Action",
  tagsLoaded: "[layout] tagsLoaded Action",
  userInfoLoaded: "[layout] userInfoLoaded Action",
  menuItemsLoaded: "[layout] menuItemsLoaded Action",
  langItemsLoaded: "[layout] langItemsLoaded Action",
  biItemsLoaded: "[layout] biItemsLoaded Action",
  loadDataWithAction: "[layout] loadDataWithAction Action",
  logoutAction: "[layout] logout Action",
  RESET_STORE: "RESET_STORE",
  refreshInbox: "[inbox] Refresh Action",
  changeLoading: "[inbox] Change Loading Action",
  refreshMenu: "[layout] RefreshMenu Action",
};

export const initialState = {
  not_inbox: false,
  is_case_detail: false,
  is_bi_dashboard: false,
  loading: false,
  username: "آرین نوین",
  is_user_info_loading: 0,
  is_notifications_loading: 0,
  is_sidebar_collapsed: false,
  is_top_menu_loading: 0,
  is_tags_loading: 0,
  is_bi_menu_loading: 0,
  is_lang_loading: 0,
  ajax_loading: 0,
  is_token_checked: false,
  top_menu_items: [],
  bi_menu_items: [],
  tags: [],
  notifications: [],
  notifications_dropdown_open: false,
  fromDate: null,
  toDate: null,
  current_category: null,
  current_date_range: "",
  current_side_menu: 0,
  log_job_labels: [],
  user_permissions: [],
  process_description_modal_open: false,
  process_title: "",
  process_descriptions: "",
  user_role: null,
  langs: [],
  isMenuChange: false,
  menuChangeByAction: "todo",
  isItemsLoaded: false,
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.setVariable: {
      const varName = action.varName;
      let prp = { ...state };
      prp[varName] = action.payload;
      return prp;
    }
    case actionTypes.setVariables: {
      const data = action.payload;
      let prp = { ...state };
      data.map((x) => {
        prp[x[0]] = x[1];
      });
      return prp;
    }
    case actionTypes.changeLoading: {
      let prp = { ...state };
      prp.ajax_loading += action.payload;
      return prp;
    }
    case actionTypes.notificationsLoaded: {
      return {
        ...state,
        is_notifications_loading: 2,
        notifications: action.payload,
      };
    }
    case actionTypes.tagsLoaded: {
      return { ...state, is_tags_loading: 2, tags: action.payload };
    }
    case actionTypes.menuItemsLoaded: {
      return {
        ...state,
        is_top_menu_loading: 2,
        top_menu_items: action.payload,
      };
    }
    case actionTypes.biItemsLoaded: {
      return { ...state, is_bi_menu_loading: 2, bi_menu_items: action.payload };
    }
    case actionTypes.langItemsLoaded: {
      return { ...state, is_lang_loading: 2, langs: action.payload };
    }
    case actionTypes.userInfoLoaded: {
      return { ...state, is_user_info_loading: 2, username: action.payload };
    }
    case actionTypes.loadDataWithAction: {
      return {
        ...state,
        current_action: action.payload,
        username: action.payload,
      };
    }
    case actionTypes.logoutAction: {
      state = initialState;
      return { ...state };
    }
    case actionTypes.RESET_STORE: {
      return initialState;
    }
    case actionTypes.refreshMenu: {
      return { ...state, isMenuChange: true };
    }
    default:
      return { ...state };
  }
};

export const actions = {
  handle_variables: (varName, value) => ({
    type: actionTypes.setVariable,
    varName: varName,
    payload: value,
  }),
  handle_multi_variables: (data) => ({
    type: actionTypes.setVariables,
    payload: data,
  }),
  notifications_loaded: (notifications) => ({
    type: actionTypes.notificationsLoaded,
    payload: notifications,
  }),
  tags_loaded: (tags) => ({ type: actionTypes.tagsLoaded, payload: tags }),
  menu_items_loaded: (items) => ({
    type: actionTypes.menuItemsLoaded,
    payload: items,
  }),
  bi_menu_items_loaded: (items) => ({
    type: actionTypes.biItemsLoaded,
    payload: items,
  }),
  active_lang_loaded: (items) => ({
    type: actionTypes.langItemsLoaded,
    payload: items,
  }),
  user_info_loaded: (username) => ({
    type: actionTypes.userInfoLoaded,
    payload: username,
  }),
  load_data_with_action: (action) => ({
    type: inboxActionTypes.filterByAction,
    payload: action,
  }),
  load_data_with_pro_uid: (id) => ({
    type: inboxActionTypes.filterByProUid,
    payload: id,
  }),
  load_data_with_text_search: (text) => ({
    type: inboxActionTypes.filterByText,
    payload: text,
  }),
  load_data_with_from_date: (date) => ({
    type: inboxActionTypes.filterByFromDate,
    payload: date,
  }),
  load_data_with_to_date: (date) => ({
    type: inboxActionTypes.filterByToDate,
    payload: date,
  }),
  load_data_with_date_range: (date) => ({
    type: inboxActionTypes.filterByDateRange,
    payload: date,
  }),
  log_out: () => ({ type: actionTypes.logoutAction, payload: null }),
  handle_reset_store: () => ({ type: actionTypes.RESET_STORE }),
  handle_refresh_inbox: () => ({ type: actionTypes.refreshInbox }),
  change_loading: (amount) => ({
    type: actionTypes.changeLoading,
    payload: amount,
  }),
};
