import React, {useContext, useEffect,useState} from 'react';
import Rating from "react-rating";
import {connect, useSelector} from 'react-redux'
import {compose} from 'redux'
import {withTranslation} from 'react-i18next';
import * as service from '../_redux/serviceDeskRedux';

import ServiceStatement from "./ServiceStatement";
import {Modal, Tab, Tabs} from 'react-bootstrap';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
    get_categories,
    get_notifications,
    get_service_info,
    get_services,
    post_service_feedback,
    get_visit_count
} from "../_redux/serviceDeskCrud";
import {GridLoader} from "react-spinners";
import {AppConfig} from "../../../appConfig";
import Accessibility from "./Accessibility";
import "./styles.css"

const increase={
    fontSize:'50px'
}



function ServiceDeskFront(props) {
    const state = useSelector(state => state.ServiceDesk)
    const config = useContext(AppConfig);
    const [lastUpdate,setLastUpdate] = useState();
    const [customStyle,setCustomStyle] = useState({width:"33.333%",height:"35%"});
    const [serviceNameStyle,setServiceNameStyle]=useState({height:"40px"});

    let provinceTitle = null;
    if (props.match.params.province) {
        provinceTitle = props.match.params.province;
    }
    let pid = '*';
    if (provinceTitle !== undefined)
        pid = provinceTitle;

    useEffect(()=>{
        if(state.accessibilityFontSize == 0){
            document.querySelector("body").classList.remove("increaseFont4");
            setCustomStyle({width:"33.3333333%",height:"35%"});
            setServiceNameStyle({height:"40px"});
        }else{
            document.querySelector("body").classList.remove(`increaseFont${state.accessibilityFontSize - 1}`);
            document.querySelector("body").classList.add(`increaseFont${state.accessibilityFontSize}`);
            setCustomStyle({width:"100%",height:"35%"});
            if(state.accessibilityFontSize>=3) {
                setCustomStyle({width:"100%",height:"40%"});
                setServiceNameStyle({height: "70px"});
            }
        }

    },[state.accessibilityFontSize])

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

    if(!state.isConfigLoaded){
        return <div className={'service_table'} style={{display:'flex',height:'100vh'}}>
            <div className={'loader-container'} style={{margin:'auto'}}>
                <GridLoader color={"#45a5bf"} />
            </div>
        </div>
    }

    const handleClose = () => {
        props.handle_variables({
            show: false
        })
    }
    const setKey = (k) => {
        props.handle_variables({
            selectedKey: k
        })
    }
    const showModal = () => {
        $('#myModal').modal('show');
    }

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

    let steps = [
        {
            selector: '.first-step',
            content: ({goTo, inDOM}) => (
                <div className="user_guid_bx"><h4> خدمت</h4>
                    <p>در این قسمت خدمات دستگاه و شناسنامه آن معرفی میگردد. جهت استفاده از آن خدمت به روی آن کلیک کنید و
                        جهت استفاده از سایر امکانات از آیکون های پایین هر خدمت وارد شوید</p>

                </div>),
        },
        {
            selector: '.second-step',
            content: ({goTo, inDOM}) => (
                <div className="user_guid_bx"><h4>شناسنامه خدمت</h4>
                    <p>اطلاعات جزئی تر به همراه چارت گردش کار و مدارک مورد نیاز در این بخش نمایش داده می شود.</p>

                </div>),
        },
        {
            selector: '.third-step',
            content: ({goTo, inDOM}) => (
                <div className="user_guid_bx"><h4>شکایت خدمت</h4>
                    <p>برای شکایت خدمات شماره فرایند و پین را وارد نمایید. ضروری است در زمان ثبت درخواست موارد مذکور را
                        به خاطر بسپارید.</p>

                </div>
            ),
        },

    ];
    pid = 'setad';
    if (provinceTitle != null) {
        pid = provinceTitle;
        provinceTitle = 'logo-mnt-' + provinceTitle + '.png';

    } else
        provinceTitle = 'logo-mnt.png';
    return (
        <div className="service_table">

            <header id="header" className="animated fadeInDown">
                <img src="assets/img/motto.png" className="year_motto" alt=""/>
                {/*<div id="logo-group">*/}
                {/*    <span id="logo"> <img src={`assets/img/${provinceTitle}`} alt=""/> </span>*/}
                {/*</div>*/}
                <section className="header_items_bx">
                    <div>

                        <span className="pull-right"><a href="/help.pdf"><i className="fa fa-info"
                                                                            title="راهنمای کاربری "/></a> </span>

                        <a href="#/login"><i className="fa fa-user" title="ورود "></i> </a>
                        <div className="date_bx_style">&nbsp;</div>
                    </div>
                    <div className="leader_logo_bx">
                        <img src="assets/img/pic1.jpg" alt=""/>
                        <img src="assets/img/pic2.jpg" alt=""/>
                        <img src="assets/img/pic3.jpg" alt=""/>
                    </div>
                </section>
            </header>
            <div id="desk-main">
                <div id="content" className="container">
                    <div className="row">
                        <div className="col-xs-12 ">
                            <div className="row">

                                <div className="col-md-9">
                                    <div className="service_table_index_bx first-step">
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
                                                                            <label onClick={(event, id) => ToggleFilter(event, y.id)}>
                                                                            <input type="checkbox"/> {y.title}
                                                                            </label>
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
                                        {services.map(x => {
                                            if (x.id != 888)
                                                return <div key={x.id} className="col-xs-12 col-sm-4" style={customStyle}>
                                                    <div className="service_item_bx">
                                                        <a href={x.type === "0" ? (x.web.startsWith('http') ? x.web : 'http://' + x.web) : config.iframeServer + x.web + '?kid=' + x.id + '&pid=' + pid}
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
                                                                           title={x.mobileApp}></i>
                                                                    </a>
                                                                }
                                                                {(x.web === undefined || x.web === null || x.web == '') ? null :
                                                                    <a href={x.type === "0" ? (x.web.startsWith('http') ? x.web : 'http://' + x.web) : config.iframeServer + x.web + '?kid=' + x.id + '&pid=' + pid}
                                                                       target="_blank"> <i className="fa fa-globe"
                                                                                           title={x.type === "0" ? (x.web.startsWith('http') ? x.web : 'http://' + x.web) : config.iframeServer + x.web + '?kid=' + x.id + '&pid=' + pid}></i></a>
                                                                }
                                                                {(x.sms === undefined || x.sms === null || x.sms == '') ? null :
                                                                    <a href={x.sms}>
                                                                        <i className="fa fa-comment-o"
                                                                           title={x.sms}></i>
                                                                    </a>
                                                                }

                                                            </div>

                                                            <div>
                                                                <h3 className="service_name_style" style={serviceNameStyle}>{x.title}</h3>

                                                            </div>
                                                            <div className="service_btn_orginal_bx">
                                                                <a data-toggle="modal"
                                                                   data-target="myModal"
                                                                   className="btn btn-sm btn-default"
                                                                   onClick={e => itemCredential(x.id)}
                                                                >
                                                                    شناسنامه
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
                                                                        <a href={state.messageUrl + '?kid=' + x.id + '&pid=' + pid}
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
                                        }
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="aside_service_table">

                                        <div>
                                            <section id="carousel" className="service_info_slider_bx">
                                                <div>
                                                    <div className="carousel slide" id="fade-quote-carousel"
                                                         data-ride="carousel" data-interval="3000">
                                                        <div className="carousel-inner">
                                                            <div className="active item">
                                                                <div className="services_info_item_bx">
                                                                    {/*<img src="../../../../assets/img/service-check.png"*/}
                                                                    {/*     className=""/>*/}
                                                                    <p>ثبت درخواست</p>
                                                                </div>

                                                            </div>
                                                            <div className="item">
                                                                <div className="services_info_item_bx">
                                                                    <img src="../../../../assets/img/service-track.png"
                                                                         className=""/>
                                                                    <p>شکایت</p>
                                                                </div>

                                                            </div>
                                                            <div className="item">
                                                                <div className="services_info_item_bx">
                                                                    <img src="../../../../assets/img/service-law.png"
                                                                         className=""/>
                                                                    <p>دستورالعمل</p>
                                                                </div>

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </section>
                                            <h5 className="service_use_title">شهروند گرامی!</h5>
                                            <p className="service_info_descript"><i
                                                className="fa fa-quote-right"></i> در راستای احترام به حقوق شهروندی در
                                                نظام اداری و به اعتبار چشم انداز خود به عنوان سازمانی «چابک، هوشمند،
                                                قانون مدار و پاسخگو » خود را مکلف به ارائه خدمات به موقع، سریع و آسان به
                                                ارباب رجوع می دانیم، از همین رو به جهت ارتقاء رضایت مندی شما مراجعه
                                                کنندگان گرامی مفتخر هستیم این خدمات را در قالب میزخدمت الکترونیکی در
                                                اختیار شما قرار دهیم.
                                                <i className="fa fa-quote-left"></i>
                                            </p>
                                            <a href="#/login" className="login_btn_style"><i
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
                                    </div>

                                    <div className="aside_service_table" style={{marginTop:"5px"}}>
                                        <div style={{margin: '10px',paddingRight: '5px',paddingTop: '5px'}}>
                                            <p>تعداد بازديد امروز : {state.visit.today} </p>
                                            <p>تعداد بازديد ديروز  : {state.visit.yesterday}</p>
                                            <p>تعداد بازديد ماه جاری : {state.visit.currentMonth}</p>
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
            <Modal show={state.show} onHide={e => handleClose()} size="lg" width="90%">
                <Modal.Header>
                    <Modal.Title>شناسه خدمت</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Tabs
                        id="controlled-tab-example"
                        activeKey={state.selectedKey}
                        onSelect={(k) => setKey(k)}
                    >
                        <Tab eventKey="id" title="شناسه خدمت">
                            {/* <div className="col-sm-8"> */}
                            <div className="row">
                                <div className="col-sm-8">
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
                                    <p><span
                                        style={{fontSize: 14}}>تعداد دفعات مراجعه: </span> {state.CurrentInfo === null ? "" : state.CurrentInfo.AttendanceFrequency}
                                    </p>
                                    <p><a
                                        href={state.CurrentInfo === null ? "" : (config.iframeServer + state.CurrentInfo.ServiceIdentity)}
                                        className="service_flowchart">دانلود شناسنامه</a></p>
                                </div>
                                <div className="col-sm-4">
                                    <Accordion>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon/>}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                        >
                                            مدت زمان ارایه خدمت
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            {state.CurrentInfo === null ? "" : state.CurrentInfo.Duration}


                                        </AccordionDetails>
                                    </Accordion>
                                    <Accordion>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon/>}
                                            aria-controls="panel2a-content"
                                            id="panel2a-header"
                                        >
                                            هزینه ها
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            {state.CurrentInfo == null ? "" : state.CurrentInfo.Cost == null ? "" : state.CurrentInfo.Cost.map(c => {
                                                return (
                                                    <div>
                                                        <span
                                                            style={{fontSize: 14}}>{c.TXT_COST_TITLE}</span> : <span>{c.TXT_COST}</span>
                                                        <br/>
                                                    </div>
                                                )
                                            })}
                                        </AccordionDetails>
                                    </Accordion>
                                    <Accordion>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon/>}
                                            aria-controls="panel2a-content"
                                            id="panel2a-header"
                                        >
                                            مدارک مورد نیاز
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            {state.CurrentInfo === null ? "" : state.CurrentInfo.RequiredDocs}

                                        </AccordionDetails>
                                    </Accordion>
                                    <Accordion>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon/>}
                                            aria-controls="panel2a-content"
                                            id="panel2a-header"
                                        >
                                            سایر
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            {state.CurrentInfo === null ? "" : state.CurrentInfo.Other_info == null ? "" : state.CurrentInfo.Other_info.map(info => {
                                                return (
                                                    <div>
                                                        <span
                                                            style={{fontSize: 14}}>{info.TXT_KHEDMAT_TITLE}</span> : <span>{info.TXR_CONTENT}</span><br/>
                                                    </div>
                                                )
                                            })}
                                        </AccordionDetails>
                                    </Accordion>


                                </div>


                            </div>

                            {/* </div> */}
                            {/* <div className="col-sm-4">
                                            fuck
                                        </div> */}
                        </Tab>
                        <Tab eventKey="flow" title="فلوچارت خدمت">
                            <div style={{marginBottom: 20}}>
                                جهت دریافت فلوچارت <a
                                href={state.CurrentInfo === null ? "" : config.iframeServer + state.CurrentInfo.ChartAddress}
                                target="_blank"><strong>اینجا</strong></a> کلیک کنید
                            </div>

                            <img
                                src={state.CurrentInfo === null ? "" : config.iframeServer + state.CurrentInfo.ChartAddress}
                                className="service_flowchart img" id="ChartImage" onClick={showModal}/>
                        </Tab>
                        <Tab eventKey="data" title="مدارک مورد نیاز">
                            {state.CurrentInfo.RequiredDocs}npm

                        </Tab>

                    </Tabs>
                </Modal.Body>

            </Modal>

            <div className="modal fade" id="myModal" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel"
                 aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-hidden="true">
                                &times;
                            </button>
                            <h4 className="modal-title" id="myModalLabel">{props.t('شناسنامه خدمت')}</h4>
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
                                        <p><span
                                            style={{fontSize: 14}}>تعداد دفعات مراجعه: </span> {state.CurrentInfo === null ? "" : state.CurrentInfo.AttendanceFrequency}
                                        </p>
                                        <p><a
                                            href={state.CurrentInfo === null ? "" : (config.iframeServer + state.CurrentInfo.ServiceIdentity)}
                                            className="service_flowchart">دانلود شناسنامه</a></p>
                                    </div>

                                    <div className="col-sm-4">
                                        <div className="panel-group" id="accordion" role="tablist"
                                             aria-multiselectable="true">

                                            <div className="panel panel-default">
                                                <div className="panel-heading" role="tab" id="headingThree">
                                                    <h4 className="panel-title">
                                                        <a className="collapsed" role="button" data-toggle="collapse"
                                                           data-parent="#accordion" href="#collapse1"
                                                           aria-expanded="true" aria-controls="collapse1">
                                                            <span style={{fontSize: 14}}>  مدت زمان ارائه خدمت </span><i
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
                                <div className="text-center tab-pane padding-top-0" id="tab_query_2">
                                    <div style={{marginBottom: 20}}>
                                        جهت دریافت فلوچارت <a
                                        href={state.CurrentInfo === null ? "" : config.iframeServer + state.CurrentInfo.ChartAddress}
                                        target="_blank"><strong>اینجا</strong></a> کلیک کنید
                                    </div>

                                    <img
                                        src={state.CurrentInfo === null ? "" : config.iframeServer + state.CurrentInfo.ChartAddress}
                                        className="service_flowchart img" id="ChartImage" onClick={showModal}/>
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
                                <div className="text-left tab-pane padding-top-0" id="tab_query_4">
                                    <ServiceStatement/>
                                </div>
                            </div>

                        </div>
                    </div>
                    {/* /.modal-content */}
                </div>
                {/* /.modal-dialog */}
            </div>

            <div className="modal fade" id="myTrackerModal" tabIndex="-1" role="dialog" aria-labelledby="myTrackerLabel"
                 aria-hidden="true">
                <div className="modal-dialog modal-md">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-hidden="true">
                                &times;
                            </button>
                            <h4 className="modal-title" id="myModalLabel">{props.t('شکایت')}</h4>
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
                                            <select className="tracker_itm_drpdwn" onChange={RateServiceChanged}
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
                                                <label className="add_service_lable"
                                                       >
                                                    <textarea className="add_service_txtbx survey_txtarea"
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

    function itemCredential(id) {
        props.handle_variables({
            selectedKey: 'id'
        })
        get_service_info(config.apiServer,id).then(res => {
            props.handle_variables({
                serviceInfo: state.serviceInfo.concat(res),
                CurrentInfo: res,
                show: true
            })
        })
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
        props.handle_variables({searchFilter: e.target.value})
    }

    function closeTour() {
        props.handle_variables({isTourOpen: false})
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

        let data = {
            feedback: JSON.stringify({
                isNew: true,
                isDeleted: false,
                sid: state.rating.serviceId,
                val: state.rating.value,
                mes: state.rating.text
            })
        };

        post_service_feedback(config.apiServer,data).then(res => {
            $("#myTrackerModal").modal('hide');

        });
    }

    function itemTracker(id) {
        let rate = state.rating;
        rate.serviceId = id;
        props.handle_variables({rating: rate});
    }


}




export default compose(withTranslation(), connect(null, service.actions))(ServiceDeskFront);