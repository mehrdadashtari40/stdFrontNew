//change to the address and workspace of your ProcessMaker server:
//var restServer = "http://192.168.1.77:2803/workflow/";
/**
 * Created by griga on 11/19/16.
 */
import React from 'react';
import { config } from '../../../config/config';
import * as ReactDOM from 'react-dom';
import { BeatLoader } from 'react-spinners';
import getPmSession from './getPmSession';
import $ from 'jquery';

import { smallBox } from './message';
export default function(url, username, password,clientId,clientSecret, callback,failCallback) {
	$.ajax({
		type: 'POST',
		url: url + 'oauth2/token',
		dataType: 'json',
		// insecure example of data to obtain access token and login:
		data: {
			grant_type: 'password',
			scope: '*',
			client_id: clientId,
			client_secret: clientSecret,

			username: username,
			password: password,
		},
	})
		.done(function(data) {
			if (data.error) {
				smallBox({
                    title: 'مشکلی در اتصال به وجود آماده ، لطفا دوباره سعی کنید',
					//content: "<i>"+ data.error +"</i><br/><p>" + data.error_description + "</p>",
					color: '#e04362',
					iconSmall: 'fa fa-check fa-2x fadeInRight animated',
					timeout: 4000,
				});
			} else if (data.access_token) {
				//Can call REST endpoints here using the data.access_token.

				//To call REST endpoints later, save the access_token and refresh_token
				//as cookies that expire in one hour
				var d = new Date();
				d.setTime(d.getTime() + data.expires_in);
				localStorage.setItem('access_token', data.access_token);
				localStorage.setItem('refresh_token', data.refresh_token);
				localStorage.setItem('expires_in', d.toUTCString());
				getPmSession();
				callback();
			} else {
				alert(data.error_description); //for debug
				smallBox({
					title: 'مشکلی در اتصال به وجود آماده ، لطفا دوباره سعی کنید',
					//content: "<i>"+ data.error +"</i><br/><p>" + data.error_description + "</p>",
					color: '#e04362',
					iconSmall: 'fa fa-check fa-2x fadeInRight animated',
					timeout: 4000,
				});
			}
		})
		.fail(function(data, statusText, xhr) {
			if(data.responseJSON !== undefined &&  data.responseJSON.error_description === "Invalid username and password combination") {
				smallBox({
					title: 'لطفا نام کاربری یا رمز عبور خود را به درستی وارد کنید',
					//content: "<i>"+ statusText +"</i><br/><p>" + data.error_description + "</p>",
					color: "#e04362",
					iconSmall: "fa fa-check fa-2x fadeInRight animated",
					timeout: 4000
				});
				failCallback();

			} else {
				smallBox({
					title: 'مشکلی در اتصال به وجود آماده ، لطفا دوباره سعی کنید',
					//content: "<i>"+ statusText +"</i><br/><p>" + data.error_description + "</p>",
					color: '#e04362',
					iconSmall: 'fa fa-check fa-2x fadeInRight animated',
					timeout: 4000,
				});
				failCallback();
			}
		});
}
