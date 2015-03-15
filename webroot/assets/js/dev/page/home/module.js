define('home.module', ['app', 'ajax', 'util', 'appData'], function(app, ajax, util, appData){
	app.controller('HomeModuleCtrl', ['$scope', '$element', function($scope, $element){
	  	function loadPageData(p){
		  	ajax.NewClient("/api/open").send('drawing.app.DrawItems', {status: 1})
				.done(function(result){
					var project,i, item;
					for (i = result.length - 1; i >= 0; i--) {
						item = result[i];
						project = util.objectFind('id', parseInt(item.project_id), appData.projects);
						result[i].project_name = project ? project.name: 'not found';
						result[i].created = util.str2date(item.created);
						result[i].activeData = util.drawingActiveStatus(item, appData);

						if(item.activeData.finish_zt){
							var end = new Date(item.created.getTime() + item.draw_plan*util.DATE_DAY);

							if(end.getTime()<ajax.serverTime.time()){
								result[i].draw_play_human_time = '';
							}else{
								result[i].draw_play_human_time = util.humanTime(item.created, end);
							}
							result[i].draw_play_date = util.date2str(end, 'time');
						}

						result[i].created = util.date2str(item.created, 'time');
					};

					$scope.$apply(function(){
						$scope.items = result;
					});
				})
	  	}

	  	loadPageData(1);

	  	
	}]);

	return {
		title : '消息列表',
		goBackButton : false,
		headerHtml : '<a href="/drawing/form">+添加项目</a> <a href="/drawing/list"><i class="fa fa-list"></i></a>',
		i18n : false
	};
})

