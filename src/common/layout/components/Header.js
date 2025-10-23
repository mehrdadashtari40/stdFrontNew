import React, { useContext, useEffect, useState } from "react";

import * as layout from "../_redux/layoutRedux";
import { connect, shallowEqual, useDispatch, useSelector } from "react-redux";
import NotificationsDropdown from "./NotificationsDropdown";
import {
  get_active_languages,
  get_log_jobs,
  get_menu_items,
  get_new_menu_items,
  get_my_permissions,
  sign_out,
} from "../_redux/layoutCrud";
import { useHistory } from "react-router-dom";
import TopMenu from "./TopMenu";
import DashboardDropdown from "./DashboardDropdown";
import LanguageDropdown from "./LanguageDropdown";
import Helps from "../../../../src/views/inbox/components/Helps";
import { compose } from "redux";
import { withTranslation } from "react-i18next";
import { config } from "../../../config/config";
import { AppConfig } from "../../../appConfig";
import { Select } from "antd";
import {
  baseUrlSetter,
  get_dropdown_items,
} from "../../../views/work-desk/_redux/workDeskCrud";
import { get_inbox_tasks } from "../../../views/inbox/_redux/inboxCrud";
import { actions } from "../../../views/inbox/_redux/inboxRedux";
// import inboxState from "../../../views/inbox/_redux/inboxRedux";
import { Modal } from "react-bootstrap";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const { Option } = Select;

function Header(props) {
  const [collapsedHeader, setCollapsedHeader] = useState(false);
  const [dropDownItems, setDropDownItems] = useState(null);
  const { apiServer, workDeskBaseUrl } = useContext(AppConfig);
  const [showModal, setShowModal] = useState(false);
  let { state } = useSelector(
    (state) => ({
      state: state.layout2,
    }),
    shallowEqual
  );

  let { inboxState } = useSelector(
    (state) => ({
      inboxState: state.inbox,
    }),
    shallowEqual
  );
  if (state === undefined) state = {};
  let history = useHistory();
  const token = localStorage.getItem("access_token");

  const useEffectHandler = async () => {
    await baseUrlSetter(workDeskBaseUrl);
    get_dropdown_items(token).then((res) => {
      setDropDownItems(res.data.data);
    });
  };

  useEffect(() => {
    useEffectHandler();
  }, []);

  useEffect(() => {
    if (state.is_top_menu_loading === 0) {
      let lang = localStorage.getItem("lang");
      if (lang === null) lang = "fa";
      getMenuData();
      get_menu_items(apiServer, lang).then((res) => {
        props.bi_menu_items_loaded(res.bi_menu);
      });
      get_my_permissions(apiServer).then((res) => {
        let permissions = res.map((x) => x.PER_CODE.toUpperCase());
        props.handle_variables("user_permissions", permissions);
      });
   //   get_log_jobs().then((res) => {
    //    if (res.data?.data) {
     //     props.handle_variables("log_job_labels", res.data.data);
    //    }
   //   });

      if (config.multi_lang === true) {
        get_active_languages().then((res) => {
          props.active_lang_loaded(res);
        });
      }
      props.handle_variables("is_top_menu_loading", 1);
    }
  });

  const dispatch = useDispatch();

  useEffect(() => {
    if (state.isMenuChange) {
      getMenuData();
      props.handle_variables("isMenuChange", false);
    }
  }, [state.isMenuChange]);

  useEffect(() => {
    getMenuData(state.menuChangeByAction);
  }, [state.menuChangeByAction]);

  const getMenuData = (action = "todo") => {
    //inboxState.current_action
    if (!state.not_inbox) {
      get_new_menu_items(
        apiServer,
        action,
        localStorage.getItem("groupId")
      ).then((res) => {
        // orderdRes=res.sort((a, b) => a.order - b.order);
        let bpms_categories = [];

        res.length > 0 &&
          res.map((x) => {
            let menu = {};
            menu.title = x.label;
            menu.descrption = "";
            menu.icon = x.icon;
            menu.new = "1";
            let orderedItems = [];
            orderedItems = x.items.sort((a, b) => a.order - b.order);
            menu.items = [];
            orderedItems.map((y) => {
              let menuItems = {};
              menuItems.title = y.label;
              menuItems.descrption = y.description;
              menuItems.pro_descrption = "";
              menuItems.icon = "";
              menuItems.route = `outlook/create/${y.pro_uid}/${y.task_uid}`;
              menuItems.route_type = "internal";
              menuItems.new = "1";
              menuItems.unread_count = "0";
              menuItems.pro_uid = y.pro_uid;
              menuItems.tas_uid = y.task_uid;
              menuItems.can_start = y.can_start ? "1" : "0";
              menu.items.push(menuItems);
            });
            bpms_categories.push(menu);
          });
        props.menu_items_loaded(bpms_categories);
        if (bpms_categories.length > 0)
          props.handle_variables("current_category", bpms_categories[0]);
        props.handle_variables("isItemsLoaded", false);
      });
    }
  };

  const handle_sign_out = ()  => {
    sign_out().finally((res) =>  {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      let lang = localStorage.getItem("lang");
      let ssoLogin = localStorage.getItem("sso_login");
      let def_lang = localStorage.getItem("default_lang");
      if (def_lang === null) def_lang = "fa";
      if (lang === "undefined") localStorage.setItem("lang", def_lang);
      const sso_signout_url = "https://my.inso.gov.ir/logout";
      if(ssoLogin === "true") { window.open(sso_signout_url, '_self');
      }else window.open('/', '_self');
            
    });
  };
  const handle_help = () => {
    setShowModal(true);
  };
  
  if (
    state.is_case_detail === true ||
    state.is_bi_dashboard === true ||
    state.not_inbox === true
  )
    return (
      <div
        className={
          "case-header-container" +
          (collapsedHeader === true ? " collapsed" : "")
        }
      >
        <div
          className={
            "header-container" +
            (state.is_sidebar_collapsed === true ? " collapsed" : "")
          }
        >
          {/* <TopMenu items={state.top_menu_items} /> */}
          <div className="header-content">
            <div></div>
            <div className="header-left-container">
            <div
              onClick={() => handle_help()}
              className={"notification-dropdown-btn"}
              title={props.t("Help")}
            >
              <div style={{display: 'flex', alignItems:'center', gap:4}}>
                    <HelpOutlineIcon sx={{fontSize: 25}} />
                    <span>راهنما</span>
                  </div>
            </div>
            <LanguageDropdown />
            <DashboardDropdown />
            {/*<NotificationsDropdown/>*/}
            <div
              onClick={() => handle_sign_out()}
              className={"notification-dropdown-btn"}
              title={props.t("Sign out")}
            >
              <div style={{display: 'flex', alignItems:'center', gap:4}}>
                <ExitToAppIcon sx={{fontSize: 25}} />
                <span>خروج</span>
              </div>
            </div>
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
              <Modal.Header closeButton>
                <Modal.Title>
                  <i className="fal fa-question-circle"></i>

                  <span>راهنماهای کاربری</span>
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Helps></Helps>
                {/*<UserLogin/>*/}
              </Modal.Body>
            </Modal>
          </div>
        </div>
        {/* {collapsedHeader && (
          <div
            className={"case-header-btn"}
            onClick={() => setCollapsedHeader(!collapsedHeader)}
          >
            <i className="fas fa-arrow-down fa-2x"></i>
          </div>
        )} */}
      </div>
    );

  const handleChange = (e) => {
    localStorage.setItem("groupId", e);
    let filters = {
      search_text: inboxState.search_text,
      action: inboxState.current_action,
      pro_uid: inboxState.current_pro_uid,
      from_date: inboxState.from_date,
      to_date: inboxState.to_date,
      date_range: inboxState.date_range,
    };
    get_inbox_tasks(
      apiServer,
      window.localStorage.getItem("currentPage") || inboxState.pg_current_page,
      inboxState.pg_per_page,
      filters,
      "",
      e
    ).then((res) => {
      dispatch(actions.tasks_loaded(res));
    });
    getMenuData();
  };

  return (
    <div   
      className={
        "header-container" +
        (state.is_sidebar_collapsed === true ? " collapsed" : "")
      }
    >
      {/* <TopMenu items={state.top_menu_items} /> */}
      <div
       className={"header-content"}>
        {dropDownItems && (
          <Select
            defaultValue={
              !localStorage.getItem("groupId") ||
              localStorage.getItem("groupId") === "null"
                ? null
                : localStorage.getItem("groupId")
            }
            onChange={handleChange}
            showSearch
            style={{
              width: 250,
            }}
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            <Option
              selected={!localStorage.getItem("groupId") ? true : false}
              value={null}
            >
              همه
            </Option>
            {dropDownItems &&
              dropDownItems.map((el) => {
                return <Option value={el.id}>{el.title}</Option>;
              })}
          </Select>
        )}
       <div style={{display:'flex', alignItems: 'center', gap: 10}}>
          <div
                  onClick={() => handle_help()}
                  className={"notification-dropdown-btn"}
                  title={props.t("Help")}
                >
                  <div style={{display: 'flex', alignItems:'center', gap:4}}>
                    <HelpOutlineIcon sx={{fontSize: 25}} />
                    <span>راهنما</span>
                  </div>
                </div>
            <LanguageDropdown />
            <DashboardDropdown />
            {/*<NotificationsDropdown/>*/}
            <div
              className={"notification-dropdown-btn"}
              onClick={() => handle_sign_out()}
              title={props.t("Sign out")}
            >
              <div style={{display: 'flex', alignItems:'center', gap:4}}>
                <ExitToAppIcon sx={{fontSize: 25}} />
                <span>خروج</span>
              </div>
            </div>
       </div>
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
              <Modal.Header closeButton>
                <Modal.Title>
                  <i className="fal fa-question-circle"></i>

                  <span>راهنماهای کاربری</span>
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Helps></Helps>
                {/*<UserLogin/>*/}
              </Modal.Body>
            </Modal>
        {/*<div className={'text-center date-holder'}>*/}
        {/*    <h6><small>{current_date}</small></h6>*/}
        {/*    <h6><small>{current_time}</small></h6>*/}
        {/*</div>*/}
      </div>
    </div>
  );
}
export default compose(
  withTranslation(),
  connect(null, layout.actions)
)(Header);
