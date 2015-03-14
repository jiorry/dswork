define("util",["jquery"],function(){var e={};return e.DATE_DAY=864e5,e.DATE_HOUR=36e5,e.humanTime=function(t,n){typeof t=="string"&&(t=e.Str2date(t)),typeof n=="string"&&(n=e.Str2date(n));var r,i,s,o=Math.abs(n.getTime()-t.getTime())/1e3;return o>=31536e3?(r=o/31536e3,i=Math.round((r-Math.floor(r))*12),s=parseInt(r)+"年"+(i==0?"":i+"个月")):o>=2592e3?(r=o/2592e3,i=Math.round((r-Math.floor(r))*30),s=parseInt(r)+"个月"+(i==0?"":i+"天")):o>=86400?(r=o/86400,i=Math.round((r-Math.floor(r))*24),s=parseInt(r)+"天"+(i==0?"":i+"小时")):o>=3600?(r=o/3600,i=Math.round((r-Math.floor(r))*60),s=parseInt(r)+"小时"+(i==0?"":i+"分钟")):o>=60?(r=o/60,s=parseInt(r)+"分钟"):o<60&&(s=parseInt(o).toString()+"秒"),s},e.drawingActiveStatus=function(e,t){var n=t.user.id,r={is_js:!1,is_xmjl:!1,is_xmgl:!1,is_zt:!1,finish_js:!1,finish_xmjl:!1,finish_xmgl:!1,finish_zt:!1};return e.xmjl_id==n&&(r.finish_xmjl=e.is_xmjl_sign,r.is_xmjl=!0),t.draw_js_user_ids.indexOf(n.toString())>-1&&(r.finish_js=e.js_sign_by>0,r.is_js=!0),t.draw_sw_user_ids.indexOf(n.toString())>-1&&(r.finish_sw=e.sw_sign_by>0,r.is_sw=!0),t.draw_xmgl_user_ids.indexOf(n.toString())>-1&&(r.finish_xmgl=e.xmgl_sign_by>0,r.is_xmgl=!0),t.draw_zt_user_ids.indexOf(n.toString())>-1&&(r.finish_zt=e.zt_sign_by>0,r.is_zt=!0),r},e.userAvatar=function(e){return!e||e==""?e="/assets/img/avatar_empty.png":e="/upload/avatar/"+e,e},e.setTitle=function(e){e||(e=""),$("#gos-headerTitle").text(e),document.title=e},e.str2date=function(e){return e=e.replace(/[A-Za-z]/g," ").substr(0,19),new Date(Date.parse(e))},e.date2str=function(e,t){if(!e)return"";switch(typeof e){case"number":e=new Date(e);break;case"string":e=this.str2date(e)}return t&&t=="time"?e.getFullYear()+"-"+this.lpad(e.getMonth()+1,"0",2)+"-"+this.lpad(e.getDate(),"0",2)+" "+this.lpad(e.getHours(),"0",2)+":"+this.lpad(e.getMinutes(),"0",2):e.getFullYear()+"-"+this.lpad(e.getMonth()+1,"0",2)+"-"+this.lpad(e.getDate(),"0",2)},e.getUrlParameter=function(e){var t=window.location.search.substring(1),n=t.split("&");for(var r=0;r<n.length;r++){var i=n[r].split("=");if(i[0]==e)return i[1]}},e.cipherString=function(t,n,r){var i=new RSAKey,s=Server.getTime().toString(),o=CryptoJS.MD5(s+n);i.setPublic(t.hex,"10001");var u=i.encrypt(e.lpad(s,"0",16)+o.toString(CryptoJS.enc.Base64)),a=n+"|"+r,f=e.aesEncrypto(a,s,o),l=t.keyid.toString()+"|"+CryptoJS.enc.Hex.parse(u.toString()).toString(CryptoJS.enc.Base64)+"|"+f.toString();return l},e.aesEncrypto=function(t,n,r){n=n.toString();var i=CryptoJS.MD5(e.lpad(n,"0",16)),s=CryptoJS.AES.encrypt(t,r,{iv:i});return s.ciphertext.toString(CryptoJS.enc.Base64)},e.aesDecrypto=function(t,n,r){n=n.toString();var i=CryptoJS.MD5(e.lpad(n,"0",16)),s={ciphertext:CryptoJS.enc.Base64.parse(t),salt:""};return decrypted=CryptoJS.AES.decrypt(s,r,{iv:i}),decrypted.toString(CryptoJS.enc.Utf8)},e.lpad=function(e,t,n){while(e.toString().length<n)e=t+e;return e},e.rpad=function(e,t,n){while(e.toString().length<n)e+=t;return e},e.objectFind=function(e,t,n){if(!n)return null;var r,i=n.length;for(r=0;r<i;r++)if(n[r]&&n[r][e]==t)return n[r];return null},e.objectFindIndex=function(e,t,n){if(!n)return-1;var r,i=n.length;for(r=0;r<i;r++)if(n[r]&&n[r][e]==t)return r;return-1},e.setCookie=function(e,t,n){if(n){var r=new Date;r.setTime(r.getTime()+n*864e5);var i="; expires="+r.toGMTString()}else var i="";document.cookie=e+"="+t+i+"; path=/"},e.getCookie=function(e){var t=e+"=",n=document.cookie.split(";");for(var r=0;r<n.length;r++){var i=n[r];while(i.charAt(0)==" ")i=i.substring(1,i.length);if(i.indexOf(t)==0)return i.substring(t.length,i.length)}return null},e.deleteCookie=function(e){this.SetCookie(e,"",-1)},e.getNick=function(){if(this.currentNick)return this.currentNick;var e=decodeURIComponent(this.getCookie("PUB_gosauth")),t=e.split("|");return t.length>1?this.currentNick=t[0]:this.currentNick=e,this.currentNick},e.getSecret=function(){return decodeURIComponent(this.getCookie("secret"))},e.scopeFormData=function(e){var t,n,r,i={};for(n in e){if(n.charAt(0)=="$")continue;t=e[n];if(!t)continue;if(typeof t.$$parentForm!="undefined"&&t.$valid)for(r in t){if(r.charAt(0)=="$")continue;t[r]&&typeof t[r].$modelValue!="undefined"?i[r]=t[r].$modelValue:i[r]=t[r].$viewValue}}return i},e}),define("loader",["util","jquery"],function(e){var t=$("#gos-goback"),n=$("#gos-headerBarR"),r=function(){this.defaultViewName="home.module";var r=$("#gos-Views");this.getViewName=function(e){var t=e.$$path=="/"?this.defaultViewName:e.$$path;return t.charAt(0)=="/"&&(t=t.substr(1)),t.replace(/\//g,".")},this.getViewPath=function(e){var t=this.getViewName();return t.replace(/\./g,"/")},this.buildHeader=function(r){r.goBackButton==0?t.hide():t.show(),r.headerHtml?n.html(r.headerHtml):n.empty(),e.setTitle(r.title)},this.loadview=function(e,t,n,r){var i={},s=n.defer(),o=this,u=t.substr(0,t.indexOf(".html"));return i[e]=u,require.config({paths:i}),require([e],function(t){if(t&&t.i18n){var n=r.language,i=e.split(".");n=n==""?"en_US":n,window._gos.transData=window._gos.transData||{},window._gos.transData[e]?s.resolve():$.getJSON(u.substr(0,u.indexOf(i.join("/")))+"/"+i[0]+"/locales/"+n+"/"+i[1]+".json").success(function(t){window._gos.transData[e]=t,s.resolve()}).fail(function(){n="en_US",$.getJSON(window._gos.srcPath+u+"/locales/"+n+"/"+typ+".json").success(function(t){window._gos.transData[e]=t,s.resolve()})})}else s.resolve();o.buildHeader(t)},function(e){s.reject()}),s.promise}};return new r}),window._gos=window._gos||{},define("app",["util","loader","angular","angular-route","angular-animate","angular-resource","jquery"],function(e,t){var n=angular.module("app",["ngResource","ngRoute","ngAnimate"]);return n.setTitle=function(t){e.setTitle(t)},n.run(["$rootScope","$location",function(t,n){var r=e.getCookie("lang");r||(r=navigator.language||navigator.userLanguage),r=r.replace("-","_").toLowerCase(),e.setCookie("lang",r),t.language=r}]),n.filter("t",["$location",function(e){return function(n,r){var i;r=r?r:t.getViewName(e);if(window._gos.transData&&window._gos.transData.hasOwnProperty(r)){i=window._gos.transData[r];if(i.hasOwnProperty(n))return i[n]}return n}}]),window._gos.viewstackRouter=window._gos.viewstackRouter||[],n.gosRouter=function(e,t,n,r){window._gos.viewstackRouter.push({router:e,name:t,templateUrl:window._gos.srcPath+t.split(".").join("/")+".html",group:r,controller:n})},window._gos.srcPath="/assets/js/"+MYENV+"/page/",n.gosRouter("/","home.module","HomeModuleCtrl"),n.gosRouter("/home/module","home.module","HomeModuleCtrl"),n.gosRouter("/drawing/form","drawing.form","DrawingFormCtrl"),n.gosRouter("/drawing/form/:id","drawing.form","DrawingFormCtrl"),n.gosRouter("/drawing/view/:id","drawing.view","DrawingViewCtrl"),n.gosRouter("/me/password","me.password","MePasswordCtrl"),n}),define("ajax",["util","jquery"],function(e){var t={NewClient:function(e,t){return new n(e,t)},serverTime:{diff:0,set:function(e){this.diff=e>0?(new Date).getTime()-e*1e3:0},time:function(){return(new Date).getTime()-this.diff}},getHostName:function(){var e=window.location.host.split(".");return e[e.length-2]+"."+e[e.length-1]},getUrlVars:function(){var e=[],t,n=window.location.href.slice(window.location.href.indexOf("?")+1).split("&");for(var r=0;r<n.length;r++)t=n[r].split("="),e.push(t[0]),e[t[0]]=t[1];return e},datasetDecode:function(e){if(!e||e.length==0)return e;var t=e[0],n=e.length,r,i,s=[];for(var o=1;o<n;o++){r=new Object;for(var u=0;u<t.length;u++)r[t[u]]=e[o][u];s.push(r)}return s}},n=function(e,t){this.path=e||"/api/web",this._timeout=t||1e4,this._button=null,this._block=null};n.prototype.errorHandler=function(e){console.log(e)},n.prototype.button=function(e){return this._button=e,this},n.prototype.block=function(e){return this._block=e,this},n.prototype.sendAlone=function(e,t){if(this.deferred&&this.deferred.state()=="pending"){var n=function(){};return{done:n,fail:n,always:n}}return this.deferred=this.send(e,t),this.deferred},n.prototype.send=function(e,t){var n={method:e,args:t?t:null},r={type:"POST",dataType:"json",cache:!1,timeout:this._timeout},i=null;this._block&&this.doBusy(this._block,!0),this._button&&this.doDisable(this._button,!0);var s=this;return deferred=$.ajax({url:this.path,type:r.type,dataType:r.dataType,cache:r.cache,data:{src:JSON.stringify(n)},timeout:r.timeout}),deferred.always(function(){s._block&&s.doBusy(s._block,!1),s._button&&s.doDisable(s._button,!1)}).fail(function(e,t,n){switch(e.status){case 599:if(s.errorHandler)try{s.errorHandler(JSON.parse(e.responseText))}catch(r){console.log(r)}break;case 404:alert(t+": api not found!");break;default:alert(t+": "+e.responseText)}}),deferred},n.prototype.doDisable=function(e,t){typeof e=="string"&&(e=$(e)),e.attr("disabled",t?"disabled":null)},n.prototype.doBusy=function(e,t){var n,r;typeof e=="string"?n=$(e):n=e;var i={bgColor:"#CCCCCC",duration:200,opacity:.5};n.each(function(){var e=$(this);t?(r=$("<div></div>").css({"background-color":i.bgColor,opacity:i.opacity,width:e.width(),height:e.height(),position:"absolute",top:"0px",left:"0px","z-index":9999}),r=$('<div class="block-overlay"></div>').css({position:"relative"}).append(r),e.prepend(r.append('<div class="bloack-ui"></div>').fadeIn(i.duration))):(r=e.children(".block-overlay"),r.length>0&&r.remove())})};var r=function(){var e=document.createElement("bootstrap"),t={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd otransitionend",transition:"transitionend"};for(var n in t)if(e.style[n]!==undefined)return{end:t[n]};return!1};return $.fn.emulateTransitionEnd=function(e){var t=!1,n=this;$(this).one("bsTransitionEnd",function(){t=!0});var r=function(){t||$(n).trigger($.support.transition.end)};return setTimeout(r,e),this},$(function(){$.support.transition=r();if(!$.support.transition)return;$.event.special.bsTransitionEnd={bindType:$.support.transition.end,delegateType:$.support.transition.end,handle:function(e){if($(e.target).is(this))return e.handleObj.handler.apply(this,arguments)}}}),t}),require.config({baseUrl:"/assets/js/",paths:{app:MYENV+"/mylib/app",appData:MYENV+"/mylib/appData",loader:MYENV+"/mylib/loader",util:MYENV+"/mylib/util",ajax:MYENV+"/mylib/ajax",gosEditor:MYENV+"/mylib/gos.editor",angular:MYENV+"/angular","angular-route":MYENV+"/angular-route","angular-animate":MYENV+"/angular-animate","angular-resource":MYENV+"/angular-resource"},shim:{app:{deps:["angular","angular-route","angular-animate","angular-resource","jquery"]},angular:{exports:"angular"},"angular-route":{deps:["angular"]},"angular-animate":{deps:["angular"]},"angular-resource":{deps:["angular"]}}}),require(["app","ajax","util","crypto"],function(e,t,n){var r=t.NewClient("/api/open");e.run(["$rootScope",function(e){function a(e){u.text(e).removeClass("hidden")}function f(){u.text("").addClass("hidden")}e.userBinded=null,e.isLoaded=!1;var i,s=r.send("public.site.Rsakey",null).done(function(e){i=e}),o=r.send("public.sign.BindIpUser",null).done(function(t){t&&e.$apply(function(){e.userBinded=t,e.nick=t.nick})});$.when(s,o).done(function(){e.$apply(function(){e.isLoaded=!0})});var u=$("#errorBox");$("form[name=registion] :input").keydown(function(){f()}),e.save=function(){var r=e.nick,s=e.password,o=e.confirm_pwd;if(s!=o){a("两次输入的密码不匹配");return}if(!e.userBinded){a("您的电脑没有权限使用这个功能，请联系管理员");return}if(e.userBinded.status>0){a("功能被限制，请与管理员联系，再次初始化您的登录密码");return}t.NewClient("/api/open").button("#password-btn-save").send("public.sign.InitPassword",{cipher:n.cipherString(i,r,s)}).done(function(e){window.location.href="/"}).fail(function(e){var t=JSON.parse(e.responseText);a(t.message)})}}]),angular.bootstrap(document,["app"])}),define("page/Password",function(){});