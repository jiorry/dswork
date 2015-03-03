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
	['appData', 'ajax', 'util'], 
	function (appData, ajax, util){
		require(['app', 'loader'], function(app, loader){
			
		});

		var rsaData,
			client = ajax.NewClient("/api/web");

		client.send('Rsakey', null)
			.done(function(result){
				ajax.serverTime.set(parseFloat(result.unix))
				rsaData = result;

				if(result.is_login){
					loginSuccess();
				}else{
					loginByIp();
				}
			})

		function loginByIp(){
			prepareFixIpLogin();

			client.send('LoginByIp', null)
				.done(function(result){
					if(result.success){
						appData.userVO = result.user;

						$('#gos-fix-ip-login img').attr('src', util.userAvatar(appData.userVO.avatar));
						$('#gos-current-user span').html(appData.userVO.nick);

						loginSuccess(0.5);

					}else
						prepareLoginForm();
				})
		}

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
			ajax.NewClient("/api/open").send('drawing.app.AppData', null)
				.done(function(result){
					appData.subjects = result.subjects;
					appData.projects = result.projects;
					appData.draw_sign_js = result.draw_sign_js;
					appData.draw_sign_sw = result.draw_sign_sw;
					appData.draw_sign_xmgl = result.draw_sign_xmgl;
					appData.draw_sign_xmjl = result.draw_sign_xmjl;
					appData.draw_sign_zt = result.draw_sign_zt;
					if(func){
						func();
					}
				})
		}

		function loginSuccess(delay){
			var showfunc = function(){
				$('#gos-loginContainer').removeClass('in').one('bsTransitionEnd', function(){
					$(this).addClass('hidden');
					$('#gos-container').removeClass('hidden').addClass('in');
				}).emulateTransitionEnd(150);
				bootstrapApp();
			}
			initAppData(function(){
				if(delay){
					window.setTimeout(function(){
						showfunc();
					}, delay * 1000)
				}else{
					showfunc()
				}
			})
		}

		function prepareFixIpLogin(){
			showLoginContainer();
			$('#gos-fix-ip-login').removeClass('hidden').addClass('in');
		}

		function prepareLoginForm(){
			showLoginContainer();
			$('#gos-fix-ip-login').addClass('hidden').removeClass('in');

			$('#gos-text-input-login').on('keypress', 'input', function(){
				$('#gos-login-message').text('');
			}).removeClass('hidden').addClass('in');

			$('#gos-text-input-login button.btn-primary').click(function(){
				var $box = $(this).parent(),
					obj = {login: $box.find('input[name=login]').val(), password: $box.find('input[name=password]').val()}

				var rsa = new RSAKey(),
					ts = Server.getTime().toString(),
					userkey = CryptoJS.MD5( ts + obj.login )
				rsa.setPublic(rsaData.hex, '10001');
				
				var cipher = rsa.encrypt(util.lpad(ts, '0', 16)+userkey.toString(CryptoJS.enc.Base64)),
					text = obj.login + "|" +obj.password;
				
				var aesCipher = util.aesEncrypto(text, ts, userkey);

				var s = rsaData.keyid.toString()+"|"+
						CryptoJS.enc.Hex.parse(cipher.toString()).toString(CryptoJS.enc.Base64)+"|"+
						aesCipher.toString();

				// /api/web UserLogin [cipher_string, is_remember?]
				var isRemember = $box.find('input[name=remember]').is(':checked');
				client.send('UserLogin', {cipher: s, remember: isRemember})
					.done(function(result){
						console.log(result);
						if(result.is_ok){
							loginSuccess();
						}else{
							if(result.message.indexOf('not found')>0){
								$('#gos-login-message').text('没有找到您的信息哦，是不是输错了？')
							}else{
								$('#gos-login-message').text('用户名密码不匹配，仔细检查一下啊')
							}
						}
							
					})
			})

		}

		function showLoginContainer (){
			$('#gos-loginContainer').removeClass('hidden').addClass('in')
				.children('div.gos-form-signin-box').removeClass('hidden').addClass('in');
		}

});



