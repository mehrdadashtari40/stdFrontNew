import getAuthenticatedJSON from "../../utils/functions/getAuthenticatedJSON";
import axios from "axios";
import Axios from "axios";
export const GET_LOG_JOBS_MENU_URL =
  "http://api.bservice.ir/loki/loki/api/v1/label/job/values";
export const SIGN_OUT_URL = "login/login";

//Deprecated

export function get_current_notifications(apiServer) {
  return getAuthenticatedJSON(apiServer + "casesextend/my-todo-list");
}

export function get_my_name(apiServer) {
  return getAuthenticatedJSON(apiServer + "userextend/get-my-name");
}

export function get_my_permissions(apiServer) {
  return getAuthenticatedJSON(apiServer + "arian/get-my-permissions");
}

export function sign_out(iframeServer) {
  return getAuthenticatedJSON(iframeServer + SIGN_OUT_URL);
}

export function get_tag_list(apiServer) {
  return getAuthenticatedJSON(apiServer + "tag/tags-list");
}

export function get_menu_items(apiServer, lang = "fa") {
  return getAuthenticatedJSON(apiServer + "biarian/bibpmsmenucustome");
}

export function get_new_menu_items(apiServer, action, group_uid) {
  return getAuthenticatedJSON(
    `${apiServer}biarian/menu-structure?action=${action}${
      !group_uid || group_uid === "null" 
      ? "" : `&group_uid=${group_uid}`
    }`
  );
}

export function get_log_jobs() {
  return axios.get(GET_LOG_JOBS_MENU_URL, { crossdomain: true });
}

export function get_active_languages(apiServer) {
  return getAuthenticatedJSON(apiServer + "arian/get-actives-languages");
}

export function get_inbox_filters(apiServer, action) {
  return getAuthenticatedJSON(
    apiServer + "biarian/inbox-filters" + "/" + action
  );
}
