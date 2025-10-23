import { Button } from "react-bootstrap";
import React from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { actions } from "../_redux/workDeskRedux";
import DatePicker from "@hassanmojab/react-modern-calendar-datepicker";
import TimeInput from "react-time-input";
import { Formik, Field } from "formik";
import TimeField from "react-simple-timefield";
import { TextField } from "@mui/material";
import {
  get_events,
  set_event,
  get_all_committees,
  get_all_subcommittees,
  get_members,
  send_mail,
} from "../_redux/workDeskCrud";
import * as Yup from "yup";
import { Select } from "antd";

export default () => {
  let { state } = useSelector(
    (state) => ({
      state: state.workDeskReducer,
    }),
    shallowEqual
  );

  const token = localStorage.getItem("access_token");
  const [committees, setCommittees] = React.useState(null);
  const [subCommittees, setSubCommittees] = React.useState(null);

  const formSchema = Yup.object().shape({
    description: Yup.string()
      .required("پر کردن فیلد الزامیست")
      .typeError("پر کردن فیلد الزامیست"),
    title: Yup.string()
      .required("پر کردن فیلد الزامیست")
      .typeError("پر کردن فیلد الزامیست"),
    startTime: Yup.string()
      .required("پر کردن فیلد الزامیست")
      .typeError("پر کردن فیلد الزامیست"),
    endTime: Yup.string()
      .required("پر کردن فیلد الزامیست")
      .typeError("پر کردن فیلد الزامیست"),
    date: Yup.object()
      .required("پر کردن فیلد الزامیست")
      .typeError("پر کردن فیلد الزامیست"),
  });

  const renderCustomDateInput = ({ ref }, value, placeholder, stats) => {
    const persianDate = new Date(value).toLocaleDateString("fa-ir").split("/");

    return (
      <input
        readOnly
        ref={ref} // necessary
        placeholder={placeholder && placeholder}
        value={value ? `${value?.year}/${value?.month}/${value?.day}` : ""}
        style={{
          padding: "10px",
          textAlign: "right",
          fontSize: "1.15rem",
          width: "100%",
          height: "5.3rem",
          border: "1px solid rgba(0, 0, 0, 0.23)",
          margin: "0",
          display: "block",
          borderRadius: "4px",
          color: "#000000",
        }}
        disabled={stats}
        className="my-custom-input-class" // a styling class
      />
    );
  };

  const handleClose = () => {
    dispatch(actions.handle_variables("calendarModal", false));
  };

  const dispatch = useDispatch();

  return (
    <Modal
      show={state.calendarModal}
      onHide={handleClose}
      dialogClassName="calendar-modal"
    >
      <div className="calendar-modal-parent-div">
        <Formik
          initialValues={{}}
          validationSchema={formSchema}
          onSubmit={(values) => {
            const datez = moment
              .from(
                `${values?.date.year}/${values?.date.month}/${values?.date.day}`,
                "fa",
                "YYYY/MM/DD"
              )
              .format("YYYY-MM-DD");

            values.date = `${datez} 00:00:00`;
            values.startTime = `${datez} ${values?.startTime}:00`;
            values.endTime = `${datez} ${values?.endTime}:00`;

            set_event(values).then((res) => {
              const convertedUsers = [];
              state.users.map((b) => {
                convertedUsers.push({
                  name: b.username,
                  email: b.email,
                  user_id: b.usr_uid,
                });
              });

              const formData = new FormData();
              formData.append("sendTypeId", "1");
              formData.append("organization_id", values?.organization_id);
              formData.append("tc_id", values?.tc_id);
              formData.append("sc_id", values?.sc_id);
              formData.append("subject", values?.title);
              formData.append("description", values?.description);
              formData.append("users", JSON.stringify(convertedUsers));
              send_mail(formData).then((res) => {
                window.location.reload();
              });
            });
          }}
        >
          {({ handleSubmit, values, errors, touched, setFieldValue }) => {
            return (
              <>
                <div className="col-sm-12 modal-fields-div">
                  <div role="group" aria-labelledby="my-radio-group">
                    <label>
                      <Field type="radio" name="eventTypeId" value="1" />
                      <span style={{ marginInline: 10 }}>رویداد</span>
                    </label>
                    <label>
                      <Field
                        type="radio"
                        name="eventTypeId"
                        style={{ paddingInline: 5 }}
                        value="2"
                      />
                      <span style={{ marginInline: 10 }}>یادرآور</span>
                    </label>
                  </div>
                </div>
                <div className="col-sm-12 modal-fields-div">
                  <div className="input-div">
                    <label>موضوع</label>
                    <TextField
                      className="my-custom-input"
                      variant="outlined"
                      value={values?.title}
                      onChange={(e) => {
                        setFieldValue("title", e.target.value);
                      }}
                      placeholder="وارد کنید ..."
                    />
                    {errors.title && (
                      <div className="err-div">{errors.title}</div>
                    )}
                  </div>
                </div>
                <div className="col-sm-12 modal-fields-div time-div p-0">
                  <div className="input-div col-sm-12 col-md-6">
                    <label>تاریخ</label>
                    <DatePicker
                      value={values?.date}
                      onChange={(e) => {
                        if (e) {
                          setFieldValue("date", e);
                        }
                      }}
                      shouldHighlightWeekends
                      renderInput={(e) =>
                        renderCustomDateInput(e, values?.date, "تاریخ", false)
                      } // render a custom input
                      locale="fa" // add this
                    />
                    {errors.date && (
                      <div className="err-div">{errors.date}</div>
                    )}
                  </div>
                  <div className="input-div col-sm-12 col-md-3">
                    <label>از ساعت</label>
                    <TimeField
                      value={values?.startTime}
                      onChange={(event, value) => {
                        setFieldValue("startTime", value);
                      }}
                      input={<TextField variant="outlined" />}
                      inputRef={(ref) => {}}
                      colon=":"
                      // showSeconds
                    />
                    {errors.startTime && (
                      <div className="err-div">{errors.startTime}</div>
                    )}
                  </div>
                  <div className="input-div col-sm-12 col-md-3">
                    <label>تا ساعت</label>
                    <TimeField
                      value={values?.endTime}
                      onChange={(event, value) => {
                        setFieldValue("endTime", value);
                      }}
                      input={<TextField variant="outlined" />}
                      inputRef={(ref) => {}}
                      colon=":"
                      // showSeconds
                    />
                    {errors.endTime && (
                      <div className="err-div">{errors.endTime}</div>
                    )}
                  </div>
                </div>
                <div className="col-sm-4 modal-fields-div">
                  <div className="my-custom-select-div">
                    <label>سازمان</label>
                    <Select
                      placeholder="انتخاب کنید"
                      value={values?.organization_id}
                      style={{ overflow: "auto" }}
                      className="my-custom-select"
                      allowClear
                      onSelect={(e, a) => {
                        setFieldValue("organization_id", e);
                        setFieldValue("tc_id", null);
                        setFieldValue("sc_id", null);
                        setCommittees(null);
                        setSubCommittees(null);
                        get_all_committees(token, e).then((res) => {
                          setCommittees(res.data.data);
                        });
                      }}
                      onClear={() => {
                        setFieldValue("organization_id", null);
                        setFieldValue("tc_id", null);
                        setFieldValue("sc_id", null);
                        setCommittees(null);
                        setSubCommittees(null);
                      }}
                    >
                      {state?.organizations &&
                        state?.organizations.map((el, index) => (
                          <Option key={index} name={el?.TITLE} value={el.ID}>
                            {el["TITLE"]}
                          </Option>
                        ))}
                    </Select>{" "}
                  </div>
                  {errors?.organization_id && (
                    <div className="err-div">{errors?.organization_id}</div>
                  )}
                </div>
                <div className="col-sm-4 modal-fields-div">
                  <div className="my-custom-select-div">
                    <label>کمیته</label>
                    <Select
                      placeholder={
                        values?.organization_id
                          ? "انتخاب کنید"
                          : "فیلد سازمان را تکمیل نمایید"
                      }
                      value={values?.tc_id}
                      style={{ overflow: "auto" }}
                      allowClear
                      className="my-custom-select"
                      onSelect={(e, a) => {
                        setFieldValue("tc_id", e);
                        setFieldValue("sc_id", null);

                        setSubCommittees(null);
                        console.log("subCommittees", values?.organization_id);

                        get_all_subcommittees(
                          token,
                          e,
                          values?.organization_id
                        ).then((res) => {
                          setSubCommittees(res.data.data);
                        });
                        get_members(token, {
                          tc: e,
                        }).then((res) => {
                          const data = res?.data?.data;
                          const keys = Object.keys(data && data);
                          let users = [];
                          keys.map((el) => {
                            if (data[el]) {
                              if (Array.isArray(data[el])) {
                                users = [...users, ...data[el]];
                              } else {
                                users.push(data[el]);
                              }
                            }
                          });
                          dispatch(actions.handle_variables("users", users));
                        });
                      }}
                      onClear={() => {
                        setFieldValue("tc_id", null);
                        setFieldValue("sc_id", null);

                        setSubCommittees(null);
                      }}
                    >
                      {committees &&
                        committees.map((el, index) => (
                          <Option key={index} name={el?.CODE} value={el.DRP_TC}>
                            {el["CODE"]}
                          </Option>
                        ))}
                    </Select>{" "}
                  </div>
                  {errors?.tc_id && (
                    <div className="err-div">{errors?.tc_id}</div>
                  )}
                </div>
                <div className="col-sm-4 modal-fields-div">
                  <div className="my-custom-select-div">
                    <label>زیر کمیته</label>
                    <Select
                      placeholder={
                        values?.tc_id
                          ? "انتخاب کنید"
                          : "فیلد کمیته را تکمیل نمایید"
                      }
                      value={values?.sc_id}
                      style={{ overflow: "auto" }}
                      allowClear
                      className="my-custom-select"
                      onSelect={(e, a) => {
                        setFieldValue("sc_id", e);
                        get_members(token, {
                          tc: values?.tc_id,
                          sc: e,
                        }).then((res) => {
                          const data = res?.data?.data;
                          const keys = Object.keys(data && data);
                          let users = [];
                          keys.map((el) => {
                            if (data[el]) {
                              if (Array.isArray(data[el])) {
                                users = [...users, ...data[el]];
                              } else {
                                users.push(data[el]);
                              }
                            }
                          });

                          dispatch(actions.handle_variables("users", users));
                        });
                      }}
                      onClear={() => {
                        setFieldValue("sc_id", null);
                      }}
                    >
                      {subCommittees &&
                        subCommittees.map((el, index) => (
                          <Option key={index} name={el?.CODE} value={el.DRP_SC}>
                            {el["CODE"]}
                          </Option>
                        ))}
                    </Select>{" "}
                  </div>
                  {errors?.sc_id && (
                    <div className="err-div">{errors?.sc_id}</div>
                  )}
                </div>
                <div className="col-sm-12 modal-fields-div">
                  <div className="input-div">
                    <label>توضیحات</label>
                    <TextField
                      className="description-field"
                      style={{ height: "13rem" }}
                      variant="outlined"
                      value={values?.description}
                      onChange={(e) => {
                        setFieldValue("description", e.target.value);
                      }}
                      placeholder="وارد کنید ..."
                    />
                    {errors.description && (
                      <div className="err-div">{errors.description}</div>
                    )}
                  </div>
                </div>
                <div className="col-sm-12 calendar-button-div">
                  <div className="col-sm-3 modal-fields-div">
                    <Button
                      className="modal-btn bg-danger text-white modal-cancel-btn"
                      onClick={handleClose}
                    >
                      انصراف
                    </Button>
                  </div>
                  <div className="col-sm-3 modal-fields-div">
                    <Button
                      className="modal-btn  text-white modal-submit-btn"
                      onClick={handleSubmit}
                    >
                      ثبت
                    </Button>
                  </div>
                </div>
              </>
            );
          }}
        </Formik>
      </div>
    </Modal>
  );
};
