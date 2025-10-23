import { TextField } from "@mui/material";
import React from "react";
import DatePicker from "react-modern-calendar-datepicker";
import { get_all_documents } from "../_redux/workDeskCrud";
import { useDebounce, useDebouncedCallback } from "use-debounce";
import { useDispatch } from "react-redux";
import { actions } from "../_redux/workDeskRedux";

export default () => {
  const [values, setValues] = React.useState({});
  const [expireDate, setExpireDate] = React.useState(null);
  const [date, setDate] = React.useState(null);
  const token = localStorage.getItem("access_token");

  const dispatch = useDispatch();

  const debounceCallBack = useDebouncedCallback((value) => {
    documentGetHandler();
    values.archive = 0;
    get_all_documents(token, values).then((res) => {
      dispatch(actions.handle_variables("documents", res.data.data));
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

  const renderCustomDateInput = (
    { ref },
    value,
    placeholder,
    stats,
    clearHandler
  ) => {
    return (
      <div style={{ width: "100%" }}>
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
        <i
          className="fa fa-times"
          onClick={() => clearHandler()}
          style={{
            position: "absolute",
            left: "4px",
            top: "14px",
            bottom: "0",
          }}
        ></i>
      </div>
    );
  };

  return (
    <div className="docs-search-fields col-sm-12 p-0">
      <div className="" style={{ width: "15%", padding: "5px" }}>
        <div className="input-div">
          <label>سازمان</label>
          <TextField
            className="search-fields"
            variant="outlined"
            onChangeCapture={(e) => {
              setValues((vals) => {
                vals.organization_title = e.target.value;
                return vals;
              });

              debounceCallBack();
            }}
            placeholder="سازمان"
          />
        </div>
      </div>
      <div className="" style={{ width: "14%", padding: "5px" }}>
        <div className="input-div">
          <label>کمیته فنی متناظر</label>
          <TextField
            className="search-fields"
            variant="outlined"
            placeholder="کمیته فنی متناظر"
            onChangeCapture={(e) => {
              setValues((vals) => {
                vals.tc_title = e.target.value;
                return vals;
              });

              debounceCallBack();
            }}
          />
        </div>
      </div>
      <div className="" style={{ width: "15%", padding: "5px" }}>
        <div className="input-div">
          <label>عنوان</label>
          <TextField
            className="search-fields"
            variant="outlined"
            placeholder="عنوان"
            onChangeCapture={(e) => {
              setValues((vals) => {
                vals.title = e.target.value;
                return vals;
              });

              debounceCallBack();
            }}
          />
        </div>
      </div>

      {/* <div className="">
        <div className="input-div">
          <label>دسته بندی</label>
          <TextField
            className="search-fields"
            type={"text"}
            variant="outlined"
            onChangeCapture={(e) => {
              setValues((vals) => {
                vals.category_title = e.target.value;
                return vals;
              });

              debounceCallBack();
            }}
            placeholder="دسته بندی"
          />
        </div>
      </div> */}

      <div className=" datepicker-div" style={{ width: "12%", padding: "5px" }}>
        <label>تاریخ ثبت</label>
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
                vals.submit_date = datez;
                return vals;
              });
              debounceCallBack();
            }
          }}
          shouldHighlightWeekends
          renderInput={(e) =>
            renderCustomDateInput(e, date, "تاریخ ثبت", false, () => {
              setDate(null);
              setValues((copy) => {
                delete copy.submit_date;
                return copy;
              });
              debounceCallBack();
            })
          } // render a custom input
          locale="fa" // add this
        />
      </div>
      <div className=" datepicker-div" style={{ width: "14%", padding: "5px" }}>
        <label>تاریخ اعتبار</label>
        <DatePicker
          value={expireDate}
          style={{ marginTop: "5px" }}
          onChange={(e) => {
            if (e) {
              setExpireDate(e);
              const datez = moment
                .from(`${e.year}/${e.month}/${e.day}`, "fa", "YYYY/MM/DD")
                .format("YYYY-MM-DD");

              setValues((vals) => {
                vals.expire_date = datez;
                return vals;
              });
              debounceCallBack();
            }
          }}
          shouldHighlightWeekends
          renderInput={(e) =>
            renderCustomDateInput(e, expireDate, "تاریخ اعتبار", false, () => {
              setExpireDate(null);
              setValues((copy) => {
                delete copy.expire_date;
                return copy;
              });
              debounceCallBack();
            })
          } // render a custom input
          locale="fa" // add this
        />
      </div>
      <div className="" style={{ width: "14%", padding: "5px" }}>
        <div className="input-div">
          <label>درج کننده</label>
          <TextField
            className="search-fields"
            variant="outlined"
            placeholder="درج کننده"
            onChangeCapture={(e) => {
              setValues((vals) => {
                vals.submit_user = e.target.value;
                return vals;
              });

              debounceCallBack();
            }}
          />
        </div>
      </div>
    </div>
  );
};
