import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import Email from "@mui/icons-material/Email";
import ArrowBack from "@mui/icons-material/ArrowBackIosTwoTone";
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

  return (
    <Paper
      component="form"
      sx={{ p: "2px 4px", alignItems: "center", marginTop: 1 }}
    >
      <div
        className="row"
        style={{ display: "flex", justifyContent: "right", margin: 10 }}
      >
        <Email style={{ marginLeft: 5 }} />
        <span>پست الکترونیک</span>
      </div>
      <hr />
      <a
        className="row"
        style={{
          display: "flex",
          justifyContent: "right",
          margin: 10,
          color: "black",
        }}
        onClick={() => {
          dispatch(actions.handle_variables("emailModal", true));
        }}
      >
        <ArrowBack />
        <span>ارسال ایمیل</span>
      </a>
      <a
        onClick={() => {
          dispatch(actions.handle_variables("tableType", "email"));
        }}
        className="row"
        style={{
          display: "flex",
          justifyContent: "right",
          margin: 10,
          color: "black",
        }}
      >
        <ArrowBack />
        <span>آرشیو ایمیل</span>
      </a>
    </Paper>
  );
};
