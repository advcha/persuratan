app.controller('JenisSuratController', function (Restangular,$scope,$location,$rootScope,$modal,Flash,uiGridConstants,LoginSetting) {
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
				document.getElementById('jenissurat').style.maxWidth = getWidth;
				$(".title_grid").css('max-width',getWidth);
				$(".ui-grid-viewport").css('max-width',getWidth);

				$(".nav li.active").removeClass("active");
				$('#nav_jenis_surat').addClass('active');
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
		{name:'ID',field:'idjenissurat',visible:false},
		{name:'No.',field:'num',cellTemplate:'<div style="float:right;padding:5px;">{{row.entity.num}}</div>',width:'5%'},
		{name:'Jenis Surat',field:'jenissurat',width:'35%'},
		{name:'Singkatan',field:'singkatan',width:'25%'},
		{name:' ',field:'',cellTemplate:'app/templates/edit-button.html',enableFiltering:false}
	];        
	$scope.gridOptions.minRowsToShow = 11;
	$scope.gridOptions.enableHorizontalScrollbar = uiGridConstants.scrollbars.ALWAYS;	
	
	$scope.editRow=function(grid,row){
		$modal.open({
			templateUrl: 'app/templates/edit-jenis-surat.html',
			controller: 'EditJenisSuratController',
			scope: $scope,
			resolve: {
				idjenissurat: function () { return row.entity.idjenissurat; }
			}
		});
	}
	
	$scope.addRow=function(){
		$modal.open({
			templateUrl: 'app/templates/edit-jenis-surat.html',
			controller: 'EditJenisSuratController',
			scope: $scope,
			resolve: {
				idjenissurat: function () { return 0; }
			}
		});
	}
	
	$scope.deleteRow=function(grid,row){
		if(confirm("Apakah data ini ingin dihapus?")){
			Restangular.one('jenis-surat',row.entity.idjenissurat).remove().then(function(jenissurat){
				var status=jenissurat[0];
				var msg=jenissurat[1];
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
		Restangular.all('jenis-surat').getList().then(function(jenissurat){
			$scope.gridOptions.data = jenissurat;
		});
	}
	
	$scope.$on('jenissurat',function(event,jenissurat){
		var status=jenissurat[0];
		var msg=jenissurat[1];
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

app.controller('EditJenisSuratController', function (Restangular,$scope,$location,$modalInstance,idjenissurat) {
	//$('#bagian').focus();
	$scope.data_jenissurat={};
	$scope.data_found=0;
	$scope.idjenissurat=idjenissurat;
	if($scope.idjenissurat==0){
		$scope.title_surat="Tambah";
	}else{
		$scope.title_surat="Edit";
	}
	var editData=Restangular.one('jenis-surat',idjenissurat);
	editData.getList().then(function(jenissurat){
		if(jenissurat[0]){
			$scope.data_found=1;
			$scope.data_jenissurat={
				'idjenissurat':jenissurat[0].idjenissurat,
				'jenissurat':jenissurat[0].jenissurat,
				'singkatan':jenissurat[0].singkatan
			};
		}else{
			console.log("Data tidak ditemukan atau Data baru!");
		}
	});
	
	$scope.save=function(){
		$scope.$broadcast('show-errors-check-validity');
		if($scope.formJenisSurat.$valid){
			editData.jenissurat=$scope.data_jenissurat.jenissurat;
			editData.singkatan=$scope.data_jenissurat.singkatan;
			if($scope.idjenissurat==0){
				editData.post().then(function(jenissurat){
					$scope.$parent.$emit('jenissurat',jenissurat);
				});
			}else{
				editData.put().then(function(jenissurat){
					$scope.$parent.$emit('jenissurat',jenissurat);
				});
			}
			//});
			$modalInstance.dismiss('cancel');
		}
	};
});

app.controller('KodeMasalahController', function (Restangular,$scope,$location,$rootScope,$modal,Flash,uiGridConstants,LoginSetting) {
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
				document.getElementById('kodemasalah').style.maxWidth = getWidth;
				$(".title_grid").css('max-width',getWidth);
				$(".ui-grid-viewport").css('max-width',getWidth);

				$(".nav li.active").removeClass("active");
				$('#nav_kode_masalah').addClass('active');
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
		{name:'ID',field:'idkode',visible:false},
		{name:'No.',field:'num',cellTemplate:'<div style="float:right;padding:5px;">{{row.entity.num}}</div>',width:'5%'},
		{name:'Kode Masalah',field:'kodemasalah',width:'15%'},
		{name:'Keterangan',field:'keterangan',width:'55%'},
		{name:' ',field:'',cellTemplate:'app/templates/edit-button.html',enableFiltering:false}
	];        
	$scope.gridOptions.minRowsToShow = 11;
	$scope.gridOptions.enableHorizontalScrollbar = uiGridConstants.scrollbars.ALWAYS;	
	
	$scope.editRow=function(grid,row){
		$modal.open({
			templateUrl: 'app/templates/edit-kode-masalah.html',
			controller: 'EditKodeMasalahController',
			scope: $scope,
			resolve: {
				idkode: function () { return row.entity.idkode; }
			}
		});
	}
	
	$scope.addRow=function(){
		$modal.open({
			templateUrl: 'app/templates/edit-kode-masalah.html',
			controller: 'EditKodeMasalahController',
			scope: $scope,
			resolve: {
				idkode: function () { return 0; }
			}
		});
	}
	
	$scope.deleteRow=function(grid,row){
		if(confirm("Apakah data ini ingin dihapus?")){
			Restangular.one('kode-masalah',row.entity.idkode).remove().then(function(kodemasalah){
				var status=kodemasalah[0];
				var msg=kodemasalah[1];
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
		Restangular.all('kode-masalah').getList().then(function(kodemasalah){
			$scope.gridOptions.data = kodemasalah;
		});
	}
	
	$scope.$on('kodemasalah',function(event,kodemasalah){
		var status=kodemasalah[0];
		var msg=kodemasalah[1];
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
app.controller('EditKodeMasalahController', function (Restangular,$scope,$location,$modalInstance,idkode) {
	//$('#bagian').focus();
	$scope.data_kodemasalah={};
	$scope.data_found=0;
	$scope.idkode=idkode;
	if($scope.idkode==0){
		$scope.title_surat="Tambah";
	}else{
		$scope.title_surat="Edit";
	}
	var editData=Restangular.one('kode-masalah',idkode);
	editData.getList().then(function(kodemasalah){
		if(kodemasalah[0]){
			$scope.data_found=1;
			$scope.data_kodemasalah={
				'idkode':kodemasalah[0].idkode,
				'kodemasalah':kodemasalah[0].kodemasalah,
				'keterangan':kodemasalah[0].keterangan
			};
		}else{
			console.log("Data tidak ditemukan atau Data baru!");
		}
	});
	
	$scope.save=function(){
		$scope.$broadcast('show-errors-check-validity');
		if($scope.formKodeMasalah.$valid){
			editData.kodemasalah=$scope.data_kodemasalah.kodemasalah;
			editData.keterangan=$scope.data_kodemasalah.keterangan;
			if($scope.idkode==0){
				editData.post().then(function(kodemasalah){
					$scope.$parent.$emit('kodemasalah',kodemasalah);
				});
			}else{
				editData.put().then(function(kodemasalah){
					$scope.$parent.$emit('kodemasalah',kodemasalah);
				});
			}
			//});
			$modalInstance.dismiss('cancel');
		}
	};
});

app.controller('TingkatanController', function (Restangular,$scope,$location,$rootScope,$modal,Flash,uiGridConstants,LoginSetting) {
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
				document.getElementById('tingkatan').style.maxWidth = getWidth;
				$(".title_grid").css('max-width',getWidth);
				$(".ui-grid-viewport").css('max-width',getWidth);

				$(".nav li.active").removeClass("active");
				$('#nav_administrasi').addClass('active');
				$('#nav_tingkatan').addClass('active');
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
		{name:'ID',field:'iduserlevel',visible:false},
		{name:'No.',field:'num',cellTemplate:'<div style="float:right;padding:5px;">{{row.entity.num}}</div>',width:'5%'},
		{name:'Tingkatan',field:'userlevel',width:'50%'},
		{name:' ',field:'',cellTemplate:'app/templates/edit-button.html',enableFiltering:false}
	];        
	$scope.gridOptions.minRowsToShow = 11;
	$scope.gridOptions.enableHorizontalScrollbar = uiGridConstants.scrollbars.ALWAYS;	
	
	$scope.editRow=function(grid,row){
		$modal.open({
			templateUrl: 'app/templates/edit-tingkatan.html',
			controller: 'EditTingkatanController',
			scope: $scope,
			resolve: {
				iduserlevel: function () { return row.entity.iduserlevel; }
			}
		});
	}
	
	$scope.addRow=function(){
		$modal.open({
			templateUrl: 'app/templates/edit-tingkatan.html',
			controller: 'EditTingkatanController',
			scope: $scope,
			resolve: {
				iduserlevel: function () { return 0; }
			}
		});
	}
	
	$scope.deleteRow=function(grid,row){
		if(confirm("Apakah data ini ingin dihapus?")){
			Restangular.one('tingkatan',row.entity.iduserlevel).remove().then(function(tingkatan){
				var status=tingkatan[0];
				var msg=tingkatan[1];
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
		Restangular.all('tingkatan').getList().then(function(tingkatan){
			$scope.gridOptions.data = tingkatan;
		});
	}
	
	$scope.$on('tingkatan',function(event,tingkatan){
		var status=tingkatan[0];
		var msg=tingkatan[1];
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
app.controller('EditTingkatanController', function (Restangular,$scope,$location,$modalInstance,iduserlevel) {
	//$('#bagian').focus();
	$scope.data_tingkatan={};
	$scope.data_found=0;
	$scope.iduserlevel=iduserlevel;
	if($scope.iduserlevel==0){
		$scope.title_surat="Tambah";
	}else{
		$scope.title_surat="Edit";
	}
	var editData=Restangular.one('tingkatan',iduserlevel);
	editData.getList().then(function(tingkatan){
		if(tingkatan[0]){
			$scope.data_found=1;
			$scope.data_tingkatan={
				'iduserlevel':tingkatan[0].iduserlevel,
				'userlevel':tingkatan[0].userlevel
			};
		}else{
			console.log("Data tidak ditemukan atau Data baru!");
		}
	});
	
	$scope.save=function(){
		$scope.$broadcast('show-errors-check-validity');
		if($scope.formTingkatan.$valid){
			editData.userlevel=$scope.data_tingkatan.userlevel;
			if($scope.iduserlevel==0){
				editData.post().then(function(tingkatan){
					$scope.$parent.$emit('tingkatan',tingkatan);
				});
			}else{
				editData.put().then(function(tingkatan){
					$scope.$parent.$emit('tingkatan',tingkatan);
				});
			}
			//});
			$modalInstance.dismiss('cancel');
		}
	};
});


app.controller('PenggunaController', function (Restangular,$scope,$location,$rootScope,$modal,Flash,uiGridConstants,LoginSetting) {
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
				document.getElementById('pengguna').style.maxWidth = getWidth;
				$(".title_grid").css('max-width',getWidth);
				$(".ui-grid-viewport").css('max-width',getWidth);

				$(".nav li.active").removeClass("active");
				$('#nav_administrasi').addClass('active');
				$('#nav_pengguna').addClass('active');
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
		{name:'ID',field:'iduser',visible:false},
		{name:'No.',field:'num',cellTemplate:'<div style="float:right;padding:5px;">{{row.entity.num}}</div>',width:'5%'},
		{name:'Pengguna',field:'user',width:'20%'},
		{name:'Nama Lengkap',field:'nama_lengkap',width:'25%'},
		{name:'Tingkatan Pengguna',field:'userlevel',width:'25%'},
		{name:' ',field:'',cellTemplate:'app/templates/edit-button.html',enableFiltering:false}
	];        
	$scope.gridOptions.minRowsToShow = 11;
	$scope.gridOptions.enableHorizontalScrollbar = uiGridConstants.scrollbars.ALWAYS;	
	
	$scope.editRow=function(grid,row){
		$modal.open({
			templateUrl: 'app/templates/edit-pengguna.html',
			controller: 'EditPenggunaController',
			scope: $scope,
			resolve: {
				iduser: function () { return row.entity.iduser; }
			}
		});
	}
	
	$scope.addRow=function(){
		$modal.open({
			templateUrl: 'app/templates/edit-pengguna.html',
			controller: 'EditPenggunaController',
			scope: $scope,
			resolve: {
				iduser: function () { return 0; }
			}
		});
	}
	
	$scope.deleteRow=function(grid,row){
		if(confirm("Apakah data ini ingin dihapus?")){
			Restangular.one('pengguna',row.entity.iduser).remove().then(function(pengguna){
				var status=pengguna[0];
				var msg=pengguna[1];
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
		Restangular.all('pengguna').getList().then(function(pengguna){
			$scope.gridOptions.data = pengguna;
		});
	}
	
	$scope.$on('pengguna',function(event,pengguna){
		var status=pengguna[0];
		if(status=='error')
			status='danger';
		var msg=pengguna[1];
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
app.controller('EditPenggunaController', function (Restangular,$scope,$location,$modalInstance,iduser) {
	//$('#bagian').focus();
	$scope.data_pengguna={};
	$scope.data_found=0;
	$scope.iduser=iduser;
	$scope.iduserlevel=null;
	if($scope.iduser==0){
		$scope.title_surat="Tambah";
		$scope.password_1="";
		$scope.password_2="(Lagi)";
	}else{
		$scope.title_surat="Edit";
		$scope.password_1="Lama ";
		$scope.password_2="Baru";
	}
	var editData=Restangular.one('pengguna',iduser);
	editData.getList().then(function(pengguna){
		if(pengguna[0]){
			$scope.data_found=1;
			$scope.data_pengguna={
				'iduser':pengguna[0].iduser,
				'user':pengguna[0].user,
				'nama_lengkap':pengguna[0].nama_lengkap,
				'iduserlevel':pengguna[0].iduserlevel
			};
			$scope.iduserlevel=pengguna[0].iduserlevel;
		}else{
			console.log("Data tidak ditemukan atau Data baru!");
		}
	});
	
	$scope.save=function(){
		$scope.$broadcast('show-errors-check-validity');
		if($scope.formPengguna.$valid){
			if($scope.iduser==0){
				if($scope.data_pengguna.password != $scope.data_pengguna.password2){
					$scope.formPengguna.password2.$error.wrong=true;
					$("#confirm_pass").toggleClass('has-error');
					return;
				}
			}

			editData.user=$scope.data_pengguna.user;
			editData.password=$scope.data_pengguna.password;
			editData.password2=$scope.data_pengguna.password2;
			editData.nama_lengkap=$scope.data_pengguna.nama_lengkap;
			editData.iduserlevel=$scope.data_pengguna.iduserlevel;
			if($scope.iduser==0){
				editData.post().then(function(pengguna){
					$scope.$parent.$emit('pengguna',pengguna);
				});
			}else{
				editData.put().then(function(pengguna){
					$scope.$parent.$emit('pengguna',pengguna);
				});
			}
			$modalInstance.dismiss('cancel');
		}
	};
	
	$scope.userlevels=Restangular.all('tingkatan').getList().$object;
});

