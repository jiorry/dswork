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
					$scope.currentUser = appData.user;
					$scope.isCurrentUser = (appData.user.id == result.user_id);
					$scope.activeData = util.drawingActiveStatus(result, appData);
					$scope.signList = signList($scope.activeData);
				})

				app.setTitle('晒图 ' + result.name);

			}).fail(function(jqXHR){
				var err = JSON.parse(jqXHR.responseText)
				alert(err.message);
				$('#gos-btnHome').trigger('click');
			})

		$scope.sign = function(typ){
			if($scope.activeData['finish_'+typ]){
				console.error(typ + ' already signed')
				return;
			}

			doSign(true, typ);
		}

		$scope.unsign = function(typ){
			if(!$scope.activeData['finish_'+typ]){
				console.error(typ + ' is unsign')
				return;
			}
			doSign(false, typ);
		}

		function doSign(sign, typ){
			ajax.NewClient("/api/open").button('#drawing-view-button-div a.btn').send('drawing.app.DoSign', {item_id: $scope.formData.id, sign: sign, typ: typ})
				.done(function(result){
					if(!result)
						return;

					$scope.$apply(function(){
						$scope.activeData['finish_' + typ] = sign;
						$scope.signList = signList($scope.activeData);
					})
				})
		}

		function signList(activeData){
			var arr = ['js', 'sw', 'xmgl', 'xmjl', 'zt'], 
				funcName = function(typ){
					switch(typ){
					case 'js':
						return '技术部';
					case 'sw':
						return '商务部';
					case 'xmjl':
						return '项目经理';
					case 'xmgl':
						return '项目管理';
					case 'zt':
						return '制图部';
					}
				},
				funcData = function(typ){
					if(!activeData['is_'+typ]){
						return null;
					}
					return {title : funcName(typ), is_sign: activeData['finish_'+typ], typ : typ}
				};

			var listData = [], item;
			for (var i = arr.length - 1; i >= 0; i--) {
				if (item = funcData(arr[i])){
					listData.push(item)
				}
			};

			return listData;
		}
	}]);

	return {
		title : '晒图表单',
		goBackButton : true,
		headerHtml : '',
		i18n : false
	};
})

