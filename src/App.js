import React, { Component, useEffect } from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/configureStore";
import { authRoutes } from "./routes";
import { Layout } from "./common/layout";
import { config as mainConfig } from "./config/config";
import { AppConfig } from "./appConfig";

function App({ config }) {
  // useEffect(() => {
  //     Notification.requestPermission().then(async function (permission) {
  //         //TODO: Completely implement firebase push notifications
  //         //askForPermissioToReceiveNotifications();
  //     });
  // },[])
  //Override main config values with value from environment variables
  useEffect(() => {
    const script = document.createElement("script");

    script.src = "../assets/jslib/goftino.js";
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);
  let myConfig = Object.assign(mainConfig, config);
  let lang = localStorage.getItem("lang");
  if (lang === null) lang = myConfig.default_lang;
  myConfig.apiServer =
    myConfig.baseUrl + "bpmsback/api/1.0/" + myConfig.workspace + "/";
  myConfig.iframeServer =
    myConfig.baseUrl +
    "bpmsback/sys" +
    myConfig.workspace +
    "/" +
    lang +
    "/" +
    myConfig.theme +
    "/";
  myConfig.BIURL = myConfig.baseUrl + "biback";
  document.title = myConfig.appTitle;
  return (
    <AppConfig.Provider value={myConfig}>
      <Provider store={store}>
        <HashRouter>
          <Switch>
            {authRoutes.map((route, idx) => {
              return route.component ? (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  render={(props) => <route.component {...props} />}
                />
              ) : null;
            })}

            <Route path="/" name="Home" component={Layout} />
          </Switch>
        </HashRouter>
      </Provider>
    </AppConfig.Provider>
  );
}

export default App;
