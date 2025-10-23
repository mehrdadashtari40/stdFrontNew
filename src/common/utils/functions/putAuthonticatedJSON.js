import request from 'then-request'
//import $ from "../tables/Datatable";
import $ from 'jquery';
export default function(url,data){
    let myToken = localStorage.getItem('access_token');
    return new Promise((resolve, reject)=>{
        $.ajax({
            type: "PUT",
            url: url,
            data:data,
            dataType: 'json',
            beforeSend: setHeader
        }).then(function (data) {
            resolve(data)
        }).fail(function(Object) {
            if(Object.status === 200){
                resolve(Object.responseText);
            } else {
                reject();
            }
        });
    });
    function setHeader(xhr) {
        xhr.setRequestHeader('Authorization', 'Bearer '+myToken);
    }
}
