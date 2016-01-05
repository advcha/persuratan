app.controller('MainController', function (Restangular,$scope,$location,$rootScope,LoginSetting) {
    $scope.init=function(){
		Restangular.all('main').getList().then(function(main){
			var status=main[0];
			var msg=main[1];
			if(status=="error"){
				$location.path('login');
			}else{
				document.getElementById('bg').className='main-form';
				$rootScope.isMain=true;
				var getWidth=document.getElementById('ng-view').offsetWidth+"px";
				document.getElementById('logo_kejaksaan').style.maxWidth = getWidth;
				$("section.main-form").css('width',getWidth);
				$(".nav li.active").removeClass("active");
				$('#nav_main').addClass('active');
				//restore the setting when browser is refreshed
				$rootScope.nama_lengkap=LoginSetting.state.nama_lengkap;
				$rootScope.isAdmin=LoginSetting.state.isAdmin;
			}
		});
	}
    $rootScope.logout=function(){
		Restangular.all('logout').getList().then(function(){
			$location.path('login');
			document.getElementById('bg').className='';
			$rootScope.isMain=false;
		});
	}
});
