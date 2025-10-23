import { TextField } from "@mui/material";
import React from "react";
import DatePicker from "react-modern-calendar-datepicker";
import { get_all_documents, get_all_emails } from "../_redux/workDeskCrud";
import { useDebounce, useDebouncedCallback } from "use-debounce";
import { useDispatch } from "react-redux";
import { actions } from "../_redux/workDeskRedux";

export default () => {
  const [values, setValues] = React.useState({});
  const [endDate, setExpireDate] = React.useState(null);
  const [date, setDate] = React.useState(null);
  const token = localStorage.getItem("access_token");

  const dispatch = useDispatch();

  const debounceCallBack = useDebouncedCallback((value) => {
    documentGetHandler();
    get_all_emails(token, values).then((res) => {
      dispatch(actions.handle_variables("emails", res.data.data));
    });
  }, 666);

  const documentGetHandler = () => {
    let copy = values;
    const keys = Object.keys(copy);
    keys.map((el) => {
      if (!copy[el]) {
        delete copy[el];
      }
    });
    setValues(copy);
  };

  const renderCustomDateInput = ({ ref }, value, placeholder, stats) => {
    const persianDate = new Date(value).toLocaleDateString("fa-ir").split("/");

    return (
      <input
        readOnly
        ref={ref} // necessary
        placeholder={placeholder && placeholder}
        value={value ? `${value?.year}/${value?.month}/${value?.day}` : ""}
        style={{
          textAlign: "right",
          fontSize: "1.15rem",
          width: "100%",
          height: "3rem",
          border: "1px solid rgba(0, 0, 0, 0.23)",
          margin: "0",
          marginTop: "5px",
          display: "block",
          borderRadius: "4px",
          color: "#000000",
        }}
        disabled={stats}
        className="my-custom-input-class" // a styling class
      />
    );
  };

  return (
    <div className="docs-search-fields col-sm-12">
      <div className="col-sm-6">
        <div className="input-div">
          <label>جست و جو بر اساس موضوع یا گیرنده</label>
          <TextField
            className="search-fields"
            variant="outlined"
            onChangeCapture={(e) => {
              setValues((vals) => {
                vals.search = e.target.value;
                return vals;
              });

              debounceCallBack();
            }}
            placeholder="جست و جو بر اساس موضوع یا گیرنده"
          />
        </div>
      </div>

      <div className="col-sm-3">
        <div
          className=" datepicker-div"
          style={{ width: "100%", padding: "5px" }}
        >
          <label>از تاریخ</label>
          <DatePicker
            style={{ marginTop: "5px" }}
            value={date}
            onChange={(e) => {
              if (e) {
                setDate(e);
                const datez = moment
                  .from(`${e.year}/${e.month}/${e.day}`, "fa", "YYYY/MM/DD")
                  .format("YYYY-MM-DD");

                setValues((vals) => {
                  vals.start_date = datez;
                  return vals;
                });
                debounceCallBack();
              }
            }}
            shouldHighlightWeekends
            renderInput={(e) =>
              renderCustomDateInput(e, date, "از تاریخ", false, () => {
                setDate(null);
                setValues((copy) => {
                  delete copy.start_date;
                  return copy;
                });
                debounceCallBack();
              })
            } // render a custom input
            locale="fa" // add this
          />
        </div>
      </div>
      <div className="col-sm-3">
        <div
          className=" datepicker-div"
          style={{ width: "100%", padding: "5px" }}
        >
          <label>تا تاریخ</label>
          <DatePicker
            style={{ marginTop: "5px" }}
            value={endDate}
            onChange={(e) => {
              if (e) {
                setExpireDate(e);
                const datez = moment
                  .from(`${e.year}/${e.month}/${e.day}`, "fa", "YYYY/MM/DD")
                  .format("YYYY-MM-DD");

                setValues((vals) => {
                  vals.end_date = datez;
                  return vals;
                });
                debounceCallBack();
              }
            }}
            shouldHighlightWeekends
            renderInput={(e) =>
              renderCustomDateInput(e, endDate, "تا تاریخ", false, () => {
                setDate(null);
                setValues((copy) => {
                  delete copy.end_date;
                  return copy;
                });
                debounceCallBack();
              })
            } // render a custom input
            locale="fa" // add this
          />
        </div>
      </div>
      {/* <div className="col-sm-4">
        <div className="input-div">
          <label>محتوای ایمیل</label>
          <TextField
            className="search-fields"
            variant="outlined"
            onChangeCapture={(e) => {
              setValues((vals) => {
                vals.content = e.target.value;
                return vals;
              });

              debounceCallBack();
            }}
            placeholder="محتوای ایمیل"
          />
        </div>
      </div> */}
    </div>
  );
};
