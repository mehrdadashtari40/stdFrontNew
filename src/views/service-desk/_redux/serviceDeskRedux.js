export const actionTypes = {
    setVariable: "[service desk] setVariable Action",
    SET_Table_DATA: "[service desk] SET Table DATA Action",

    tasksLoaded: "[service desk] GET_Table_DATA Action",
    filtersLoaded: "[service desk] filtersLoaded Action",
    customFieldsLoaded: "[service desk] customFieldsLoaded Action",
    filterByAction: "[service desk] filterByAction Action",
    filterByProUid: "[service desk] filterByProUid Action",
    filterByText: "[service desk] filterByText Action",
    filterByFromDate: "[service desk] filterByFromDate Action",
    filterByToDate: "[service desk] filterByToDate Action",
    filterByDateRange: "[service desk] filterByDateRange Action",
    handleHistoryModal: "[service desk] handleHistoryModal Action",
    historyLoaded: "[service desk] historyLoaded Action",
    handleInfoModal: "[service desk] handleInfoModal Action",
    infoLoaded: "[service desk] infoLoaded Action",
    handleTagModal: "[service desk] handleTagModal Action",
    RESET_STORE: 'RESET_STORE',
    refreshInbox: '[service desk] Refresh Action'
};

export const initialState = {
    isConfigLoaded:false,
    isServicesLoaded:false,
    isCategoriesLoaded:false,
    isNotificationsLoaded:false,
    messageUrl: '/',
    show: false,
    selectedKey: "id",
    Categories: [],
    services: [],
    QueryList: [],
    filter: [],
    notifications: [],
    searchFilter: "",
    serviceInfo: [],
    CurrentInfo: [],
    isTourOpen: false,
    accessibilityFontSize:0,
    visit:{},
    rating: {
        value: 1,
        text: "",
        serviceId: -1
    }
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