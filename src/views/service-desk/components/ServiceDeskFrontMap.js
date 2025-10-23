import React, {useContext, useEffect, useState} from 'react'
import postAuthonticatedJSON from '../../../common/utils/functions/postAuthenticatedJSON';
import getAuthonticatedJSON from '../../../common/utils/functions/getAuthenticatedJSON';
import Rating from "react-rating";
// import 'react-svg-map/lib/index.css';
import IranRmto from './iranmap-rmto';
import IranFrw from './iranmap-frw';
import IranDefault from './iranmap-default';
import $ from 'jquery';
import {connect, useSelector} from 'react-redux'
import {compose} from 'redux'
import {withTranslation} from 'react-i18next';
// import './styles.css'

import * as service from '../_redux/serviceDeskRedux';
import {getLocationId, getLocationName} from './utils';
import ServiceStatement from "./ServiceStatement";
import {get_categories, get_notifications, get_services, get_visit_count} from "../_redux/serviceDeskCrud";
import {AppConfig} from "../../../appConfig";
import "./styles.css"
import Accessibility from "./Accessibility";


const provinceCode = ["azerbaijan-east",
    "azerbaijan-west",
    "ardabil",
    "isfahan",
    "alborz",
    "ilam",
    "bushehr",
    "tehran",
    "chahar-mahaal-bakhtiari",
    "khorasan-south",
    "khorasan-razavi",
    "khorasan-north",
    "khuzestan",
    "zanjan",
    "semnan",
    "sistan-baluchestan",
    "fars",
    "qazvin",
    "qom",
    "kurdistan",
    "kerman",
    "kermanshah",
    "kohgiluyeh-boyer-ahmad",
    "golestan",
    "gilan",
    "lorestan",
    "mazandaran",
    "markazi",
    "hormozgan",
    "hamadan",
    "yazd",
    "shahrood",
    "iranshahr"]

function ServiceDeskFrontMap(props) {
    const config = useContext(AppConfig);
    const state = useSelector(state => state.ServiceDesk);
    const [customStyle,setCustomStyle] = useState({width:"50",height:"40%"});
    const [serviceNameStyle,setServiceNameStyle]=useState({height:"40px"});

    useEffect(()=>{
        get_visit_count(config.apiServer)
            .then(res=> {
                let date = new Date(res.lastUpdate);
                let persian_date = date.toLocaleString('fa-IR').split("،").reverse().join(" , ");
                props.handle_variables({
                    visit:{
                        ...res,
                        lastUpdate: persian_date
                    }
                });
            })
    },[])

    useEffect(()=>{
        if(state.accessibilityFontSize == 0){
            document.querySelector("body").classList.remove("increaseFont4");
            setCustomStyle({width:"50%",height:"40%"});
            setServiceNameStyle({height:"40px"});
        }else{
            document.querySelector("body").classList.remove(`increaseFont${state.accessibilityFontSize - 1}`);
            document.querySelector("body").classList.add(`increaseFont${state.accessibilityFontSize}`);
            setCustomStyle({width:"100%",height:"40%"});
            if(state.accessibilityFontSize>=3) {
                setCustomStyle({width:"100%",height:"50%"});
                setServiceNameStyle({height: "70px"});
            }
        }

    },[state.accessibilityFontSize])

    useEffect(() => {
        //document.title = config.appTitle;
        if(!state.isConfigLoaded) {
                document.title = config.appTitle;
                props.handle_variables({
                    messageUrl: '/',
                    isConfigLoaded: true
                });
        }
        if (!state.isServicesLoaded) {
            get_services(config.apiServer,props.match.params.province ? props.match.params.province : "*").then(res => {
                res = res.map(x => {
                    x.categories = JSON.parse(x.categories);
                    x.style = JSON.parse(x.style);
                    return x;
                });
                props.handle_variables({
                    services: res,
                    isServicesLoaded: true
                });
            })
        }
        if (!state.isCategoriesLoaded) {
            get_categories(config.apiServer).then(res => {
                let cats = [];
                res.map(x => {
                    if (parseInt(x.parent) === 0) cats.push({
                        id: x.id,
                        title: x.title,
                        items: []
                    })
                });

                res.map(x => {
                    if (parseInt(x.parent) !== 0) cats.filter(y => {
                        return parseInt(y.id) === parseInt(x.parent);
                    })[0].items.push({
                        id: x.id,
                        title: x.title,
                        items: []
                    });
                });
                props.handle_variables({
                    Categories: cats,
                    isCategoriesLoaded: true
                });
            })
        }
        if (!state.isNotificationsLoaded) {
            get_notifications(config.apiServer).then(res => {
                props.handle_variables({
                    notifications: res,
                    isNotificationsLoaded: true
                });
            })
        }

        let guidDone = localStorage.getItem("service_desk_guid_done");
        if (guidDone === "true") {
            props.handle_variables({
                isTourOpen: false
            });
        }
    })

    
    // state = {
    //     pointedLocation: null,
    //     focusedLocation: null,
    //     clickedLocationId: null,
    //     clickedLocationName: null,
    //     tooltipStyle: {
    //         display: 'none'
    //     },
    //     provinceStyle: [],
    //     Categories: [],
    //     services: [],
    //     QueryList: [],
    //     filter: [],
    //     notifications: [],
    //     searchFilter: "",
    //     serviceInfo: [],
    //     CurrentInfo: null,
    //     isTourOpen: false,
    //     rating: {
    //         value: 1,
    //         text: "",
    //         serviceId: -1
    //     }
    // };


    // }
    function getIndex(value, arr) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] === value) {
                return i;
            }
        }
        return -1; //to handle the case where the value doesn't exist
    }

    function handleLocationMouseOver(event) {
        const pointedLocation = getLocationName(event);
        props.handle_variables({pointedLocation});
    }

    function handleLocationMouseOut() {
        props.handle_variables({pointedLocation: null, tooltipStyle: {display: 'none'}});
    }

    function handleLocationClick(event) {
        const clickedLocationName = getLocationName(event);
        const clickedLocationId = getLocationId(event);
        const lakeSeaList = ['caspian-sea', 'persian-gulf', 'jazmourian-lake', 'qom-lake', 'urmia-lake'];
        if (lakeSeaList.indexOf(clickedLocationId) < 0) { //true
            props.handle_variables({clickedLocationName: clickedLocationName, clickedLocationId: clickedLocationId});
            window.open('/#/services/' + clickedLocationId, '_blank');
        }
    }

    function handleLocationFocus(event) {
        const focusedLocation = getLocationName(event);
        props.handle_variables({focusedLocation: focusedLocation});
    }

    function handleLocationBlur() {
        props.handle_variables({focusedLocation: null});
    }

    function handleLocationMouseMove(event) {
        const tooltipStyle = {
            display: 'block',
            position: 'absolute',
            background: '#fff7a3',
            border: '1px solid #444',
            width: '110px',
            textAlign: 'center',
            padding: '4px 6px',
            top: event.clientY - 70,
            left: event.clientX - 100
        };

        // noinspection JSAnnotator
        const provinceStyle = [];
        /*
        const locationId = getLocationId(event);
        const idx = getIndex(locationId, provinceCode);
        for(let i=0; i<provinceCode.length;i++){
            if(i==idx)
                provinceStyle.push({"backgroundColor":"red"});
            else
                provinceStyle.push({"backgroundColor":"white"});
        }
*/
        props.handle_variables({tooltipStyle, provinceStyle});


    }

    function itemCredentional(id) {
        let self = this;
        let info = state.serviceInfo;
        let SI = info.filter(x => parseInt(x.id) === parseInt(id));
        if (SI.length > 0) {
            props.handle_variables({CurrentInfo: SI[0]})
        } else {
            let URL = config.apiServer + "servicedesk/Service-info/" + id;

            getAuthonticatedJSON(URL)
                .then(res => {
                    props.handle_variables({
                        serviceInfo: state.serviceInfo.concat(res),
                        CurrentInfo: res
                    })
                });
        }
    }

    function ToggleFilter(event, id) {
        let filters = state.filter;
        if ($(event.target).prop("checked")) {
            filters.push(id);
        } else {
            filters = filters.filter(x => x !== id);
        }
        props.handle_variables({filter: filters});
    }

    function searchChanged(e) {
        props.handle_variables({searchFilter: e.target.value});
    }

    function closeTour() {
        props.handle_variables({isTourOpen: false});
        localStorage.setItem("service_desk_guid_done", true);
    }

    function ratingChanged(value) {
        let rate = state.rating;
        rate.value = value;
        props.handle_variables({rating: rate});
    }

    function RateMessageChanged(e) {
        let rate = state.rating;
        rate.text = e.target.value;
        props.handle_variables({rating: rate});
    }

    function RateServiceChanged(e) {
        let rate = state.rating;
        rate.serviceId = e.target.value;
        props.handle_variables({rating: rate});
    }

    function handleRatingSubmit() {
        props.handle_variables({
            rating: {
                value: 1,
                text: "",
                serviceId: -1
            }
        });

        let URL = config.apiServer + "servicedesk/feedback";
        let data = {
            feedback: JSON.stringify({
                isNew: true,
                isDeleted: false,
                sid: state.rating.serviceId,
                val: state.rating.value,
                mes: state.rating.text
            })
        };
        postAuthonticatedJSON(URL, data)
            .then(res => {

            });

        $("#myTrackerModal").modal('hide');

    }

    function componentWillMount() {
        document.title = config.appTitle;
    }

    function componentDidMount() {
        let self = this;
        let URL = config.apiServer + "servicedesk/Service/setad";

        getAuthonticatedJSON(URL)
            .then(res => {
                res.map(x => {
                    URL = config.apiServer + "servicedesk/ServiceCategories/" + x.id;

                    getAuthonticatedJSON(URL)
                        .then(res => {

                            let temp = state.services.map(y => {
                                if (parseInt(y.id) === parseInt(x.id)) {
                                    y.categories = res.map(y => y.category_id);
                                }
                                return y;
                            });
                            props.handle_variables({
                                services: temp
                            });
                        });
                });
                res = res.map(x => {
                    x.style = JSON.parse(x.style);
                    return x;
                });
                props.handle_variables({
                    services: res
                });
            });
        URL = config.apiServer + "servicedesk/Category";

        getAuthonticatedJSON(URL)
            .then(res => {
                let cats = [];
                res.map(x => {
                    if (parseInt(x.parent) === 0) cats.push({
                        id: x.id,
                        title: x.title,
                        items: []
                    })
                });

                res.map(x => {
                    if (parseInt(x.parent) !== 0) cats.filter(y => {
                        return parseInt(y.id) === parseInt(x.parent);
                    })[0].items.push({
                        id: x.id,
                        title: x.title,
                        items: []
                    });
                });
                props.handle_variables({Categories: cats});
            });

    }


    let self = this;
    let currentDashlets = [];
    let services = state.services;

    if (state.filter.length > 0) {
        services = services.filter(x => {
            let res = false;
            x.categories.map(y => {
                if (state.filter.indexOf(y) > -1) res = true;
            });
            return res;
        })
    }

    if (state.searchFilter !== "") {
        services = services.filter(x => x.title.includes(state.searchFilter));
    }


    // if(state.CurrentDashboard!==undefined){
    //     currentDashlets = _.map(state.dashlets.filter(x=>(x.dashboardId === state.CurrentDashboard.id && x.isDeleted === false)), el => createMyElement(el));
    // }
    let provinceTitle = null;
    if (props.match.params.province) {
        provinceTitle = props.match.params.province;
    }
    let pid = 'setad';
    if (provinceTitle !== null) {
        pid = provinceTitle;
        provinceTitle = 'logo-mnt-' + provinceTitle + '.png';

    } else
        provinceTitle = 'logo-mnt.png';
    return (

        <div className="service_table">

            <header id="header" className="animated fadeInDown">
                <img src="assets/img/motto.png" className="year_motto" alt=""/>
                <div id="logo-group">
                    <span id="logo"> <img src="assets/img/logo-mnt.png" alt="SmartAdmin"/> </span>
                </div>
                <section className="header_items_bx">
                    <div>
                            <span className="pull-right"><a href="/help.pdf"><i className="fa fa-info"
                                                                                title="راهنمای کاربری "/> </a></span>
                        <a href="#/login"><i className="fa fa-user" title="ورود "></i> </a>
                        <div className="date_bx_style">&nbsp;</div>
                    </div>
                    <div className="leader_logo_bx">
                        <img src="assets/img/pic1.jpg" alt="SmartAdmin"/>
                        <img src="assets/img/pic2.jpg" alt="SmartAdmin"/>
                        <img src="assets/img/pic3.jpg" alt="SmartAdmin"/>
                    </div>
                </section>
            </header>
            <div id="desk-main">
                <div id="content" className="container">
                    <div className="row">
                        <div className="col-xs-12 ">
                            <div className="row">
                                <div className="col-md-7">
                                    <div className="service_table_index_bx">
                                        <div className="service_menu_bx">
                                            <div className="col-xs-5">
                                                <ul className="service_menu_ul">{
                                                    state.Categories.map(x =>
                                                        <li key={x.id}>
                                                            {x.title}
                                                            {x.items !== undefined ?
                                                                <ul>
                                                                    {x.items.map(y =>
                                                                        <li key={y.id}>
                                                                            <label onClick={(event, id) => ToggleFilter(event, y.id)}><input type="checkbox"/> {y.title}</label>
                                                                        </li>
                                                                    )}
                                                                </ul>
                                                                : null}
                                                        </li>
                                                    )
                                                }
                                                </ul>
                                            </div>
                                            <div className="col-xs-7">

                                                <div className="form-group margin-5-10">
                                                    <div className="input-group">
                                                        <input className="form-control" id="searchBar"
                                                               placeholder="جستجو" value={state.searchFilter}
                                                               onChange={searchChanged}/>
                                                        <span className="input-group-addon">
                                                      <i className="fa fa-search"></i>
                                                  </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="service_items_overflow_bx">
                                            {services.map(x => {
                                                return <div key={x.id} className="col-xs-12 col-sm-6"  style={customStyle}>
                                                    <div className="service_item_bx">
                                                        <a href={x.type === "0" ? (x.web.startsWith('http') ? x.web : 'http://' + x.web) : config.iframeServer + x.web + '?kid=' + x.id + '&pid=setad'}
                                                           target={x.type === "0" ? "_self" : "_blank"}>
                                                            <div className="service_item_iconlogo"
                                                                 style={{backgroundColor: x.style.IconColor}}>
                                                                <i className={"fa " + x.icon}></i>
                                                            </div>
                                                            <div className="logo-container">
                                                                {(x.email === undefined || x.email === null || x.email == '') ? null :
                                                                    <a href={"mailto:" + x.email} title={x.email}>
                                                                        <i className="fa fa-envelope-o"></i>
                                                                    </a>
                                                                }
                                                                {(x.phone === undefined || x.phone === null || x.phone == '') ? null :
                                                                    <a href={"tel:" + x.phone}>
                                                                        <i className="fa fa-phone" title={x.phone}></i>
                                                                    </a>
                                                                }
                                                                {(x.mobileApp === undefined || x.mobileApp === null || x.mobileApp == '') ? null :
                                                                    <a href={x.mobileApp}>
                                                                        <i className="fa fa-mobile"
                                                                           title="اپلیکیشن موبایل"></i>
                                                                    </a>
                                                                }

                                                                {(x.web === undefined || x.web === null || x.web == '') ? null :
                                                                    <a href={x.type === "0" ? (x.web.startsWith('http') ? x.web : 'http://' + x.web) : config.iframeServer + x.web + '?kid=' + x.id + '&pid=setad'}
                                                                       target="_blank"> <i className="fa fa-globe"
                                                                                           title={x.type === "0" ? (x.web.startsWith('http') ? x.web : 'http://' + x.web) : config.iframeServer + x.web + '?kid=' + x.id + '&pid=setad'}></i></a>
                                                                }
                                                                {(x.sms === undefined || x.sms === null || x.sms == '') ? null :
                                                                    <a href={x.sms}>
                                                                        <i className="fa fa-comment-o"
                                                                           title="سامانه پیامکی"></i>
                                                                    </a>
                                                                }

                                                            </div>

                                                            <div>
                                                                <h3 className="service_name_style" style={serviceNameStyle}>{x.title}</h3>
                                                                {/*<h3 className="service_unit_title">توضیحات مربوط به خدمت ، در این بخش نمایش خواهد یافت. متن برای تست آماده و درج شده و بایستی قبل از آپلود و تحویل جاگذاری شود.{x.description}</h3>*/}

                                                                {/*<h4 className="service_unit_title">{x.title}</h4>*/}
                                                            </div>
                                                            <div className="service_btn_orginal_bx">
                                                                <a data-toggle="modal"
                                                                   data-target="#myModal"
                                                                   className="btn btn-sm btn-default"
                                                                   onClick={(id => itemCredentional(x.id))}>شناسنامه
                                                                    <i className="fa fa-address-card second-step"
                                                                       title="شناسنامه خدمت"></i>
                                                                </a>
                                                                <a style={x.CHK_VOTE === "0" ? {display: "none"} : {visibility: "visible"}}
                                                                   href={x.TXT_LINK_VOTE != null ? (x.TXT_LINK_VOTE.startsWith('http') ? x.TXT_LINK_VOTE : config.iframeServer + x.TXT_LINK_VOTE + '?kid=' + x.id + '&pid=' + pid) : "/"}
                                                                   target="_blank" className="btn btn-sm btn-default">نظرسنجی
                                                                    <i className="fa fa-bars" title="نظرسنجی خدمت"></i>
                                                                </a>
                                                                <div className="dropdown">
                                                                    <a className="btn btn-sm btn-default"> سایر گزینه ها
                                                                    </a>
                                                                    <div className="dropdown-content">
                                                                        <a style={x.CHK_SHEKAYAT === "0" ? {display: "none"} : {visibility: "visible"}}
                                                                           href={x.TXT_LINK_SHEKAYAT != null ? (x.TXT_LINK_SHEKAYAT.startsWith('http') ? x.TXT_LINK_SHEKAYAT : config.iframeServer + x.TXT_LINK_SHEKAYAT + '?kid=' + x.id + '&pid=' + pid + '&s=0') : "/"}
                                                                           target="_blank" className="btn">شکایت
                                                                            <i className="fa fa-comment third-step"
                                                                               title="شکایت"></i>
                                                                        </a>
                                                                        <a style={x.CHK_SHEKAYAT === "0" ? {display: "none"} : {visibility: "visible"}}
                                                                           href={x.txt_peigiri_shekayat != null ? (x.txt_peigiri_shekayat.startsWith('http') ? x.txt_peigiri_shekayat : config.iframeServer + x.txt_peigiri_shekayat + '?kid=' + x.id + '&pid=' + pid + '&s=1') : "/"}
                                                                           target="_blank" className="btn">پیگیری شکایت
                                                                            <i className="fa fa-search third-step"
                                                                               title="پیگیری شکایت"></i>
                                                                        </a>
                                                                        <a href={x.tracker != null ? (x.tracker.startsWith('http') ? x.tracker : config.iframeServer + x.tracker + '?kid=' + x.id + '&pid=' + pid) : "/"}
                                                                           target="_blank" className="btn">پیگیری خدمت
                                                                            <i className="fa fa-search third-step"
                                                                               title="پیگیری خدمت"></i>
                                                                        </a>
                                                                        <a href={config.messageUrl != null ? config.messageUrl + '?kid=' + x.id + '&pid=' + pid : "/"}
                                                                           target="_blank" className="btn">ارسال پیام
                                                                            <i className="fa fa-envelope third-step"
                                                                               title="ارسال پیام"></i>
                                                                        </a>

                                                                    </div>
                                                                </div>

                                                            </div>
                                                        </a>

                                                    </div>
                                                </div>
                                            })
                                            }</div>
                                    </div>
                                </div>
                                <div className="col-md-5">
                                    <div className="" style={{background:'white',boxShadow: '0 1px 9px #b9b9b9'}}>
                                        <p className="map_head_txt">با کلیک بر روی هر استان، می‌توانید خدمات الکترونیکی
                                            ارائه شده در آن استان را مشاهده نمایید.</p>


                                        <div style={{display: 'flex', justifyContent: 'space-around'}}>
                                            < a href="#/login" className="login_btn_style"><i
                                                className="fa fa-user"></i> ورود به سامانه </a>
                                            <a style={config.linkHelp === "" ? {display: "none"} : {visibility: "visible"}}
                                               href={config.linkHelp} className="login_btn_style"><i
                                                className="fa fa-info"></i>  راهنمای کاربری </a>
                                            <a style={config.linkApp === "" ? {display: "none"} : {visibility: "visible"}}
                                               href={config.linkApp} className="login_btn_style"><i
                                                className="fa fa-android"></i> دانلود اپلیکیشن موبایل</a>
                                            <a style={config.linkFAQ === "" ? {display: "none"} : {visibility: "visible"}}
                                               href={config.linkFAQ} className="login_btn_style"><i
                                                className="fa fa-question-circle"></i> سوالات متداول</a>
                                        </div>

                                        <div className="examples__block__map__tooltip"
                                             style={state.tooltipStyle}>
                                            {state.pointedLocation}
                                        </div>

                                    </div>
                                    <div className="aside_service_table" style={{marginTop:"5px"}}>
                                        <div className="row" style={{margin: '10px',paddingRight: '5px',paddingTop: '5px'}}>
                                            <div className="col-md-6">
                                                <p>تعداد بازديد امروز : {state.visit.today} </p>
                                                <p>تعداد بازديد ديروز  : {state.visit.yesterday}</p>
                                                <p>تعداد بازديد ماه جاری : {state.visit.currentMonth}</p>
                                            </div>
                                            <div className="col-md-6">
                                                <p>تعداد بازديد ماه گذشته : {state.visit.lastMonth}</p>
                                                <p>تعداد بازديد كل : {state.visit.total}</p>
                                            </div>
                                        </div>

                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                <footer className="footer_bx">
                    {config.copyrightText.length > 0 &&
                    <p className="">
                        {config.copyrightText}
                    </p>
                    }
                    {config.serviceDeskFooterText.length > 0 &&
                    <p className="">
                        {config.serviceDeskFooterText}
                        {state.visit.lastUpdate}
                    </p>
                    }
                    <p className=""><a href="http://arian.co.ir">طراحی و اجرا : آرین نوین رایانه</a></p>
                </footer>
            </div>

            <div className="modal fade" id="myModal" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel"
                 aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-hidden="true">
                                &times;
                            </button>
                            <h4 className="modal-title"
                                id="myModalLabel">شناسنامه خدمت</h4>
                        </div>
                        <div className="service_modal_tab_style">
                            <div className="tabbable-panel">
                                <div className="tabbable-line">
                                    <ul className="nav nav-tabs ">
                                        <li className="active">
                                            <a href="#tab_query_1" data-toggle="tab">شناسنامه خدمت</a>
                                        </li>
                                        <li>
                                            <a href="#tab_query_2" data-toggle="tab">فلوچارت خدمت</a>
                                        </li>
                                        <li>
                                            <a href="#tab_query_3" data-toggle="tab">مدارک موردنیاز خدمت</a>
                                        </li>
                                        <li>
                                            <a href="#tab_query_4" data-toggle="tab">بیانیه خدمت</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="modal-body">
                            <div className="tab-content service_modal_inner_bx">
                                <div className="tab-pane active padding-top-0" id="tab_query_1">
                                    <div className="col-sm-8">
                                        <p>شناسه یکتای
                                            خدمت: {state.CurrentInfo === null ? "" : state.CurrentInfo.UID}</p>
                                        <p><span
                                            style={{fontSize: 14}}>شناسه یکتای خدمت :</span> {state.CurrentInfo === null ? "" : state.CurrentInfo.UID}
                                        </p>
                                        <p><span
                                            style={{fontSize: 14}}>شرح خدمت:</span> {state.CurrentInfo === null ? "" : state.CurrentInfo.Description}
                                        </p>
                                        <p><span
                                            style={{fontSize: 14}}>نوع ارائه خدمت : </span>{state.CurrentInfo === null ? "" : state.CurrentInfo.ServeType}
                                        </p>
                                        <p><span
                                            style={{fontSize: 14}}>زمان های ارائه خدمت : </span> {state.CurrentInfo === null ? "" : state.CurrentInfo.AvailableTime}
                                        </p>
                                        {/* <p>هزینه خدمت:  {state.CurrentInfo === null? "": state.CurrentInfo.Cost}</p> */}
                                        <p><span
                                            style={{fontSize: 14}}>تعداد دفعات مراجعه: </span> {state.CurrentInfo === null ? "" : state.CurrentInfo.AttendanceFrequency}
                                        </p>
                                        <p><a
                                            href={state.CurrentInfo === null ? "" : (config.iframeServer + state.CurrentInfo.ServiceIdentity)}
                                            className="service_flowchart">دانلود شناسنامه</a></p>
                                    </div>
                                    {/*<div className="col-sm-3">*/}
                                    {/*<a href="" className="btn service_linkbtn">درخواست خدمت <i className="fa fa-check"></i> </a>*/}
                                    {/*</div>*/}
                                    <div className="col-sm-4">
                                        <div className="panel-group" id="accordion" role="tablist"
                                             aria-multiselectable="true">
                                            <div className="panel panel-default">
                                                <div className="panel-heading" role="tab" id="headingThree">
                                                    <h4 className="panel-title">
                                                        <a className="collapsed" role="button" data-toggle="collapse"
                                                           data-parent="#accordion" href="#collapse1"
                                                           aria-expanded="true" aria-controls="collapse1">
                                                            مدت زمان ارائه خدمت<i
                                                            className="fa fa-angle-down service_colapse_icon"></i></a>
                                                    </h4>
                                                </div>
                                                <div id="collapse1" className="panel-collapse collapse" role="tabpanel"
                                                     aria-labelledby="headingThree">
                                                    <div className="panel-body">
                                                        {state.CurrentInfo === null ? "" : state.CurrentInfo.Duration}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="panel panel-default">
                                                <div className="panel-heading" role="tab" id="headingThree">
                                                    <h4 className="panel-title">
                                                        <a className="collapsed" role="button" data-toggle="collapse"
                                                           data-parent="#accordion" href="#collapse2"
                                                           aria-expanded="false" aria-controls="collapse2">
                                                            هزینه ها <i
                                                            className="fa fa-angle-down service_colapse_icon"></i></a>
                                                    </h4>
                                                </div>
                                                <div id="collapse2" className="panel-collapse collapse" role="tabpanel"
                                                     aria-labelledby="headingThree">
                                                    <div className="panel-body">
                                                        {state.CurrentInfo == null ? "" : state.CurrentInfo.Cost == null ? "" : state.CurrentInfo.Cost.map(c => {
                                                            return (
                                                                <div>
                                                                    <span
                                                                        style={{fontSize: 14}}>{c.TXT_COST_TITLE}</span> : <span>{c.TXT_COST}</span>
                                                                    <br/>
                                                                </div>
                                                            )
                                                        })}

                                                    </div>
                                                </div>
                                            </div>
                                            <div className="panel panel-default">
                                                <div className="panel-heading" role="tab" id="headingThree">
                                                    <h4 className="panel-title">
                                                        <a className="collapsed" role="button" data-toggle="collapse"
                                                           data-parent="#accordion" href="#collapse3"
                                                           aria-expanded="false" aria-controls="collapse3">
                                                            مدارک مورد نیاز <i
                                                            className="fa fa-angle-down service_colapse_icon"></i></a>
                                                    </h4>
                                                </div>
                                                <div id="collapse3" className="panel-collapse collapse" role="tabpanel"
                                                     aria-labelledby="headingThree">
                                                    <div className="panel-body">
                                                        {state.CurrentInfo === null ? "" : state.CurrentInfo.RequiredDocs}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="panel panel-default">
                                                <div className="panel-heading" role="tab" id="headingThree">
                                                    <h4 className="panel-title">
                                                        <a className="collapsed" role="button" data-toggle="collapse"
                                                           data-parent="#accordion" href="#collapse4"
                                                           aria-expanded="false" aria-controls="collapse4">
                                                            سایر <i
                                                            className="fa fa-angle-down service_colapse_icon"></i></a>
                                                    </h4>
                                                </div>
                                                <div id="collapse4" className="panel-collapse collapse" role="tabpanel"
                                                     aria-labelledby="headingThree">
                                                    <div className="panel-body">
                                                        {state.CurrentInfo === null ? "" : state.CurrentInfo.Other_info == null ? "" : state.CurrentInfo.Other_info.map(info => {
                                                            return (
                                                                <div>
                                                                    <span
                                                                        style={{fontSize: 14}}>{info.TXT_KHEDMAT_TITLE}</span> : <span>{info.TXR_CONTENT}</span><br/>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            </div>


                                        </div>
                                    </div>
                                </div>
                                <div className="tab-pane padding-top-0" id="tab_query_2">
                                    <div style={{marginBottom: 20}}>
                                        جهت دریافت فلوچارت <a
                                        href={state.CurrentInfo === null ? "" : config.iframeServer + state.CurrentInfo.ChartAddress}
                                        target="_blank"><strong>اینجا</strong></a> کلیک کنید
                                    </div>

                                    <img
                                        src={state.CurrentInfo === null ? "" : config.iframeServer + state.CurrentInfo.ChartAddress}
                                        className="service_flowchart img"/>
                                </div>
                                <div className="tab-pane padding-top-0" id="tab_query_3">
                                    {state.CurrentInfo &&
                                    <div>
                                        <strong>
                                            مدارک مورد نیاز :
                                        </strong>
                                        <br/>
                                        {state.CurrentInfo.RequiredDocs}
                                        <br/><br/>
                                    </div>
                                    }
                                </div>
                                <div className="tab-pane padding-top-0" id="tab_query_4">
                                    <ServiceStatement/>
                                </div>
                            </div>

                        </div>
                    </div>
                    {/* /.modal-content */}
                </div>
                {/* /.modal-dialog */}
            </div>

            <div className="modal fade" id="myTrackerModal" tabIndex="-1" role="dialog"
                 aria-labelledby="myTrackerLabel"
                 aria-hidden="true">
                <div className="modal-dialog modal-md">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-hidden="true">
                                &times;
                            </button>
                            <h4 className="modal-title"
                                id="myModalLabel">'شکایت خدمت'</h4>
                        </div>

                        <div className="service_modal_tab_style">
                            <div className="tabbable-panel">
                                <div className="tabbable-line">
                                    <ul className="nav nav-tabs ">
                                        <li className="active">
                                            <a href="#tab_tracker_1" data-toggle="tab">شکایت</a>
                                        </li>
                                        <li>
                                            <a href="#tab_tracker_2" data-toggle="tab">نظرسنجی</a>
                                        </li>

                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="modal-body">
                            <div className="tab-content service_modal_inner_bx">
                                <div className="tab-pane active padding-top-0" id="tab_tracker_1">

                                    <form className="display-inline">
                                        <div className="form-group margin-15">
                                            <select className="tracker_itm_drpdwn"
                                                    onChange={RateServiceChanged}
                                                    value={state.rating.serviceId}>
                                                {state.services.map(x =>
                                                    <option key={x.id} value={x.id}>{x.title}</option>
                                                )}
                                            </select>
                                        </div>
                                        <div className="form-group margin-15">
                                            <div className="input-group">
                                                <input type="text" className="form-control"/>
                                                <span className="input-group-addon">
                                                          <i className="fa fa-barcode"></i>
                                                      </span>
                                            </div>
                                        </div>
                                        <div className="form-group margin-15">
                                            <div className="input-group">
                                                <input type="text" className="form-control"/>
                                                <span className="input-group-addon">
                                                          <i className="fa fa-lock"></i>
                                                      </span>
                                            </div>
                                        </div>

                                        <input type="submit" value="شکایت" className="btn btn_service_track"/>
                                    </form>
                                </div>
                                <div className="tab-pane padding-top-0" id="tab_tracker_2">
                                    <form className="smart-form">
                                        <div className="rating_bx"><i>میزان رضایتمندی</i>
                                            <Rating
                                                emptySymbol="fa fa-star-o fa-2x"
                                                fullSymbol="fa fa-star fa-2x"
                                                initialRating={state.rating.value}
                                                onChange={(value) => ratingChanged(value)}
                                            /></div>
                                        <fieldset>
                                            <section><p>متن نظرسنجی</p>
                                                <label className="add_service_lable">
                                                        <textarea
                                                                  className="add_service_txtbx survey_txtarea"
                                                                  id="ServiceTitle" name="ServiceTitle"
                                                                  onChange={RateMessageChanged}/>
                                                </label>
                                            </section>
                                        </fieldset>
                                        <button type="button" className="btn btn_service_track"
                                                onClick={handleRatingSubmit}>ارسال نظر
                                        </button>

                                    </form>

                                </div>
                            </div>

                        </div>
                    </div>
                    {/* /.modal-content */}
                </div>
                {/* /.modal-dialog */}
            </div>
            <Accessibility/>

        </div>
    )
}

export default compose(withTranslation(), connect(state => state.ServiceDesk, service.actions))(ServiceDeskFrontMap);