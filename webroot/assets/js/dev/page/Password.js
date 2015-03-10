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
	['app', 'ajax', 'util', 'crypto'], 
	function (app, ajax, util){
		var client = ajax.NewClient("/api/open");
		app.run(['$rootScope', function($rootScope){
			$rootScope.user = null;
			$rootScope.isLoaded = false;

			var p1 = client.send('public.site.Rsakey', null)
				.done(function(result){
					rsaData = result;
				})

			var p2 = client.send('public.sign.BindIpUser', null)
				.done(function(result){
					if(result){
						$rootScope.$apply(function(){
							$rootScope.user = result;
							$rootScope.nick = result.nick
						})
					}
				})

			$.when(p1,p2).done(function(){
				$rootScope.$apply(function(){
					$rootScope.isLoaded = true;
				})
			})

			var $errorBox = $('#errorBox');
			function setError(s){
				$errorBox.text(s)
					.removeClass('hidden');
			}

			function clearError(){
				$errorBox.text('').addClass('hidden');
			}

			$('form[name=registion] :input').keydown(function(){
				clearError();
			})

			$rootScope.save = function(){
				var nick = $rootScope.nick,
					password = $rootScope.password,
					confirm = $rootScope.confirm_pwd,
					code = '';

				if(password != confirm){
					setError('两次输入的密码不匹配');
					return
				}

				client.send('public.sign.ChangePassword', {cipher : util.cipherString(nick, password), nick : nick, code: code})
					.done(function(result){
						console.log(result)
					})
			}
    	}])

		angular.bootstrap(document, ['app']);
		
});



