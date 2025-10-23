import getAuthonticatedJSON from "../../../common/utils/functions/getAuthenticatedJSON";
import postAuthenticatedJSON from "../../../common/utils/functions/postAuthenticatedJSON";

const CATEGORIES_URL = 'arian/menu/categories/';
const ACTIVES_LANGUAGES_URL =  'arian/get-actives-languages/';
const CATEGORY_REORDER_URL =  'arian/menu/reorder-categories/';
const CATEGORY_PROCESS_URL =  'arian/menu/reorder-processes/';
const PROCESS_URL =  'arian/menu/processes/';

export function get_categories(apiServer) {
    return getAuthonticatedJSON(apiServer+CATEGORIES_URL)
}

export function get_categories_details(apiServer,id) {
    return getAuthonticatedJSON(apiServer+CATEGORIES_URL + id);
}

export function get_task_details(apiServer,id) {
    return getAuthonticatedJSON(apiServer+PROCESS_URL + id);
}

export function post_category_is_active(apiServer,id, isActive) {
    return postAuthenticatedJSON(apiServer+CATEGORIES_URL + id, {
        isActive: isActive,
    });
}

export function post_process_is_active(apiServer,id, data) {
    return postAuthenticatedJSON(apiServer+PROCESS_URL + id, data);
}

export function post_category_reorder(apiServer,data) {
    return postAuthenticatedJSON(apiServer+CATEGORY_REORDER_URL, data);
}

export function post_process_reorder(apiServer,catUid, data) {
    return postAuthenticatedJSON(apiServer+CATEGORY_PROCESS_URL + catUid, data);
}

export function post_categories_update(apiServer,id, data) {
    return postAuthenticatedJSON(apiServer+CATEGORIES_URL + id, data);
}

export function post_task_update(apiServer,id, data) {
    return postAuthenticatedJSON(apiServer+PROCESS_URL + id, data);
}

export function get_processes_list(apiServer,id) {
    return getAuthonticatedJSON(apiServer+CATEGORIES_URL + id + "/processes");
}

export function get_actives_languages(apiServer) {
    return getAuthonticatedJSON(apiServer+ACTIVES_LANGUAGES_URL);
}