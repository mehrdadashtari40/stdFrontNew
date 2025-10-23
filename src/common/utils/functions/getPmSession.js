
import { config } from "../../../config/config";
import $ from 'jquery';
export default function () {

    let myToken = localStorage.getItem('access_token');
   console.log('url', config.apiServer + "extrarest/session-id");
    $.ajax({
        type: "GET",
        url: config.apiServer + "extrarest/session-id",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + myToken);
        }
    })
        .done(function (data) {
            if (data) {
                localStorage.setItem("session_id", data);
                return data;
            }
        })
        .fail(function () {
            localStorage.setItem("session_id", '');
            return '';
        });

}