app.controller('LaporanController', function (Restangular,$scope,$location,$rootScope,$modal,$timeout,LoginSetting) {
    $scope.init=function(){
		Restangular.all('main').getList().then(function(main){
			var status=main[0];
			var msg=main[1];
			if(status=="error"){
				$location.path('login');
			}else{
				document.getElementById('bg').className='main-form';
				$rootScope.isMain=true;
				var getWidth=$('#ng-view').outerWidth();
				document.getElementById('laporan').style.maxWidth = getWidth;
				$(".title_grid").css('max-width',getWidth);
				$(".nav li.active").removeClass("active");
				$('#nav_laporan').addClass('active');
				//restore the setting when browser is refreshed
				$rootScope.nama_lengkap=LoginSetting.state.nama_lengkap;
				$rootScope.isAdmin=LoginSetting.state.isAdmin;
			}
		});
	}
	
	$scope.data_laporan={};//pls set/initialize this to empty array or we'd get undefined for 'jenislaporan'
	$scope.data_laporan.jenislaporan="surat_masuk";
	$scope.print_isclicked=false;
	$scope.show_bulan=false;
	$scope.show_tanggal=false;
	$scope.showdatepicker="";
	$scope.$watch('data_laporan.periode',function(value){
		if(value=="bulanan"){
			$scope.show_bulan=true;
			$scope.show_tanggal=false;
		}else if(value=="tanggal"){
			$scope.show_bulan=false;
			$scope.show_tanggal=true;	
			
			//BEGIN UI BOOTSTRAP DATEPICKER SETTING
			$scope.dateOptions = {
				'show-weeks': false
			};

			$scope.data_laporan.tgl_from = new Date();
			$scope.tglFromIsOpen = false;
			$scope.data_laporan.tgl_to = new Date();
			$scope.tglToIsOpen = false;

			$scope.tglFromDatePickerOpen = function ($event) {
				if ($event) {
					$event.preventDefault();
					$event.stopPropagation(); // This is the magic
				}
				$scope.tglFromIsOpen = true;
			};
			$scope.tglToDatePickerOpen = function ($event) {
				if ($event) {
					$event.preventDefault();
					$event.stopPropagation(); // This is the magic
				}
				$scope.tglToIsOpen = true;
			};
			//END UI BOOTSTRAP DATEPICKER SETTING		
		}
	});
	
	$scope.print=function(){
		bulan="";
		tgl_from="";
		tgl_to="";
		$scope.print_isclicked=true;
		if(!$scope.data_laporan.periode)
			return;
		else{
			if($scope.data_laporan.periode=='bulanan'){
				if(!$scope.data_laporan.bulan)
					return;
				else{
					bulan=$rootScope.getProperDate($scope.data_laporan.bulan);
				}
			}else{ 
				if($scope.data_laporan.periode=='tanggal'){
					if(!$scope.data_laporan.tgl_from || !$scope.data_laporan.tgl_to)
						return;
					else{
						tgl_from=$rootScope.getProperDate($scope.data_laporan.tgl_from);
						tgl_to=$rootScope.getProperDate($scope.data_laporan.tgl_to);
					}
				}else{
					console.log("Periode tidak diketahui");
					return;
				}
			}
		}
		var data={
			jenislaporan:$scope.data_laporan.jenislaporan,
			periode:$scope.data_laporan.periode,
			bulan:bulan,
			tgl_from:tgl_from,
			tgl_to:tgl_to
		};

		if($scope.data_laporan.jenislaporan=="surat_masuk"){
			$modal.open({
				templateUrl: 'app/templates/view-laporan.html',
				controller: 'ViewLaporanController',
				resolve: {
					data: function () { return data; }
				}
			});
		}else{
			$modal.open({
				templateUrl: 'app/templates/view-laporan-keluar.html',
				controller: 'ViewLaporanController',
				resolve: {
					data: function () { return data; }
				}
			});
		}
	}

    $rootScope.logout=function(){
		Restangular.all('logout').getList().then(function(){
			$location.path('login');
			document.getElementById('bg').className='';
			$rootScope.isMain=false;
		});
	}
});
app.controller('ViewLaporanController', function (Restangular,$rootScope,$scope,$modalInstance,$timeout,data) {
	$scope.data=data;
	$scope.result=[];
	$scope.jenissurat="";
	$scope.jenislaporan="";
	$scope.jumlah="0";
	var laporan=[];
	if($scope.data.periode=='bulanan'){
		$scope.jenislaporan="BULAN "+$rootScope.getPeriodeName($scope.data.bulan,true);
	}else{
		$scope.jenislaporan="TANGGAL "+$rootScope.getPeriodeName($scope.data.tgl_from,false)+" S/D "+$rootScope.getPeriodeName($scope.data.tgl_to,false);
	}
	
	if(data.jenislaporan=='surat_masuk'){
		$scope.jenissurat="SURAT MASUK";
		laporan=Restangular.all('surat-masuk').customGET('laporan',data);
	}else{
		$scope.jenissurat="SURAT KELUAR";
		laporan=Restangular.all('surat-keluar').customGET('laporan',data);
	}
	laporan.then(function(result){
		$scope.jumlah=result.length;
		if(result.length){
			for(i=0;i<result.length;i++){
				$scope.result.push(result[i]);
			}
			//console.log($scope.result);
			$modalInstance.opened.then(
				$timeout(function() {
					window.print();
				}, 1000)
			);
		}
	});
	
	$scope.printLaporan=function(){
		$modalInstance.opened.then(
			$timeout(function() {
				window.print();
			}, 0)
		);
	};
});
