require.config({
	baseUrl : "/assets/js/",
	paths: {
		'app' : 'dev/mylib/app',
		'appData' : 'dev/mylib/appData',
		'loader' : 'dev/mylib/loader',
		'util' : 'dev/mylib/util',
		'ajax' : 'dev/mylib/ajax',
		'gosEditor' : 'dev/mylib/gos.editor',
		
		'angular':'dev/angular',
		'angular-route':'dev/angular-route',
		'angular-animate':'dev/angular-animate',
		'angular-resource':'dev/angular-resource'
	},
	shim: {
	    'app':{
			deps: ['angular', 'angular-route', 'angular-animate', 'angular-resource','jquery']
		},
	    'angular':{
            exports:'angular'
        },
        'angular-route':{
            exports:'angular-route',
            deps: ['angular']
        },
        'angular-animate':{
            exports:'angular-animate',
            deps: ['angular']
        },
        'angular-resource':{
            exports:'angular-resource',
            deps: ['angular']
        },
        'jquery' : {
        	exports:'$'
        }
	}
});
require(
	['app'], 
	function (app){
		app.run(['$rootScope', function($rootScope){
			switch(window.location.pathname){
			case '/error/a':
				$rootScope.message = "您没有相应的登录权限，请联系管理员！"
				break;
			case '/error/b':
				$rootScope.message = "您没的权限不足，请联系管理员！"
				break;
			}
    	}])

		angular.bootstrap(document, ['app']);
		
});



