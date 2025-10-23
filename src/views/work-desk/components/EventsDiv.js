import { Button, Tooltip } from "antd";
import { Button as BootButton, Modal } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { actions } from "../_redux/workDeskRedux";
import LoadingOverlay from "react-loading-overlay";
import { delete_event, get_events } from "../_redux/workDeskCrud";
import { successNotification } from "./functions";

export default () => {
  const [open, setOpen] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const dispatch = useDispatch();

  let { state } = useSelector(
    (state) => ({
      state: state.workDeskReducer,
    }),
    shallowEqual
  );

  const handleClose = () => {
    setOpen(false);
  };

  const deleteHandler = () => {
    delete_event(currentId).then((res) => {
      const filtered = state.events.filter((le) => {
        return le.id !== currentId;
      });
      dispatch(actions.handle_variables("events", filtered));
      successNotification("رویداد حذف شد");
    });
    handleClose();
  };

  const clockHandler = (startTime, endTime) => {
    const splittedStartTime = startTime.split(" ")[1].split(":");
    const splittedEndTime = endTime.split(" ")[1].split(":");
    return `${splittedEndTime[0]}:${splittedEndTime[1]}
 
    ${splittedStartTime[0]}:${splittedStartTime[1]}
    `;
  };

  return (
    <>
      {state.isSecretary === "1" && (
        <div className="events-div p-1">
          <div className="col-sm-12 p-0">
            {" "}
            <Button
              className="calendar-add-btn"
              onClick={() => {
                dispatch(actions.handle_variables("calendarModal", true));
              }}
            >
              افزودن رویداد
            </Button>
          </div>
          {/* <div className="col-sm-12 p-0 events-details-div">
          {!state.isLoading ? (
            <>
              {state?.events &&
                state.events.map((el) => {
                  return (
                    <Tooltip placement="bottom" title={el?.description}>
                      <div className="col-sm-12 event">
                        <h4 className="event-title col-sm-5 p-0">
                          {el?.title}
                        </h4>
                        <h6
                          className="col-sm-5"
                          style={{ marginBlock: "auto" }}
                        >
                          {clockHandler(el?.startTime, el?.endTime)}
                        </h6>
                        <i
                          onClick={() => {
                            setCurrentId(el?.id);
                            setOpen(true);
                          }}
                          className="fa fa-trash trash-icon col-sm-2"
                        ></i>
                      </div>
                    </Tooltip>
                  );
                })}
            </>
          ) : (
            // <div className="event-loading-div">
            <LoadingOverlay
              active={state?.isLoading}
              spinner
              className="loading-overlay"
              // text=""
            ></LoadingOverlay>
            // </div>
          )}
        </div> */}
        </div>
      )}
      <Modal show={open} onHide={handleClose} dialogClassName="del-modal">
        <div className="event-del-dialog">
          <h4 className="col-sm-12 del-title">رویداد حذف شود؟</h4>
          <div className="col-sm-12 del-button-div p-0">
            <div className="col-sm-6 modal-fields-div">
              <BootButton
                className="modal-btn bg-danger text-white modal-cancel-btn"
                onClick={handleClose}
              >
                انصراف
              </BootButton>
            </div>
            <div className="col-sm-6 modal-fields-div">
              <BootButton
                className="modal-btn  text-white modal-submit-btn"
                onClick={() => deleteHandler()}
              >
                حذف
              </BootButton>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};
