define("ngContactSelect",["app"],function(e){e.directive("ngContactSelect",[function(){return{restrict:"A",replace:!1,template:'<div class="clearfix"><div class="items"></div><a class="btn btn-primary select-contact btn-flat" href="" open-mode="blank">+ <i class="fa fa-user"></i></a></div>',link:function(e,t,n){var r=t.closest("form[name]");r=r.length==0?null:r.attr("name"),t.addClass("gos-contact-items"),t.find("a.select-contact").attr("href",n.ngUrl).click(function(){window._gos.currentToolTarget=t}),t.on("click","i.fa-times",function(){var r=$(this).parent(),i=r.data("type"),s=r.data("id"),o=e[n.ngModel],u=t.data("select-data");for(var a=o.length-1;a>=0;a--)o[a][0]==i&&o[a][1]==s&&(o.splice(a,1),u.splice(a,1));t.data("select-data",u),r.remove(),e.$apply(function(){e[n.ngModel]=o&&o.length==0?null:o})}),t.on("$contactsSelected",function(r,i,s){t.data("select-data",i),e.$apply(function(){e[n.ngModel]=s&&s.length==0?null:s})}),e.$watch(n.ngModel,function(r,i){if(!r){e[n.ngModel]=null;return}var s,o,u="",a=t.data("select-data");if(!a){e[n.ngModel]=null;return}for(o=0;o<r.length;o++){s=a[o];if(!s)continue;switch(parseInt(r[o][0])){case 0:u+='<a class="btn btn-success item" data-id="'+s.id+'" data-type="0"><img class="avatar xsmall" src="/upload/avatar/4.jpg"> '+s.nick+' <i class="fa fa-times"></i></a>';break;case 1:u+='<a class="btn btn-success item" data-id="'+s.id+'" data-type="1"><i class="fa fa-users"></i> '+s.name+' <i class="fa fa-times"></i></a>'}}t.find("div.items").html(u)})}}}])});