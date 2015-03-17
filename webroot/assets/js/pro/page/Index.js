define("util",["jquery"],function(){var e={};return e.DATE_DAY=864e5,e.DATE_HOUR=36e5,e.humanTime=function(t,n){typeof t=="string"&&(t=e.Str2date(t)),typeof n=="string"&&(n=e.Str2date(n));var r,i,s,o=Math.abs(n.getTime()-t.getTime())/1e3;return o>=31536e3?(r=o/31536e3,i=Math.round((r-Math.floor(r))*12),s=parseInt(r)+"年"+(i==0?"":i+"个月")):o>=2592e3?(r=o/2592e3,i=Math.round((r-Math.floor(r))*30),s=parseInt(r)+"个月"+(i==0?"":i+"天")):o>=86400?(r=o/86400,i=Math.round((r-Math.floor(r))*24),s=parseInt(r)+"天"+(i==0?"":i+"小时")):o>=3600?(r=o/3600,i=Math.round((r-Math.floor(r))*60),s=parseInt(r)+"小时"+(i==0?"":i+"分钟")):o>=60?(r=o/60,s=parseInt(r)+"分钟"):o<60&&(s=parseInt(o).toString()+"秒"),s},e.drawingActiveStatus=function(e,t){var n=t.user.id,r={is_js:!1,is_xmjl:!1,is_xmgl:!1,is_zt:!1,finish_js:!1,finish_xmjl:!1,finish_xmgl:!1,finish_zt:!1};return r.finish_xmjl=e.xmjl_sign_by>0,e.xmjl_id==n&&(r.is_xmjl=!0),r.finish_js=e.js_sign_by>0,t.draw_js_user_ids.indexOf(n.toString())>-1&&(r.is_js=!0),r.finish_sw=e.sw_sign_by>0,t.draw_sw_user_ids.indexOf(n.toString())>-1&&(r.is_sw=!0),r.finish_xmgl=e.xmgl_sign_by>0,t.draw_xmgl_user_ids.indexOf(n.toString())>-1&&(r.is_xmgl=!0),r.finish_zt=e.zt_sign_by>0,t.draw_zt_user_ids.indexOf(n.toString())>-1&&(r.is_zt=!0),r},e.userAvatar=function(e){return!e||e==""?e="/assets/img/avatar_empty.png":e="/upload/avatar/"+e,e},e.setTitle=function(e){e||(e=""),$("#gos-headerTitle").text(e),document.title=e},e.str2date=function(e){return e=e.replace(/[A-Za-z]/g," ").substr(0,19),new Date(Date.parse(e))},e.date2str=function(e,t){if(!e)return"";switch(typeof e){case"number":e=new Date(e);break;case"string":e=this.str2date(e)}return t&&t=="time"?e.getFullYear()+"-"+this.lpad(e.getMonth()+1,"0",2)+"-"+this.lpad(e.getDate(),"0",2)+" "+this.lpad(e.getHours(),"0",2)+":"+this.lpad(e.getMinutes(),"0",2):e.getFullYear()+"-"+this.lpad(e.getMonth()+1,"0",2)+"-"+this.lpad(e.getDate(),"0",2)},e.getUrlParameter=function(e){var t=window.location.search.substring(1),n=t.split("&");for(var r=0;r<n.length;r++){var i=n[r].split("=");if(i[0]==e)return i[1]}},e.cipherString=function(t,n,r){var i=new RSAKey,s=Server.getTime().toString(),o=CryptoJS.MD5(s+n);i.setPublic(t.hex,"10001");var u=i.encrypt(e.lpad(s,"0",16)+o.toString(CryptoJS.enc.Base64)),a=n+"|"+r,f=e.aesEncrypto(a,s,o),l=t.keyid.toString()+"|"+CryptoJS.enc.Hex.parse(u.toString()).toString(CryptoJS.enc.Base64)+"|"+f.toString();return l},e.aesEncrypto=function(t,n,r){n=n.toString();var i=CryptoJS.MD5(e.lpad(n,"0",16)),s=CryptoJS.AES.encrypt(t,r,{iv:i});return s.ciphertext.toString(CryptoJS.enc.Base64)},e.aesDecrypto=function(t,n,r){n=n.toString();var i=CryptoJS.MD5(e.lpad(n,"0",16)),s={ciphertext:CryptoJS.enc.Base64.parse(t),salt:""};return decrypted=CryptoJS.AES.decrypt(s,r,{iv:i}),decrypted.toString(CryptoJS.enc.Utf8)},e.lpad=function(e,t,n){while(e.toString().length<n)e=t+e;return e},e.rpad=function(e,t,n){while(e.toString().length<n)e+=t;return e},e.objectFind=function(e,t,n){if(!n)return null;var r,i=n.length;for(r=0;r<i;r++)if(n[r]&&n[r][e]==t)return n[r];return null},e.objectFindIndex=function(e,t,n){if(!n)return-1;var r,i=n.length;for(r=0;r<i;r++)if(n[r]&&n[r][e]==t)return r;return-1},e.setCookie=function(e,t,n){if(n){var r=new Date;r.setTime(r.getTime()+n*864e5);var i="; expires="+r.toGMTString()}else var i="";document.cookie=e+"="+t+i+"; path=/"},e.getCookie=function(e){var t=e+"=",n=document.cookie.split(";");for(var r=0;r<n.length;r++){var i=n[r];while(i.charAt(0)==" ")i=i.substring(1,i.length);if(i.indexOf(t)==0)return i.substring(t.length,i.length)}return null},e.deleteCookie=function(e){this.SetCookie(e,"",-1)},e.getNick=function(){if(this.currentNick)return this.currentNick;var e=decodeURIComponent(this.getCookie("PUB_gosauth")),t=e.split("|");return t.length>1?this.currentNick=t[0]:this.currentNick=e,this.currentNick},e.getSecret=function(){return decodeURIComponent(this.getCookie("secret"))},e.scopeFormData=function(e){var t,n,r,i={};for(n in e){if(n.charAt(0)=="$")continue;t=e[n];if(!t)continue;if(typeof t.$$parentForm!="undefined"&&t.$valid)for(r in t){if(r.charAt(0)=="$")continue;t[r]&&typeof t[r].$modelValue!="undefined"?i[r]=t[r].$modelValue:i[r]=t[r].$viewValue}}return i},e}),define("appData",["util"],function(e){function n(n){t["draw_"+n+"_users"]=[];var r,i=t["draw_"+n+"_user_ids"];for(var s=i.length-1;s>=0;s--)r=e.objectFind("id",i[s],t.all_users),r&&t["draw_"+n+"_users"].push(r)}var t={bindedUser:null,user:null,all_users:null,subjects:[],projects:[],draw_js_users:[],draw_sw_users:[],draw_xmgl_users:[],draw_xmjl_users:[],draw_zt_users:[],draw_js_user_ids:[],draw_sw_user_ids:[],draw_xmgl_user_ids:[],draw_xmjl_user_ids:[],draw_zt_user_ids:[]};return t.buildData=function(){n("js"),n("sw"),n("xmjl"),n("xmgl"),n("zt")},t}),define("ajax",["util","jquery"],function(e){var t={NewClient:function(e,t){return new n(e,t)},serverTime:{diff:0,set:function(e){this.diff=e>0?(new Date).getTime()-e*1e3:0},time:function(){return(new Date).getTime()-this.diff}},getHostName:function(){var e=window.location.host.split(".");return e[e.length-2]+"."+e[e.length-1]},getUrlVars:function(){var e=[],t,n=window.location.href.slice(window.location.href.indexOf("?")+1).split("&");for(var r=0;r<n.length;r++)t=n[r].split("="),e.push(t[0]),e[t[0]]=t[1];return e},datasetDecode:function(e){if(!e||e.length==0)return e;var t=e[0],n=e.length,r,i,s=[];for(var o=1;o<n;o++){r=new Object;for(var u=0;u<t.length;u++)r[t[u]]=e[o][u];s.push(r)}return s}},n=function(e,t){this.path=e||"/api/web",this._timeout=t||1e4,this._button=null,this._block=null};n.prototype.errorHandler=function(e){console.log(e)},n.prototype.button=function(e){return this._button=e,this},n.prototype.block=function(e){return this._block=e,this},n.prototype.sendAlone=function(e,t){if(this.deferred&&this.deferred.state()=="pending"){var n=function(){};return{done:n,fail:n,always:n}}return this.deferred=this.send(e,t),this.deferred},n.prototype.send=function(e,t){var n={method:e,args:t?t:null},r={type:"POST",dataType:"json",cache:!1,timeout:this._timeout},i=null;this._block&&this.doBusy(this._block,!0),this._button&&this.doDisable(this._button,!0);var s=this;return deferred=$.ajax({url:this.path,type:r.type,dataType:r.dataType,cache:r.cache,data:{src:JSON.stringify(n)},timeout:r.timeout}),deferred.always(function(){s._block&&s.doBusy(s._block,!1),s._button&&s.doDisable(s._button,!1)}).fail(function(e,t,n){switch(e.status){case 599:if(s.errorHandler)try{s.errorHandler(JSON.parse(e.responseText))}catch(r){console.log(r)}break;case 404:alert(t+": api not found!");break;default:alert(t+": "+e.responseText)}}),deferred},n.prototype.doDisable=function(e,t){typeof e=="string"&&(e=$(e)),e.attr("disabled",t?"disabled":null)},n.prototype.doBusy=function(e,t){var n,r;typeof e=="string"?n=$(e):n=e;var i={bgColor:"#CCCCCC",duration:200,opacity:.5};n.each(function(){var e=$(this);t?(r=$("<div></div>").css({"background-color":i.bgColor,opacity:i.opacity,width:e.width(),height:e.height(),position:"absolute",top:"0px",left:"0px","z-index":9999}),r=$('<div class="block-overlay"></div>').css({position:"relative"}).append(r),e.prepend(r.append('<div class="bloack-ui"></div>').fadeIn(i.duration))):(r=e.children(".block-overlay"),r.length>0&&r.remove())})};var r=function(){var e=document.createElement("bootstrap"),t={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd otransitionend",transition:"transitionend"};for(var n in t)if(e.style[n]!==undefined)return{end:t[n]};return!1};return $.fn.emulateTransitionEnd=function(e){var t=!1,n=this;$(this).one("bsTransitionEnd",function(){t=!0});var r=function(){t||$(n).trigger($.support.transition.end)};return setTimeout(r,e),this},$(function(){$.support.transition=r();if(!$.support.transition)return;$.event.special.bsTransitionEnd={bindType:$.support.transition.end,delegateType:$.support.transition.end,handle:function(e){if($(e.target).is(this))return e.handleObj.handler.apply(this,arguments)}}}),t}),define("loader",["util","jquery"],function(e){var t=$("#gos-goback"),n=$("#gos-headerBarR"),r=function(){this.defaultViewName="home.module";var r=$("#gos-Views");this.getViewName=function(e){var t=e.$$path=="/"?this.defaultViewName:e.$$path;return t.charAt(0)=="/"&&(t=t.substr(1)),t.replace(/\//g,".")},this.getViewPath=function(e){var t=this.getViewName();return t.replace(/\./g,"/")},this.buildHeader=function(r){r.goBackButton==0?t.hide():t.show(),r.headerHtml?n.html(r.headerHtml):n.empty(),e.setTitle(r.title)},this.loadview=function(e,t,n,r){var i={},s=n.defer(),o=this,u=t.substr(0,t.indexOf(".html"));return i[e]=u,require.config({paths:i}),require([e],function(t){if(t&&t.i18n){var n=r.language,i=e.split(".");n=n==""?"en_US":n,window._gos.transData=window._gos.transData||{},window._gos.transData[e]?s.resolve():$.getJSON(u.substr(0,u.indexOf(i.join("/")))+"/"+i[0]+"/locales/"+n+"/"+i[1]+".json").success(function(t){window._gos.transData[e]=t,s.resolve()}).fail(function(){n="en_US",$.getJSON(window._gos.srcPath+u+"/locales/"+n+"/"+typ+".json").success(function(t){window._gos.transData[e]=t,s.resolve()})})}else s.resolve();o.buildHeader(t)},function(e){s.reject()}),s.promise}};return new r}),window._gos=window._gos||{},define("app",["util","loader","angular","angular-route","angular-animate","angular-resource","jquery"],function(e,t){var n=angular.module("app",["ngResource","ngRoute","ngAnimate"]);return n.setTitle=function(t){e.setTitle(t)},n.run(["$rootScope","$location",function(t,n){var r="zh_CN";r||(r=navigator.language||navigator.userLanguage),r=r.replace("_","-").toLowerCase(),e.setCookie("lang",r),t.language=r}]),n.filter("t",["$location",function(e){return function(n,r){var i;r=r?r:t.getViewName(e);if(window._gos.transData&&window._gos.transData.hasOwnProperty(r)){i=window._gos.transData[r];if(i.hasOwnProperty(n))return i[n]}return n}}]),window._gos.viewstackRouter=window._gos.viewstackRouter||[],n.gosRouter=function(e,t,n,r){window._gos.viewstackRouter.push({router:e,name:t,templateUrl:window._gos.srcPath+t.split(".").join("/")+".html",group:r,controller:n})},window._gos.srcPath="/assets/js/"+MYENV+"/page/",n.gosRouter("/","home.module","HomeModuleCtrl"),n.gosRouter("/home/module","home.module","HomeModuleCtrl"),n.gosRouter("/drawing/form","drawing.form","DrawingFormCtrl"),n.gosRouter("/drawing/list","drawing.list","DrawingListCtrl"),n.gosRouter("/drawing/form/:id","drawing.form","DrawingFormCtrl"),n.gosRouter("/drawing/view/:id","drawing.view","DrawingViewCtrl"),n.gosRouter("/me/password","me.password","MePasswordCtrl"),n}),define("ngViewExplorer",["app","loader"],function(e,t){function n(e,t){var n=e.indexOf("#");return n>0&&(e=e.substr(0,n)),t&&(n=e.indexOf("?"),n>0&&(e=e.substr(0,n))),e}$(document).on("click","a[href]",function(){window._gos.openMode=$(this).attr("open-mode")}),e.service("Viewstack",function(){this.getRouter=function(){return window._gos.viewstackRouter},this.route=function(e){var t=window._gos.viewstackRouter,r,i,s,o,u,a=new RegExp(":([a-zA-Z0-9_]+)","g");for(i=t.length-1;i>=0;i--){r=$.extend({},t[i]),r.search={},u=r.router.match(a);if(r.router.indexOf(":")>0&&u&&u.length>0){r.router=r.router.replace(/\/:\w+/g,"/(\\w+)"),s=(new RegExp(r.router,"g")).exec(e);if(!s)continue;for(o=1;s.length>o;o++)r.search[u[o-1].substr(1)]=s[o];return r}if(r.router==n(e))return r}return null}}),e.directive("ngViewExplorer",["$rootScope","$q","$animate","$http","$compile","$controller","$location","$templateRequest","$sce","Viewstack",function(e,r,i,s,o,u,a,f,l,c){function h(i,u,h){return function(i,u,p){function E(e,t,n){var r=c.getRouter();if(!t||!r||t==n)return!1;v.group=v.group||"";if(b!=v.group)return;g=v.controller;if(d){var i=!1;d.children().each(function(){var e=$(this);if(t!=e.data("view-url"))return;e.siblings(".in").removeClass("in").one("bsTransitionEnd",function(){$(this).addClass("hidden"),e.removeClass("hidden").addClass("in")}).emulateTransitionEnd(150),i=!0});if(i)return!1}return!0}function S(e,t,n){defer=r.defer(),defer.promise.then(function(){if(m){var e=g,n=y.split("."),r=window._gos.openMode;h(w,function(n){var i=$('<div class="view-item fade" ng-controller="'+e+'">'+m+"</div>");i.data("$ngController",e),i.data("view-url",t),n.append(i),d?d.children(".in").removeClass("in").one("bsTransitionEnd",function(){var e=$(this);switch(r){case"self":e.after(i),e.remove();break;case"":case undefined:e.addClass("hidden").nextAll().remove(),e.remove(),d.append(i);break;case"blank":e.addClass("hidden").nextAll().remove(),d.append(i)}i.addClass("in")}).emulateTransitionEnd(150):(u.after(n),i.addClass("in"),d=n),o(n.contents())(w)})}}),v.template?(m=v.template,defer.resolve()):(templateUrl=v.templateUrl,templateUrl=l.getTrustedResourceUrl(templateUrl),angular.isDefined(templateUrl)&&(m=f(templateUrl)),s.get(templateUrl).success(function(e){m=e,defer.resolve()}))}var d,v,m,g,y,b=p.ngViewExplorer,w=i.$new();e.$on("$locationChangeSuccess",function(i,s,o){s==o&&(o="");if(n(s)==n(o))return;var u;a.$$html5?u=a.$$path:u=s.match(/#(\/.*)/),v=c.route(u);if(!v)return console.log("error: no matched router:",u),!1;y=v.name,$.extend(a.$$search,v.search),t.loadview(y,v.templateUrl,r,e).then(function(){E(i,s,o)&&(console.log(y,"loaded successfull"),S(i,s,o))},function(){console.log(y,"failed loaded")})})}}return{scope:!1,terminal:!0,priority:300,transclude:"element",compile:h}}])}),window._gos=window._gos||{},require.config({baseUrl:"/assets/js/",paths:{ngEditor:MYENV+"/directive/editor",ngDatetimePicker:MYENV+"/directive/datetimePicker",ngBootstrapSwitch:MYENV+"/directive/bootstrapSwitch",ngViewExplorer:MYENV+"/directive/viewExplorer",app:MYENV+"/mylib/app",appData:MYENV+"/mylib/appData",loader:MYENV+"/mylib/loader",util:MYENV+"/mylib/util",ajax:MYENV+"/mylib/ajax",gosEditor:MYENV+"/mylib/gos.editor",angular:MYENV=="dev"?MYENV+"/angular":MYENV+"/angular","angular-route":MYENV=="dev"?MYENV+"/angular-route":MYENV+"/angular","angular-animate":MYENV=="dev"?MYENV+"/angular-animate":MYENV+"/angular","angular-resource":MYENV=="dev"?MYENV+"/angular-resource":MYENV+"/angular"},shim:{app:{deps:["angular","angular-route","angular-animate","angular-resource","jquery"]},angular:{exports:"angular"},"angular-route":{deps:["angular"]},"angular-animate":{deps:["angular"]},"angular-resource":{deps:["angular"]}}}),require(["appData","ajax","util","crypto","app","loader","ngViewExplorer"],function(e,t,n,r,i){function u(){require(["app","ngViewExplorer"],function(e){e.config(["$routeProvider","$locationProvider","$controllerProvider","$compileProvider","$filterProvider","$provide",function(t,n,r,i,s,o){e.controller=r.register,e.directive=i.directive,e.filter=s.register,e.factory=o.factory,e.service=o.service,n.html5Mode(!0)}]),e.run(["$rootScope",function(e){e.goBack=function(){window.history.go(-1)},e.tabPaneNext=function(e){var t=$(e.target);if(t.attr("disabled"))return;t.closest(".pager").addClass("hidden").closest("div.tab-pane").next().removeClass("hidden").addClass("active").addClass("in")}}]),angular.bootstrap(document,["app"])})}function a(t){o.send("drawing.app.AppData",null).done(function(n){e.subjects=n.subjects,e.projects=n.projects,e.draw_js_user_ids=n.draw_js_user_ids,e.draw_sw_user_ids=n.draw_sw_user_ids,e.draw_xmgl_user_ids=n.draw_xmgl_user_ids,e.draw_xmjl_user_ids=n.draw_xmjl_user_ids,e.draw_zt_user_ids=n.draw_zt_user_ids,e.all_users=n.all_users,e.buildData(),t&&t()})}function f(t){$("#gos-current-user span").text(e.user.nick);var n=function(){$("#gos-loginContainer").removeClass("in").one("bsTransitionEnd",function(){$(this).addClass("hidden"),$("#gos-container").removeClass("hidden").addClass("in")}).emulateTransitionEnd(150),u()};a(function(){t?(l(),window.setTimeout(function(){n()},t*1200)):n()})}function l(){h();var t=$("#gos-already-signin").removeClass("hidden").addClass("in");t.find("img").attr("src",e.user.avatar).removeClass("hidden"),t.find("span").text(e.user.nick)}function c(){function r(e){t.removeClass("hidden"),t.text(e)}function i(e){t.addClass("hidden"),t.text("")}h();var t=$("#gos-login-message");$loginForm=$("#gos-login-form-signin"),$loginForm.removeClass("hidden").addClass("in"),o.send("public.sign.BindIpUser",null).done(function(t){e.bindedUser=t;if(e.bindedUser.status==0){window.location.href="/password";return}t&&t.nick!=""&&($loginForm.find(":input[name=login]").val(t.nick).attr("disabled","disabled"),$loginForm.find("img").attr("src",t.avatar).parent().removeClass("hidden"),$loginForm.find(":input[name=password]").focus())}),$loginForm.removeClass("hidden").addClass("in"),$loginForm.on("keypress","input",function(){i()}).removeClass("hidden").addClass("in"),$loginForm.keypress(function(e){e.keyCode==13&&$loginForm.find("button.btn-primary").trigger("click")}),$loginForm.find("button.btn-primary").click(function(){var t=$(this).parent(),i=t.find("input[name=login]").val(),u=t.find("input[name=password]").val();o.send("public.sign.UserLogin",{cipher:n.cipherString(s,i,u)}).done(function(t){e.user=t,f()}).fail(function(e){var t=JSON.parse(e.responseText);r(t.message)})})}function h(){$("#gos-loginContainer").removeClass("hidden").addClass("in").children("div.gos-form-signin-box").removeClass("hidden").addClass("in")}var s,o=t.NewClient("/api/open");o.send("public.site.Rsakey",null).done(function(n){t.serverTime.set(parseFloat(n.unix)),s=n,n.is_login?(e.user=n.user,f(1)):c()})}),define("page/Index",function(){});