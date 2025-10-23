import React, { useContext, useEffect, useRef, useState } from "react";
import Captcha from "./Captcha";
import UiValidate from "../../../common/forms/validation/UiValidate";
import getToken from "../../../common/utils/functions/getToken";
import $ from "jquery";
import * as auth from "../_redux/authRedux";
import { connect, useSelector } from "react-redux";
import { get_active_languages } from "../../../common/layout/_redux/layoutCrud";
import Select from "react-select";
import { compose } from "redux";

import MyIranSSO from "./MyIranSSO";

import { withTranslation } from "react-i18next";
import { BeatLoader, GridLoader } from "react-spinners";
import { get_user_info } from "../_redux/authCrud";
import { AppConfig } from "../../../appConfig";

import { Button, Col, Container, Dropdown, Modal, Row } from "react-bootstrap";
import { useHistory } from "react-router-dom"; // Add this import

const { detect } = require("detect-browser");
const browser = detect();
let iframeLoading = false;
let TokenLoading = false;

function Login(props) {
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const config = useContext(AppConfig);
  const history = useHistory(); // Add this hook
  
  let bgURL = config.backgroundImage
    ? config.baseUrl + config.backgroundImage
    : "../assets/img/login-bg.png";
  const logoURL = config.logoImage
    ? config.baseUrl + config.logoImage
    : "../../../../assets/img/Asset%202.png";
  const state = useSelector((state) => state.auth);

  const handleAuthClose = () => {
    props.handle_variables({
      isAuthModalOpen: false,
      action: "Login",
      captcha_text: "",
      hashPhone: undefined,
    });
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    const enterCaptchaCode = $("#cpatchaTextBox").val();
    if (state.captcha_code === enterCaptchaCode) {
      props.handle_variables({
        pmLogin: config.iframeServer + "login/authentication.php",
        dontMatchCaptcha: false,
      });
      iframeLoading = false;
      TokenLoading = false;
      const formData = Array.from(evt.target.elements)
        .filter((el) => el.name)
        .reduce(
          (a, b) => ({
            ...a,
            [b.name]: b.value,
          }),
          {}
        );
      setIsLoginLoading(true);
      getToken(
        config.apiServer,
        formData["form[USR_USERNAME]"],
        btoa(unescape(encodeURIComponent(formData["form[USR_PASSWORD]"]))),
        state.clientId,
        state.clientSecret,
        function () {
          setIsLoginLoading(false);
          TokenLoading = true;
          RedirectToDashboard();
        },
        function () {
          setIsLoginLoading(false);
          props.handle_variables({ pmLogin: null, dontMatchCaptcha: false });
          TokenLoading = false;
          props.handle_variables({ captcha_code: "" });
          $("#cpatchaTextBox").val("");
        }
      );
      return false;
    } else {
      props.handle_variables({ pmLogin: null, dontMatchCaptcha: true });
    }
    props.handle_variables({ captcha_code: "" });
    $("#cpatchaTextBox").val("");
    return false;
  };

  // FIXED: Added empty dependency array []
  useEffect(function () {
    iframeLoading = false;
    TokenLoading = false;
    document.title = config.appTitle;
    if (!state.envLoaded) {
      localStorage.setItem("external_login", config.external_login);
      props.handle_variables({
        clientId: config.clientId,
        clientSecret: config.clientSecret,
        envLoaded: true,
      });
      var static_info_loaded = true;
      if ([undefined, ""].indexOf(config.external_login) === -1) {
        static_info_loaded = false;
        window.location.assign(config.external_login);
      }
      props.handle_variables({
        static_info_loaded: static_info_loaded,
      });
    }

    if (config.multi_lang === true) {
      get_active_languages(config.apiServer).then((res) => {
        props.handle_variables({
          languages: res,
        });
      });
    }
  }, []); // Added empty dependency array

  const usernameChange = (event) => {
    props.handle_variables({
      username: event.target.value,
    });
  };
  
  const passwordChange = (event) => {
    props.handle_variables({
      password: event.target.value,
    });
  };

  const RedirectToDashboard = () => {
    props.handle_reset_store();
    get_user_info(config.apiServer)
      .then((res) => {
        // BETTER: Use history.push instead of window.location.replace
        if (res !== "null" && res !== "" && res !== '"default"') {
          res = JSON.parse(res);
        }
        history.push("/workdesk"); // Use React Router
        localStorage.setItem("sso_login", false);
      })
      .catch((error) => {
        history.push("/workdesk"); // Use React Router
      });
  };

  if (state.static_info_loaded === false) {
    return (
      <div id="extr-page">
        <div className={"loader-container"}>
          <GridLoader color={"#45a5bf"} />
        </div>
      </div>
    );
  }
  
  let captchaError = null;
  if (state.dontMatchCaptcha)
    captchaError = (
      <p style={{ color: "#ff5252", margin: "0 20px" }}>
        {props.t("Wrong captcha")}
      </p>
    );

  const options = state.languages.map((x) => ({
    value: x.name,
    label: x.title,
    is_rtl: x.is_rtl,
  }));
  
  let l = localStorage.getItem("lang");
  if (l === null) l = localStorage.getItem("default_lang");
  const current_lang = options.filter((x) => x.value === l)[0];
  
  return (
    <div
      id="extr-page"
      className="login_noscrol"
      style={{ backgroundImage: `url(${bgURL})` }}
    >
      <div id="main" role="main" className="animated fadeInDown">
        <div id="content2" className="container">
          <div className="row login-container">
            <div className="col-lg-12">
              <div className="well no-padding login_bx_style">
                <UiValidate>
                  <form
                    id="login-form"
                    className="smart-form client-form"
                    onSubmit={handleSubmit}
                  >
                    <header>
                      <img src={logoURL} className="ligin_logo_img" />
                      <p className="login_title_app">
                        {config.loginPageAppTitle}
                      </p>
                      <p className="login_org_name">
                        {config.loginPageOrgName}
                      </p>
                    </header>
                    <fieldset>
                      <section>
                        <label className="input">
                          <i className="icon-append fa fa-user" />
                          <input
                            onChange={usernameChange}
                            type="text"
                            name="form[USR_USERNAME]"
                            dir="ltr"
                            placeholder={props.t("Username")}
                            data-smart-validate-input=""
                            data-required=""
                            data-message-required={props.t(
                              "Please insert username"
                            )}
                          />
                          <b className="tooltip tooltip-top-right">
                            <i className="fa fa-user txt-color-teal" />
                            {props.t("Please insert username")}
                          </b>
                        </label>
                      </section>
                      <section>
                        <label className="input">
                          <i className="icon-append fa fa-lock" />
                          <input
                            onChange={passwordChange}
                            type="password"
                            name="form[USR_PASSWORD]"
                            dir="ltr"
                            placeholder={props.t("Password")}
                            data-smart-validate-input=""
                            data-required=""
                            data-minlength="3"
                            data-maxnlength="20"
                            data-message={props.t("Please insert password")}
                          />
                          <b className="tooltip tooltip-top-right">
                            <i className="fa fa-lock txt-color-teal" />
                            {props.t("Please insert password")}
                          </b>
                        </label>
                      </section>
                      {state.languages.length < 1 ? null : (
                        <section>
                          <label className="select-label">
                            <Select
                              value={current_lang}
                              options={options}
                              onChange={(val) => {
                                localStorage.setItem("lang", val.value);
                                localStorage.setItem("is_rtl", val.is_rtl);
                                window.location.reload();
                              }}
                            />
                          </label>
                        </section>
                      )}
                      <Captcha />
                      {captchaError}
                    </fieldset>
                    <footer>
                      <button type="submit" className="btn_login_page">
                        {props.t("Login")}
                        <div id="load-container">
                          {isLoginLoading ? (
                            <div className="load-holder">
                              <BeatLoader color={"#fff"} size={18} margin={3} />
                            </div>
                          ) : null}
                        </div>
                      </button>
                      {config.register_text && config.register_text.trim() ? (
                        <a
                          href={config.register_link}
                          className="btn_login_page"
                          style={{
                            textAlign: "center",
                            color: config.register_color,
                            marginTop: "5px",
                            textDecoration: "none",
                            background: config.register_background,
                          }}
                        >
                          {config.register_text}
                        </a>
                      ) : null}
                      {config.register_text_2 &&
                      config.register_text_2.trim() ? (
                        <a
                          href={config.register_link_2}
                          className="btn_login_page"
                          style={{
                            textAlign: "center",
                            color: config.register_color_2,
                            marginTop: "5px",
                            textDecoration: "none",
                            background: config.register_background_2,
                          }}
                        >
                          {config.register_text_2}
                        </a>
                      ) : null}
                    </footer>
                  </form>
                  <button 
                    onClick={() => {
                      props.handle_open_login_modal();
                    }}
                    className="btn_login_page Sso_Login m-2"
                  >
                    {props.t("Login_SSO")}
                    <div id="load-container">
                    </div>
                  </button>
                  <Modal
                    show={state.isAuthModalOpen}
                    onHide={handleAuthClose}
                    size={state.action === "Login" ? "lg" : "md"}
                    centered
                  >
                    <Modal.Body>
                      {state.action === "Login" ? (
                        <Row className={"text-center p-1"}>
                          <Col xs={12}>
                            <h5 className={"hp-auth-panel fs-5"}>
                              <span>
                                ثبت نام و احراز هویت متقاضی از طریق درگاه
                                یکپارچه "پنجره ملی خدمات دولت هوشمند" امکانپذیر
                                است
                              </span>
                            </h5>
                          </Col>
                          <Col xs={12} md={7} className={"left-bordered"}>
                            <MyIranSSO />
                          </Col>
                          <Col xs={12} md={4}>
                            <div
                              className={"hp-auth-panel p-3"}
                              style={{ marginLeft: "5px" }}
                            >
                              <a
                                href="https://isd.inso.gov.ir/bpmsback/sysstd/fa/modern/44738461160c6fb5d89dec5016204396/230679178633ab09e0776c3030747152.php  "
                                className={"btn btn-primary"}
                              >
                                <div>ثبت نام دستگاه های اجرایی</div>
                              </a>
                            </div>
                          </Col>
                        </Row>
                      ) : (
                        <>
                          <Row>
                            <Col>
                              <i
                                className={"fas fa-arrow-left fa-2x pull-left"}
                                onClick={() =>
                                  props.handle_variables({
                                    action: "Login",
                                    authErrors: [],
                                    captcha_text: "",
                                  })
                                }
                              />
                              <h4>افراد حقوقی</h4>
                            </Col>
                          </Row>
                        </>
                      )}
                    </Modal.Body>
                  </Modal>
                    <div className="text-center">
                      <p className="text-danger my-2">
                        ورود کاربران عادی از پنجره سازمان فناوری می‌باشد
                      </p>
                    </div>
                      
            <div className={"row  table-actions"}>
              <a
                target="_blank"
                href="/helps/register.pdf"
                className="downloadTerms"
              >
                <i
                  className={"fas fa-download"}
                  onClick={() => {
                    window.open("/helps/register.pdf", "_blank");
                  }}
                />
                راهنمای ثبت‌نام و تکمیل پروفایل
              </a>
            </div>
                </UiValidate>
              </div>
              <a href="http://arian.co.ir" className="login_footer_info">
                <img src="../../../../assets/img/Asset%2019.png" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default compose(withTranslation(), connect(null, auth.actions))(Login);