import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useHistory } from "react-router-dom";

export default function Activities(props) {
  const history = useHistory();
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

  const handleFilterByProUid = (action) => {
    inbox_state.current_action = null;
    if (state.is_case_detail) {
      history.push("/inbox");
      props.handle_refresh_inbox();
    }
    if (inbox_state.current_pro_uid === action)
      props.load_data_with_pro_uid("");
    else props.load_data_with_pro_uid(action);
  };

  return (
    <>
      {props.menuItems?.map((item) => (
        <div
          className={`sidebar-submenu-item-list ${
            inbox_state.current_pro_uid === item.pro_uid ? "active" : ""
          }`}
        >
          <ArrowBackIcon sx={{ color: "#4E4E4E" }} />
          <div
            style={{
              width: "100%",
              padding: 10,
              color: "#4E4E4E",
              fontSize: 11,
              borderBottom: "1px solid #DCDCDC",
            }}
            onClick={() => handleFilterByProUid(item.pro_uid)}
          >
            {item.title}
          </div>
          {item.pro_uid !== null &&
            item.tas_uid !== null &&
            parseInt(item.can_start) !== 0 && (
              <a
                href={"/#/new-case/" + item.pro_uid + "/" + item.tas_uid}
                className={"start-new"}
                onClick={() =>
                  history.push(
                    "/newInbox/create/" + item.pro_uid + "/" + item.tas_uid
                  )
                }
              >
                {props.t("Start")}
              </a>
            )}
        </div>
      ))}
    </>
  );
}
