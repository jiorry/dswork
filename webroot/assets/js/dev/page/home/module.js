define('home.module', ['app', 'ajax', 'util', 'appData'], function(app, ajax, util, appData){
	app.controller('HomeModuleCtrl', ['$scope', '$element', function($scope, $element){
	  	$scope.$on('$viewActived', function(){
	  		$('#gos-goback').hide();
	  	})

	  	$scope.$on('$viewHidden', function(){
	  		$('#gos-goback').hide();
	  	})

	  	function loadPageData(p){
		  	ajax.NewClient("/api/open").send('drawing.app.DrawItems', {page: p})
				.done(function(result){
					var project,i;
					for (i = result.length - 1; i >= 0; i--) {
						project = util.objectFind('id', parseInt(result.project_id), appData.projects);
						result[i].project_name = project ? project.name: 'not found';
						result[i].created = util.date2str(result[i].created, 'time');

						result[i].project_name = util.objectFind('id', result[i].project_id, appData.projects).name;
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

