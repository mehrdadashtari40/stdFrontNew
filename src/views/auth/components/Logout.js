import React, { Component } from "react";
import { config } from "../../../config/config";
import postAuthenticatedJSON from "../../../common/utils/functions/postAuthenticatedJSON";

let iframeLoading = false;
let TokenLoading = false;

export default class Logout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      code: "",
      pmLogin: null,
    };
  }

  componentDidMount() {}

  render() {
    localStorage.setItem("baseURL", null);
    let external_login = localStorage.getItem("external_login");
    if (external_login !== null) window.location.assign(external_login);
    else window.location.replace("#/login");

    return <div id="extr-page" className="login_noscrol"></div>;
  }

  result(text) {
    this.setState({ captcha: text });
  }

  frameLoaded() {
    iframeLoading = true;
    this.RedirectToDashboard();
  }

  RedirectToDashboard() {
    if (TokenLoading === true && iframeLoading === true) {
      this.props.location.push("/dashboard");
    }
  }
}
