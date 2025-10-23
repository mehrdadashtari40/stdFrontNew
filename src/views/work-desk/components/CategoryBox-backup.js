import React, { Fragment, useEffect, useState } from "react"; // Import Fragment
import Paper from "@mui/material/Paper";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowBack from "@mui/icons-material/ArrowBackIosTwoTone";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import TreeView from "@mui/lab/TreeView";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronLeft";
import TreeItem from "@mui/lab/TreeItem";
import {
  delete_category,
  get_all_categories,
  get_all_documents,
  get_members,
} from "../_redux/workDeskCrud";
import { actions } from "../_redux/workDeskRedux";
import { Button } from "react-bootstrap"; // Ensure this is compatible with React 19 or consider MUI Button

export default function CategoryBox() { // Use a named function component
  const token = localStorage.getItem("access_token");

  const [categoryData, setCategoryData] = useState([]);
  const [tcId, setTcId] = useState(null);
  const [expanded, setExpanded] = useState([]);
  const [selected, setSelected] = useState([]);
  const [scId, setScId] = useState(null);

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
    let params = {};
    const token = localStorage.getItem("access_token");
    get_all_categories(token, params).then(async (res) => {
      const obj = {};
      const result = [];
      res.data.data.forEach((el) => { // Changed map to forEach for side effects
        const { category_title, id, sc_app_uid, sc_code, tc_app_uid, tc_code } =
          el;
        if (!obj[id]) {
          obj[id] = {
            category_title,
            id,
            tcs: [{ tc_app_uid, tc_code, scs: [{ sc_app_uid, sc_code }] }],
          };
        } else {
          obj[id]?.tcs.push({
            tc_app_uid,
            tc_code,
            scs: [{ sc_app_uid, sc_code }],
          });
        }
      });
      const keys = Object.keys(obj);
      keys.forEach((es) => { // Changed map to forEach
        result.push(obj[es]);
      });
      result.forEach((le, idx) => { // Changed map to forEach
        const obj2 = {};
        const secRes = [];
        le.tcs.forEach((v) => { // Changed map to forEach
          if (!obj2[v.tc_app_uid]) {
            obj2[v.tc_app_uid] = v;
          }
        });
        const kes = Object.keys(obj2);
        kes.forEach((n) => { // Changed map to forEach
          secRes.push(obj2[n]);
        });
        result[idx].tcs = secRes;
      });
      dispatch(actions.handle_variables("rawCategories", res.data.data));
      dispatch(actions.handle_variables("categories", result));
      dispatch(actions.handle_variables("category_length", res.data.total));
    });
  }, []); // Ensure this effect runs only once

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
        <span>دسته بندی اسناد</span>
      </div>
      <hr />

      <Button
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
      </Button>
      <TreeView
        aria-label="file system navigator"
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        expanded={expanded}
        selected={selected}
        onNodeToggle={handleToggle}
        onNodeSelect={handleSelect}
        multiSelect
        sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: "auto" }}
      >
        {state.categories &&
          state.categories.map((category) => (
            // Use Fragment with key for list items
            <Fragment key={category.id || `category-${category.category_title}`}>
              {category.id && (
                <TreeItem
                  nodeId={category.id}
                  label={category.category_title}
                  onClick={() => {
                    const params = { tree_id: category.id, archive: 0 };
                    get_all_documents(token, params).then((res) => {
                      dispatch(
                        actions.handle_variables("documents", res.data.data)
                      );
                    });
                  }}
                >
                  {category?.tcs &&
                    category?.tcs.length !== 0 &&
                    category?.tcs.map((tc) => {
                      // Use Fragment with key for list items
                      return (
                        <Fragment key={tc.tc_app_uid || `tc-${tc.tc_code}-${category.id}`}>
                          {tc.tc_app_uid && (
                            <>
                              {tc?.scs && tc?.scs.length > 0 && tc?.scs[0]?.sc_app_uid ? (
                                <TreeItem
                                  nodeId={`${tc.tc_app_uid}_${category.id}`}
                                  label={tc.tc_code}
                                  onClick={() => {
                                    setTcId(tc.tc_app_uid);
                                    const params = {
                                      tree_id: tc.tc_app_uid,
                                      archive: 0,
                                    };
                                    get_all_documents(token, params).then(
                                      (res) => {
                                        dispatch(
                                          actions.handle_variables(
                                            "documents",
                                            res.data.data
                                          )
                                        );
                                      }
                                    );
                                    dispatch(
                                      actions.handle_variables(
                                        "CULoading",
                                        true
                                      )
                                    );
                                    get_members(token, {
                                      tc: tc.tc_app_uid,
                                    }).then((res) => {
                                      dispatch(
                                        actions.handle_variables(
                                          "CULoading",
                                          false
                                        )
                                      );
                                      dispatch(
                                        actions.handle_variables(
                                          "committeeUsers",
                                          res?.data?.data
                                        )
                                      );
                                    });
                                  }}
                                >
                                  {tc?.scs &&
                                    tc?.scs.length !== 0 &&
                                    tc?.scs.map((sc) => {
                                      // Use Fragment with key for list items
                                      return (
                                        <Fragment key={sc.sc_app_uid || `sc-${sc.sc_code}-${tc.tc_app_uid}`}>
                                          {sc.sc_app_uid && (
                                            <TreeItem
                                              onClick={() => {
                                                setScId(sc.sc_app_uid);
                                                const params = {
                                                  tree_id: sc.sc_app_uid,
                                                  archive: 0,
                                                };
                                                get_all_documents(
                                                  token,
                                                  params
                                                ).then((res) => {
                                                  dispatch(
                                                    actions.handle_variables(
                                                      "documents",
                                                      res.data.data
                                                    )
                                                  );
                                                });
                                                dispatch(
                                                  actions.handle_variables(
                                                    "CULoading",
                                                    true
                                                  )
                                                );
                                                get_members(token, {
                                                  tc: tcId, // Note: tcId might not be updated yet here
                                                  sc: sc.sc_app_uid,
                                                }).then((res) => {
                                                  dispatch(
                                                    actions.handle_variables(
                                                      "CULoading",
                                                      false
                                                    )
                                                  );
                                                  dispatch(
                                                    actions.handle_variables(
                                                      "committeeUsers",
                                                      res?.data?.data
                                                    )
                                                  );
                                                });
                                              }}
                                              nodeId={`${sc.sc_app_uid}_${tc?.tc_app_uid}`}
                                              label={sc.sc_code}
                                            />
                                          )}
                                        </Fragment>
                                      );
                                    })}
                                </TreeItem>
                              ) : (
                                <TreeItem
                                  nodeId={`${tc.tc_app_uid}_${category.id}`}
                                  label={tc.tc_code}
                                  onClick={() => {
                                    setTcId(tc.tc_app_uid);
                                    const params = {
                                      tree_id: tc.tc_app_uid,
                                      archive: 0,
                                    };
                                    get_all_documents(token, params).then(
                                      (res) => {
                                        dispatch(
                                          actions.handle_variables(
                                            "documents",
                                            res.data.data
                                          )
                                        );
                                      }
                                    );
                                    dispatch(
                                      actions.handle_variables(
                                        "CULoading",
                                        true
                                      )
                                    );
                                    get_members(token, {
                                      tc: tc.tc_app_uid,
                                    }).then((res) => {
                                      dispatch(
                                        actions.handle_variables(
                                          "CULoading",
                                          false
                                        )
                                      );
                                      dispatch(
                                        actions.handle_variables(
                                          "committeeUsers",
                                          res?.data?.data
                                        )
                                      );
                                    });
                                  }}
                                />
                              )}
                            </>
                          )}
                        </Fragment>
                      );
                    })}
                </TreeItem>
              )}
            </Fragment>
          ))}
      </TreeView>
    </Paper>
  );
}