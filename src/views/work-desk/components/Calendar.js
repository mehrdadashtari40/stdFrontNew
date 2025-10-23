import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import { Calendar } from "react-modern-calendar-datepicker";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { actions } from "../_redux/workDeskRedux";
import { useEffect } from "react";
import { fixNumbers } from "./functions";
import { get_events } from "../_redux/workDeskCrud";

export default () => {
  const [selectedDay, setSelectedDay] = useState(null);
  const [highlightedDays, setHighlightedDays] = useState(null);

  let { state } = useSelector(
    (state) => ({
      state: state.workDeskReducer,
    }),
    shallowEqual
  );

  const highlightDayHandler = (data) => {
    const patterned = data.map((el) => {
      if (el?.date) {
        const dates = new Date(el?.date).toLocaleDateString("fa-ir").split("/");

        return {
          year: +fixNumbers(dates[0]),
          month: +fixNumbers(dates[1]),
          day: +fixNumbers(dates[2]),
          className: "highlighted-days",
        };
      }
    });

    setHighlightedDays(patterned);
  };

  useEffect(() => {
    if (!highlightedDays && state?.events) {
      highlightDayHandler(state?.events);
    }
  });

  const dispatch = useDispatch();

  return (
    <Paper
      component="form"
      sx={{ p: "2px 4px", display: "flex", alignItems: "center", marginTop: 1 }}
    >
      {highlightedDays && (
        <Calendar
          value={selectedDay}
          onChange={async (e) => {
            setSelectedDay(e);
            dispatch(actions.handle_variables("calendarDate", e));
            dispatch(actions.handle_variables("calendarModalOpen", true));
            const datez = moment
              .from(`${e.year}/${e.month}/${e.day}`, "fa", "YYYY/MM/DD")
              .format("YYYY-MM-DD");
            dispatch(actions.handle_variables("isLoading", true));
            dispatch(actions.handle_variables("events", undefined));

            await get_events(`${datez}`).then((res) => {
              dispatch(actions.handle_variables("events", res.data.data));
            });
            dispatch(actions.handle_variables("isLoading", false));
          }}
          shouldHighlightWeekends
          locale="fa"
          customDaysClassName={highlightedDays}
        />
      )}
    </Paper>
  );
};
