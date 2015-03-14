require.config({
	baseUrl : "/assets/js/",
	paths: {
		'app' : MYENV+'/mylib/app',
		'appData' : MYENV+'/mylib/appData',
		'loader' : MYENV+'/mylib/loader',
		'util' : MYENV+'/mylib/util',
		'ajax' : MYENV+'/mylib/ajax',
		'gosEditor' : MYENV+'/mylib/gos.editor',
		
		'angular':MYENV+'/angular',
		'angular-route':MYENV+'/angular-route',
		'angular-animate':MYENV+'/angular-animate',
		'angular-resource':MYENV+'/angular-resource'
	},
	shim: {
	    'app':{
			deps: ['angular', 'angular-route', 'angular-animate', 'angular-resource','jquery']
		},
	    'angular':{
            exports:'angular'
        },
        'angular-route':{
            deps: ['angular']
        },
        'angular-animate':{
            deps: ['angular']
        },
        'angular-resource':{
            deps: ['angular']
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



