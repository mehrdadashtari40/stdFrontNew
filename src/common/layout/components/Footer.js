import React from "react";
import {config} from '../../../config/config'
export default function Footer() {
    return (
        <div className="page-footer">
            <div className="row">


                <div className="col-xs-6 col-sm-6 hidden-xs">
                    <div className="txt-color-white inline-block">
                        {/* place your logo here */}
                        <img src="assets/img/arian.png" className="footer_arian_logo" alt="ArianNovin"/>
                        <h6 className="txt-color-lighten hidden-mobile display-inline pad2">
                            <a href="http://arian.co.ir"
                               rel="noopener noreferrer"
                               className="txt-color-white"
                               target="_blank">{this.props.t('Arian Novin Co')}</a></h6>&nbsp;
                        <h6 className="txt-color-lighten hidden-mobile display-inline pad2">- نسخه {process.env.REACT_APP_VERSION}</h6>

                    </div>
                </div>
                <div className="col-xs-12 col-sm-6">
                    <div id="load-container" className="page_loading"></div>
                    <p className="txt-color-white text-right"></p>
                </div>
            </div>
        </div>
    )
}