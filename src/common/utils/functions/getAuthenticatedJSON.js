/**
 * Created by griga on 11/19/16.
 */

import React from "react";
import * as ReactDOM from "react-dom";
import { BarLoader, BeatLoader, RingLoader } from "react-spinners";
import $ from "jquery";
export default function (url) {
  let myToken = localStorage.getItem("access_token");

  return new Promise((resolve, reject) => {
    $.ajax({
      type: "GET",
      url: url,
      dataType: "json",
      beforeSend: setHeader,
    })
      .done(function (data) {
        resolve(data);
      })
      .fail(reject)
      .always(function () {});
  });
  function setHeader(xhr) {
    xhr.setRequestHeader("Authorization", "Bearer " + myToken);
  }
}
