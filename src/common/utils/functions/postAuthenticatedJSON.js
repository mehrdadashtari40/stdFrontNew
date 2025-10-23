/**
 * Created by griga on 11/19/16.
 */

import React from 'react'
import * as ReactDOM from "react-dom";
import {BarLoader, RingLoader} from "react-spinners";
import $ from 'jquery';
import store from '../../../store/configureStore';
import {actions} from '../../layout/_redux/layoutRedux';
export default function(url,data){
    let myToken = localStorage.getItem('access_token');


    return new Promise((resolve, reject)=>{
        store.dispatch(actions.change_loading(1))
        $.ajax({
            type: "POST",
            url: url,
            data:JSON.stringify(data),
            dataType: 'json',
            beforeSend: setHeader
        }).done(function (data) {
            resolve(data)
        })
            .fail(reject)
            .always(function (){
                store.dispatch(actions.change_loading(-1))
            });
    });
    function setHeader(xhr) {
        xhr.setRequestHeader('Authorization', 'Bearer '+myToken);
        xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    }
}
