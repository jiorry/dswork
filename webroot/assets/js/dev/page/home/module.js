define('home.module', ['app', 'ajax', 'util'], function(app, ajax, util){
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
					for (var i = result.length - 1; i >= 0; i--) {
						result[i].created = util.date2str(result[i].created, 'time');
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

