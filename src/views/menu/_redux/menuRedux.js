export const actionTypes = {
    setVariable: "[menuSettings] setVariable Action",
    refreshMenu : '[layout] RefreshMenu Action'
};

export const initialState = {
    categoriesList: [],
    currentCatUID: "",
    currentCatName: "",
    openEdit: false,
    openSubMenu: false,
    openSubMenuEdit: false,
    processList: [],
    currentTasUid: "",
    activeLanguages: []
};

export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.setVariable: {
            const varName = action.varName;
            let prp = { ...state };
            prp[varName] = action.payload;
            return prp;
        }
        default:
            return { ...state };
    }
}

export const actions = {
    handle_variables: (varName, value) => ({ type: actionTypes.setVariable, varName: varName, payload: value }),
    handle_refresh_menu: () => ({type: actionTypes.refreshMenu})
};