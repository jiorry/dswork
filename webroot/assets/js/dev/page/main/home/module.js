define('home.module', ['app'], function(app){
	app.controller('HomeModuleCtrl', ['$scope', '$element', function($scope, $element){
	  	$scope.login = 'jiorry#lDdj2niqPnS';

	  	$scope.$on('$viewActived', function(){
	  		$('#gos-goback').hide();
	  	})

	  	$scope.$on('$viewHidden', function(){
	  		$('#gos-goback').hide();
	  	})


	}]);

	return {
		title : '项目列表',
		goBackButton : false,
		headerHtml : '<a href="/community/project.form">+添加项目</a>',
		i18n : true
	};
})

