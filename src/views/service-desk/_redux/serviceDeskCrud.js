import getAuthonticatedJSON from "../../../common/utils/functions/getAuthenticatedJSON";
import postAuthonticatedJSON from "../../../common/utils/functions/postAuthenticatedJSON";

export const GET_SERVICES_LIST_URL = "arian/sd/Service/";
export const GET_MY_SERVICES_LIST_URL = "servicedesk/MyService/";
export const GET_CATEGORIES_LIST_URL = "arian/sd/Category/";
export const GET_MY_CATEGORIES_LIST_URL = "servicedesk/MyCategory/";
export const GET_NOTIFICATIONS_LIST_URL = "arian/sd/notifications/";
export const GET_SERVICE_INFO_URL = "arian/sd/Service-info/";
export const GET_MY_SERVICE_INFO_URL = "servicedesk/MyService/";
export const POST_SERVICE_FEEDBACK_URL =  "arian/sd/feedback/";
export const GET_VISIT_COUNT_URL =  "arian/sd/visit_count/";

export function get_services(apiServer,pid) {
    return getAuthonticatedJSON(apiServer+GET_SERVICES_LIST_URL+pid)
}

export function get_visit_count(apiServer) {
    return getAuthonticatedJSON(apiServer+GET_VISIT_COUNT_URL)
}

export function get_categories(apiServer) {
    return getAuthonticatedJSON(apiServer+GET_CATEGORIES_LIST_URL)
}

export function get_my_services(apiServer,pid) {
    return getAuthonticatedJSON(apiServer+GET_MY_SERVICES_LIST_URL)
}

export function get_my_categories(apiServer) {
    return getAuthonticatedJSON(apiServer+GET_MY_CATEGORIES_LIST_URL)
}

export function get_notifications(apiServer) {
    return getAuthonticatedJSON(apiServer+GET_NOTIFICATIONS_LIST_URL)
}

export function get_service_info(apiServer,id) {
    return getAuthonticatedJSON(apiServer+GET_SERVICE_INFO_URL+id)
}

export function get_my_service_info(apiServer,id) {
    return getAuthonticatedJSON(apiServer+GET_MY_SERVICE_INFO_URL+id)
}

export function post_service_feedback(apiServer,data) {
    return postAuthonticatedJSON(apiServer+POST_SERVICE_FEEDBACK_URL,data)
}