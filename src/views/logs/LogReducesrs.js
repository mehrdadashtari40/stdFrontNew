import {GET_ALL_LOGS} from "./LogActions";

const initialState = {
    allLogData: [],
    current_log_type: null
};

const LogReducers = (state = initialState, action) => {
    switch (action.type) {

        case GET_ALL_LOGS:

            return {
                ...state,
                allLogData: action.allLogData,
                current_log_type: action.log_type
            }
        default:
            return state;
    }
};

export default LogReducers;
  
