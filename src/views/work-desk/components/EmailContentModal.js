import { Divider } from "antd";
import React from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { actions } from "../_redux/workDeskRedux";

export default () => {
  const dispatch = useDispatch();
  let { state } = useSelector(
    (state) => ({
      state: state.workDeskReducer,
    }),
    shallowEqual
  );

  const handleClose = () => {
    dispatch(actions.handle_variables("emailContentModal", false));
    dispatch(actions.handle_variables("currentContent", null));
  };

  return (
    <Modal
      show={state.emailContentModal}
      onHide={handleClose}
      dialogClassName="content-modal"
    >
      <h2 style={{ marginBlock: "auto", padding: "5px" }}>محتوای ایمیل</h2>
      <Divider />
      <div className="col-sm-12">
        <h5 style={{ marginBlock: "auto" }}>{state?.currentContent}</h5>
      </div>
    </Modal>
  );
};
