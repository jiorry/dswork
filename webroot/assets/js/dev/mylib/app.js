window._gos = window._gos || {};

define(
	'app',
	['util', 'loader', 'angular', 'angular-route', 'angular-animate', 'angular-resource', 'jquery'],
	function(util, loader){
    	var app = angular.module('app',['ngResource', 'ngRoute', 'ngAnimate']);

    	app.setTitle = function(title){
    		util.setTitle(title);
    	}

    	app.run(['$rootScope', '$location', function($rootScope, $location){
    		var lang = util.getCookie('lang');
    		if(!lang){
    			lang = navigator.language || navigator.userLanguage;
    		}
    		lang = lang.replace('-', '_').toLowerCase();
    		util.setCookie('lang', lang);

    		$rootScope.language = lang;
    	}])

		// i18n filter
		app.filter('t', ['$location', function ($location) {
			    return function (text, name) {
			    	var trans;
			        name = name ? name : loader.getViewName($location);
			        if(window._gos.transData && window._gos.transData.hasOwnProperty(name)){
			        	trans = window._gos.transData[name];
			        	if (trans.hasOwnProperty(text)) {
				            return trans[text];
						}
			        }
			        return text;
			       
			    };;
			}
		]);

		window._gos.viewstackRouter = window._gos.viewstackRouter || [];

		app.gosRouter = function(r, name, ctr, group){
			window._gos.viewstackRouter.push(
				{
					router : r,
					name : name,
			        templateUrl : window._gos.srcPath + name.split('.').join('/')+'.html',
					group : group,
			        controller : ctr
			    }
			);
		}

		window._gos.srcPath = '/assets/js/'+MYENV+'/page/';		

		app.gosRouter('/', 'home.module', 'HomeModuleCtrl');
		app.gosRouter('/home/module', 'home.module', 'HomeModuleCtrl');
		app.gosRouter('/drawing/form', 'drawing.form', 'DrawingFormCtrl');
		app.gosRouter('/drawing/form/:id', 'drawing.form', 'DrawingFormCtrl');
		app.gosRouter('/drawing/view/:id', 'drawing.view', 'DrawingViewCtrl');
		app.gosRouter('/me/password', 'me.password', 'MePasswordCtrl');

    	return app;
	}
)