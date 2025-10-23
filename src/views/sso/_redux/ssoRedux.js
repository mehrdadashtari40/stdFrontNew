import { actionTypes as inboxActionTypes } from '../../../views/inbox/_redux/inboxRedux'
export const actionTypes = {

    RESET_STORE: 'RESET_STORE',

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
    process_title: '',
    process_descriptions: '',
    user_role: null,
    langs: [],
    isMenuChange: false,
    menuChangeByAction: 'todo'
};

export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.RESET_STORE: {
            return initialState;
        }
        default:
            return { ...state };
    }
}

export const actions = {

    handle_reset_store: () => ({ type: actionTypes.RESET_STORE }),

};