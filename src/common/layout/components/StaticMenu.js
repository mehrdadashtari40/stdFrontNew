import React from "react";
import { connect, shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { withTranslation } from "react-i18next";
import * as layout from "../_redux/layoutRedux";

function StaticMenu(props) {
  let { inbox_state } = useSelector(
    (state) => ({
      inbox_state: state.inbox,
    }),
    shallowEqual
  );
  let { state } = useSelector(
    (state) => ({
      state: state.layout2,
    }),
    shallowEqual
  );

  let history = useHistory();
  if (inbox_state === undefined) inbox_state = {};
  const handleFilterByAction = (action) => {
    inbox_state.current_pro_uid = null;
    if (state.is_case_detail) {
      history.push("/inbox");
      props.handle_refresh_inbox();
    }
    props.load_data_with_action(action);
    props.handle_variables("menuChangeByAction", action);
  };
  return (
    <>
      <div
        className={`sidebar-submenu-item ${
          inbox_state?.current_action === "todo" ? "active" : ""
        }`}
        onClick={() => handleFilterByAction("todo")}
      >
        <i className="fal fa-inbox-in icon-style"></i>
        <div className="sidebar-submenu-item-title">{props.t("inbox")}</div>
      </div>
      <div
        className={`sidebar-submenu-item ${
          inbox_state?.current_action === "sent" ? "active" : ""
        }`}
        onClick={() => handleFilterByAction("sent")}
      >
        <i className="fal fa-paper-plane icon-style"></i>
        <div className="sidebar-submenu-item-title">{props.t("Sent")}</div>
      </div>
      <div
        className={`sidebar-submenu-item ${
          inbox_state?.current_action === "unassigned" ? "active" : ""
        }`}
        onClick={() => handleFilterByAction("unassigned")}
      >
        <i className="fal fa-user-clock icon-style"></i>
        <div className="sidebar-submenu-item-title">
          {props.t("Unassigned")}
        </div>
      </div>
      <div
        className={`sidebar-submenu-item ${
          inbox_state?.current_action === "draft" ? "active" : ""
        }`}
        onClick={() => handleFilterByAction("draft")}
      >
        <i className="fal fa-pen icon-style"></i>
        <div className="sidebar-submenu-item-title">{props.t("draft")}</div>
      </div>
    </>
  );
}

export default connect(null, layout.actions)(withTranslation()(StaticMenu));
