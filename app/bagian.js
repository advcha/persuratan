app.controller('BagianController', function (Restangular,$scope,$location,$rootScope,$modal,Flash,uiGridConstants,LoginSetting) {
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
				document.getElementById('bagian').style.maxWidth = getWidth;
				$(".title_grid").css('max-width',getWidth);
				$(".ui-grid-viewport").css('max-width',getWidth);

				$(".nav li.active").removeClass("active");
				$('#nav_bagian').addClass('active');
				//restore the setting when browser is refreshed
				$rootScope.nama_lengkap=LoginSetting.state.nama_lengkap;
				$rootScope.isAdmin=LoginSetting.state.isAdmin;
			}
		});
	}
    
	$scope.gridOptions={
		enableFiltering: false,
		onRegisterApi: function(gridApi){
			$scope.gridApi = gridApi;
		},
		enablePaginationControls: true,
		paginationPageSizes: [10, 25, 50, 75, 100],
		paginationPageSize: 10
	}; 

	$scope.gridOptions.columnDefs=[
		{name:'ID',field:'idbagian',visible:false},
		{name:'No.',field:'num',cellTemplate:'<div style="float:right;padding:5px;">{{row.entity.num}}</div>',width:'5%'},
		{name:'Bagian',field:'bagian',width:'35%'},
		{name:'Singkatan',field:'singkatan',width:'25%'},
		{name:'Kode Tanda Tangan',field:'kodettd',width:'20%'},
		{name:' ',field:'',cellTemplate:'app/templates/edit-button.html',enableFiltering:false}
	];        
	$scope.gridOptions.minRowsToShow = 11;
	$scope.gridOptions.enableHorizontalScrollbar = uiGridConstants.scrollbars.ALWAYS;	
	
	$scope.editRow=function(grid,row){
		$modal.open({
			templateUrl: 'app/templates/edit-bagian.html',
			controller: 'EditBagianController',
			resolve: {
				idbagian: function () { return row.entity.idbagian; }
			}
		});
	}
	
	$scope.addRow=function(){
		$modal.open({
			templateUrl: 'app/templates/edit-bagian.html',
			controller: 'EditBagianController',
			resolve: {
				idbagian: function () { return 0; }
			}
		});
	}
	
	$scope.deleteRow=function(grid,row){
		if(confirm("Apakah data ini ingin dihapus?")){
			Restangular.one('bagian',row.entity.idbagian).remove().then(function(bagian){
				var status=bagian[0];
				var msg=bagian[1];
				if(status=='success'){
					populateData();
				}
				var getWidth=document.getElementById('ng-view').offsetWidth+"px";
				$(".alert").css('max-width',getWidth);
				Flash.create(status,msg);
			});
		}
	}
	
	$scope.searchRow=function(){
		$scope.gridOptions.enableFiltering=!$scope.gridOptions.enableFiltering;
		$scope.gridApi.core.notifyDataChange( uiGridConstants.dataChange.COLUMN );
		clearAllFilter();
	}
	
	$scope.refreshRow=function(){
		clearAllFilter();
	}
	
	function clearAllFilter(){
		var columns = $scope.gridApi.grid.columns;
		for (var i = 0; i < columns.length; i++) {
			if (columns[i].enableFiltering) {
				columns[i].filters[0].term='';
			}
		}
	}
	  
	populateData();
	
	function populateData(){
		Restangular.all('bagian').getList().then(function(bagian){
			$scope.gridOptions.data = bagian;
		});
	}
	
	$rootScope.$on('bagian',function(event,bagian){
		var status=bagian[0];
		var msg=bagian[1];
		if(status=='success'){
			populateData();
		}
		var getWidth=document.getElementById('ng-view').offsetWidth+"px";
		$(".alert").css('max-width',getWidth);
		Flash.create(status,msg);
	});

    $rootScope.logout=function(){
		Restangular.all('logout').getList().then(function(){
			$location.path('login');
			document.getElementById('bg').className='';
			$rootScope.isMain=false;
		});
	}
});
app.controller('EditBagianController', function (Restangular,$scope,$location,$modalInstance,idbagian) {
	//$('#bagian').focus();
	$scope.data_bagian={};
	$scope.data_found=0;
	$scope.idbagian=idbagian;
	if($scope.idbagian==0){
		$scope.title_surat="Tambah";
	}else{
		$scope.title_surat="Edit";
	}
	var editData=Restangular.one('bagian',idbagian);
	editData.getList().then(function(bagian){
		if(bagian[0]){
			$scope.data_found=1;
			$scope.data_bagian={
				'idbagian':bagian[0].idbagian,
				'bagian':bagian[0].bagian,
				'singkatan':bagian[0].singkatan,
				'kodettd':bagian[0].kodettd
			};
		}else{
			console.log("Data tidak ditemukan atau Data baru!");
		}
	});
	
	$scope.save=function(){
		$scope.$broadcast('show-errors-check-validity');
		if($scope.formBagian.$valid){
			editData.bagian=$scope.data_bagian.bagian;
			editData.singkatan=$scope.data_bagian.singkatan;
			editData.kodettd=$scope.data_bagian.kodettd;
			if($scope.idbagian==0){
				editData.post().then(function(bagian){
					$scope.$emit('bagian',bagian);
				});
			}else{
				editData.put().then(function(bagian){
					$scope.$emit('bagian',bagian);
				});
			}
			//});
			$modalInstance.dismiss('cancel');
		}
	};
});

