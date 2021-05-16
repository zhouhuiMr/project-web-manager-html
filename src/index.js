import _ from 'lodash';
import {writerInfo} from './js/language-docs.js';
const axios = require('axios');
const qs = require('qs');

window.config = {

    domain : 'http://localhost:8011',
    project : '/web',
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

window.loginToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjb2RlIjoiYWRtaW4iLCJyb2xlcyI6WzEsMl0sImlzcyI6IndlYiIsInVzZXJUeXBlIjoiMSIsImV4cCI6MTYyMTEyMTY1MCwidXNlcklkIjoxfQ.ZoCBZ8qNnb2EVfrza6mQJ4xO62Gvh4FaJejVgFS3h8c";
// window.loginToken = cookieValue("LOGIN-TOKEN");


window.writerInfo = writerInfo;
window.language = "zh";

/**
 * 页面宽度、高度的信息
 */
window.pageSizeMsg = {
    width : document.body.clientWidth,
    height : document.body.clientHeight
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
                "X-XSRF-TOKEN" : window.cookieValue("XSRF-TOKEN"),
                "LOGIN-TOKEN" : window.loginToken
            },
            url : obj.url,
            method : "POST",
            data : qs.stringify(obj.data)
        }).then(function(response){
            if(obj.callBack != null){
                obj.callBack(response.data);
            }
        }).catch(function(error){
            if(obj.errCallBack != null){
                obj.errCallBack();
            }else{
                app.$alert(writerInfo.requestError[language], {
                    confirmButtonText: writerInfo.bt_requestErrorConfirm[language],
                    type : 'error'
                });
            }
        });
    }
  };
  w.formRequest = formRequest;

  var formJsonRequest = function(url,data,errCallBack,callBack){
      this.url = url;
      this.data = data;
      this.errCallBack = errCallBack;
      this.callBack = callBack;
      this.init();
  };

  formJsonRequest.prototype = {
      init : function(){
          var obj = this;
          axios({
              headers: {
                  "Content-Type" : "application/json; charset=UTF-8",
                  "X-XSRF-TOKEN" : window.cookieValue("XSRF-TOKEN"),
                  "LOGIN-TOKEN" : window.loginToken
              },
              url : obj.url,
              method : "POST",
              data : obj.data
          }).then(function(response){
              if(obj.callBack != null){
                  obj.callBack(response.data);
              }
          }).catch(function(error){
              if(obj.errCallBack != null){
                  obj.errCallBack();
              }else{
                  app.$alert(writerInfo.requestError[language], {
                      confirmButtonText: writerInfo.bt_requestErrorConfirm[language],
                      type : 'error'
                  });
              }
          });
        }
    };
    w.formJsonRequest = formJsonRequest;

  var htmlOfButton = function(app,callBack){
      this.url = config.domain + config.project + "/action/permission/buttonListOfHtml";
      this.callBack = callBack;
      this.app = app;
      this.init();
  };
  htmlOfButton.prototype = {
      init : function(){
          var obj = this;
          var param = {
              menuId : this.app.$route.query.menuId
          };
          new formRequest(this.url,param,null,function(data){
            if(obj.callBack != null){
                obj.callBack(data);
            }
          });
      }
  };
  w.htmlOfButton = htmlOfButton;

})(window);