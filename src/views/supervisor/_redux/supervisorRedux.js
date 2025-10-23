export const actionTypes = {
    setVariable: "[supervisor] setVariable Action",
    tasksLoaded: "[supervisor] tasksLoaded Action",
    filtersLoaded: "[supervisor] filtersLoaded Action",
    customFieldsLoaded: "[supervisor] customFieldsLoaded Action",
    filterByAction: "[supervisor] filterByAction Action",
    filterByProUid: "[supervisor] filterByProUid Action",
    filterByText: "[supervisor] filterByText Action",
    filterByFromDate: "[supervisor] filterByFromDate Action",
    filterByToDate: "[supervisor] filterByToDate Action",
    filterByDateRange: "[supervisor] filterByDateRange Action",
    handleHistoryModal: "[supervisor] handleHistoryModal Action",
    historyLoaded: "[supervisor] historyLoaded Action",
    handleInfoModal: "[supervisor] handleInfoModal Action",
    infoLoaded: "[supervisor] infoLoaded Action",
    handleTagModal: "[supervisor] handleTagModal Action",
    RESET_STORE : 'RESET_STORE',
    refreshInbox : '[supervisor] Refresh Action'
};

export const initialState = {
    is_inbox_loading:0,
    is_datatable_loading:true,
    tasks:[],
    custom_fields:[],
    task_start_number:1,
    current_context_holder:null,
    filter_types:[1,2,3],
    filter_type_open:false,
    current_action:"to_revise",
    current_pro_uid:"",
    pg_current_page:0,
    pg_total_size:0,
    pg_per_page:10,
    search_text:"",
    from_date:"",
    to_date:"",
    date_range:"",
    is_modal_loading:true,
    open_history_modal:false,
    history_items:[],
    open_info_modal:false,
    info_items:null,
    open_tag_modal:false,
    tags_loaded:false,
    tags:[],
    inbox_filters:[],
    current_app_uid:null,
    existing_tag_ids:[]
};

export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.setVariable: {
            const varName = action.varName;
            let prp = {...state};
            prp[varName] = action.payload;
            return prp;
        }
        case actionTypes.tasksLoaded: {
            return { ...state, is_inbox_loading: 2,
                pg_current_page: Math.ceil(action.payload.start/action.payload.limit),
                pg_total_size: action.payload.total,
                pg_per_page: action.payload.limit,
                is_datatable_loading: false,
                tasks: action.payload.data,
            };
        }
        case actionTypes.filtersLoaded: {
            return { ...state, inbox_filters: action.payload};
        }
        case actionTypes.filterByAction: {
            return { ...state,
                is_inbox_loading: 0,
                current_action: action.payload,
                pg_current_page:0,
            };
        }
        case actionTypes.filterByProUid: {
            return { ...state,
                is_inbox_loading: 0,
                current_pro_uid: action.payload,
                pg_current_page:0,
            };
        }
        case actionTypes.filterByText: {
            return { ...state,
                is_inbox_loading: 0,
                search_text: action.payload,
                pg_current_page:0,
            };
        }
        case actionTypes.filterByDateRange: {
            return { ...state,
                is_inbox_loading: 0,
                date_range: action.payload,
                pg_current_page:0,
            };
        }
        case actionTypes.filterByFromDate: {
            return { ...state,
                is_inbox_loading: 0,
                from_date: action.payload,
                pg_current_page:0,
            };
        }
        case actionTypes.filterByToDate: {
            return { ...state,
                is_inbox_loading: 0,
                to_date: action.payload,
                pg_current_page:0,
            };
        }
        case actionTypes.customFieldsLoaded: {
            return { ...state,
                custom_fields: action.payload,
            };
        }
        case actionTypes.handleHistoryModal: {
            return { ...state,
                is_modal_loading:!action.payload,
                open_history_modal:action.payload,
                current_context_holder:null
            };
        }
        case actionTypes.historyLoaded: {
            return { ...state,
                is_modal_loading:false,
                history_items:action.payload,
            };
        }
        case actionTypes.handleInfoModal: {
            return { ...state,
                is_modal_loading:!action.payload,
                open_info_modal:action.payload,
                current_context_holder:null
            };
        }
        case actionTypes.infoLoaded: {
            return { ...state,
                is_modal_loading:false,
                info_items:action.payload,
            };
        }
        case actionTypes.handleTagModal: {
            return { ...state,
                open_tag_modal:action.payload,
                current_context_holder:null
            };
        }
        case actionTypes.RESET_STORE: {
            return initialState;
        }
        case actionTypes.refreshInbox: {
            return initialState;
        }
        default:
            return {...state};
    }
}

export const actions = {
    handle_variables: (varName, value) => ({type: actionTypes.setVariable, varName: varName, payload: value}),
    tasks_loaded: (tasks) => ({type: actionTypes.tasksLoaded, payload: tasks}),
    filters_loaded: (filters) => ({type: actionTypes.filtersLoaded, payload: filters}),
    set_custom_fields: (fields) => ({type: actionTypes.customFieldsLoaded, payload: fields}),
    handle_history_modal: (state) => ({type: actionTypes.handleHistoryModal, payload: state}),
    history_loaded: (items) => ({type: actionTypes.historyLoaded, payload: items}),
    handle_info_modal: (state) => ({type: actionTypes.handleInfoModal, payload: state}),
    info_loaded: (items) => ({type: actionTypes.infoLoaded, payload: items}),
    handle_tag_modal: (state) => ({type: actionTypes.handleTagModal, payload: state}),
};