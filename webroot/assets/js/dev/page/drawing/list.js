define('drawing.list', ['app', 'ajax', 'util', 'appData', 'ngDatetimePicker'], function(app, ajax, util, appData){

	app.controller('DrawingListCtrl', ['$scope', '$element', '$location', function($scope, $element, $location){
		$scope.projects = appData.projects;
	  	$scope.subjects = appData.subjects;

		var $button = $element.find('a.btn-default');
		$button.click(function(){
			query();
		})

		function query(){
			var obj = {end: $scope.end, begin: $scope.begin, project_id: $scope.project_id? $scope.project_id : 0, subject_id: $scope.subject_id ? $scope.subject_id : 0};
			ajax.NewClient("/api/open").button($button).send('drawing.app.DrawItems', obj)
				.done(function(result){
					var project,i, item;
					for (i = result.length - 1; i >= 0; i--) {
						item = result[i];
						project = util.objectFind('id', parseInt(item.project_id), appData.projects);
						result[i].project_name = project ? project.name: 'not found';
						
						result[i].created = util.date2str(item.created, 'time');

						result[i].xmjl_user = util.objectFind('id', item.xmjl_id, appData.all_users)
						result[i].js_user = util.objectFind('id', item.js_sign_by, appData.all_users)
						result[i].zt_user = util.objectFind('id', item.zt_sign_by, appData.all_users)
						result[i].xmgl_user = util.objectFind('id', item.xmgl_sign_by, appData.all_users)
						result[i].sw_user = util.objectFind('id', item.sw_sign_by, appData.all_users)
					};

					$scope.$apply(function(){
						$scope.items = result;
					});
				})
		}
	  		
	}]);

	return {
		title : '晒图列表',
		goBackButton : true,
		headerHtml : '',
		i18n : false
	};
})

