define('drawing.form', ['app', 'ajax', 'util', 'appData', 'ngDatetimePicker'], function(app, ajax, util, appData){
	app.controller('DrawingFormCtrl', ['$scope', '$element', '$location', function($scope, $element, $location){
	  	$scope.projects = appData.projects;
	  	$scope.subjects = appData.subjects;
	  	$scope.draw_xmjl_users = appData.draw_xmjl_users;
	  	$scope.user = appData.user;
	  	

	  	var formData = {id: 0}
	  	if($location.router && $location.router.search.id){
	  		$scope.is_editable = false;
	  		ajax.NewClient("/api/open").send('drawing.app.ItemData', {id: $location.router.search.id})
				.done(function(result){
					formData = result;
					$scope.$apply(function(){
						$scope.item_id = formData.id;
						$scope.name = formData.name;
						$scope.no = formData.no;
						$scope.drawing_no = formData.drawing_no;
						$scope.zrz = parseInt(formData.zrz);
						$scope.a1 = parseInt(formData.a1);
						$scope.quantity = parseInt(formData.quantity);

						$scope.subject_id = parseInt(formData.subject_id);
						$scope.project_id = parseInt(formData.project_id);
						$scope.xmjl_id = parseInt(formData.xmjl_id);
						$scope.is_editable = isEditable(formData);
						$scope.memo = formData.memo;

					})
				}).fail(function(jqXHR){
					var err = JSON.parse(jqXHR.responseText)
					alert(err.message);
					$('#gos-btnHome').trigger('click');
				})
	  	}

	  	$scope.is_editable = true;
	  	var $button = $element.find('a.btn-save');

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
	  		data.memo = this.memo;

	  		ajax.NewClient("/api/open").button($button).send('drawing.app.Save', data)
				.done(function(result){
					if(parseInt(data.id) >0)
						$('#drawing-go-view-item').trigger('click')
					else
						$('#gos-btnHome').trigger('click')
				})
	  	}

	  	function isEditable(data){
	  		return !(data.xmjl_sign_by>0 || data.js_sign_by > 0 || data.sw_sign_by > 0 || data.xmgl_sign_by > 0 || data.zt_sign_by > 0 );
	  	}
	}]);

	return {
		title : '晒图表单',
		goBackButton : true,
		headerHtml : '',
		i18n : false
	};
})

