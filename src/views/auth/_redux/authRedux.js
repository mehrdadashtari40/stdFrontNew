export const actionTypes = {
    setVariable: "[auth] setVariable Action",
    RESET_STORE: 'RESET_STORE',

    OPEN_LOGIN_MODAL: 'OPEN_LOGIN_MODAL',

};

export const initialState = {
    captcha_code: "",
    envLoaded: false,
    loading: false,
    code: '',
    pmLogin: null,
    dontMatchCaptcha: false,
    username: '',
    password: '',
    usr_uid: '',
    clientId: '',
    static_info_loaded: false,
    clientSecret: '',
    languages: [],
    overrides: {},
    VerificationCode: '',
    NewPassword: '',
    NewPasswordConfirm: '',
    action: "",
    isAuthModalOpen: false,

};

export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.setVariable: {
            let prp = { ...state };
            Object.assign(prp, action.payload);
            return prp;
        }
        case actionTypes.OPEN_LOGIN_MODAL: {
            return {
                ...state,
                isAuthModalOpen: true,
                action: 'Login',
                captcha_text: ""
            };
        }

        default:
            return { ...state };
    }
}

export const actions = {
    handle_variables: (value) => ({ type: actionTypes.setVariable, payload: value }),
    handle_reset_store: () => ({ type: actionTypes.RESET_STORE }),
    handle_open_login_modal: () => ({ type: actionTypes.OPEN_LOGIN_MODAL }),
};