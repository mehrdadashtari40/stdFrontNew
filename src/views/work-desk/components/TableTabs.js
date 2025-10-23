import { Tab, Tabs } from "@mui/material";
import React from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { actions } from "../_redux/workDeskRedux";

export default () => {
  let { state } = useSelector(
    (state) => ({
      state: state.workDeskReducer,
    }),
    shallowEqual
  );

  const dispatch = useDispatch();

  const handleChange = (e, value) => {
    dispatch(actions.handle_variables("tableType", value));
  };

  return (
    <div className="col-sm-12 tabs-div">
      <div className="col-sm-6">
        <Tabs value={state.tableType} onChange={handleChange}>
          <Tab value={"category"} className="table-tabs" label="دسته بندی" />
          <Tab value={"document"} className="table-tabs" label="مستند" />
        </Tabs>
      </div>
    </div>
  );
};
