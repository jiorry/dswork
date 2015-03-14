({
	// optimize: "none",
	paths: {
		'ngEditor' : 'directive/editor',
		'ngDatetimePicker' : 'directive/datetimePicker',
		'ngBootstrapSwitch' : 'directive/bootstrapSwitch',
		'ngViewExplorer' : 'directive/viewExplorer',

		'app' : 'mylib/app',
		'appData' : 'mylib/appData',
		'loader' : 'mylib/loader',
		'util' : 'mylib/util',
		'ajax' : 'mylib/ajax',
		'gosEditor' : 'mylib/gos.editor',

		'crypto' : 'empty:',
		'jquery' : 'empty:'
	},
	shim: {
	    'app':{
			deps: ['angular', 'angular-route', 'angular-animate', 'angular-resource','jquery']
		}
	},

	baseUrl : "../dev",
	removeCombined : true,
	modules: [
		{
			name : 'angular',
			create: false,
			include : ['angular-route','angular-animate','angular-resource']
		},
		{
			name : 'page/Index',
			create: false,
			exclude : ['angular','angular-route','angular-animate','angular-resource']
		},
		{
			name : 'page/Password',
			create: false,
			exclude : ['angular','angular-route','angular-animate','angular-resource']
		},
		{
			name : 'page/Error',
			create: false,
			exclude : ['angular','angular-route','angular-animate','angular-resource']
		}

	],

	dir : '../pro'
})