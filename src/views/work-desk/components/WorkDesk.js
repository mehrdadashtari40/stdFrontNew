import React, { useContext, useEffect, useLayoutEffect } from "react";
import { connect, shallowEqual, useSelector } from "react-redux";

import { withTranslation } from "react-i18next";
import * as workDesk from "../_redux/workDeskRedux";
import {
  baseUrlSetter,
  get_all_categories,
  get_all_committees,
  get_all_documents,
  get_all_document_types,
  get_all_organizations,
  get_all_subcommittees,
  get_events,
  get_user_id,
  check_role,
  get_category_titles,
} from "../_redux/workDeskCrud";
import moment from "jalali-moment";

import { useHistory } from "react-router-dom";
import postAuthenticatedJSON from "../../../common/utils/functions/postAuthenticatedJSON";
import { config } from "../../../config/config";
import Spinner from "../../../common/Spinner/Spinner";
import DualListBox from "react-dual-listbox";
import {
  get_inbox_filters,
  get_tag_list,
} from "../../../common/layout/_redux/layoutCrud";

import { smallBox } from "../../../common/utils/functions";
import classnames from "classnames";
import { AppConfig } from "../../../appConfig";
import SideBar from "./SideBar";
import { create } from "jss";
import rtl from "jss-rtl";
import Modal from "./Modal";

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { StyledEngineProvider } from '@mui/material/styles';
import { jssPreset } from '@mui/styles';
import SearchFields from "./SearchFields";
import TableTabs from "./TableTabs";
import CategoryDatatable from "./CategoryDatatable";
import DocumentDatatable from "./DocumentDatatable";
import CalendarModal from "./CalendarModal";
import DocumentDetail from "./DocumentDetail";
import EmailModal from "./EmailModal";
import EmailDatatable from "./EmailDatatable";
import CalendarEvents from "./CalendarEvents";
import CategoryBox from "./CategoryBox";
import { get_categories } from "../../menu/_redux/menuCrud";

function WorkDesk(props) {
  const { workDeskBaseUrl } = useContext(AppConfig);
  const token = localStorage.getItem("access_token");

  //console.log("asdasdasdas", workDeskBaseUrl);

  const useEffectFunctionHandler = async () => {
    await baseUrlSetter(workDeskBaseUrl);
    setTimeout(() => {
      get_user_id().then((res) => {
        props.handle_variables("userId", res.data);
      });

      check_role().then((res) => {
        props.handle_variables("isNew", res.data?.is_new);
        res?.data?.data.map((r) => {
          if (r.ROLE_ID == 8 || r.ROLE_ID == 12) {
            props.handle_variables("hasAccess", true);
          }
        });
      });

      get_all_documents(token, {
        archive: 0,
      }).then((res) => {
        props.handle_variables("document_length", res.data.total);
        props.handle_variables("documents", res.data.data);
      });

      get_all_organizations(token).then((res) => {
        props.handle_variables("organizations", res.data.data);
      });

      get_all_categories(token).then((res) => {
        const obj = {};
        const result = [];
        res.data.data.map((el) => {
          const {
            category_title,
            id,
            sc_app_uid,
            sc_code,
            tc_app_uid,
            tc_code,
          } = el;
          if (!obj[el.id]) {
            obj[el.id] = {
              category_title,
              id,
              tcs: [{ tc_app_uid, tc_code, scs: [{ sc_app_uid, sc_code }] }],
            };
          } else if (obj[el.id]) {
            obj[el.id]?.tcs.push({
              tc_app_uid,
              tc_code,
              scs: [{ sc_app_uid, sc_code }],
            });
          }
        });
        const keys = Object.keys(obj);
        keys.map((es) => {
          result.push(obj[es]);
        });
        result.map((le, idx) => {
          const obj2 = {};
          const secRes = [];
          le.tcs.map((v) => {
            if (!obj2[v.tc_app_uid]) {
              obj2[v.tc_app_uid] = v;
            }
          });
          const kes = Object.keys(obj2);
          kes.map((n) => {
            secRes.push(obj2[n]);
          });
          result[idx].tcs = secRes;
        });
        props.handle_variables("rawCategories", res.data.data);
        props.handle_variables("categories", result);
        props.handle_variables("category_length", res.data.total);
      });

      get_all_document_types(token).then((res) => {
        props.handle_variables("document_types", res.data);
      });

      get_events().then((res) => {
        props.handle_variables("events", res.data.data);
        props.handle_variables("isSecretary", res.data?.isSecretary);
      });

      get_category_titles(token).then((res) => {
        props.handle_variables("categoryTitles", res.data.data);
      });
    }, 1000);
  };

  let { state } = useSelector(
    (state) => ({
      state: state.workDeskReducer,
    }),
    shallowEqual
  );
  if (state === undefined) state = {};
  let history = useHistory();

  useEffect(() => {
    useEffectFunctionHandler();
    props.handle_variables("tableType", "document");
  }, []);

  const theme = createTheme({
    direction: "rtl",
  });

  const jss = create({
    plugins: [...jssPreset().plugins, rtl()],
  });

  const componentHandler = () => {
    switch (state.tableType) {
      case "category":
        return <CategoryDatatable />;
      case "document":
        return <DocumentDatatable />;
      case "detail":
        return <DocumentDetail />;
      case "email":
        return <EmailDatatable />;
    }
  };

  return (
    <StyledEngineProvider jss={jss}>
      <ThemeProvider theme={theme}>
        <div
          className="wk-con"
          style={{
            background: "white",
            display: "flex",
            flexWrap: "wrap",
            height: "fit-content",
            marginTop: "25px",
          }}
        >
          <div className="col-sm-9 table-and-search">{componentHandler()}</div>
          <SideBar />
          <Modal />
          <CalendarModal />
          <EmailModal />
          <CalendarEvents />
        </div>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default connect(null, workDesk.actions)(withTranslation()(WorkDesk));
