let ArianAdminConfig = {
  baseUrl: "",
  workspace: "",
  clientId: "",
  clientSecret: "",
  external_login: "",
  logout_redirect: "",
  showDefaultCustomFields: false,
  apiServer: "",
  apiServerInso:"",
  iframeServer: "",
  BIURL: "",
  logsUrls: "https://api.bservice.ir/loki/loki/api/v1/query_range",
  processMapUrl: "",
  firstRedirectUrl: "/login",
  loginPageAppTitle: "داشبورد جامع مدیریتی",
  loginPageOrgName: "شرکت آرین نوین رایانه",
  firstLink: {},
  secondLink: {},
  appTitle: "سامانه مدیریت فرآیندهای سازمانی",
  copyrightText:
    "کلیه حقوق مادی و معنوی این طرح متعلق به شرکت آرین نوین رایانه می باشد.",
  serviceDeskFooterText: "آخرین بروزرسانی: ",
  serviceDeskSetting:
    "6704213155da2bc35dd3140060550592/8051735805da2bc35ef7b26018410799",
  serviceDeskNew:
    "9621534135cc922f8807a90019403637/4302142135cc923be248782041670927",
  serviceDeskEdit:
    "8959321035da3dde4536ae8097207553/7127797375da3de379d3e39023643494",
  serviceDeskGroup:
    "5810127125ce10e7cb60d00006862042/4231998685ce10ecdea3322074628063",
  linkApp: "",
  default_lang: "fa",
  default_dir: "rtl",
  login_homepage: true,
  taskboard: "false",
  multi_lang: false,
  linkHelp: "",
  linkFAQ: "",
  iranMap: "frw",
  version: "4.9.2.0",
  apiRootUrl: "assets/api",
  theme: "modern",
  register_text: "",
  register_link: "",
  register_color: "#fff",
  register_background: "#5c9ba5",
  register_text_2: "",
  register_link_2: "",
  register_color_2: "#fff",
  register_background_2: "#20D469",
};

// ArianAdminConfig.assign(workspaceSettings)

ArianAdminConfig.sound_path = "assets/sound/";
ArianAdminConfig.sound_on = true;

/*********************************************
 *    TODO : Default Process Color
 ********************************************/
ArianAdminConfig.paused = "#c8d6e5";
ArianAdminConfig.draft = "#ff9f43";
ArianAdminConfig.participated = "#48dbfb";
ArianAdminConfig.unassigned = "#9b59b6";
ArianAdminConfig.todo = "#2ecc71";
ArianAdminConfig.complete = "#ff6b6b";

/*
 * DEBUGGING MODE
 * debugState = true; will spit all debuging message inside browser console.
 * The colors are best displayed in chrome browser.
 */

ArianAdminConfig.voice_command = true;

ArianAdminConfig.voice_command_auto = false;

ArianAdminConfig.voice_command_lang = "en-US";
/*
 *  Use localstorage to remember on/off (best used with HTML Version)
 */
ArianAdminConfig.voice_localStorage = false;

export const config = ArianAdminConfig;
