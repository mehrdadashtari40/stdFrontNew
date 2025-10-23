import React from "react";
import { Modal, Button } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { actions } from "../_redux/workDeskRedux";
import { Formik, Field } from "formik";
import { TextField } from "@mui/material";
import { InboxOutlined } from "@mui/icons-material";
import { Divider, Select, message, Upload } from "antd";
import * as Yup from "yup";
import {
  get_all_committees,
  get_all_subcommittees,
  get_members,
  send_mail,
} from "../_redux/workDeskCrud";
import { successNotification } from "./functions";
import TextArea from "antd/lib/input/TextArea";

const formSchema = Yup.object().shape({
  description: Yup.string()
    .required("پر کردن فیلد الزامیست")
    .typeError("پر کردن فیلد الزامیست"),
  tc_id: Yup.string()
    .required("پر کردن فیلد الزامیست")
    .typeError("پر کردن فیلد الزامیست"),
  organization_id: Yup.string()
    .required("پر کردن فیلد الزامیست")
    .typeError("پر کردن فیلد الزامیست"),
  // users: Yup.array()
  //   .required()
  //   .test({
  //     message: "انتخاب کاربران الزامیست",
  //     test: (arr) => +arr.length !== 0,
  //   }),
});

const { Option } = Select;

export default () => {
  const token = localStorage.getItem("access_token");
  const [committees, setCommittees] = React.useState(null);
  const [isUsersLoaded, setIsUsersLoaded] = React.useState(false);
  const [subCommittees, setSubCommittees] = React.useState(null);

  let { state } = useSelector(
    (state) => ({
      state: state.workDeskReducer,
    }),
    shallowEqual
  );

  const handleClose = () => {
    dispatch(actions.handle_variables("emailModal", false));
  };

  const dispatch = useDispatch();
  const CustomSelectComponent = (
    props,
    selectProps,
    label,
    func,
    customFunction,
    deSelectFunction
  ) => {
    const { data, valName, val, defaultValue } = selectProps;
    return (
      <div className="my-custom-select-div">
        {label && <label>{label}</label>}
        <Select
          defaultValue={defaultValue && defaultValue}
          className="my-custom-select"
          {...props}
          onSelect={(e) => {
            if (func) {
              func(props?.name, e);
            }
            if (customFunction) {
              customFunction(e);
            }
          }}
          onDeselect={() => {
            deSelectFunction();
          }}
        >
          {data &&
            data.map((el, index) => (
              <Option key={index} value={el[val]}>
                {el[valName]}
              </Option>
            ))}
        </Select>
      </div>
    );
  };

  return (
    <Modal
      show={state.emailModal}
      onHide={handleClose}
      dialogClassName="calendar-modal"
    >
      <div className="col-sm-12 em-header">
        <i className="fa fa-envelope em-header-icon"></i>
        <h4 className="em-header-title">ارسال ایمیل</h4>
      </div>
      <div className="calendar-modal-parent-div">
        <div class></div>
        <Formik
          validationSchema={formSchema}
          initialValues={{ users: [], sendTypeId: "1" }}
          onSubmit={(values) => {
            const formData = new FormData();
            const convertedUsers = [];
            if (values.sendTypeId === "1") {
              state.users.map((b) => {
                convertedUsers.push({
                  name: b.username,
                  email: b.email,
                  user_id: b.usr_uid,
                });
              });
            } else if (values.sendTypeId === "2") {
              values.users.map((el) => {
                state.users.map((b) => {
                  if (el === b.email) {
                    convertedUsers.push({
                      name: b.username,
                      email: b.email,
                      user_id: b.usr_uid,
                    });
                  }
                });
              });
            }
            values.users = convertedUsers;
            //console.log("users", convertedUsers);

            formData.append("sendTypeId", values?.sendTypeId);
            formData.append("organization_id", values?.organization_id);
            formData.append("tc_id", values?.tc_id);
            formData.append("sc_id", values?.sc_id);
            formData.append("subject", values?.subject);
            formData.append("description", values?.description);
            formData.append("users", JSON.stringify(convertedUsers));
            formData.append("file", values?.file);
            formData.append("cc", values?.cc);
            formData.append("bcc", values?.bcc);

            send_mail(formData).then((res) => {
              successNotification("ثبت شد");
            });
            handleClose();
          }}
        >
          {({ handleSubmit, setFieldValue, values, errors }) => {
            return (
              <>
                <div className="col-sm-12 modal-fields-div">
                  <div className="input-div">
                    <label>موضوع ایمیل</label>
                    <TextField
                      className="my-custom-input"
                      variant="outlined"
                      value={values?.subject}
                      onChange={(e) => {
                        setFieldValue("subject", e.target.value);
                      }}
                      placeholder="وارد کنید ..."
                    />
                    {errors.description && (
                      <div className="err-div">{errors.description}</div>
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
                        setIsUsersLoaded(true);
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
                        setIsUsersLoaded(true);
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
                <div className="col-sm-4 modal-fields-div">
                  {" "}
                  <Field
                    name="sendTypeId"
                    as={(e) =>
                      CustomSelectComponent(
                        e,
                        {
                          data: [
                            { ID: "1", TITLE: "همه" },
                            { ID: "2", TITLE: "لیست انتخابی" },
                          ],
                          valName: "TITLE",
                          val: "ID",
                          type: "Select",
                          defaultValue: "1",
                        },
                        "نوع ارسال",
                        setFieldValue,
                        (e) => {
                          const value = e;
                          //console.log("ccccccccccc", e);
                          // setOrganizationId(value);
                          // get_all_committees(token, value).then((res) => {
                          //   if (res.data.data.length !== 0) {
                          //     dispatch(
                          //       actions.handle_variables(
                          //         "committees",
                          //         res.data.data
                          //       )
                          //     );
                          //   } else {
                          //     dispatch(
                          //       actions.handle_variables(
                          //         "committees",
                          //         undefined
                          //       )
                          //     );
                          //   }
                          // });
                        }
                      )
                    }
                    placeholder="انتخاب کنید"
                    value={values?.sendTypeId}
                  />
                  {errors?.sendTypeId && (
                    <div className="err-div">{errors?.sendTypeId}</div>
                  )}
                </div>

                {+values?.sendTypeId === 2 && (
                  <div className="col-sm-4 modal-fields-div">
                    <div className="my-custom-select-div">
                      <label>کاربران</label>
                      <Select
                        mode="multiple"
                        placeholder="انتخاب کنید"
                        value={values?.users}
                        style={{ overflow: "auto" }}
                        className="my-custom-select"
                        onChange={(e, a) => {
                          setFieldValue("users", e);
                        }}
                      >
                        {isUsersLoaded &&
                          state?.users &&
                          state?.users.map((el, index) => (
                            <Option
                              key={index}
                              name={el?.username}
                              value={el["email"]}
                            >
                              {el["fullName"]}
                            </Option>
                          ))}
                      </Select>{" "}
                    </div>
                    {errors?.users && (
                      <div className="err-div">{errors?.users}</div>
                    )}
                  </div>
                )}

                <div className="col-sm-4 modal-fields-div">
                  <label>مدارک پیوستی</label>
                  <input
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setFieldValue("file", file);
                      }
                    }}
                    multiple={false}
                  />
                  {errors.file && <div className="err-div">{errors.file}</div>}
                </div>
                <div className="col-sm-6 modal-fields-div">
                  <div className="input-div">
                    <label>cc</label>
                    <TextField
                      className="my-custom-input"
                      variant="outlined"
                      value={values?.cc}
                      onChange={(e) => {
                        setFieldValue("cc", e.target.value);
                      }}
                      inputProps={{
                        style: { direction: "ltr" },
                      }}
                      placeholder="you@example.com,you@example.com, ..."
                    />
                    <div style={{ fontSize: 10, color: "#3b70f6" }}>
                      در صورت وجود چند مورد، موارد را با کامای انگلیسی (,) از هم
                      جدا کنید.
                    </div>
                  </div>
                </div>
                <div className="col-sm-6 modal-fields-div">
                  <div className="input-div">
                    <label>bcc</label>
                    <TextField
                      className="my-custom-input"
                      variant="outlined"
                      value={values?.bcc}
                      onChange={(e) => {
                        setFieldValue("bcc", e.target.value);
                      }}
                      inputProps={{
                        style: { direction: "ltr" },
                      }}
                      placeholder="you@example.com,you@example.com, ..."
                    />
                    <div style={{ fontSize: 10, color: "#3b70f6" }}>
                      در صورت وجود چند مورد، موارد را با کامای انگلیسی (,) از هم
                      جدا کنید.
                    </div>
                  </div>
                </div>
                <div className="col-sm-12 modal-fields-div">
                  <div className="input-div">
                    <label>متن ایمیل</label>
                    <TextArea
                      className="my-custom-input"
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
                <div className="col-sm-12 button-div">
                  <div className="col-sm-3 modal-fields-div">
                    <Button
                      onClick={handleClose}
                      className="modal-btn bg-danger text-white modal-cancel-btn"
                    >
                      انصراف
                    </Button>
                  </div>
                  <div className="col-sm-3 modal-fields-div">
                    <Button
                      className="modal-btn  text-white modal-submit-btn"
                      onClick={() => handleSubmit()}
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
