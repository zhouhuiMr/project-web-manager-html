import _ from 'lodash';
// import '../../css/login/login.css';
import Vue from 'vue';

window.app = new Vue({
    el : "#app",
    data : {
        userNameLine : {
            'spin_line_select' : false,
            'spin_line_unselect' : false
        },
        passwordLine : {
            'spin_line_select' : false,
            'spin_line_unselect' : false
        },
        authCodeLine : {
            'spin_line_select' : false,
            'spin_line_unselect' : false
        },
        userNameSize : {
            'label_large' : false,
            'label_small' : false,
        },
        passwordSize : {
            'label_large' : false,
            'label_small' : false,
        },
        authCodeSize : {
            'label_large' : false,
            'label_small' : false,
        },
        loginForm : {
            userName : "",
            password : "",
            authCode : ""
        },
        authCodeUrlAction : "/action/user/imageAuthCode",
        authCodeUrl : config.domain + config.project + "/action/user/imageAuthCode",
        errorMsg : "",
        fullscreenLoading : false
    },
    methods: {
        userLogin : function(){
            userLogin();
        },
        refreshAuthCode : function(){
            this.authCodeUrl = config.domain + config.project + this.authCodeUrlAction + "?v=" + Math.random();
        },
        selectInput : function(value){
            app.errorMsg = "";
            //选择输入框
            if(value == 0){
                //用户名
                this.userNameLine = {
                    'spin_line_select' : true,
                    'spin_line_unselect' : false
                };
                this.userNameSize = {
                    'label_large' : false,
                    'label_small' : true
                };
            }else if(value == 1){
                //密码
                this.passwordLine = {
                    'spin_line_select' : true,
                    'spin_line_unselect' : false
                };
                this.passwordSize = {
                    'label_large' : false,
                    'label_small' : true
                };
            }else {
                this.authCodeLine = {
                    'spin_line_select' : true,
                    'spin_line_unselect' : false
                };
                this.authCodeSize = {
                    'label_large' : false,
                    'label_small' : true,
                };
            }
        },
        blurInput : function(value){
            if(value == 0){
                //用户名
                this.userNameLine = {
                    'spin_line_select' : false,
                    'spin_line_unselect' : true
                };
                if(this.loginForm.userName == null || this.loginForm.userName == ""){
                    this.userNameSize = {
                        'label_large' : true,
                        'label_small' : false
                    };
                }
            }else if(value == 1){
                this.passwordLine = {
                    'spin_line_select' : false,
                    'spin_line_unselect' : true
                };
                if(this.loginForm.password == null || this.loginForm.password == ""){
                    this.passwordSize = {
                        'label_large' : true,
                        'label_small' : false
                    };
                }
            }else{
                this.authCodeLine = {
                    'spin_line_select' : false,
                    'spin_line_unselect' : true
                };
                if(this.loginForm.authCode == null || this.loginForm.authCode == ""){
                    this.authCodeSize = {
                        'label_large' : true,
                        'label_small' : false
                    };
                }
            }
        }
    },
    mounted() {

    }
});

document.onkeydown = function(e){
    var ev = document.all ? window.event : e;
    if(ev.keyCode == 13){
        userLogin();
    }
};

/**
 * 用户登录的功能
 *
 * @author zhouhui
 * @since 20210202
 */
function userLogin(){
    if(app.loginForm.userName == null || app.loginForm.userName == ""){
        app.errorMsg = "请输入用户名！";
        return;
    };
    if(app.loginForm.password == null || app.loginForm.password == ""){
        app.errorMsg = "请输入密码！";
        return;
    };
    if(app.loginForm.authCode == null || app.loginForm.authCode == ""){
        app.errorMsg = "请输入验证码！";
        return;
    };

    app.fullscreenLoading = true;
    var url = config.domain + config.project + "/action/user/login";
    var data = {
        "authCode" : app.loginForm.authCode,
        "code" : app.loginForm.userName,
        "password" : app.loginForm.password,
        "sessionId" : cookieValue("SESSIONID")
    };
    new formRequest(url,data,function(){
        app.fullscreenLoading = false;
        app.errorMsg = "服务器异常，请稍后重试！";
    },function(data){
        console.info(data);
        app.fullscreenLoading = false;
        if(data.code == "0000"){
            window.location.href = "main.html";
        }else{
            app.errorMsg = data.message;
            app.authCodeUrl = config.domain + config.project + app.authCodeUrlAction + "?v=" + Math.random();
            if(data.code == "0007"){
                app.loginForm.authCode = "";
            }else if(data.code == "0008"){
                app.loginForm.authCode = "";
                app.loginForm.userName = "";
                app.loginForm.password = "";
            }
        }
    });
}