define("drawing.form",["app","ajax","util","appData","ngDatetimePicker"],function(e,t,n,r){return e.controller("DrawingFormCtrl",["$scope","$element","$location",function(e,n,i){function u(e){return!(e.is_xmjl_sign||e.js_sign_by>0||e.sw_sign_by>0||e.xmgl_sign_by>0||e.zt_sign_by>0)}e.projects=r.projects,e.subjects=r.subjects,e.draw_xmjl_users=r.draw_xmjl_users,e.user=r.user;var s={id:0};i.$$search.id&&(e.is_editable=!1,t.NewClient("/api/open").send("drawing.app.ItemData",{id:i.$$search.id}).done(function(t){s=t,e.$apply(function(){e.item_id=s.id,e.name=s.name,e.no=s.no,e.drawing_no=s.drawing_no,e.zrz=parseInt(s.zrz),e.a1=parseInt(s.a1),e.quantity=parseInt(s.quantity),e.subject_id=parseInt(s.subject_id),e.project_id=parseInt(s.project_id),e.xmjl_id=parseInt(s.xmjl_id),e.is_editable=u(s)})}).fail(function(e){var t=JSON.parse(e.responseText);alert(t.message),$("#gos-btnHome").trigger("click")})),e.is_editable=!0;var o=n.find("a.btn-save");e.save=function(){var e={};e.id=s.id,e.project_id=this.project_id,e.name=this.name,e.no=this.no,e.drawing_no=this.drawing_no,e.subject_id=this.subject_id,e.zrz=this.zrz,e.a1=this.a1,e.quantity=this.quantity,e.xmjl_id=this.xmjl_id,t.NewClient("/api/open").button(o).send("drawing.app.Save",e).done(function(t){parseInt(e.id)>0?$("#drawing-go-view-item").trigger("click"):$("#gos-btnHome").trigger("click")})}}]),{title:"晒图表单",goBackButton:!0,headerHtml:"",i18n:!1}});