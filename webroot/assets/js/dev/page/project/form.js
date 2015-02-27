define('project.form', ['app', 'ngEditor', 'ngDatetimePicker'], function(app){
	app.controller('ProjectFormCtrl', ['$scope', '$element', function($scope, $element){
	  	$scope.$on('$viewActived', function(){
	  		$('#gos-goback').hide();
	  	})

	  	$scope.$on('$viewHidden', function(){
	  		$('#gos-goback').hide();
	  	})

	  	$scope.project_names = [
	  		{ name : 'a'},
	  		{ name : 'b'},
	  		{ name : 'c'},
	  		{ name : 'd'}
	  	]
	}]);

	return {
		title : '晒图AVC',
		goBackButton : true,
		headerHtml : '<a href="/project/form">+ABC</a>',
		i18n : false
	};
})

