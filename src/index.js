if (typeof process === 'undefined') {
  window.process = {
    env: {
      NODE_ENV: process.env.NODE_ENV || 'development'
    }
  };
}

import "./polyfill";

import React, { Suspense } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
// import { initializeFirebase } from './pushnotification';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "antd/dist/antd.css";

// import './assets/css/rtl.css';
import * as serviceWorker from "./serviceWorker";
import "./i18n";
window.jQuery = window.$ = require("jquery");

let is_rtl = localStorage.getItem("is_rtl");
if (is_rtl === null) is_rtl = 1;
else {
  is_rtl = parseInt(is_rtl);
}
let html = document.getElementsByTagName("html")[0];
let body = document.getElementsByTagName("body")[0];
let classString = body.className;

if (parseInt(is_rtl) === 0) {
  html.setAttribute("dir", "ltr");
  html.setAttribute("lang", "en");
  classString = classString.split("rtl_body").join("");
  body.className = classString.concat(" ltr_body");
} else {
  html.setAttribute("dir", "rtl");
  html.setAttribute("lang", "fa");
  classString = classString.split("ltr_body").join("");
  body.className = classString.concat(" rtl_body");
}

fetch("/main-config/")
  .then((r) => r.json())
  .then((config) => {
    const container = document.getElementById("smartadmin-root");
    const root = createRoot(container);
    root.render(
      <Suspense fallback={<div>Loading</div>}>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <App config={config} useSuspense={true} />
      </Suspense>
    );
  });

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
// initializeFirebase();