import React, { useContext } from "react";
import getPmSession from "../../../common/utils/functions/getPmSession";
import { login_sso } from "../_redux/ssoCrud";
import { withTranslation } from "react-i18next";
import * as sso from "../_redux/ssoRedux";
import { compose } from "redux";
import { connect } from "react-redux";
import { AppConfig } from "../../../appConfig";
import { useHistory } from "react-router-dom";

function Sso(props) {
  const config = useContext(AppConfig);
  const history = useHistory()

  React.useEffect(() => {
    const queryParams = new URLSearchParams(
      "/" + window.location.hash.split("/")[1]
    );

    // console.log('hahs',window.location.hash)
  
    const code = queryParams.get("code");
    const isLegal = localStorage.getItem("isLegal");

    const redirectUri =
      "https:" + "//" + "isd.inso.gov.ir" + "/api/1.0/std/std/auth/sso-redirect-url";
    const data = {
      code: code,
      redirect_uri: redirectUri,
      client_id: config.clientId_std,
      client_secret: config.clientSecret_std,
      isLegal: isLegal,
    };
    login_sso(data).then((res) => {
      localStorage.setItem("access_token", res.data.access_token);
      localStorage.setItem("sso_login", true);
      getPmSession();
      props.handle_reset_store();
      history.push("/workdesk");
    });
  }, []);

  return (
    <div className="d-flex align-items-center justify-content-center text-center">
      <h6 className="my-auto">در حال بارگذاری</h6>
    </div>
  );
}

export default compose(withTranslation(), connect(null, sso.actions))(Sso);
