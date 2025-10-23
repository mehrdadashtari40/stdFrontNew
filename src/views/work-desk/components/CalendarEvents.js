import { Divider, Tooltip } from "antd";
import React from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { delete_event } from "../_redux/workDeskCrud";
import { actions } from "../_redux/workDeskRedux";
import LoadingOverlay from "react-loading-overlay";
import { successNotification } from "./functions";

export default () => {
  const [currentId, setCurrentId] = React.useState(null);
  let { state } = useSelector(
    (state) => ({
      state: state.workDeskReducer,
    }),
    shallowEqual
  );

  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(actions.handle_variables("calendarModalOpen", false));
  };

  const clockHandler = (startTime, endTime) => {
    const splittedStartTime = startTime.split(" ")[1].split(":");
    const splittedEndTime = endTime.split(" ")[1].split(":");
    return `${splittedEndTime[0]}:${splittedEndTime[1]}
 
    ${splittedStartTime[0]}:${splittedStartTime[1]}
    `;
  };

  const dateHandler = (date) => {
    return `${date?.year}/${date?.month}/${date?.day}`;
  };

  return (
    <Modal
      show={state.calendarModalOpen}
      onHide={handleClose}
      dialogClassName="crud-modal event-modal"
      style={{ padding: "10px" }}
    >
      <div className="col-sm-12">
        <h4 className="my-auto">
          رویداد های {dateHandler(state?.calendarDate)}
        </h4>
      </div>
      <Divider />
      <div className="event-calendar-modal">
        {!state.isLoading ? (
          <>
            {state?.events &&
              state.events.map((el) => {
                return (
                  <div
                    className="col-sm-12 event"
                    style={{
                      height: "auto",
                      minHeight: "5rem",
                      padding: "5px",
                    }}
                  >
                    <h4 className="event-title col-sm-5 p-0">{el?.title}</h4>
                    <h6 className="col-sm-5" style={{ marginBlock: "auto" }}>
                      {clockHandler(el?.startTime, el?.endTime)}
                    </h6>
                    <div
                      className="col-sm-12"
                      style={{ overflowWrap: "break-word" }}
                    >
                      {el?.description}
                    </div>
                    {state.isSecretary === "1" && (
                      <i
                        onClick={() => {
                          //   setCurrentId(el?.id);
                          //   setOpen(true);
                          delete_event(el.id).then((res) => {
                            const filtered = state.events.filter((le) => {
                              return le.id !== el.id;
                            });
                            dispatch(
                              actions.handle_variables("events", filtered)
                            );
                            successNotification("رویداد حذف شد");
                            if (filtered.length === 0) {
                              dispatch(
                                actions.handle_variables(
                                  "calendarModalOpen",
                                  false
                                )
                              );
                            }
                          });
                        }}
                        style={{ cursor: "pointer" }}
                        className="fa fa-trash trash-icon col-sm-2"
                      ></i>
                    )}
                  </div>
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
      </div>
    </Modal>
  );
};
