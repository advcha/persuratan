app.controller('LoginController', function (Restangular,$rootScope,$scope,$location,$window,LoginSetting,ScreenSetting) {
	var innerheight=$window.innerHeight;
	if(innerheight>=659){
		var calculate_margin_login_form=(innerheight-659)/2;
		var margin_login_form=calculate_margin_login_form+'px';
		$('.login-form > section').css({'margin-top':margin_login_form});
		
		var height_others_els=342;
		var grid_height=innerheight-height_others_els;
		var grid_rows_count=Math.floor(grid_height / 30);
		var min_rows_count=grid_rows_count+1;
		var min_page_count=10;
		if(grid_rows_count<=10)
			min_page_count=10;
		else{
			if(grid_rows_count<=25)
				min_page_count=25;
			else{
				if(grid_rows_count<=50)
					min_page_count=50;
				else{
					if(grid_rows_count<=75)
						min_page_count=75;
					else{
						min_page_count=100;
					}
				}
			}
		}
		ScreenSetting.state.grid_rows_counter=min_rows_count;
		ScreenSetting.state.grid_row_counter_per_page=min_page_count;
	}
    $scope.loginData={'username':'','password':''};
    $scope.closeAlert = function(index) {
		if($scope.alerts){
			$scope.alerts.splice(index, 1);
		}
	};
    $scope.login=function(){
		$scope.$broadcast('show-errors-check-validity');
		if($scope.formLogin.$valid){
			var loginObj=Restangular.all('login');
			var result=loginObj.getList({username:$scope.loginData.username,password:$scope.loginData.password});
			result.then(function(login){
				var status=login[0];
				var msg=login[1];
				//console.log(status+" "+msg);
				if(status=="error"){
					$scope.alerts=[
						{type:'error',msg:msg,show:true}
					];
				}else{
					$rootScope.nama_lengkap=msg['nama_lengkap'];
					LoginSetting.state.nama_lengkap=msg['nama_lengkap'];
					$rootScope.isAdmin=false;
					LoginSetting.state.isAdmin=false;
					if(msg['userlevel']=='Administrator'){
						$rootScope.isAdmin=true;
						LoginSetting.state.isAdmin=true;
					}
						
					$scope.closeAlert();
					$location.path('main');
				}
			});
		}
	}
    
});
