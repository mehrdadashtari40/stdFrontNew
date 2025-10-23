import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowBack from "@mui/icons-material/ArrowBackIosTwoTone";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronLeft";
import TreeItem from "@mui/lab/TreeItem";
import Pagination from "@mui/material/Pagination";

import {
  delete_category,
  get_all_categories,
  get_all_documents,
  get_members,
} from "../_redux/workDeskCrud";
import { actions } from "../_redux/workDeskRedux";
import { Button } from "react-bootstrap";
export default () => {
  const token = localStorage.getItem("access_token");

  const [categoryData, setCategoryData] = useState([]);
  const [tcId, setTcId] = useState(null);
  const [expanded, setExpanded] = useState([]);
  const [selected, setSelected] = useState([]);
  const [scId, setScId] = useState(null);

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  let { state } = useSelector(
    (state) => ({
      state: state.workDeskReducer,
    }),
    shallowEqual
  );

  const handleToggle = (event, nodeIds) => {
    setExpanded(nodeIds);
    // console.log("expanded1");
  };

  const handleSelect = (event, nodeIds) => {
    setSelected(nodeIds);
  };

  const dispatch = useDispatch();

  useEffect(() => {
    const params = {
      offset: page,
      totalPages: rowsPerPage,
    };
    const token = localStorage.getItem("access_token");
    get_all_categories(token, params).then(async (res) => {
      const data = res.data.data;
      const total = res.data.total;
      setTotalPages(Math.ceil(total / rowsPerPage));

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

      dispatch(actions.handle_variables("rawCategories", data));
      dispatch(actions.handle_variables("categories", result));
      dispatch(actions.handle_variables("category_length", total));
    });
  }, [page, rowsPerPage]);

  const filterDataTable = (title) => {
    const params = {
      category_title: title,
      archive: 0,
    };
    const token = localStorage.getItem("access_token");

    get_all_documents(token, params).then(async (res) => {
      await dispatch(actions.handle_variables("documents", res.data.data));
    });
  };

  return (
    <Paper
      component="form"
      sx={{ p: "2px 4px", alignItems: "center", marginTop: 1 }}
    >
      <div
        className="row"
        style={{ display: "flex", justifyContent: "right", margin: 10 }}
      >
        <MenuIcon style={{ marginLeft: 5 }} />
        <span>کمیته های فنی/فرعی متناظر</span>
      </div>
      <hr />

      {/* <Button
        onClick={() => {
          const params = { archive: 0 };
          get_all_documents(token, params).then((res) => {
            dispatch(actions.handle_variables("documents", res.data.data));
          });
          dispatch(actions.handle_variables("committeeUsers", null));
          setExpanded([]);
          setSelected([]);
        }}
        style={{ width: "100%", height: "4rem", marginBlock: "1rem" }}
      >
        نمایش همه
      </Button> */}

      <div style={{ paddingRight: 10 }}>
        {state.rawCategories &&
          state.rawCategories.map((category) => (
            <div
              style={{ paddingBottom: 5, cursor: "pointer" }}
              onClick={() => {
                if (category.sc_code) {
                  get_members(token, {
                    tc: category.tc_app_uid,
                    sc: category.sc_app_uid,
                  }).then((res) => {
                    dispatch(actions.handle_variables("CULoading", false));
                    dispatch(
                      actions.handle_variables(
                        "committeeUsers",
                        res?.data?.data
                      )
                    );
                  });
                } else {
                  get_members(token, {
                    tc: category.tc_app_uid,
                  }).then((res) => {
                    dispatch(actions.handle_variables("CULoading", false));
                    dispatch(
                      actions.handle_variables(
                        "committeeUsers",
                        res?.data?.data
                      )
                    );
                  });
                }
                dispatch(actions.handle_variables("CULoading", true));
              }}
            >
              {category?.sc_code ? category?.sc_code : category.tc_code}
            </div>
          ))}

        {totalPages > 1 && (
          <Pagination
            style={{ paddingTop: 10, paddingBottom: 10 }}
            count={totalPages}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
            hidePrevButton
            hideNextButton
          />
        )}
      </div>
    </Paper>
  );
};
