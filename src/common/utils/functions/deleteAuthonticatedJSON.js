import $ from 'jquery';
export default function(url){
    let myToken = localStorage.getItem('access_token');
    return new Promise((resolve, reject)=>{
        $.ajax({
            type: "DELETE",
            url: url,
            dataType: 'json',
            beforeSend: setHeader
        }).then(function (data) {
            resolve(data)
        }).fail(function(Object) {
            if(Object.status === 200){
                resolve(Object.status);
            } else {
                reject(Object);
            }
        });
    });
    function setHeader(xhr) {
        xhr.setRequestHeader('Authorization', 'Bearer '+myToken);
    }
}
