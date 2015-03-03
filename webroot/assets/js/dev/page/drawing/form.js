define('drawing.form', ['app', 'ajax', 'util', 'appData', 'ngDatetimePicker'], function(app, ajax, util, appData){
	app.controller('DrawingFormCtrl', ['$scope', '$element', '$location', function($scope, $element, $location){
	  	$scope.projects = appData.projects;
	  	$scope.subjects = appData.subjects;
	  	$scope.draw_sign_xmjl = appData.draw_sign_xmjl;
	  	$scope.user = appData.userVO;

	  	$scope.avatar_url = util.userAvatar(appData.userVO.avatar);

	  	var formData = {id: 0}
	  	if($location.$$search.id){
	  		ajax.NewClient("/api/open").send('drawing.app.ItemData', {id: $location.$$search.id})
				.done(function(result){
					formData = result;
					$scope.$apply(function(){
						$scope.name = formData.name;
						$scope.no = formData.no;
						$scope.drawing_no = formData.drawing_no;
						$scope.zrz = parseInt(formData.zrz);
						$scope.a1 = parseInt(formData.a1);
						$scope.quantity = parseInt(formData.quantity);

						$scope.subject_id = parseInt(formData.subject_id);
						$scope.project_id = parseInt(formData.project_id);
						$scope.xmjl_id = parseInt(formData.xmjl_id);

					})
				}).fail(function(jqXHR){
					var err = JSON.parse(jqXHR.responseText)
					alert(err.message);
					$('#gos-btnHome').trigger('click');
				})
	  	}

	  	$scope.save = function(){
	  		var data = {};
	  		data.id = formData.id;
	  		data.project_id = this.project_id;
	  		data.name = this.name;
	  		data.no = this.no;
	  		data.drawing_no = this.drawing_no;
	  		data.subject_id = this.subject_id;
	  		data.zrz = this.zrz;
	  		data.a1 = this.a1;
	  		data.quantity = this.quantity;
	  		data.xmjl_id = this.xmjl_id;

	  		ajax.NewClient("/api/open").send('drawing.app.Save', data)
				.done(function(result){
					$('#gos-btnHome').trigger('click')
				})
	  	}
	}]);

	return {
		title : '晒图AVC',
		goBackButton : true,
		headerHtml : '',
		i18n : false
	};
})

