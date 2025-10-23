import { TextField } from "@mui/material";
import { InboxOutlined } from "@mui/icons-material";
import { Divider, Select, message, Upload } from "antd";
import { Formik, Field } from "formik";
import React, { useState, useEffect } from "react"; // Import useEffect
import { Button, Modal, Form, Tabs, Tab } from "react-bootstrap";
import DatePicker from "@hassanmojab/react-modern-calendar-datepicker";

import moment from "jalali-moment";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import {
  create_category,
  create_document,
  edit_category,
  edit_document,
  get_all_categories,
  get_all_committees,
  get_all_documents,
  get_all_subcommittees,
} from "../_redux/workDeskCrud";
import { actions } from "../_redux/workDeskRedux";
import {
  errorNotification,
  fixNumbers,
  successNotification,
} from "./functions";
import { utils } from "react-modern-calendar-datepicker";
import DocumentsArchive from "./DocumentsArchive";

const { Option } = Select;

const documentSchema = Yup.object().shape({
  organization_id: Yup.string()
    .required("پر کردن فیلد الزامیست")
    .typeError("پر کردن فیلد الزامیست"),
  title: Yup.string()
    .required("پر کردن فیلد الزامیست")
    .typeError("پر کردن فیلد الزامیست"),
  tc_id: Yup.string()
    .required("پر کردن فیلد الزامیست")
    .typeError("پر کردن فیلد الزامیست"),
  document_type_id: Yup.string().when("is_comment_available", {
    is: (id) => +id === 1,
    then: Yup.string()
      .required("پر کردن فیلد الزامیست")
      .typeError("پر کردن فیلد الزامیست"),
  }),
  document_number: Yup.string()
    .required("پر کردن فیلد الزامیست")
    .typeError("پر کردن فیلد الزامیست"),
  question_count: Yup.string().when(
    ["document_type_id", "is_comment_available"],
    {
      is: (document_type_id, is_comment_available) =>
        +document_type_id === 1 && +is_comment_available === 1,
      then: Yup.string()
        .required("پر کردن فیلد الزامیست")
        .typeError("پر کردن فیلد الزامیست"),
    }
  ),
  description: Yup.string()
    .required("پر کردن فیلد الزامیست")
    .typeError("پر کردن فیلد الزامیست"),
  category_id: Yup.string()
    .required("پر کردن فیلد الزامیست")
    .typeError("پر کردن فیلد الزامیست"),
  expire_date: Yup.object()
    .required("پر کردن فیلد الزامیست")
    .typeError("پر کردن فیلد الزامیست"),
  path: Yup.string(),
  file: Yup.string().when("path", {
    is: (path) => path === null || path === undefined,
    then: Yup.string()
      .required("پر کردن فیلد الزام یست")
      .typeError("پر کردن فیلد الزامیست"),
  }),
});

const categorySchema = Yup.object().shape({
  category_title: Yup.string().required("پر کردن فیلد الزامیست"),
});

export default function ModalComponent(props) { // Named function instead of anonymous
  const [organizationId, setOrganizationId] = useState(null);
  const [fetchDone, setFetchDone] = useState(false);
  const [key, setKey] = useState("modal");

  let { state } = useSelector(
    (state) => ({
      state: state.workDeskReducer,
    }),
    shallowEqual
  );

  const todayDateHandler = () => {
    let date;
    if (state?.currentData?.submit_date) {
      date = new Date(state?.currentData?.submit_date)
        .toLocaleDateString("fa-ir")
        .split("/");
    } else {
      date = new Date().toLocaleDateString("fa-ir").split("/");
    }
    return {
      year: +fixNumbers(date[0]),
      month: +fixNumbers(date[1]),
      day: +fixNumbers(date[2]),
    };
  };

  const token = localStorage.getItem("access_token");
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(actions.handle_variables("currentData", null));
    dispatch(actions.handle_variables("modalOpen", false));
    setKey("modal");
    setFetchDone(true);
  };

  // ✅ FIXED: Added dependency array
  useEffect(() => {
    if (state.currentData && !fetchDone && state?.tableType === "document") {
      organizationHandler(state?.currentData?.organization_id);
      tcHandler(state?.currentData?.tc_id, state?.currentData?.organization_id);
      setFetchDone(true);
    }
  }, [state.currentData, fetchDone, state.tableType]); // ✅ Added dependencies

  const handleSubmit = (data) => {
    if (state.tableType == "category") {
      const values = { title: data.category_title };
      if (state.submitType == "create") {
        create_category(token, values).then((res) => {
          successNotification("دسته بندی افزوده شد");
          get_all_categories(token, {}).then((res) => {
            const obj = {};
            const result = [];
            res.data.data.map((el) => {
              const {
                category_title,
                id,
                sc_app_uid,
                sc_code,
                tc_app_uid,
                tc_code,
              } = el;
              if (!obj[el.id]) {
                obj[el.id] = {
                  category_title,
                  id,
                  tcs: [
                    { tc_app_uid, tc_code, scs: [{ sc_app_uid, sc_code }] },
                  ],
                };
              } else if (obj[el.id]) {
                obj[el.id]?.tcs.push({
                  tc_app_uid,
                  tc_code,
                  scs: [{ sc_app_uid, sc_code }],
                });
              }
            });
            const keys = Object.keys(obj);
            keys.map((es) => {
              result.push(obj[es]);
            });
            result.map((le, idx) => {
              const obj2 = {};
              const secRes = [];
              le.tcs.map((v) => {
                if (!obj2[v.tc_app_uid]) {
                  obj2[v.tc_app_uid] = v;
                }
              });
              const kes = Object.keys(obj2);
              kes.map((n) => {
                secRes.push(obj2[n]);
              });
              result[idx].tcs = secRes;
            });
            dispatch(actions.handle_variables("rawCategories", res.data.data));
            dispatch(actions.handle_variables("categories", result));
            dispatch(
              actions.handle_variables("category_length", res.data.total)
            );
          });
        });
      } else if (state.submitType == "edit") {
        edit_category(token, values, state?.currentData?.id).then((res) => {
          successNotification("دسته بندی ویرایش داده شد");
          get_all_categories(token, {}).then((res) => {
            const obj = {};
            const result = [];
            res.data.data.map((el) => {
              const {
                category_title,
                id,
                sc_app_uid,
                sc_code,
                tc_app_uid,
                tc_code,
              } = el;
              if (!obj[el.id]) {
                obj[el.id] = {
                  category_title,
                  id,
                  tcs: [
                    { tc_app_uid, tc_code, scs: [{ sc_app_uid, sc_code }] },
                  ],
                };
              } else if (obj[el.id]) {
                obj[el.id]?.tcs.push({
                  tc_app_uid,
                  tc_code,
                  scs: [{ sc_app_uid, sc_code }],
                });
              }
            });
            const keys = Object.keys(obj);
            keys.map((es) => {
              result.push(obj[es]);
            });
            result.map((le, idx) => {
              const obj2 = {};
              const secRes = [];
              le.tcs.map((v) => {
                if (!obj2[v.tc_app_uid]) {
                  obj2[v.tc_app_uid] = v;
                }
              });
              const kes = Object.keys(obj2);
              kes.map((n) => {
                secRes.push(obj2[n]);
              });
              result[idx].tcs = secRes;
            });
            dispatch(actions.handle_variables("rawCategories", res.data.data));
            dispatch(actions.handle_variables("categories", result));
            dispatch(
              actions.handle_variables("category_length", res.data.total)
            );
          });
        });
      }
    } else if (state.tableType == "document") {
      const values = new FormData();
      const datez = moment
        .from(
          `${data?.expire_date.year}/${data?.expire_date.month}/${data?.expire_date.day}`,
          "fa",
          "YYYY/MM/DD"
        )
        .format("YYYY-MM-DD");
      const pathForDownload = data?.path;
      values.append("category_id", data?.category_id);
      values.append("organization_id", data?.organization_id);
      values.append("tc_id", data?.tc_id);
      values.append("sc_id", data?.sc_id);
      values.append("title", data?.title);
      values.append("submit_date", new Date());
      values.append("expire_date", `${datez} 00:00:00`);
      values.append("is_comment_available", data?.is_comment_available || "0");
      values.append("is_forum_available", data?.is_forum_available || "0");
      values.append("document_type_id", data?.document_type_id);

      if (data?.document_type_id === "1") {
        values.append("question_count", data?.question_count);
      }
      values.append("document_number", data?.document_number);
      values.append("description", data?.description);

      if (state?.submitType === "create") {
        values.append("file", data?.file);
        create_document(token, values)
          .then((res) => {
            successNotification("مستند افزوده شد");
            get_all_documents(token, {
              archive: 0,
            }).then((res) => {
              dispatch(actions.handle_variables("documents", res.data.data));
              dispatch(
                actions.handle_variables("document_length", res.data.total)
              );
            });
          })
          .catch((errors) => {
            errorNotification("مشکلی در برقراری ارتباط با سرور بوجود آمد");
          });
      } else if (state?.submitType === "edit") {
        values.append("file", data?.file);
        values.append("id", state?.currentData?.id);
        edit_document(token, values)
          .then((res) => {
            successNotification("مستند ویرایش شد");
            get_all_documents(token, {
              archive: 0,
            }).then((res) => {
              dispatch(actions.handle_variables("documents", res.data.data));
              dispatch(
                actions.handle_variables("document_length", res.data.total)
              );
            });
          })
          .catch((errors) => {
            errorNotification("مشکلی در برقراری ارتباط با سرور بوجود آمد");
          });
      }
    }
    dispatch(actions.handle_variables("modalOpen", false));
    dispatch(actions.handle_variables("currentData", null));
    setKey("modal");
  };

  const committeeHandler = (value) => {
    get_all_subcommittees(token, value, organizationId).then((res) => {
      if (res?.data?.data?.length !== 0) {
        dispatch(actions.handle_variables("subCommittees", res.data.data));
      } else {
        dispatch(actions.handle_variables("subCommittees", undefined));
      }
    });
  };

  const CustomSelectComponent = (
    props,
    selectProps,
    label,
    func,
    customFunction,
    deSelectFunction
  ) => {
    const { data, valName, val } = selectProps;
    return (
      <div className="my-custom-select-div">
        {label && <label>{label}</label>}
        <Select
          className="my-custom-select"
          {...props}
          onSelect={async (e) => {
            if (func) {
              await func(props.name, e);
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
            data.map((el) => <Option value={el[val]}>{el[valName]}</Option>)}
        </Select>
      </div>
    );
  };

  const modalTitleHandler = () => {
    let tableType;
    let modalType = state.isEditMode ? "ویرایش" : "ایجاد";

    if (state.tableType === "category") {
      tableType = "دسته بندی";
    } else {
      tableType = "مستند";
    }

    return `${modalType} ${tableType}`;
  };

  const dpHandler = (e, setFieldValue) => {};

  const organizationDeSelect = (func) => {
    func("tc_id", null);
    func("sc_id", null);
    dispatch(actions.handle_variables("committees", null));
    dispatch(actions.handle_variables("subCommittees", null));
  };

  const committeDeSelect = (func) => {
    func("sc_id", null);
    dispatch(actions.handle_variables("subCommittees", null));
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
          height: "4.5rem",
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

  const organizationHandler = (e) => {
    dispatch(actions.handle_variables("subCommittees", undefined));
    const value = e;
    setOrganizationId(value);
    get_all_committees(token, value).then((res) => {
      if (res.data.data.length !== 0) {
        dispatch(actions.handle_variables("committees", res.data.data));
      } else {
        dispatch(actions.handle_variables("committees", undefined));
      }
    });
  };

  const tcHandler = (value, organizationId) => {
    get_all_subcommittees(token, value, organizationId).then((res) => {
      if (res?.data?.data?.length !== 0) {
        dispatch(actions.handle_variables("subCommittees", res.data.data));
      } else {
        dispatch(actions.handle_variables("subCommittees", undefined));
      }
    });
  };

  return (
    <Modal
      show={state.modalOpen}
      onHide={handleClose}
      dialogClassName="crud-modal"
    >
      <div className="modal-parent-div" dir="rtl">
        {state.currentData && (
          <Formik
            initialValues={
              state.currentData
                ? { ...state.currentData, submit_date: todayDateHandler() }
                : {}
            }
            onSubmit={(values) => {
              handleSubmit(values);
            }}
            enableReinitialize
            //validateOnBlur
            validationSchema={
              state.tableType === "document" ? documentSchema : categorySchema
            }
          >
            {({
              handleSubmit: formikSubmitHandler,
              setFieldValue,
              values,
              errors,
            }) => {
              return (
                <div className="crud-modal-parent-div">
                  <div className="col-sm-12">
                    <Tabs
                      id="controlled-tab-example"
                      activeKey={key}
                      onSelect={(k) => setKey(k)}
                      className="mb-3"
                    >
                      <Tab eventKey="modal" title={modalTitleHandler()}>
                        <div className="modal-forms-div">
                          {state.tableType === "category" ? (
                            <>
                              {" "}
                              <div className="col-sm-9">
                                <div className="input-div">
                                  <label>دسته بتدی محتوایی</label>
                                  <TextField
                                    className="my-custom-input"
                                    variant="outlined"
                                    value={values?.category_title}
                                    onChange={(e) => {
                                      setFieldValue(
                                        "category_title",
                                        e.target.value
                                      );
                                    }}
                                    placeholder="دسته بتدی محتوایی"
                                  />
                                  {errors.category_title && (
                                    <div className="err-div">
                                      {errors.category_title}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="col-sm-4 modal-fields-div">
                                <div className="input-div">
                                  <label>عنوان مستند</label>
                                  <TextField
                                    className="my-custom-input"
                                    variant="outlined"
                                    value={values?.title}
                                    onChange={(e) => {
                                      setFieldValue("title", e.target.value);
                                    }}
                                    placeholder="عنوان"
                                  />
                                  {errors.title && (
                                    <div className="err-div">
                                      {errors.title}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="col-sm-4 modal-fields-div">
                                {" "}
                                <Field
                                  name="organization_id"
                                  as={(e) =>
                                    CustomSelectComponent(
                                      e,
                                      {
                                        data: state.organizations,
                                        valName: "TITLE",
                                        val: "ID",
                                      },
                                      "سازمان",
                                      setFieldValue,
                                      (e) => {
                                        setFieldValue("tc_id", null);
                                        setFieldValue("sc_id", null);
                                        organizationHandler(e);
                                      }
                                    )
                                  }
                                  placeholder="سازمان"
                                  value={values?.organization_id}
                                />
                                {errors.organization_id && (
                                  <div className="err-div">
                                    {errors.organization_id}
                                  </div>
                                )}
                              </div>
                              <div className="col-sm-4 modal-fields-div">
                                <Field
                                  name="tc_id"
                                  as={(e) =>
                                    CustomSelectComponent(
                                      e,
                                      {
                                        data: state.committees,
                                        valName: "CODE",
                                        val: "DRP_TC",
                                      },
                                      "کمیته",
                                      setFieldValue,
                                      (e) => {
                                        setFieldValue("sc_id", null);
                                        tcHandler(e, values?.organization_id);
                                      },
                                      () => {
                                        setFieldValue("sc_id", null);
                                        dispatch(
                                          actions.handle_variables(
                                            "subCommittees",
                                            null
                                          )
                                        );
                                      }
                                    )
                                  }
                                  placeholder="کمیته"
                                  value={values?.tc_id}
                                />
                                {errors.tc_id && (
                                  <div className="err-div">{errors.tc_id}</div>
                                )}
                              </div>
                              <div className="col-sm-4 modal-fields-div">
                                <Field
                                  name="sc_id"
                                  as={(e) =>
                                    CustomSelectComponent(
                                      e,
                                      {
                                        data: state.subCommittees,
                                        valName: "CODE",
                                        val: "DRP_SC",
                                      },
                                      "زیر کمیته",
                                      setFieldValue
                                    )
                                  }
                                  placeholder="زیر کمیته"
                                  value={values?.sc_id}
                                />
                                {errors.sc_id && (
                                  <div className="err-div">{errors.sc_id}</div>
                                )}
                              </div>
                              <div className="col-sm-4 modal-fields-div">
                                <Field
                                  name="category_id"
                                  as={(e) =>
                                    CustomSelectComponent(
                                      e,
                                      {
                                        data: state.categoryTitles,
                                        valName: "title",
                                        val: "id",
                                      },
                                      "دسته بندی محتوایی",
                                      setFieldValue
                                    )
                                  }
                                  placeholder="دسته بندی محتوایی"
                                />
                                {errors.category_id && (
                                  <div className="err-div">
                                    {errors.category_id}
                                  </div>
                                )}
                              </div>

                              <div className="col-sm-4 modal-fields-div datepicker-div">
                                <label>تاریخ ثبت</label>
                                <DatePicker
                                  value={values?.submit_date}
                                  onChange={(e) => {
                                    if (e) {
                                      setFieldValue("submit_date", e);
                                    }
                                  }}
                                  shouldHighlightWeekends
                                  renderInput={(e) =>
                                    renderCustomDateInput(
                                      e,
                                      values?.submit_date,
                                      "تاریخ ثبت",
                                      true
                                    )
                                  } // render a custom input
                                  locale="fa" // add this
                                />
                              </div>
                              <div className="col-sm-4 modal-fields-div datepicker-div">
                                <label>تاریخ اعتبار</label>
                                <DatePicker
                                  value={values?.expire_date}
                                  onChange={(e) => {
                                    setFieldValue("expire_date", e);
                                  }}
                                  shouldHighlightWeekends
                                  minimumDate={utils().getToday}
                                  renderInput={(e) =>
                                    renderCustomDateInput(
                                      e,
                                      values?.expire_date,
                                      "تاریخ اعتبار",
                                      false
                                    )
                                  } // render a custom input
                                  locale="fa" // add this
                                />
                                {errors.expire_date && (
                                  <div className="err-div">
                                    {errors.expire_date}
                                  </div>
                                )}
                              </div>
                              <div className="col-sm-9 modal-fields-div checkboxes-parent-div">
                                <div
                                  role="group"
                                  className="checkboxes-div"
                                  aria-labelledby="checkbox-group"
                                >
                                  <label>
                                    <Field
                                      className="modal-checkbox"
                                      type="checkbox"
                                      name="is_comment_available"
                                      value="1"
                                      checked={
                                        +values?.is_comment_available === 1
                                      }
                                    />
                                    <span>
                                      {" "}
                                      اعضای کمیته امکان ثبت کامنت را داشته
                                      باشند؟
                                    </span>
                                  </label>
                                  <label>
                                    <Field
                                      className="modal-checkbox"
                                      type="checkbox"
                                      name="is_forum_available"
                                      checked={
                                        +values?.is_forum_available === 1
                                      }
                                      value="1"
                                    />
                                    <span>
                                      {" "}
                                      اعضای کمیته امکان ثبت نظر در تالار گفت و
                                      گو را داشته باشند؟
                                    </span>
                                  </label>
                                </div>
                              </div>
                              <div className="col-sm-3 upload-div modal-fields-div">
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
                                {errors.file && (
                                  <div className="err-div">{errors.file}</div>
                                )}
                                <div>
                                  {typeof values.path == "undefined" ? (
                                    <a></a>
                                  ) : (
                                    <a href={values?.path}>دانلود فایل</a>
                                  )}
                                </div>
                              </div>
                              {+values?.is_comment_available === 1 && (
                                <div className="col-sm-4 modal-fields-div">
                                  <Field
                                    name="document_type_id"
                                    as={(e) =>
                                      CustomSelectComponent(
                                        e,
                                        {
                                          data: state.document_types,
                                          valName: "title",
                                          val: "id",
                                        },
                                        "نوع مدرک",
                                        setFieldValue
                                      )
                                    }
                                    placeholder="نوع مدرک"
                                  />
                                  {errors.document_type_id && (
                                    <div className="err-div">
                                      {errors.document_type_id}
                                    </div>
                                  )}
                                </div>
                              )}

                              {values.document_type_id === "1" &&
                                +values?.is_comment_available === 1 && (
                                  <div className="col-sm-4 modal-fields-div">
                                    <div className="input-div">
                                      <label>تعداد سوالات</label>
                                      <TextField
                                        className="my-custom-input"
                                        variant="outlined"
                                        value={values?.question_count}
                                        onChange={(e) => {
                                          setFieldValue(
                                            "question_count",
                                            e.target.value
                                          );
                                        }}
                                        placeholder="تعداد سوالات"
                                      />
                                      {errors.question_count && (
                                        <div className="err-div">
                                          {errors.question_count}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                              <div className="col-sm-4 modal-fields-div">
                                <div className="input-div">
                                  <label>شماره مدرک</label>
                                  <TextField
                                    className="my-custom-input"
                                    variant="outlined"
                                    value={values?.document_number}
                                    onChange={(e) => {
                                      setFieldValue(
                                        "document_number",
                                        e.target.value
                                      );
                                    }}
                                    placeholder="شماره مدرک"
                                  />
                                  {errors.document_number && (
                                    <div className="err-div">
                                      {errors.document_number}
                                    </div>
                                  )}
                                </div>
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
                                      setFieldValue(
                                        "description",
                                        e.target.value
                                      );
                                    }}
                                    placeholder="توضیحات"
                                  />
                                  {errors.description && (
                                    <div className="err-div">
                                      {errors.description}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </Tab>
                      {state?.tableType === "document" && (
                        <Tab eventKey="archive" title="آرشیو مستندات">
                          <DocumentsArchive />
                        </Tab>
                      )}
                    </Tabs>
                  </div>
                  {/* <div className="col-sm-12">
                    <Divider />
                  </div> */}

                  <div className="col-sm-12 button-div">
                    <div className="col-sm-3 modal-fields-div">
                      <Button
                        className="modal-btn bg-danger text-white modal-cancel-btn"
                        onClick={handleClose}
                      >
                        انصراف
                      </Button>
                    </div>
                    {key === "modal" && (
                      <div className="col-sm-3 modal-fields-div">
                        <Button
                          className="modal-btn  text-white modal-submit-btn"
                          onClick={formikSubmitHandler}
                        >
                          ثبت
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            }}
          </Formik>
        )}
      </div>
    </Modal>
  );
}