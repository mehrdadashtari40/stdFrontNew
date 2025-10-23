import React from "react";
import { findDOMNode } from "../../../findDOMNode-polyfill";
import $ from "jquery";

import "smartadmin-plugins/bower_components/bootstrapvalidator/dist/js/bootstrapValidator.min.js";

export default class BootstrapValidator extends React.Component {
  componentDidMount() {
    $(findDOMNode(this)).bootstrapValidator(this.props.options || {});
  }

  render() {
    return this.props.children;
  }
}
