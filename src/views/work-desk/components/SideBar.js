import React, { useState, useEffect } from "react";
import SearchBox from "./SearchBox";
import AddDocumentButton from "./AddDocumentButton";
import AddCategoryButton from "./AddCategoryButton";
import Calendar from "./Calendar";
import CategoryBox from "./CategoryBox";
import EventsDiv from "./EventsDiv";
import EmailBox from "./EmailBox";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import getAuthonticatedJSON from "../../../common/utils/functions/getAuthenticatedJSON";
import { config } from "../../../config/config";
import Condition from "yup/lib/Condition";
import UserBox from "./UserBox";

export default () => {
  let { state } = useSelector(
    (state) => ({
      state: state.workDeskReducer,
    }),
    shallowEqual
  );
  const [role, setRole] = useState("");
  const [uid, setUid] = useState("");
  useEffect(() => {
    getAuthonticatedJSON(config.apiServer + "userextend/get-my-role").then(
      (res) => {
        setRole(res);
      }
    );
    getAuthonticatedJSON(config.apiServer + "userextend/get-my-uid").then(
      (res) => {
        //console.log("id", res);
        setUid(res);
      }
    );
  }, []);

  return (
    <div className="col-sm-3">
      <div className="w-100">
        <hr />
        {/* <SearchBox /> */}

        <AddDocumentButton />
        {role == "PROCESSMAKER_ADMIN" ||
        uid == "6274015296280bad4a0d892079624618" ? (
          <AddCategoryButton />
        ) : null}
        <EventsDiv />
        <Calendar />
        {/* <CategoryBox /> */}
        {state.hasAccess ? <EmailBox /> : null}
        <CategoryBox />
        <UserBox />
      </div>
    </div>
  );
};
