app.factory('LoginSetting', ['$rootScope',
    function($rootScope) {
		var settings = {
			state: {
				nama_lengkap: "",
				isAdmin: false,
			},
		};

		function saveState() {
			sessionStorage.LoginSetting = angular.toJson(settings.state);
		}
		function restoreState() {
			settings.state = angular.fromJson(sessionStorage.LoginSetting);
		}
		$rootScope.$on("savestate", saveState);
		if (sessionStorage.LoginSetting) 
			restoreState();

		return settings;
    }
]);
app.factory('ScreenSetting', ['$rootScope',
    function($rootScope) {
		var screen_settings = {
			state: {
				grid_rows_counter: 11,
				grid_row_counter_per_page: 10,
			},
		};

		function saveState() {
			sessionStorage.ScreenSetting = angular.toJson(screen_settings.state);
		}
		function restoreState() {
			screen_settings.state = angular.fromJson(sessionStorage.ScreenSetting);
		}
		$rootScope.$on("savescreenstate", saveState);
		if (sessionStorage.ScreenSetting) 
			restoreState();

		return screen_settings;
    }
]);
