window._gos = window._gos || {};

require.config({
	baseUrl : "/assets/js/",
	paths: {
		'ngEditor' : 'dev/directive/editor',
		'ngDatetimePicker' : 'dev/directive/datetimePicker',
		'ngBootstrapSwitch' : 'dev/directive/bootstrapSwitch',
		'ngViewExplorer' : 'dev/directive/viewExplorer',

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
	['appData', 'ajax', 'util', 'crypto'], 
	function (appData, ajax, util){
		require(['app', 'loader'], function(app, loader){
			
		});

		var rsaData,
			client = ajax.NewClient("/api/open");

		client.send('public.site.Rsakey', null)
			.done(function(result){
				ajax.serverTime.set(parseFloat(result.unix))
				rsaData = result;

				if(result.is_login){
					appData.user = result.user;
					loginSuccess(1);
				}else{
					prepareLoginForm();
				}
			})

		function bootstrapApp(){
			require(['app', 'ngViewExplorer'], function(app){
				app.config(['$routeProvider', '$locationProvider', '$controllerProvider', '$compileProvider', '$filterProvider', '$provide',
					function($routeProvider, $locationProvider, $controllerProvider, $compileProvider, $filterProvider, $provide) {
							app.controller = $controllerProvider.register;
					        app.directive  = $compileProvider.directive;
					        app.filter     = $filterProvider.register;
					        app.factory    = $provide.factory;
					        app.service    = $provide.service;

						    // use the HTML5 History API
						    $locationProvider.html5Mode(true);
						    // app.controller = $controllerProvider.register;
						}])

				app.run(['$rootScope', function($rootScope){
					$rootScope.goBack = function(){
						window.history.go(-1);
					}

					$rootScope.tabPaneNext = function(e){
						var $t = $(e.target);
						if($t.attr('disabled'))
							return;
						
						$t.closest('.pager').addClass('hidden')
							.closest('div.tab-pane')
							.next().removeClass('hidden').addClass('active').addClass('in');
					}
		    	}])

				angular.bootstrap(document, ['app']);
			});
		}

		function initAppData(func){
			client.send('drawing.app.AppData', null)
				.done(function(result){
					appData.subjects = result.subjects;
					appData.projects = result.projects;
					appData.draw_js_users = result.draw_js_users;
					appData.draw_sw_users = result.draw_sw_users;
					appData.draw_xmgl_users = result.draw_xmgl_users;
					appData.draw_xmjl_users = result.draw_xmjl_users;
					appData.draw_zt_users = result.draw_zt_users;

					appData.draw_js_user_ids = result.draw_js_user_ids;
					appData.draw_sw_user_ids = result.draw_sw_user_ids;
					appData.draw_xmgl_user_ids = result.draw_xmgl_user_ids;
					appData.draw_xmjl_user_ids = result.draw_xmjl_user_ids;
					appData.draw_zt_user_ids = result.draw_zt_user_ids;

					if(func){
						func();
					}
				})
		}

		function loginSuccess(delay){
			$('#gos-current-user span').text(appData.user.nick);

			var showfunc = function(){
				$('#gos-loginContainer').removeClass('in').one('bsTransitionEnd', function(){
					$(this).addClass('hidden');
					$('#gos-container').removeClass('hidden').addClass('in');
				}).emulateTransitionEnd(150);
				bootstrapApp();
			}
			initAppData(function(){
				if(delay){
					showAlreadySignin();
					window.setTimeout(function(){
						showfunc();
					}, delay * 1200)
				}else{
					showfunc()
				}
			})
		}


		function showAlreadySignin(){
			showLoginContainer();
			var $t = $('#gos-already-signin').removeClass('hidden').addClass('in');
			$t.find('img').attr('src', appData.user.avatar).removeClass('hidden');
			$t.find('span').text(appData.user.nick);
		}

		function prepareLoginForm(){
			showLoginContainer();

			var $loginMessage = $('#gos-login-message');
				$loginForm = $('#gos-login-form-signin');

			$loginForm.removeClass('hidden').addClass('in');

			function doError(s){
				$loginMessage.removeClass('hidden');
				$loginMessage.text(s);
			}
			function clearError(s){
				$loginMessage.addClass('hidden');
				$loginMessage.text('');
			}

			client.send('public.sign.BindIpUser', null)
				.done(function(result){
					appData.bindedUser = result;
					if(appData.bindedUser.status==0){
						window.location.href='/password'
						return;
					}

					if(result && result.nick!=''){
						$loginForm.find(':input[name=login]').val(result.nick).attr('disabled', 'disabled');
						$loginForm.find('img').attr('src', result.avatar).parent().removeClass('hidden');
						$loginForm.find(':input[name=password]').focus();
					}
				});

			$loginForm.removeClass('hidden').addClass('in');

			$loginForm.on('keypress', 'input', function(){
				clearError();
			}).removeClass('hidden').addClass('in');

			$loginForm.keypress(function(e){
				if(e.keyCode == 13) {
					$loginForm.find('button.btn-primary').trigger('click');
				}
			})

			$loginForm.find('button.btn-primary').click(function(){
				var $box = $(this).parent(),
					nick = $box.find('input[name=login]').val(), 
					password = $box.find('input[name=password]').val();

				// /api/web UserLogin [cipher_string, is_remember?]
				
				client.send('public.sign.UserLogin', {cipher: util.cipherString(rsaData, nick, password)})
					.done(function(result){
						appData.user = result;
						loginSuccess();
							
					}).fail(function(jqXHR){
						var err = JSON.parse(jqXHR.responseText)
						doError(err.message);
						
					})
			})

		}

		function showLoginContainer (){
			$('#gos-loginContainer').removeClass('hidden').addClass('in')
				.children('div.gos-form-signin-box').removeClass('hidden').addClass('in');
		}

});



