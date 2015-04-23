define('loader', ['util', 'jquery'], function(util){
	var $goBack = $('#gos-goback'),
		$header = $('#gos-headerBarR');
	var loader = function(){
		this.defaultViewName = 'home.module';

		var $tViews = $('#gos-Views');
		
		this.getViewName = function ($location){
			var name = $location.$$path == '/' ? this.defaultViewName : $location.$$path;
			if(name.charAt(0)=='/')
				name = name.substr(1);

			return name.replace(/\//g, '.')
		}

		this.getViewPath = function ($location){
			var name = this.getViewName();
			return name.replace(/\./g, '/');
		}

		this.buildHeader = function(m){
			if(m.goBackButton == false){
				$goBack.hide();
			}else{
				$goBack.show();
			}

			if(m.headerHtml){
				$header.html(m.headerHtml);
			}else{
				$header.empty();
			}

   			util.setTitle(m.title);
		}

		this.loadview = function(name, templateUrl, $q, $rootScope){
			var pathConfig = {},
				defer = $q.defer(),
				thisClas = this,
				path = templateUrl.substr(0, templateUrl.indexOf('.html'));

			pathConfig[name] = path;

			require.config({paths: pathConfig});
			require([name], function (m){
				if(m && m.i18n){
					var lang = $rootScope.language,
						arr = name.split('.');

					lang = lang==''?'en_US':lang;
					window._gos.transData = window._gos.transData || {}
					if(window._gos.transData[name]){
						defer.resolve();
					}else{
						// path = /page/home.module
						// toPath = /page/home/locales/lang/module.json
						$.getJSON(path.substr(0, path.indexOf(arr.join('/'))) + '/' + arr[0] + '/locales/'+lang+'/'+arr[1]+'.json?v='+JsVersion)
							.success(function(result){
								window._gos.transData[name] = result;
								defer.resolve();

							}).fail(function(){
								lang = 'en_US';
								$.getJSON(window._gos.srcPath + path + '/locales/'+lang+'/'+typ+'.json?v='+JsVersion)
									.success(function(result){
										window._gos.transData[name] = result;
										defer.resolve();

									})
							})
					}
				}else{
					defer.resolve();
				}

				thisClas.buildHeader(m);

			}, function(err){
				defer.reject ();
			});

			return defer.promise;
		}
	};

	return new loader();
});



