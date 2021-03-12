import _ from 'lodash';
const axios = require('axios');
const qs = require('qs');

window.config = {
    domain : 'https://www.ilvcode.cn',
    project : '/web',

    // domain : 'http://localhost:8011',
    // project : '/web',
};

window.cookieValue = function(name){
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
};

window.cookieDelete = function(name){
    document.cookie = name+"=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT";
};

(function(w){
  var formRequest = function(url,data,errCallBack,callBack){
    this.url = url;
    this.data = data;
    this.errCallBack = errCallBack;
    this.callBack = callBack;
    this.init();
  };
  formRequest.prototype = {
    init : function(){
        var obj = this;
        axios({
            headers: {
                "Content-Type" : "application/x-www-form-urlencoded; charset=UTF-8",
                "X-XSRF-TOKEN" : window.cookieValue("XSRF-TOKEN")
            },
            url : obj.url,
            method : "POST",
            data : qs.stringify(obj.data)
        }).then(function(response){
            if(obj.callBack != null){
                obj.callBack(response.data);
            }
        }).catch(function(error){
            console.info(error);
            if(obj.errCallBack != null){
                obj.errCallBack();
            }
        });
    }
  };
  w.formRequest = formRequest;
})(window);