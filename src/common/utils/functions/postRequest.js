/**
 * Created by griga on 11/19/16.
 */
import React from 'react'
import request from 'then-request'
import * as ReactDOM from "react-dom";
import {BarLoader, HashLoader} from "react-spinners";
import { smallBox } from './message';

export default function(url,options,callback){


    return new Promise((resolve, reject)=>{
    request('POST', url, options,callback).then((res)=> {
      resolve(JSON.parse(res.getBody()));
    }).catch((res) => {
        smallBox({
            title:'خطا',
            content: "<i>"+ 'مشکلی در ثبت اطلاعات در سیستم به وجود آمده است ، لطفا مجددا تلاش کنید.' +"</i>",
            color: "#e04362",
            iconSmall: "fa fa-check fa-2x fadeInRight animated",
            timeout: 4000
        })
    }).done(function () {
        })

  })
}
