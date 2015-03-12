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
			$rootScope.userBinded = null;
			$rootScope.isLoaded = false;
			var rsaData;

			var p1 = client.send('public.site.Rsakey', null)
				.done(function(result){
					rsaData = result;
				})

			var p2 = client.send('public.sign.BindIpUser', null)
				.done(function(result){
					if(result){
						$rootScope.$apply(function(){
							$rootScope.userBinded = result;
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
			function doError(s){
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
					confirm = $rootScope.confirm_pwd;

				if(password != confirm){
					doError('两次输入的密码不匹配');
					return
				}
				if(!$rootScope.userBinded){
					doError('您的电脑没有权限使用这个功能，请联系管理员');
					return
				} 
				if($rootScope.userBinded.status>0){
					doError('功能被限制，请与管理员联系，再次初始化您的登录密码');
					return
				}
				client.send('public.sign.InitPassword', {cipher : util.cipherString(rsaData, nick, password)})
					.done(function(result){
						window.location.href = "/"

					}).fail(function(jqXHR){
						var err = JSON.parse(jqXHR.responseText)
						doError(err.message);
					})


					
			}
    	}])

		angular.bootstrap(document, ['app']);
		
});



