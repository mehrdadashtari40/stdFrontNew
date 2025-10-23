import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import User from "@mui/icons-material/People";
import ArrowBack from "@mui/icons-material/ArrowBackIosTwoTone";
import LoadingOverlay from "react-loading-overlay";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import {
  delete_category,
  get_all_categories,
  get_all_documents,
} from "../_redux/workDeskCrud";
import { actions } from "../_redux/workDeskRedux";
export default () => {
  const [categoryData, setCategoryData] = useState([]);
  let { state } = useSelector(
    (state) => ({
      state: state.workDeskReducer,
    }),
    shallowEqual
  );
  const dispatch = useDispatch();

  useEffect(() => {
    let params = {};
    const token = localStorage.getItem("access_token");
    get_all_categories(token, params).then(async (res) => {
      const obj = {};
      const result = [];
      res.data.data.map((el) => {
        const { category_title, id, sc_app_uid, sc_code, tc_app_uid, tc_code } =
          el;
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
      dispatch(actions.handle_variables("rawCategories", res.data.data));

      dispatch(actions.handle_variables("categories", result));
      dispatch(actions.handle_variables("category_length", res.data.total));
    });
  }, []);

  const filterDataTable = (title) => {
    const params = {
      category_title: title,
    };
    const token = localStorage.getItem("access_token");

    get_all_documents(token, params).then(async (res) => {
      await dispatch(actions.handle_variables("documents", res.data.data));
    });
  };

  return (
    <Paper
      component="form"
      sx={{
        p: "2px 4px",
        alignItems: "center",
        marginTop: 1,
        minHeight: "10rem",
        height: "fit-content",
      }}
    >
      <div
        className="row"
        style={{ display: "flex", justifyContent: "right", margin: 10 }}
      >
        <User style={{ marginLeft: 5 }} />
        <span>اعضا کمیته</span>
      </div>

      <hr style={{ marginBlock: "7px 15px" }} />
      {state.CULoading ? (
        <LoadingOverlay
          active={state?.CULoading}
          spinner
          className="loading-overlay"
          // text=""
        ></LoadingOverlay>
      ) : (
        <div className="">
          {state.committeeUsers && (
            <>
              {state?.committeeUsers?.boss && (
                <div style={{ marginBlock: "15px" }}>
                  <h6 className="pr-custom"> رئیس</h6>
                  <hr style={{ marginBlock: "7px" }} />
                  <h6 className="pr-custom-more">
                    {state?.committeeUsers?.boss.fullName}
                  </h6>
                </div>
              )}
              {state?.committeeUsers?.bossAlternate && (
                <div style={{ marginBlock: "15px" }}>
                  <h6 className="pr-custom">نایب رئیس</h6>
                  <hr style={{ marginBlock: "7px" }} />
                  <h6 className="pr-custom-more">
                    {state?.committeeUsers?.bossAlternate.fullName}
                  </h6>
                </div>
              )}
              {state?.committeeUsers?.regularMembers.length !== 0 && (
                <div style={{ marginBlock: "15px" }}>
                  <h6 className="pr-custom">اعضای عادی</h6>
                  <hr style={{ marginBlock: "7px" }} />
                  {state?.committeeUsers?.regularMembers &&
                    state?.committeeUsers?.regularMembers.map((el) => {
                      return <h6 className="pr-custom-more">{el.fullName}</h6>;
                    })}
                </div>
              )}
              {state?.committeeUsers?.secretary && (
                <div style={{ marginBlock: "15px" }}>
                  <h6 className="pr-custom">دبیر</h6>
                  <hr style={{ marginBlock: "7px" }} />
                  <h6 className="pr-custom-more">
                    {state?.committeeUsers?.secretary.fullName}
                  </h6>
                </div>
              )}
              {state?.committeeUsers?.secretaryAssistant && (
                <div style={{ marginBlock: "15px" }}>
                  <h6 className="pr-custom">دستیار دبیر</h6>
                  <hr style={{ marginBlock: "7px" }} />
                  <h6 className="pr-custom-more">
                    {state?.committeeUsers?.secretaryAssistant.fullName}
                  </h6>
                </div>
              )}
              {state?.committeeUsers?.secretaryAssistant && (
                <div style={{ marginBlock: "15px" }}>
                  <h6 className="pr-custom">دستیار دبیر</h6>
                  <hr style={{ marginBlock: "7px" }} />
                  <h6 className="pr-custom-more">
                    {state?.committeeUsers?.secretaryAssistant.fullName}
                  </h6>
                </div>
              )}
              {state?.committeeUsers?.secretaryTemp.length !== 0 && (
                <div style={{ marginBlock: "15px" }}>
                  <h6 className="pr-custom">دبیر موقت</h6>
                  <hr style={{ marginBlock: "7px" }} />
                  {state?.committeeUsers?.secretaryTemp &&
                    state?.committeeUsers?.secretaryTemp.map((el) => {
                      return <h6 className="pr-custom-more">{el.fullName}</h6>;
                    })}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </Paper>
  );
};
