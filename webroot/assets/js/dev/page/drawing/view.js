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


				$scope.$apply(function(){
					$scope.formData = result;
					$scope.currentUser = appData.userVO;
					$scope.isCurrentUser = (appData.userVO.id == result.user_id);
					$scope.action = currentUserAction();
				})

				app.setTitle('晒图 ' + result.name);

			}).fail(function(jqXHR){
				var err = JSON.parse(jqXHR.responseText)
				alert(err.message);
				$('#gos-btnHome').trigger('click');
			})

		$scope.sign = function(){
			if(!$scope.action || $scope.action.is_sign){
				console.error('$scope.action: ', $scope.action)
				return;
			}

			doSign(true);
		}

		$scope.unsign = function(){
			if(!$scope.action || !$scope.action.is_sign){
				console.error('$scope.action: ', $scope.action)
				return;
			}
			doSign(false);
		}

		function doSign(sign){
			ajax.NewClient("/api/open").send('drawing.app.DoSign', {item_id: $scope.formData.id, sign: sign, typ: $scope.action.typ})
				.done(function(result){
					if(!result)
						return;

					$scope.$apply(function(){
						$scope.action.is_sign = sign;

						if($scope.action.typ=='xmjl'){
							$scope.formData.is_xmjl_sign = sign;
						}else{
							$scope.formData[$scope.action.typ + '_sign_by'] = appData.userVO.id;
							if(sign){
								$scope.formData[$scope.action.typ + '_user'] = appData.userVO;
							}else{
								$scope.formData[$scope.action.typ + '_user'] = null;
							}
								
						}
					})
				})
		}

		function currentUserAction(){
			var userId = appData.userVO.id,
				index = -1;

			index = util.objectFindIndex('id', userId, appData.draw_js_users);
			if(index>-1)
				return {typ:'js', title:'技术部', is_sign: parseInt($scope.formData.js_sign_by)>0};

			index = util.objectFindIndex('id', userId, appData.draw_sw_users);
			if(index>-1)
				return {typ:'sw', title:'商务部', is_sign: parseInt($scope.formData.sw_sign_by)>0};

			index = util.objectFindIndex('id', userId, appData.draw_xmgl_users);
			if(index>-1)
				return {typ:'xmgl', title:'项目部', is_sign: parseInt($scope.formData.xmgl_sign_by)>0};

			index = util.objectFindIndex('id', userId, appData.draw_xmjl_users);
			if(index>-1)
				return {typ:'xmjl', title:'项目经理', is_sign: $scope.formData.is_xmjl_sign};

			index = util.objectFindIndex('id', userId, appData.draw_zt_users);
			if(index>-1)
				return {typ:'zt', title:'制图部', is_sign: parseInt($scope.formData.zt_sign_by)>0};

			return false;
		}
	}]);

	return {
		title : '晒图表单',
		goBackButton : true,
		headerHtml : '',
		i18n : false
	};
})

