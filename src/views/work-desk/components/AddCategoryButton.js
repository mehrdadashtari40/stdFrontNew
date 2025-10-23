import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { actions } from "../_redux/workDeskRedux";

export default () => {
    const dispatch = useDispatch()
  return (

        <div className="w-100" style={{ marginTop: 8 }}>
          <button
            className="btn btn-primary text-white"
            style={{ width: "100%", height: "3.5rem" }}
            onClick={() => {
              dispatch(actions.handle_variables('tableType','category'))
            }}
          >
            <span className="my-auto mx-auto">ثبت دسته بندی</span>
          </button>
        </div>
     
  );
};
