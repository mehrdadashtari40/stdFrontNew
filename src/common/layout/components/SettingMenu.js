import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { withTranslation } from "react-i18next";
import { connect, shallowEqual, useSelector } from "react-redux";
import * as layout from "../_redux/layoutRedux";
import { AppConfig } from "../../../appConfig";
import { Link } from "react-router-dom";

function SettingMenu(props) {
  const config = React.useContext(AppConfig);
  const [expandedTabs, setExpandedTabs] = useState([]);
  let { state } = useSelector(
    (state) => ({
      state: state.layout2,
    }),
    shallowEqual
  );
  if (state === undefined) state = {};
  let location = useLocation();
  const is_current_route = (route) => {
    route = "/" + route;
    let current_route = location.pathname + location.search;
    return current_route === route;
  };

  const render_menu = (menu, key, level = 0) => {
    if (menu.items == null || menu.items.length === 0) {
      return {
        key: menu._id,
        is_active: is_current_route(menu.route),
        item: (
          <Link
            onClick={() =>
              props.setSettingsOpen && props.setSettingsOpen(false)
            }
            to={`/${menu.route ?? ""}`}
            key={menu._id}
            className={
              "item-holder" + (is_current_route(menu.route) ? " active" : "")
            }
            style={{ paddingRight: (level + 1) * 20 }}
          >
            {menu.icon === null ? "" : <i className={menu.icon}></i>}
            {props.t(menu.title)}
          </Link>
        ),
      };
    }
    let is_active = false;
    const childs = menu.items.map((x, key) => {
      let items = render_menu(x, key, level + 1);
      if (items.is_active === true) is_active = true;
      return items.item;
    });
    return {
      key: menu._id,
      is_active: is_active,
      item: (
        <Accordion
          defaultExpanded={is_active}
          key={menu._id}
          onChange={(e, action) => {
            let items = expandedTabs;
            if (action) {
              items.push(level + "_" + key);
            }
            setExpandedTabs(items);
          }}
        >
          <AccordionSummary
            className="sidebar-menu-item"
            style={{ paddingRight: (level + 1) * 15 }}
            expandIcon={<i className="fas fa-chevron-down icon-style"></i>}
            aria-label="Expand"
          >
            {menu.icon && <i className={`${menu.icon} icon-style`}></i>}
            {menu.title}
          </AccordionSummary>
          <AccordionDetails>{childs}</AccordionDetails>
        </Accordion>
      ),
    };
  };
  let menu_items = [];
  const addId = (item) => {
    item.title = props.t(item.title);
    if (item.items) {
      item.items = item.items.map(addId);
    }
    if (!item._id) {
      item._id = Math.random().toString(36).slice(2);
    }
    return item;
  };
  let navItems = require("../../../config/navigation.json").map((x) =>
    addId(x)
  );
  const filter_by_permissions = (items) => {
    items = items
      .filter((x) => {
        if (x.permission === undefined) return true;
        else if (state.user_permissions.indexOf(x.permission) !== -1)
          return true;
        return false;
      })
      .map((x) => {
        if (x.items !== undefined) x.items = filter_by_permissions(x.items);
        return x;
      });
    //.filter(x=>x.route !== undefined || (x.items !== undefined && x.items.length > 0))
    return items;
  };
  menu_items = filter_by_permissions(navItems);

  if (config.taskboard !== "true") {
    menu_items = menu_items.filter((x) => x._id !== "task_board");
  }
  if (localStorage.getItem("login_homepage") !== "true") {
    menu_items = menu_items.filter((x) => x._id !== "login_homepage");
  }

  menu_items = menu_items.map((x) => {
    if (x._id === "system_admin") {
      x.items = x.items.map((y) => {
        if (y._id === "settings") {
          y.items = y.items.map((k) => {
            if (k._id === "logs") {
              if (state.log_job_labels !== undefined)
                k.items = state.log_job_labels.map((l) => ({
                  title: l,
                  icon: "fa fa-history",
                  route: "logs/" + l,
                }));
            }
            return k;
          });
        }
        return y;
      });
    }
    return x;
  });

  if (
    menu_items.filter(
      (x) => x.title === props.t("Analytical dashboards")
    )[0] === undefined &&
    state.bi_menu_items.length !== 0
  ) {
    if (state.user_permissions.indexOf("PM_ARIAN_DASHBOARD") !== -1) {
      menu_items.push({
        title: props.t("Dashboards"),
        icon: "fad fa-chart-pie-alt",
        items: state.bi_menu_items.map(addId),
        _id: "111",
      });
    }
  }
  return <>{menu_items.map((x, key) => render_menu(x, key).item)}</>;
}

export default connect(null, layout.actions)(withTranslation()(SettingMenu));
