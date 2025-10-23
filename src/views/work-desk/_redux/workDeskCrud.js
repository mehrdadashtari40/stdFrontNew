import Axios from "axios";
import React, { useContext } from "react";
import { AppConfig } from "../../../appConfig";
import getAuthenticatedJSON from "../../../common/utils/functions/getAuthenticatedJSON";

import postAuthenticatedJSON from "../../../common/utils/functions/postAuthenticatedJSON";
import putAuthonticatedJSON from "../../../common/utils/functions/putAuthonticatedJSON";
import { config } from "../../../config/config";
let baseUrl;

let GET_DOCUMENTS_URL;
let EDIT_DOCUMENTS_URL;
let GET_CATEGORIES_URL;
let GET_CATEGORIES_TITLES_URL;
let CATEGORIES_ACTION_URL;
let GET_ORGANIZATIONS_URL;
let GET_COMMITTEES_URL;
let GET_SUBCOMMITTEES_URL;
let GET_DOCUMENT_TYPES_URL;
let GET_DOCUMENT_FORUM_URL;
let GET_FORUM_MESSAGES_URL;
let ADD_FORUM_MESSAGES_SCORE_URL;
let SET_EVENT;
let GET_EVENTS;
let DEL_EVENT;
let GET_EMAILS;
let SEND_EMAIL;
let ADD_COMMENT;
let CHECK_ROLE;
let DROPDOWN_ITEMS;
let GET_MEMBERS_URL;

//Not Deprecated

const urlSetter = () => {
  GET_DOCUMENT_TYPES_URL = config.apiServer + "std/document-types";
  GET_CATEGORIES_URL = config.apiServer + "std/categories";
  GET_CATEGORIES_TITLES_URL = config.apiServer + "std/category-titles";
  GET_DOCUMENT_FORUM_URL = config.apiServer + "std/document-forum/";
  GET_COMMITTEES_URL = config.apiServer + "std/committees/";
  SEND_EMAIL = config.apiServer + "std/send-mail";
  GET_SUBCOMMITTEES_URL = config.apiServer + "std/subcommittees/";
  GET_DOCUMENTS_URL = config.apiServer + "std/documents";
  EDIT_DOCUMENTS_URL = config.apiServer + "std/edit/documents";
  GET_FORUM_MESSAGES_URL = config.apiServer + "std/document-forum-messages/";
  CATEGORIES_ACTION_URL = config.apiServer + "std/categories/";
  ADD_FORUM_MESSAGES_SCORE_URL =
    config.apiServer + "std/document-forum-messages-score/";
  GET_ORGANIZATIONS_URL = config.apiServer + "std/organizations";
  GET_EMAILS = config.apiServer + "std/get-emails";
  SET_EVENT = config.apiServer + "std/add-event";
  DEL_EVENT = config.apiServer + "std/events/";
  GET_EVENTS = config.apiServer + "std/get-events/";
  ADD_COMMENT = config.apiServer + "std/add-comment/";
  CHECK_ROLE = config.apiServer + "std/checkRole";
  DROPDOWN_ITEMS = config.apiServer + "std/user_groups";
  GET_MEMBERS_URL = config.apiServer + "std/committee-members";
};

export const baseUrlSetter = (url) => {
  baseUrl = url;
  urlSetter();
};

export function delete_event(eventId) {
  const token = localStorage.getItem("access_token");

  return Axios.delete(DEL_EVENT + eventId, {
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  });
}

export function get_dropdown_items(token) {
  return Axios.get(DROPDOWN_ITEMS, {
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  });
}

export function delete_category(categoryId) {
  const token = localStorage.getItem("access_token");

  return Axios.delete(CATEGORIES_ACTION_URL + categoryId, {
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  });
}

export function get_emails() {
  const token = localStorage.getItem("access_token");

  return Axios.get(GET_EMAILS, {
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  });
}

export function check_role() {
  const token = localStorage.getItem("access_token");

  return Axios.get(CHECK_ROLE, {
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  });
}

export function get_events(date) {
  const token = localStorage.getItem("access_token");

  return Axios.get(`${GET_EVENTS}${date || ""}`, {
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  });
}

export function send_mail(data) {
  const token = localStorage.getItem("access_token");

  return Axios.post(SEND_EMAIL, data, {
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  });
}

export function add_comment(data) {
  const token = localStorage.getItem("access_token");

  return Axios.post(ADD_COMMENT, data, {
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  });
}

export function set_event(data) {
  const token = localStorage.getItem("access_token");

  return Axios.post(SET_EVENT, data, {
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  });
}

export function get_document_forum(docId) {
  const token = localStorage.getItem("access_token");

  return Axios.get(GET_DOCUMENT_FORUM_URL + docId, {
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  });
}

export function get_forum_messages(forumId) {
  const token = localStorage.getItem("access_token");

  return Axios.get(GET_FORUM_MESSAGES_URL + forumId, {
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  });
}

export function delete_forum_messages(messageId) {
  const token = localStorage.getItem("access_token");

  return Axios.delete(GET_FORUM_MESSAGES_URL + messageId, {
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  });
}

export function add_forum_messages(data) {
  const token = localStorage.getItem("access_token");

  return Axios.post(GET_FORUM_MESSAGES_URL, data, {
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  });
}

export function update_categories(categoryId, data) {
  const token = localStorage.getItem("access_token");

  return Axios.put(CATEGORIES_ACTION_URL + categoryId, data, {
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  });
}

export function update_forum_messages(messageId, data) {
  const token = localStorage.getItem("access_token");

  return Axios.put(GET_FORUM_MESSAGES_URL + messageId, data, {
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  });
}

export function add_forum_message_score(data) {
  const token = localStorage.getItem("access_token");

  return Axios.post(ADD_FORUM_MESSAGES_SCORE_URL, data, {
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  });
}

export function get_all_emails(token, params) {
  return Axios.get(`${GET_EMAILS}`, {
    params,
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  });
}

export function get_members(token, params) {
  return Axios.get(GET_MEMBERS_URL, {
    params,
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  });
}

export function get_all_documents(token, params) {
  return Axios.get(GET_DOCUMENTS_URL, {
    params,
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  });
}

export function create_category(token, data) {
  return Axios.post(GET_CATEGORIES_URL, data, {
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  });
}

export function create_document(token, data) {
  return Axios.post(GET_DOCUMENTS_URL, data, {
    headers: {
      Authorization: "Bearer " + token,
      "content-type": "multipart/form-data",
    },
  });
}

export function edit_document(token, data) {
  return Axios.post(EDIT_DOCUMENTS_URL, data, {
    headers: {
      Authorization: "Bearer " + token,
      "content-type": "multipart/form-data",
    },
  });
}

export function edit_category(token, data, id) {
  return Axios.put(GET_CATEGORIES_URL + `/${id}`, data, {
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  });
}

export function get_all_categories(token, params = {}) {
  return Axios.get(GET_CATEGORIES_URL, {
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
    params,
  });
}

export function get_category_titles(token) {
  return Axios.get(GET_CATEGORIES_TITLES_URL, {
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  });
}

export function get_all_organizations(token) {
  return Axios.get(GET_ORGANIZATIONS_URL, {
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  });
}

export function get_all_committees(token, organizationId) {
  return Axios.get(GET_COMMITTEES_URL + organizationId, {
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  });
}

export function get_all_subcommittees(token, committeeId, organizationId) {
  return Axios.get(GET_SUBCOMMITTEES_URL + committeeId + `/${organizationId}`, {
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  });
}

export function get_all_document_types(token) {
  return Axios.get(GET_DOCUMENT_TYPES_URL, {
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  });
}

export function get_user_id() {
  const token = localStorage.getItem("access_token");
  return Axios.get(config.apiServer + "userextend/get-my-uid", {
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  });
}
