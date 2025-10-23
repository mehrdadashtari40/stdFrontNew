import React from "react";
import * as layout from "../_redux/layoutRedux";
import { connect, shallowEqual, useSelector } from "react-redux";
import {
  Redirect,
  Route,
  Switch,
  useHistory,
  useLocation,
} from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { routes } from "../../../routes";
import Sidebar from "./Sidebar";
import getAuthonticatedJSON from "../../utils/functions/getAuthenticatedJSON";
import { config } from "../../../config/config";
import TopLoader from "react-top-loader";

function Layout(props) {
  let { state } = useSelector(
    (state) => ({
      state: state.layout2,
    }),
    shallowEqual
  );
  if (state === undefined) state = {};
  let history = useHistory();
  let location = useLocation();
  let path_parts = location.pathname.split("/");
  if (path_parts.length > 1 && path_parts[0] === "" && path_parts[1] === "") {
    if (!localStorage.getItem("access_token")) {
      history.push(config.firstRedirectUrl);
    } else {
      history.push("/workdesk");
      props.handle_refresh_inbox();
    }
  }

  let not_inbox = true;
  if (
    path_parts.length > 0 &&
    (path_parts[1].toUpperCase() === "DETAILS" ||
      path_parts[1].toUpperCase() === "INBOX" ||
      path_parts[1].toUpperCase() === "SUPERVISOR")
  ) {
    not_inbox = false;
  }
  if (state.not_inbox !== not_inbox) {
    props.handle_variables("not_inbox", not_inbox);
    if (not_inbox === false) {
      props.handle_variables("current_side_menu", 0);
    }
  }

  let is_case_detail = false;
  if (path_parts.length > 2) {
    if (path_parts[1] === "details") {
      is_case_detail = true;
    }
  }
  let is_bi_dashboard = false;
  if (path_parts.length > 1) {
    if (path_parts[1] === "DashboardBi") {
      is_bi_dashboard = true;
    }
  }
  if (is_case_detail !== state.is_case_detail) {
    props.handle_variables("is_case_detail", is_case_detail);
  }
  if (is_bi_dashboard !== state.is_bi_dashboard) {
    props.handle_variables("is_bi_dashboard", is_bi_dashboard);
  }

  if (!localStorage.getItem("access_token")) {
    window.location = "/#" + config.firstRedirectUrl;
  } else {
    if (state.is_token_checked === false) {
      let URL = config.apiServer + "cases";
      getAuthonticatedJSON(URL)
        .then((res) => {})
        .catch((err) => {
          window.location = "/#" + config.firstRedirectUrl;
        });
      props.handle_variables("is_token_checked", true);
    }
  }

  return (
    <div>
      <TopLoader
        className={"top-loader"}
        backgroundColor="#3d4558"
        show={state.ajax_loading > 0}
        delay={0}
        fixed={false}
        color="#fc0"
      />
      <div className={"main-app-holder"}>
        <Sidebar />
        <div
          className={
            "app-left-side" +
            (state.not_inbox === true ? "" : " inbox-container")
          }
        >
          <Header items={state.top_menu_items} />
          <div
            id="main"
            style={{height:'100%'}}
            role="main"
            className={
              (is_case_detail === true ? "case_details " : "") +
              (is_bi_dashboard === true ? "bi-dashboard " : "") +
              (state.is_sidebar_collapsed === true ? " collapsed" : "")
            }
          >
            <Switch>
              {routes.map((route, idx) => {
                return route.component ? (
                  <Route
                    key={idx}
                    path={route.path}
                    exact={route.exact}
                    name={route.name}
                    render={(props) => <route.component {...props} />}
                  />
                ) : null;
              })}
              <Redirect from="/login" to="/" />
            </Switch>
          </div>
        </div>

        {/*<Navigation/>*/}
      </div>
      {/*<Footer/>*/}
    </div>
  );
}

export default connect(null, layout.actions)(Layout);
