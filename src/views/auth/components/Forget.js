import React, {useContext, useEffect, useRef, useState} from 'react';
import UiValidate from '../../../common/forms/validation/UiValidate';
import $ from 'jquery';
import * as auth from "../_redux/authRedux";
import {connect, useSelector} from "react-redux";
import {compose} from "redux";
import {withTranslation} from "react-i18next";
import {BeatLoader} from "react-spinners";
import {AppConfig} from "../../../appConfig";
import {get_verification_code, post_verification_code} from "../_redux/authCrud";
import {toast} from "react-toastify";
import {useHistory} from "react-router-dom";

function Forget(props) {
    const [isLoginLoading, setIsLoginLoading] = useState(false);
    const [expireDate, setExpireDate] = useState("");
    const config = useContext(AppConfig);
    const state = useSelector(state => state.auth)
    const logoURL =config.logoImage? (config.baseUrl+ config.logoImage) : "../../../../assets/img/Asset%202.png";
    let history = useHistory ();

    useEffect(()=>{
        props.handle_variables({
            VerificationCode:'',
            NewPassword:'',
            NewPasswordConfirm:''
        })
    },[])

    const handleSubmit = evt => {
        setIsLoginLoading(true)
        evt.preventDefault();
        get_verification_code(config.apiServer, state.username).then(res => {
            setExpireDate(res.expire_at)
            toast.success(props.t(props.t(res.message)));
        }).catch((xhr) => {
            toast.error(props.t(props.t(JSON.parse(xhr.responseText).error.message)));
        }).then(() => {
            setIsLoginLoading(false)
        });
        return false;
    };

    const handleVerificationCode = evt => {
        evt.preventDefault()
        //Check if passwords are match
        if(state.NewPassword !== state.NewPasswordConfirm){
            toast.error(props.t(" password and password confirm does not match"));
            return 0;
        }
        //Check if password is string enough
        else if(checkPasswordFormat(state.NewPassword) === false){
            toast.error(props.t("Password is not strong enough"));
            return 0;
        } else {
            setIsLoginLoading(true)
            let data ={
                username:state.username,
                code:state.VerificationCode,
                password:state.NewPassword,
                password_confirm:state.NewPasswordConfirm
            };
            post_verification_code(config.apiServer, data).then(res => {
                toast.success(props.t(props.t(res)));
                history.push('login')

            }).catch((xhr) => {
                toast.error(props.t(props.t(JSON.parse(xhr.responseText).error.message)));
            }).then(() => {
                setIsLoginLoading(false)
            });
            return false;
        }


    };

    const usernameChange = event => {
        props.handle_variables({
            username: event.target.value,
        });
    };

    const checkPasswordFormat = (password) => {
        const pattern = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
        return pattern.test(password);
    }

        return (
            <div id="extr-page" className="login_noscrol" style={config.backgroundImage!=undefined?{backgroundImage:`url(${config.backgroundImage})`}:{}}>
            <div id="main" role="main" className="animated fadeInDown">
                <div id="content2" className="container">
                    <div className="row login-container">
                        <div className="col-lg-12">
                            <div className="well no-padding login_bx_style">
                                <UiValidate>
                                    {expireDate === "" ?
                                        <form
                                            action=""
                                            id="login-form"
                                            className="smart-form client-form"
                                            onSubmit={handleSubmit}
                                        >
                                            <header>
                                                <img
                                                    src={logoURL}
                                                    className="ligin_logo_img"
                                                />
                                                <p className="login_title_app">{config.loginPageAppTitle}</p>
                                                <p className="login_org_name">{config.loginPageOrgName}</p>
                                            </header>
                                            <fieldset>
                                                <section>
                                                    <h4 className={'text-center'}>{props.t('Forget Password')}</h4>
                                                    <h6 className={'text-center'}>{props.t('Please insert your username')}</h6>
                                                </section>
                                                <section>
                                                    <label className="input">
                                                        <i className="icon-append fa fa-mobile"/>
                                                        <input
                                                            onChange={usernameChange}
                                                            type="text"
                                                            name="form[USR_USERNAME]"
                                                            dir="ltr"
                                                            placeholder={props.t('username')}
                                                            data-smart-validate-input=""
                                                            data-required=""
                                                            data-message-required={props.t('Please insert username')}
                                                        />
                                                        <b className="tooltip tooltip-top-right">
                                                            <i className="fa fa-user txt-color-teal"/>
                                                            {props.t('Please insert username')}
                                                        </b>
                                                    </label>
                                                </section>
                                            </fieldset>
                                            <footer>
                                                <button type="submit" className="btn_login_page"
                                                        disabled={isLoginLoading}>
                                                    {props.t('Send Verification Code')}
                                                    <div id="load-container">
                                                        {isLoginLoading ? <div className="load-holder">
                                                            <BeatLoader color={'#fff'} size={18} margin={3}/>
                                                        </div> : null}
                                                    </div>
                                                </button>
                                                <div className={'text-center'}>
                                                    <a href={"#/login"}>{props.t('Return to Login')}</a>
                                                </div>
                                            </footer>
                                        </form>
                                        :
                                        <form
                                            action=""
                                            id="login-form"
                                            className="smart-form client-form"
                                            onSubmit={handleVerificationCode}
                                        >
                                            <header>
                                                <img
                                                    src={logoURL}
                                                    className="ligin_logo_img"
                                                />
                                                <p className="login_title_app">{config.loginPageAppTitle}</p>
                                                <p className="login_org_name">{config.loginPageOrgName}</p>
                                            </header>
                                            <fieldset>
                                                <section>
                                                    <h6 className={'text-center'}>{props.t('Please insert your code')}</h6>
                                                </section>
                                                <section>
                                                    <label className="input">
                                                        <i className="icon-append fa fa-code"/>
                                                        <input
                                                            onChange={(e)=>props.handle_variables({VerificationCode:e.target.value})}
                                                            type="number"
                                                            dir="ltr"
                                                            placeholder={props.t('Code')}
                                                            data-smart-validate-input=""
                                                            data-required=""
                                                            value={state.VerificationCode}
                                                            data-message-required={props.t('Please insert code')}
                                                        />
                                                        <b className="tooltip tooltip-top-right">
                                                            <i className="fa fa-user txt-color-teal"/>
                                                            {props.t('Please insert code')}
                                                        </b>
                                                    </label>
                                                </section>
                                                <section>
                                                    <label className="input">
                                                        <i className="icon-append fa fa-key"/>
                                                        <input
                                                            onChange={(e)=>props.handle_variables({NewPassword:e.target.value})}
                                                            type="password"
                                                            dir="ltr"
                                                            autoComplete={'new-password'}
                                                            placeholder={props.t('Password')}
                                                            data-smart-validate-input=""
                                                            data-required=""
                                                            data-message-required={props.t('Please insert new password')}
                                                        />
                                                        <b className="tooltip tooltip-top-right">
                                                            <i className="fa fa-user txt-color-teal"/>
                                                            {props.t('Please insert new password')}
                                                        </b>
                                                    </label>
                                                </section>
                                                <section>
                                                    <label className="input">
                                                        <i className="icon-append fa fa-key"/>
                                                        <input
                                                            onChange={(e)=>props.handle_variables({NewPasswordConfirm:e.target.value})}
                                                            type="password"
                                                            dir="ltr"
                                                            placeholder={props.t('Password confirm')}
                                                            data-smart-validate-input=""
                                                            data-required=""
                                                            data-message-required={props.t('Please new password confirm')}
                                                        />
                                                        <b className="tooltip tooltip-top-right">
                                                            <i className="fa fa-user txt-color-teal"/>
                                                            {props.t('Please insert code')}
                                                        </b>
                                                    </label>
                                                </section>
                                            </fieldset>
                                            <footer>
                                                <button type="submit" className="btn_login_page"
                                                        disabled={isLoginLoading}>
                                                    {props.t('Verify Code')}
                                                    <div id="load-container">
                                                        {isLoginLoading ? <div className="load-holder">
                                                            <BeatLoader color={'#fff'} size={18} margin={3}/>
                                                        </div> : null}
                                                    </div>
                                                </button>
                                                <div className={'text-center'}>
                                                    <a href={"#/login"} onClick={()=>{
                                                        history.push('login')
                                                    }
                                                    }>{props.t('Return to Login')}</a>
                                                </div>
                                            </footer>
                                        </form>
                                    }

                                </UiValidate>
                            </div>
                            <a href="http://arian.co.ir" className="login_footer_info">
                                <img src="../../../../assets/img/Asset%2019.png"/>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default compose(
    withTranslation(),
    connect(null, auth.actions)
)(Forget);