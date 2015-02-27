define('home.module', ['app'], function(app){
	app.controller('HomeModuleCtrl', ['$scope', '$element', function($scope, $element){
	  	$scope.$on('$viewActived', function(){
	  		$('#gos-goback').hide();
	  	})

	  	$scope.$on('$viewHidden', function(){
	  		$('#gos-goback').hide();
	  	})


	}]);

	return {
		title : '消息列表',
		goBackButton : false,
		headerHtml : '<a href="/project/form">+添加项目</a>',
		i18n : false
	};
})

