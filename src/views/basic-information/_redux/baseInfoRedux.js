export const actionTypes = {
    setVariable: "[base info] setVariable Action",
    SET_Table_DATA: "[base info] SET Table DATA Action",

    tasksLoaded: "[base info] GET_Table_DATA Action",
    filtersLoaded: "[base info] filtersLoaded Action",
    customFieldsLoaded: "[base info] customFieldsLoaded Action",
    filterByAction: "[base info] filterByAction Action",
    filterByProUid: "[base info] filterByProUid Action",
    filterByText: "[base info] filterByText Action",
    filterByFromDate: "[base info] filterByFromDate Action",
    filterByToDate: "[base info] filterByToDate Action",
    filterByDateRange: "[base info] filterByDateRange Action",
    handleHistoryModal: "[base info] handleHistoryModal Action",
    historyLoaded: "[base info] historyLoaded Action",
    handleInfoModal: "[base info] handleInfoModal Action",
    infoLoaded: "[base info] infoLoaded Action",
    handleTagModal: "[base info] handleTagModal Action",
    RESET_STORE: 'RESET_STORE',
    refreshInbox: '[base info] Refresh Action'
};

export const initialState = {
    tablesList: [],
    structure: [],
    data: [],
    loading: false,
    selectedTable: '',
    primaryKey: '',
    newRowData: [],
    editRowItem: {},
};

export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.setVariable: {
            let prp = {...state};
            Object.assign(prp, action.payload);
            return prp;
        }
        case actionTypes.SET_Table_DATA: {
            return { ...state, is_inbox_loading: 2,
                structure: action.payload['structure'],
                data: action.payload['data'],
                selectedTable: action.tableName,
            };
        }
        default:
            return {...state};
    }
}

export const actions = {
    handle_variables: (value) => ({type: actionTypes.setVariable, payload: value}),
    handle_reset_store: () => ({type: actionTypes.RESET_STORE}),
    set_table_data: (table,tableName) => ({type: actionTypes.SET_Table_DATA, payload: table,tableName:tableName}),
};