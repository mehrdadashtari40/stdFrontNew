import React, {Component, forwardRef, useEffect, useImperativeHandle} from 'react';
import './Captcha.css';
import {compose} from "redux";
import {withTranslation} from "react-i18next";
import {connect, useSelector} from "react-redux";
import * as auth from "../_redux/authRedux";

function Captcha(props) {
    const state = useSelector(state => state.auth)
    const createCaptcha = () => {
    	let elm = document.getElementById('captcha');
    	if(elm != null){
			elm.innerHTML = "";
			// var charsArray = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@!#$%^&*";
			const charsArray = "0123456789";
			let lengthOtp = 5;
			let captcha = [];
			for (let i = 0; i < lengthOtp; i++) {
				let index = Math.floor(Math.random() * charsArray.length + 1); //get the next character from the array
				if (captcha.indexOf(charsArray[index]) === -1)
					captcha.push(charsArray[index]);
				else i--;
			}
			let canv = document.createElement("canvas");
			canv.id = "captcha";
			canv.width = 100;
			canv.height = 50;
			let ctx = canv.getContext("2d");
			ctx.font = "25px Georgia";
			ctx.strokeText(captcha.join(""), 0, 30);
			props.handle_variables({
				'captcha_code': captcha.join("")
			});
			elm.appendChild(canv); // adds the canvas to the body element
		}
    }
	useEffect(()=>{
		if (state.captcha_code === "") createCaptcha();
	})
	useEffect(()=>{
		createCaptcha();
	},[])

    return (
        <section>
            <label className="input">
                <div className="box">
                    <i className="fa fa-refresh fa-2x" onClick={createCaptcha}></i>
                    <div id="captcha"></div>
                </div>
                {/*<p id="captchaCode" className="hidden">{this.state.code}</p>*/}
                <input type="text" placeholder={props.t('Captcha')} id="cpatchaTextBox" dir="ltr" autoComplete="off"/>
            </label>
        </section>
    );
}

export default compose(
	withTranslation(),
    connect(null, auth.actions)
)(Captcha);