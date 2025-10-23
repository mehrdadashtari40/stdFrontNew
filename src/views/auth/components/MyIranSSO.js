import React, { useContext, useState } from "react";
import { compose } from "redux";
import { withTranslation } from "react-i18next";
import { connect, useSelector } from "react-redux";
import * as front from "../_redux/authRedux";
import { GridLoader } from "react-spinners";
import { useLocation } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { AppConfig } from "../../../appConfig";

function MyIranSSO(props) {
  const [isRedirecting, setIsRedirecting] = useState(false);
  let isLegal = '';
  const config = useContext(AppConfig);
  const location = useLocation();
  const redirectUri =
    "https:" +
    "//" +
    "isd.inso.gov.ir" +
    "/api/1.0/std/std/auth/sso-redirect-url";
  // const redirectUri = window.location.protocol + "//" + window.location.host + "/api/1.0/std/std/auth/"
  //     + (isLegal ? "legal-sso-redirect-url" : "sso-redirect-url");
  // const redirectUri = "https://g4b.ir/api/1.0/g4bv2/nlp/auth/legal-sso-redirect-url";
  // const redirectUri = "https://nlpanr.bservice.ir/api/1.0/g4bv2/nlp/auth/legal-sso-redirect-url";

  // const clientId = isLegal ? "g4b.legal" : "g4b.mefa";

  // const ssoUrl = "https://sso.isiri.gov.ir/web/GoLogin.ashx?username=ison&password=Ison@123&type=" + '1' + "&state=" + uuidv4() + "&redirect=" + redirectUri;
  const ssoUrl = `https://my.inso.gov.ir/fast_login?client_id=${
    config?.clientId_std
  }&response_type=code&redirect_uri=${redirectUri}&scope=
  &state=${uuidv4()}`;
  const state = useSelector((state) => state.nama);

  //const handleClick = () => {
   // localStorage.setItem("sso_filters", JSON.stringify(state));
   // setIsRedirecting(true);
  //  window.location.href = ssoUrl;
  //};

  function Legalstatustrue() {
    localStorage.setItem("sso_filters", JSON.stringify(state));
    localStorage.setItem("isLegal", true);
    setIsRedirecting(true);
    window.location.href = ssoUrl;
  }

  function Legalstatusfalse() {
    localStorage.setItem("sso_filters", JSON.stringify(state));
    localStorage.setItem("isLegal", false);
    setIsRedirecting(true);
    window.location.href = ssoUrl;
  }

  return (
    <>
      <div className={"hp-auth-panel p-4"}>
        <div
          className={
            "btn btn-" +
            (isRedirecting ? "warning" : "primary")
          }
          onClick={Legalstatusfalse}
        >
          {!isRedirecting ? (
            <div>ورود افراد حقیقی</div>
          ) : (
            <div className={"d-flex"}>
              <GridLoader size={7} color={"white"} />
              <div className={"mt-1 me-2"}>در حال انتقال</div>
            </div>
          )}
        </div>
        <div
          className={
            "btn btn-" +
            (isRedirecting ? "warning" : "success")
          }
          onClick={Legalstatustrue}
        >
          {!isRedirecting ? (
            <div>ورود افراد حقوقی</div>
          ) : (
            <div className={"d-flex"}>
              <GridLoader size={7} color={"white"} />
              <div className={"mt-1 me-2"}>در حال انتقال</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default compose(
  withTranslation(),
  connect(null, front.actions)
)(MyIranSSO);
