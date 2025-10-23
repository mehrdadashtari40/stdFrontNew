import React, { useState, useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import { config, get_my_conf } from "../../../config/config";
import { actions } from "../_redux/layoutRedux";

export default function Activities(props) {
  const [renderFlag, setRenderFlag] = useState(true);
  const [not_duplicated_pronames, setNot_duplicated_pronames] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const dispatch = useDispatch();
  let { state } = useSelector(
    (state) => ({
      state: state.layout2,
    }),
    shallowEqual
  );
  if (state === undefined) state = {};
  let { inbox_state } = useSelector(
    (state) => ({
      inbox_state: state.inbox,
    }),
    shallowEqual
  );

  if (inbox_state === undefined) inbox_state = {};

  useEffect(() => {
    if (state.current_category?.items && !state.isItemsLoaded) {
      useEffectFun();
    }
  });

  const useEffectFun = async () => {
    await category_items(state.current_category.items);
    dispatch(actions.handle_variables("isItemsLoaded", true));
  };

  const handleFilterByProUid = (action) => {
    if (state.is_case_detail) {
      history.push("/inbox");
      props.handle_refresh_inbox();
    }
    if (inbox_state.current_pro_uid === action)
      props.load_data_with_pro_uid("");
    else props.load_data_with_pro_uid(action);
  };

  if (
    renderFlag &&
    config.showDefaultCustomFields &&
    state.current_category &&
    inbox_state.current_pro_uid === "" &&
    !inbox_state.is_datatable_loading
  ) {
    handleFilterByProUid(state.current_category.items[0].pro_uid);
    setRenderFlag(false);
  }

  let history = useHistory();

  const showProcessInfo = (process) => {
    props.handle_multi_variables([
      ["process_description_modal_open", true],
      ["process_title", process.title],
      ["process_descriptions", process.descrption],
    ]);
  };
  const handle_close_process_modal = () => {
    props.handle_variables("process_description_modal_open", false);
  };

  const category_items = async (data) => {
    if (data) {
      let category_items_unique = data.filter(
        (arr, index, self) =>
          index === self.findIndex((t) => t.pro_uid === arr.pro_uid)
      );
      setNot_duplicated_pronames(category_items_unique);
    }
  };

  return (
    <div className={"activity-style"}>
      <Modal
        show={state.process_description_modal_open}
        onHide={() => handle_close_process_modal()}
      >
        <Modal.Header closeButton>
          <Modal.Title>{state.process_title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{state.process_descriptions}</Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => handle_close_process_modal()}
          >
            {props.t("return")}
          </Button>
        </Modal.Footer>
      </Modal>
      <ul className="activities-ul activity-menu">
        {state.current_category === null ||
        state.current_category.items === undefined ||
        state.current_category.items.length === 0 ? (
          <>
            {state.current_category === null ? null : <li>بدون زیرمجموعه</li>}
          </>
        ) : (
          <>
            {not_duplicated_pronames.length !== 0 &&
              not_duplicated_pronames.map((x, key) => {
                let start_btn = <></>;
                let info_btn = <></>;
                if (x.pro_uid !== null && x.tas_uid !== null) {
                  if (parseInt(x.can_start) !== 0) {
                    start_btn = (
                      <>
                        <a
                          href={"/#/new-case/" + x.pro_uid + "/" + x.tas_uid}
                          className={"start-new"}
                          onClick={() =>
                            history.push(
                              "/newInbox/create/" + x.pro_uid + "/" + x.tas_uid
                            )
                          }
                        >
                          {props.t("Start")}
                        </a>
                      </>
                    );
                  }
                  if (x.descrption !== "") {
                    info_btn = (
                      <>
                        <div
                          className={"process-info"}
                          onClick={() => showProcessInfo(x)}
                        >
                          {props.t("Info")}
                        </div>
                      </>
                    );
                  }
                }

                return (
                  <li
                    className={
                      inbox_state.current_pro_uid === x.pro_uid ? "active" : ""
                    }
                  >
                    <div onClick={() => handleFilterByProUid(x.pro_uid)}>
                      <i className="fal fa-angle-double-left"></i>
                      <span>
                        {x.title}{" "}
                        {parseInt(x.unread_count) === 0
                          ? null
                          : "(" + x.unread_count + ")"}
                      </span>
                    </div>
                    <div className={"hover-holder"}>
                      {start_btn}
                      {info_btn}
                    </div>
                  </li>
                );
              })}
          </>
        )}
      </ul>
    </div>
  );
}
