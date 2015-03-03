define('drawing.view', ['app', 'ajax', 'util', 'appData'], function(app, ajax, util, appData){
	app.controller('DrawingViewCtrl', ['$scope', '$element', '$location', function($scope, $element, $location){
	  	var formData = {id: 0}
	  	if(!$location.$$search.id){
	  		$('#gos-btnHome').trigger('click');
	  		return;
	  	}
	  	ajax.NewClient("/api/open").send('drawing.app.ItemViewData', {id: $location.$$search.id})
			.done(function(result){
				var project = util.objectFind('id', parseInt(result.project_id), appData.projects);
				result.project_name = project ? project.name: 'not found';

				var subject = util.objectFind('id', parseInt(result.subject_id), appData.subjects);
				result.subject_name = subject ? subject.name: 'not found';

				result.created = util.date2str(result.created, 'time');
				// result.user.isAvatar = result.user.avatar && result.user.avatar!= '';
				// result.user.avatar = util.userAvatar(result.user.avatar);

				$scope.$apply(function(){
					$scope.formData = result;
					$scope.currentUser = appData.userVO;
					$scope.isCurrentUser = appData.userVO.id == result.user_id;
				})

				app.setTitle('晒图 ' + result.name);

			}).fail(function(jqXHR){
				var err = JSON.parse(jqXHR.responseText)
				alert(err.message);
				$('#gos-btnHome').trigger('click');
			})

		$scope.signByXmjl = function(){

		}
		$scope.signByJs = function(){
			
		}
		$scope.signByXmgl = function(){
			
		}
		$scope.signBySw = function(){
			
		}
		$scope.signByZt = function(){
			
		}
	}]);

	return {
		title : '晒图表单',
		goBackButton : true,
		headerHtml : '',
		i18n : false
	};
})

