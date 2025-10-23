import React, { useContext, useEffect, useState } from "react";

import * as layout from "../_redux/layoutRedux";
import { connect, shallowEqual, useSelector } from "react-redux";
import StaticMenu from "./StaticMenu";
import AdvancedSearch from "./AdvancedSearch";
import { get_my_name } from "../_redux/layoutCrud";
import Activities from "./Activities";
import SettingMenu from "./SettingMenu";
import { useHistory } from "react-router-dom";
import { withTranslation } from "react-i18next";
import { config } from "../../../config/config";
import { AppConfig } from "../../../appConfig";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import ListAltIcon from "@mui/icons-material/ListAlt";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Collapse } from "@mui/material";

function Sidebar(props) {
  const [openMenus, setOpenMenus] = useState({
    activities: true,
    cartable: true,
  });
  const [openIndex, setOpenIndex] = useState(null);
  const [openSubMenus, setOpenSubMenus] = useState({});
  const [menuItems, setMenuItems] = useState([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activitiesOpen, setActivitiesOpen] = useState(false);
  const [staticOpen, setStaticOpen] = useState(false);
  const { apiServer } = useContext(AppConfig);
  let { state } = useSelector(
    (state) => ({
      state: state.layout2,
    }),
    shallowEqual
  );
  if (state === undefined) state = {};
  let history = useHistory();
  useEffect(() => {
    if (state.is_user_info_loading === 0) {
      props.handle_variables("is_user_info_loading", 1);
      get_my_name(apiServer).then((res) => {
        props.user_info_loaded(res);
      });
    }
  });
  if (state.not_inbox) {
    if (state.current_side_menu !== 1) {
      props.handle_variables("current_side_menu", 1);
    }
  }

  const handleToggle = (key) => {
    setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleToggleSubmenu = (item, index) => {
    setOpenIndex((prev) => (prev === index ? null : index));

    const category_items_unique = item.items.filter(
      (arr, index, self) =>
        index === self.findIndex((t) => t.pro_uid === arr.pro_uid)
    );

    setMenuItems(category_items_unique);
  };

  return (
    <div
      className={
        "sidebar-container" +
        (state.is_sidebar_collapsed === true
          ? " collapsed-sidebar"
          : " expand-sidebar")
      }
    >
      <div className={"static-info"}>
        <div
          className={"main-logo-holder"}
          style={{ cursor: "pointer" }}
          onClick={() => {
            history.push("/workDesk");
            props.handle_refresh_inbox();
            props.handle_variables("is_sidebar_collapsed", false);
          }}
        >
          {state.is_sidebar_collapsed === true ? (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <img style={{ width: 40 }} src={"/logo.png"} />
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                padding: 10,
              }}
            >
              <img style={{ width: 50 }} src={"/logo.png"} />
              <div style={{ color: "#000000", fontWeight: "bold" }}>
                <div>سازمان ملی استاندارد ایران</div>
                <div>معاونت تدوین و ترویج استاندارد</div>
              </div>
            </div>
          )}
        </div>
        {state.is_sidebar_collapsed === true ? (
          <div
            style={{
              textAlign: "center",
              fontSize: "27px",
              marginTop: "15px",
              cursor: "pointer",
            }}
            onClick={() => {
              history.push("/workDesk");
              props.handle_variables(
                "is_sidebar_collapsed",
                !state.is_sidebar_collapsed
              );
            }}
          >
            <i class="fas fa-home icon-style"></i>
          </div>
        ) : null}
        <div className={"user-info"}>
          <div
            className={"user-info-holder"}
            onClick={() => history.push("/profile")}
          >
            <div
              style={
                !state.is_sidebar_collapsed
                  ? {
                      display: "flex",
                      alignItems: "center",
                      padding: "0 15px",
                    }
                  : {
                      padding: "0 5px",
                    }
              }
            >
              <AccountBoxIcon
                color="action"
                sx={
                  state.is_sidebar_collapsed
                    ? { fontSize: 30, marginLeft: 0 }
                    : { fontSize: 20, marginLeft: 0.5 }
                }
              />
              {state.is_sidebar_collapsed === true ? null : (
                <>
                  <div
                    style={{
                      display: "inline-block",
                      color: "#4E4E4E",
                      fontSize: 16,
                      fontWeight: "bold",
                    }}
                  >
                    {state.username}
                  </div>

                  <i className={"fal fa-edit user-edit"}></i>
                </>
              )}
            </div>
          </div>
          <div>
            {state.is_sidebar_collapsed === true ? null : (
              <div className={"text-right menu-switch-holder"}>
                {state.not_inbox ? null : (
                  <>
                    {state.current_side_menu === 0 ? (
                      <div
                        onClick={() =>
                          props.handle_variables("current_side_menu", 1)
                        }
                      >
                        <i className="fal fa-cog fa-1x icon-style"></i>
                      </div>
                    ) : null}
                    {state.current_side_menu === 0 ? (
                      <div
                        onClick={() =>
                          props.handle_variables("current_side_menu", 2)
                        }
                      >
                        <i className="fal fa-search fa-1x icon-style"></i>
                      </div>
                    ) : (
                      <div
                        onClick={() =>
                          props.handle_variables("current_side_menu", 0)
                        }
                      >
                        <i className="fal fa-arrow-right brand-color fa-1x icon-style"></i>
                      </div>
                    )}
                  </>
                )}
                <div
                  onClick={() => {
                    history.push("/workDesk");
                    props.handle_refresh_inbox();
                  }}
                >
                  <i class="fas fa-home icon-style"></i>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div
        className={
          "side-menu" + (state.current_side_menu === 1 ? " nav-menu" : "")
        }
      >
        {state.current_side_menu === 0 ? (
          <>
            {/* <div className={'main-part'}>
                    <div className={'side-activities'}
                         onMouseEnter={() => setActivitiesOpen(true)}
                         onMouseLeave={() => setActivitiesOpen(false)}
                    >
                        {(state.is_sidebar_collapsed === false || activitiesOpen === false) ? null :
                            <div className={'p-relative'}>
                                <div className={'collapsed-open'}>
                                    <Activities {...props} />
                                </div>
                            </div>
                        }
                        <div className={'site-text'}>{props.t("Activities")}</div>
                    </div>
                    <div className={'side-static-links'}
                         onMouseEnter={() => setStaticOpen(true)}
                         onMouseLeave={() => setStaticOpen(false)}
                    >
                        {(state.is_sidebar_collapsed === false || staticOpen === false) ? null :
                            <div className={'p-relative'}>
                                <div className={'collapsed-open'}>
                                    <StaticMenu {...props} />
                                </div>
                            </div>
                        }
                        <div className={'site-text'}>{props.t("Cartable")}</div>
                    </div>
                </div> */}
            <div className={"content-part"} style={{ padding: "10px 0px" }}>
              <div
                className="sidebar-menu-content"
                style={{ padding: "0 20px 10px 0" }}
                onClick={() => handleToggle("activities")}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <ListAltIcon
                    color="action"
                    sx={{ fontSize: 20, marginLeft: 0.5 }}
                  />
                  <div className="sidebar-menu-item">فعالیت ها</div>
                </div>
                <div className="sidebar-menu-item-bullet">
                  <KeyboardArrowDownIcon color="action" sx={{ fontSize: 20 }} />
                </div>
              </div>
              <Collapse in={openMenus.activities} timeout="auto" unmountOnExit>
                {state.top_menu_items.map((e, index) => (
                  <>
                    <div
                      className="sidebar-submenu-item"
                      onClick={() => handleToggleSubmenu(e, index)}
                    >
                      <i className={e.icon + " icon-style"}></i>
                      <div
                        className="sidebar-submenu-item-title"
                        style={{
                          ...(openIndex === index && { fontWeight: "bold" }),
                        }}
                      >
                        {e.title}
                      </div>
                    </div>
                    <Collapse
                      in={openIndex === index}
                      timeout="auto"
                      unmountOnExit
                    >
                      <Activities {...props} menuItems={menuItems} />
                    </Collapse>
                  </>
                ))}
              </Collapse>

              <div
                className="sidebar-menu-content"
                style={{ padding: "10px 20px 10px 0px" }}
                onClick={() => handleToggle("cartable")}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <BusinessCenterIcon
                    color="action"
                    sx={{ fontSize: 20, marginLeft: 0.5 }}
                  />
                  <div className="sidebar-menu-item">کارتابل</div>
                </div>
                <div className="sidebar-menu-item-bullet">
                  <KeyboardArrowDownIcon color="action" sx={{ fontSize: 20 }} />
                </div>
              </div>
              <Collapse in={openMenus.cartable} timeout="auto" unmountOnExit>
                <StaticMenu {...props} />
              </Collapse>
              {/* <div className={'activities'}>
                            <Activities {...props} />
                        </div>
                        <div className={'static-links'}>
                            <StaticMenu {...props} />
                        </div> */}
            </div>
          </>
        ) : (
          <>
            {state.current_side_menu === 1 ? (
              <div className={"main-part"}>
                {state.is_sidebar_collapsed ? (
                  <>
                    <div
                      onMouseEnter={() => setSettingsOpen(true)}
                      onMouseLeave={() => setSettingsOpen(false)}
                    >
                      {settingsOpen === false ? null : (
                        <div className={"p-relative"}>
                          <div className={"float-menu-holder"}>
                            <SettingMenu
                              {...props}
                              user_permissions={state.user_permissions}
                              setSettingsOpen={setSettingsOpen}
                            />
                          </div>
                        </div>
                      )}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          marginTop: 10,
                        }}
                      >
                        <i className={"fal fa-cog fa-2x icon-style"}></i>
                      </div>
                    </div>
                  </>
                ) : (
                  <SettingMenu
                    {...props}
                    user_permissions={state.user_permissions}
                  />
                )}
              </div>
            ) : (
              <div className={"main-part"}>
                <AdvancedSearch {...props} />
              </div>
            )}
          </>
        )}
      </div>

      <div className={"content-footer"}>
        {/* <div className={'collapse-btn'}
                 onClick={() => props.handle_variables('is_sidebar_collapsed', !state.is_sidebar_collapsed)}>
                {state.is_sidebar_collapsed === true ?
                    <i className="fal fa-arrow-to-left fa-3x"></i> :
                    <i className="fal fa-arrow-to-right fa-3x"></i>
                }
            </div> */}
        <div className={"menu-footer text-center"} style={{}}>
          {/* <img src="assets/img/arian.png" className="footer_arian_logo" alt="ArianNovin"/> */}
          <a
            href="http://arian.co.ir"
            style={{ color: "#494949", fontSize: 13 }}
            target="_blank"
          >
            {props.t("Arian Novin Co")} - {process.env.REACT_APP_VERSION}
          </a>
        </div>
      </div>
    </div>
  );
}

export default connect(null, layout.actions)(withTranslation()(Sidebar));
