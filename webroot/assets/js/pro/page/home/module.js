define("home.module",["app","ajax","util","appData"],function(e,t,n,r){return e.controller("HomeModuleCtrl",["$scope","$element",function(e,i){function s(i){t.NewClient("/api/open").send("drawing.app.DrawItems",{status:1}).done(function(i){var s,o,u;for(o=i.length-1;o>=0;o--){u=i[o],s=n.objectFind("id",parseInt(u.project_id),r.projects),i[o].project_name=s?s.name:"not found",i[o].created=n.str2date(u.created),i[o].activeData=n.drawingActiveStatus(u,r);if(u.activeData.finish_zt){u.zt_sign_at=n.str2date(u.zt_sign_at);var a=new Date,f=new Date(u.zt_sign_at.getTime()+u.draw_plan*n.DATE_HOUR);f.getTime()<t.serverTime.time()?i[o].draw_play_human_time="":i[o].draw_play_human_time=n.humanTime(a,f),i[o].draw_play_date=n.date2str(f,"time")}i[o].created=n.date2str(u.created,"time")}e.$apply(function(){e.items=i})})}s(1)}]),{title:"消息列表",goBackButton:!1,headerHtml:'<a href="/drawing/form">+添加项目</a> <a href="/drawing/list"><i class="fa fa-list"></i></a>',i18n:!1}});