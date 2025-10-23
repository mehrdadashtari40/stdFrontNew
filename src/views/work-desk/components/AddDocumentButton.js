import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import { Calendar } from "react-modern-calendar-datepicker";
import { useDispatch } from "react-redux";
import { actions } from "../_redux/workDeskRedux";
export default () => {
  const dispatch = useDispatch();

  const [selectedDay, setSelectedDay] = useState(null);

  return (
    <div className="w-100" style={{ marginTop: 8 }}>
      <button
        className="btn text-white"
        style={{ width: "100%", height: "3.5rem", backgroundColor: '#00a594', color: 'white' }}
        onClick={() => {
          dispatch(actions.handle_variables("tableType", "document"));
        }}
      >
        <span className="my-auto mx-auto">مستندات</span>
      </button>
    </div>
  );
};
