define("ngMdEditor",["app","util"],function(e,t){e.directive("ngMdEditor",[function(){return{restrict:"A",replace:!0,template:'<div><textarea rows=5 class="form-control gos-md-editor"></textarea><div class="editor-toolbar" style="margin-top:3px;"><a class="btn btn-default single" data-command="href" data-command-value="/" data-command-type="onClick"><i class="fa fa-life-ring"></i> MD HELP</a><div class="btn-group"><a class="btn btn-default" data-command="createLink" data-command-type="command"><i class="fa fa-link"></i></a><a class="btn btn-default" data-command="insertImage" data-command-type="command"><i class="fa fa-picture-o"></i></a></div><a class="btn btn-default single" data-command="fullPage" data-command-value="1" data-command-type="onClick"><i class="fa fa-arrows-alt"></i></a></div></div>',link:function(e,n,r){var i=n.children("textarea.form-control"),s=i.height(),o=s,u,a=[{cmd:"fullPage",value:1,onClick:function(e,t,n){parseInt(e.data("command-value"))===1?(t.addClass("fullPage"),e.data("command-value","0"),n.css("height","100%")):(t.removeClass("fullPage"),e.data("command-value","1"),n.css("height","auto"))}}];i.next().on("click","a[data-command]",function(){var e=$(this),r=t.objectFind("cmd",e.data("command"),a);if(!r)return;r.onClick.call(this,e,n,i)}),r.ngModel&&r.ngModel!=""&&(i.on("keyup",function(){e[r.ngModel]=i.val()}),i.on("focusout",function(){e.$apply(function(){e[r.ngModel]=i.val()}),console.log(i.html());var t=$("<div>"+i.html()+"</div>")}),e.$watch(r.ngModel,function(e,t){e!=t&&i.val(e)}))}}}])});