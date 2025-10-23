export const actionTypes = {
    setVariable: "[table] setVariable Action",
    tasksLoaded: "[table] tasksLoaded Action",
    customFieldsLoaded: "[table] customFieldsLoaded Action",
    filterByAction: "[table] filterByAction Action",
    filterByProUid: "[table] filterByProUid Action",
    filterByText: "[table] filterByText Action",
    filterByFromDate: "[table] filterByFromDate Action",
    filterByToDate: "[table] filterByToDate Action",
    filterByDateRange: "[table] filterByDateRange Action",
    handleHistoryModal: "[table] handleHistoryModal Action",
    historyLoaded: "[table] historyLoaded Action",
    handleInfoModal: "[table] handleInfoModal Action",
    infoLoaded: "[table] infoLoaded Action",
    handleTagModal: "[table] handleTagModal Action",
};

export const initialState = {
    Users: [],
    total: null,
    limit: null,
    current: null,
    pageCount: null,
    startPage: null,
    endPage: null,
    startIndex: null,
    endIndex: null,
    refresh: false,
    filter: '',
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
        default:
            return {...state};
    }
}

export const actions = {
    handle_variables: (varName, value) => ({type: actionTypes.setVariable, varName: varName, payload: value}),
    tasks_loaded: (tasks) => ({type: actionTypes.tasksLoaded, payload: tasks}),
};