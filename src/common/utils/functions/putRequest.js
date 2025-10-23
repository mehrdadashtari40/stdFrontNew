/**
 * Created by griga on 11/19/16.
 */

import request from 'then-request'
import React from 'react'
import * as ReactDOM from "react-dom";
import {BarLoader, HashLoader} from "react-spinners";
import {smallBox} from "./message";
import $ from "jquery";
export default function(url,options,callback){
   
    return new Promise((resolve, reject)=>{
        $.ajax({
            type: "PUT",
            url: url,
            data:JSON.stringify(options),
            dataType : "json",
            contentType: "application/json; charset=utf-8",
        }).done(function (data) {
            resolve(data)
        })
            .fail((res)=>{
                smallBox({
                    title: 'خطا',
                    content: "<i>"+ res +"</i>",
                    color: "#e04362",
                    iconSmall: "fa fa-check fa-2x fadeInRight animated",
                    timeout: 4000
                });
                reject();
            })
            .always(function (){
            });
    })
}
