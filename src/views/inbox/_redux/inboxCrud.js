import getAuthenticatedJSON from "../../../common/utils/functions/getAuthenticatedJSON";
import postAuthenticatedJSON from "../../../common/utils/functions/postAuthenticatedJSON";

export const GET_INBOX_TASKS_URL = "cases/new-inbox";
export const GET_CUSTOM_FIELDS_URL = "cases/anr-selected-variables-list";
export const GET_CASE_HISTORY_URL = "cases/";
export const GET_CASE_INFO_URL = "taskinfo/taskinformation";
export const GET_ASSIGNED_TAGS_URL = "tag/assigned-tags";
export const TAGS_URL = "tag";

export function get_inbox_tasks(
  apiServer,
  current_page,
  per_page,
  filter,
  filterOfRead = "",
  group_uid = null
) {
  let data = {
    action: filter.action,
    start: current_page * per_page,
    limit: per_page,
    filter: filterOfRead,
    sort: "",
    dir: "DESC",
    cat_uid: "",
    pro_uid: filter.pro_uid,
    search: filter.search_text,
    dateFrom: filter.from_date,
    dateTo: filter.to_date,
    newerThan: filter.date_range,
    group_uid,
  };
  return postAuthenticatedJSON(apiServer + GET_INBOX_TASKS_URL, data);
}
export function get_custom_fields(apiServer, prouid) {
  return getAuthenticatedJSON(apiServer + GET_CUSTOM_FIELDS_URL + "/" + prouid);
}
export function get_history_info(apiServer, app_uid) {
  const URL = apiServer + GET_CASE_HISTORY_URL + app_uid + "/tasks";
  return getAuthenticatedJSON(URL);
}
export function get_assigned_tags(apiServer, uid) {
  const URL = apiServer + GET_ASSIGNED_TAGS_URL + "/" + uid;
  return getAuthenticatedJSON(URL);
}
export function post_assigned_tags(apiServer, uid, tags) {
  return postAuthenticatedJSON(apiServer + TAGS_URL, {
    app_uid: uid,
    tags: tags,
  });
}
export function get_case_info(apiServer, item) {
  const URL =
    apiServer +
    GET_CASE_INFO_URL +
    "?APP_UID=" +
    item.app_uid +
    "&TAS_UID=" +
    item.tas_uid +
    "&DEL_INDEX=" +
    item.del_index;
  return getAuthenticatedJSON(URL);
}
