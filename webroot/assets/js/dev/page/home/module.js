define('home.module', ['app', 'ajax', 'util', 'appData'], function(app, ajax, util, appData){
	app.controller('HomeModuleCtrl', ['$scope', '$element', function($scope, $element){
	  	function loadPageData(p){
		  	ajax.NewClient("/api/open").send('drawing.app.DrawItems', {page: p})
				.done(function(result){
					var project,i, item;
					for (i = result.length - 1; i >= 0; i--) {
						item = result[i];
						project = util.objectFind('id', parseInt(result.project_id), appData.projects);
						result[i].project_name = project ? project.name: 'not found';
						result[i].project_name = util.objectFind('id', item.project_id, appData.projects).name;
						result[i].created = util.str2date(item.created);
						result[i].activeData = util.drawingActiveStatus(item, appData);

						if(item.activeData.finish_zt){
							var end = new Date(item.created.getTime() + item.draw_plan*util.DATE_DAY);
							result[i].draw_play_human_time = util.humanTime(item.created, end);
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
		headerHtml : '<a href="/drawing/form">+添加项目</a>',
		i18n : false
	};
})

