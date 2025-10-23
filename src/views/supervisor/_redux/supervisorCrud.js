import {config} from '../../../config/config'
import getAuthonticatedJSON from "../../../common/utils/functions/getAuthenticatedJSON";
import postAuthonticatedJSON from "../../../common/utils/functions/postAuthenticatedJSON";

export const GET_INBOX_TASKS_URL = config.apiServer + "cases/new-inbox";
export const GET_CUSTOM_FIELDS_URL = config.apiServer + "cases/anr-selected-variables-list";
export const GET_CASE_HISTORY_URL = config.apiServer + "cases/";
export const GET_CASE_INFO_URL = config.apiServer + "taskinfo/taskinformation";
export const GET_ASSIGNED_TAGS_URL = config.apiServer + "tag/assigned-tags";
export const TAGS_URL = config.apiServer + "tag";

export function get_inbox_tasks(apiServer,current_page, per_page, filter) {
    let data = {
        "action": filter.action,
        "start": current_page*per_page,
        "limit": per_page,
        "filter": "",
        "sort": "",
        "dir": "DESC",
        "cat_uid": "",
        "pro_uid": filter.pro_uid,
        "search": filter.search_text,
        "dateFrom": filter.from_date,
        "dateTo": filter.to_date,
        "newerThan": filter.date_range
    };
    return postAuthonticatedJSON(apiServer+GET_INBOX_TASKS_URL, data)
}
export function get_custom_fields(apiServer,prouid) {
    return getAuthonticatedJSON(apiServer+GET_CUSTOM_FIELDS_URL+"/"+prouid)
}
export function get_history_info(apiServer, app_uid) {
    const URL =apiServer+GET_CASE_HISTORY_URL + app_uid + '/tasks';
    return getAuthonticatedJSON(URL);
}
export function get_assigned_tags(apiServer, uid) {
    const URL = apiServer + GET_ASSIGNED_TAGS_URL +'/'+uid;
    return getAuthonticatedJSON(URL);
}
export function post_assigned_tags(apiServer, uid,tags) {
    return postAuthonticatedJSON(apiServer + TAGS_URL,{
        app_uid: uid,
        tags: tags,
    });
}
export function get_case_info(item) {
    const URL =
        GET_CASE_INFO_URL +
        '?APP_UID=' +
        item.app_uid +
        '&TAS_UID=' +
        item.tas_uid +
        '&DEL_INDEX=' +
        item.del_index;
    return getAuthonticatedJSON(URL);
}