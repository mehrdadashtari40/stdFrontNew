
import getAuthonticatedJSON from "../../common/utils/functions/getAuthenticatedJSON";
import postAuthenticatedJSON from "../../common/utils/functions/postAuthenticatedJSON";
import { config } from "../../config/config";

export const GET_NOTIFICATIONS = 'GET_NOTIFICATIONS';



export function loadNotifications(url) {
	return dispatch => {
        return getAuthonticatedJSON(url).then(response =>{
            dispatch(setNotifications(response));
        })
	};
}

export function setNotifications(data) {
	return {
		type: GET_NOTIFICATIONS,
		notifications: data,
	};
}
