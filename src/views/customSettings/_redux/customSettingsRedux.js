export const actionTypes = {
    setVariable: "[customsettings] setVariable Action"
};

export const initialState = {
    loginPageAppTitle: "",
    loginPageOrgName: "",
    backgroundImage:"",
    logoImage:"",
    firstLink: {},
    secondLink: {}
};

export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.setVariable: {
            let prp = {...state};
            Object.assign(prp, action.payload);
            return prp;
        }
        default:
            return {...state};
    }
}

export const actions = {
    handle_variables: (value) => ({type: actionTypes.setVariable, payload: value})
   
};