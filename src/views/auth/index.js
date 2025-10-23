import Login from "./components/Login";
import LoginWithSso from "./components/LoginWithSso";
import Forget from "./components/Forget";
import Sso from "../sso/components/Sso";

export const routes = [
  {
    path: "/login",
    exact: true,
    component: Login,
    name: "Login"
  },
  {
    path: "/forget",
    exact: true,
    component: Forget,
    name: "Forgot"
  },
  {
    path: "/token-login/:token",
    exact: true,
    component: LoginWithSso,
    name: "LoginWithSso"
  },
  {
    path: '/sso',
    exact: true,
    component: Sso,
    name: 'Sso',
  }
];
