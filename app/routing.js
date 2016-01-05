app.config(function(RestangularProvider,$stateProvider,$urlRouterProvider,$locationProvider){
	//
	RestangularProvider.setBaseUrl('/app/api/index.php');
	// add a response intereceptor
	RestangularProvider.addResponseInterceptor(function(data, operation, what, url, response, deferred) {
	  var extractedData;
	  // .. to look for getList operations
	  if (operation === "getList") {
		// .. and handle the data and meta data
		extractedData = data.result;
		//extractedData = data.message;
		//extractedData.error = data.error;
		//extractedData.paging = data.paging;
	  } else {
		extractedData = data.result;
	  }
	  return extractedData;
	});
    // For any unmatched url, redirect to /login
    $urlRouterProvider.otherwise("/login");
    //
    // Now set up the states
    $stateProvider
		.state('login', {
			url: "/login",
			templateUrl: "app/views/login.html",
			controller: 'LoginController'
		})
		.state('main', {
			url: '/main',
			templateUrl: "app/views/main.html",
			controller: 'MainController'/*,
			authenticate: true*/
		})
		.state('surat-masuk',{
			url: '/surat-masuk',
			templateUrl: "app/views/surat-masuk.html",
			controller: 'SuratMasukController'
		})
		.state('surat-keluar',{
			url: '/surat-keluar',
			templateUrl: "app/views/surat-keluar.html",
			controller: 'SuratKeluarController'
		})
		.state('bagian',{
			url: '/bagian',
			templateUrl: "app/views/bagian.html",
			controller: 'BagianController'
		})
		.state('jenis-surat',{
			url: '/jenis-surat',
			templateUrl: "app/views/jenis-surat.html",
			controller: 'JenisSuratController'
		})
		.state('kode-masalah',{
			url: '/kode-masalah',
			templateUrl: "app/views/kode-masalah.html",
			controller: 'KodeMasalahController'
		})
		.state('laporan',{
			url: '/laporan',
			templateUrl: "app/views/laporan.html",
			controller: 'LaporanController'
		})
		.state('tingkatan',{
			url: '/tingkatan',
			templateUrl: "app/views/tingkatan.html",
			controller: 'TingkatanController'
		})
		.state('pengguna',{
			url: '/pengguna',
			templateUrl: "app/views/pengguna.html",
			controller: 'PenggunaController'
		})
		/*.state('uploads',{
			url: '/uploads'
		})*/
      
    if(window.history && window.history.pushState){
		$locationProvider.html5Mode(true);
	}
})
.run(function($rootScope){
	$rootScope.nama_lengkap = "";
	$rootScope.isAdmin = false;
	var date_now=new Date();
	$rootScope.current_year=date_now.getFullYear();
	
	$rootScope.convertJSMonth=function (month){
		if(month==0)
			return "01";
		else if(month==1)
			return "02";
		else if(month==2)
			return "03";
		else if(month==3)
			return "04";
		else if(month==4)
			return "05";
		else if(month==5)
			return "06";
		else if(month==6)
			return "07";
		else if(month==7)
			return "08";
		else if(month==8)
			return "09";
		else if(month==9)
			return "10";
		else if(month==10)
			return "11";
		else if(month==11)
			return "12";
	};
	
	$rootScope.getMonthName=function (month){
		if(month=="01")
			return "JANUARI";
		else if(month=="02")
			return "FEBRUARI";
		else if(month=="03")
			return "MARET";
		else if(month=="04")
			return "APRIL";
		else if(month=="05")
			return "MEI";
		else if(month=="06")
			return "JUNI";
		else if(month=="07")
			return "JULI";
		else if(month=="08")
			return "AGUSTUS";
		else if(month=="09")
			return "SEPTEMBER";
		else if(month=="10")
			return "OKTOBER";
		else if(month=="11")
			return "NOVEMBER";
		else if(month=="12")
			return "DESEMBER";
	};
	
	$rootScope.getProperDate=function(tgl){
		tgl_date=new Date(tgl);
		return tgl_date.getFullYear()+"-"+$rootScope.convertJSMonth(tgl_date.getMonth())+"-"+tgl_date.getDate();
	};
	
	$rootScope.getPeriodeName=function(tgl,is_bln){
		var arr_tgl=tgl.split('-');
		if(is_bln)
			return $rootScope.getMonthName(arr_tgl[1])+" "+arr_tgl[0];
		else
			return arr_tgl[2]+" "+$rootScope.getMonthName(arr_tgl[1])+" "+arr_tgl[0];
	}
	
	window.onbeforeunload = function(event) {
		$rootScope.$broadcast('savestate');
		$rootScope.$broadcast('savescreenstate');
	};
});

