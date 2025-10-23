import React from 'react'

import {config}  from '../../../config/config';
import _ from "lodash";

export default class ServiceForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

  render() {
        let PRO_UID = this.props.params.pro_uid;
        let WE_DATA = this.props.params.we_data;

      return (
          <div id="extr-page" className="login_noscrol">
              <header id="header" className="animated fadeInDown">

                  <div id="logo-group">
                      <span id="logo"> <img src="assets/img/logo.png" alt="SmartAdmin"/> </span>
                  </div>
                  <h1 className="txt-color-red  pull-left login-header-big">داشبورد مدیریتی آرین</h1>
                  <span id="extr-page-header-space">
                      <h1 className="text-right pull-right login-header-big"><a className="btn btn-primary" href="#/login">ورود </a></h1>
                      <h1 className="text-right pull-right login-header-big"><a className="btn btn-primary" href="#/tracker/login">پیگیری </a></h1>
                  </span>

              </header>
              <div id="main" role="main" className="animated fadeInDown">


                  <div id="content" className="container">
                        <div className="row">
                          <div className="col-xs-12 ">

                              <iframe sandbox="allow-downloads allow-top-navigation allow-same-origin allow-scripts allow-forms allow-modals allow-popups" src={config.iframeServer +PRO_UID+"/"+WE_DATA + "&sid=" + localStorage.getItem('session_id')} style={{border:"0",width:"100%",height:"100%",minHeight:"600px",marginTop:"50px"}}></iframe>

                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )
  }
}
