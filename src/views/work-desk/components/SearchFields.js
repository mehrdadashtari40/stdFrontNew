import { TextField } from "@mui/material";
import { Field, Formik } from "formik";
import React, { useState } from "react";
import DatePicker from "react-modern-calendar-datepicker";

export default () => {
  const [expireDate, setExpireDate] = useState(null);
  const [submitDate, setSubmitDate] = useState(null);

  const renderCustomDateInput = ({ ref }, value, placeholder) => (
    <input
      readOnly
      ref={ref} // necessary
      placeholder={placeholder && placeholder}
      value={value && value}
      style={{
        textAlign: "right",
        fontSize: "1.15rem",
        width: "100%",
        height: "3rem",
        border: "1px solid rgba(0, 0, 0, 0.23)",
        margin: "0",
        display: "block",
        borderRadius: "4px",
        color: "#000000",
      }}
      className="my-custom-input-class" // a styling class
    />
  );

  const CustomInputComponent = (props, label, type) => (
    <TextField
      className="search-field"
      variant="outlined"
      type={type}
      {...props}
    />
  );

  const CustomDateComponent = (props) => {
    return (
      <Calendar
        {...props}
        shouldHighlightWeekends
        locale="fa" // add this
      />
    );
  };

  return (
    <div className="search-field-parent-div col-sm-12">
      <Formik onSubmit={(values) => {}} enableReinitialize initialValues={{}}>
        {({ handleSubmit }) => {
          return (
            <>
              <div className="search-field-div col-sm-2">
                <Field
                  name="organization_title"
                  as={(e) => CustomInputComponent(e, "سازمان", "text")}
                  placeholder="سازمان"
                />
              </div>
              <div className="search-field-div col-sm-2">
                <Field
                  name="subject_title"
                  as={(e) => CustomInputComponent(e, "سازمان", "text")}
                  placeholder="موضوع"
                />
              </div>
              <div className="search-field-div col-sm-2">
                <Field
                  name="tc_title"
                  as={(e) => CustomInputComponent(e, "سازمان", "text")}
                  placeholder="کمیته فنی متناظر"
                />
              </div>

              <div className="search-field-div col-sm-2">
                <DatePicker
                  value={submitDate}
                  onChange={setSubmitDate}
                  renderInput={(e) =>
                    renderCustomDateInput(e, submitDate, "تاریخ ثبت")
                  } // render a custom input
                  shouldHighlightWeekends
                  locale="fa" // add this
                />
              </div>
              <div className="search-field-div col-sm-2">
                <DatePicker
                  value={expireDate}
                  onChange={setExpireDate}
                  shouldHighlightWeekends
                  renderInput={(e) =>
                    renderCustomDateInput(e, expireDate, "تاریخ اعتبار")
                  } // render a custom input
                  locale="fa" // add this
                />
              </div>
              <div className="search-field-div col-sm-2">
                <Field
                  name="submiter"
                  as={(e) => CustomInputComponent(e, "سازمان", "text")}
                  placeholder="درج کننده"
                />
              </div>
            </>
          );
        }}
      </Formik>
    </div>
  );
};
