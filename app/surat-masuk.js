app.controller('SuratMasukController', function (Restangular,$scope,$location,$rootScope,$modal,$window,Flash,uiGridConstants,LoginSetting,ScreenSetting) {
    $scope.init=function(){
		Restangular.all('main').getList().then(function(main){
			var status=main[0];
			var msg=main[1];
			if(status=="error"){
				$location.path('login');
			}else{
				document.getElementById('bg').className='main-form';
				$rootScope.isMain=true;
				//$rootScope.nama_lengkap="Satria Faestha";
				var getWidth=document.getElementById('ng-view').offsetWidth+"px";
				document.getElementById('suratmasuk').style.maxWidth = getWidth;
				$(".title_grid").css('max-width',getWidth);
				$(".ui-grid-viewport").css('max-width',getWidth);
				$(".nav li.active").removeClass("active");
				$('#nav_suratmasuk').addClass('active');
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
		paginationPageSize: ScreenSetting.state.grid_row_counter_per_page,
		enableRowSelection: true,
		enableRowHeaderSelection: false
	}; 

	$scope.gridOptions.columnDefs=[
		{name:'ID',field:'idsurat',visible:false},
		{name:'No.',field:'num',cellTemplate:'<div style="float:right;padding:5px;">{{row.entity.num}}</div>',width:'5%'},
		{name:'No Urut',field:'no_idx_full',width:'10%'},
		{name:'No Surat',field:'no_surat',width:'15%',cellTooltip:function (row, col) {
           return row.entity.no_surat;
        }},
		{name:'Tanggal Surat',field:'tgl_surat',width:'12%',cellFilter:'date',filterHeaderTemplate: '<div class="ui-grid-filter-container"><button ng-click="grid.appScope.searchDate()"><i class="fa fa-search"></i></button</div>'},
		{name:'Pengirim',field:'asal_surat',width:'15%',cellTooltip:function (row, col) {
           return row.entity.asal_surat;
        }},
		{name:'Perihal',field:'perihal',width:'15%',cellTooltip:function (row, col) {
           return row.entity.perihal;
        }},
		{name:'Disposisi',field:'disposisi',width:'15%',cellTooltip:function (row, col) {
           return row.entity.disposisi;
        }},
		{name:'Print',field:'',width:'7%',cellTemplate:'<div class="ui-grid-cell-contents" ng-if="row.entity.disposisi">  <button type="button" class="btn btn-xs btn-primary" ng-click="grid.appScope.printDisposisi(grid,row)"><i class="fa fa-search"></i> Print</button></div>',enableFiltering:false},
		{name:'File',field:'file_document',width:'7%',cellTemplate:'app/templates/image-button.html',enableFiltering:false},
		{name:' ',field:'',width:'15%',cellTemplate:'app/templates/edit-button.html',enableFiltering:false},
		{name:'file_prefix',field:'file_prefix',visible:false},
	];        
	//$scope.gridOptions.showGridFooter = true;
	//$scope.gridOptions.showColumnFooter = true;
	//$scope.gridOptions.minRowsToShow = 15;
	$scope.gridOptions.minRowsToShow = ScreenSetting.state.grid_rows_counter;
	$scope.gridOptions.enableHorizontalScrollbar = uiGridConstants.scrollbars.ALWAYS;	
	$scope.gridOptions.multiSelect = false;
	
	$scope.editRow=function(grid,row){
		$modal.open({
			templateUrl: 'app/templates/edit-surat-masuk.html',
			controller: 'EditSuratMasukController',
			scope: $scope,
			resolve: {
				idsurat: function () { return row.entity.idsurat; }
			}
		});
	}
	
	$scope.addRow=function(){
		$modal.open({
			templateUrl: 'app/templates/edit-surat-masuk.html',
			controller: 'EditSuratMasukController',
			scope: $scope,
			resolve: {
				idsurat: function () { return 0; }
			}
		});
	}
	
	$scope.deleteRow=function(grid,row){
		if(confirm("Apakah data ini ingin dihapus?")){
			Restangular.one('surat-masuk',row.entity.idsurat).remove().then(function(suratmasuk){
				var status=suratmasuk[0];
				var msg=suratmasuk[1];
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
	
	$scope.viewFiles=function(grid,row){
		var files_arr = row.entity.file_document.split(',');
		var file_prefix = row.entity.file_prefix;
		var files_obj=[];
		if(files_arr){
			for(i=0;i<files_arr.length;i++){
				var file_arr=files_arr[i].split('.');
				var ext=file_arr[file_arr.length-1];
				var obj={
					file:files_arr[i],
					extension:ext.toLowerCase()
				};
				files_obj.push(obj);
			}
		}
		$modal.open({
			templateUrl: 'app/templates/view-files.html',
			controller: 'ViewFilesController',
			resolve: {
				files: function () { return files_obj; },
				file_prefix: function () { return file_prefix; }
			}
		});
	}
	
	$scope.printDisposisi=function(grid,row){ 
		$modal.open({
			templateUrl: 'app/templates/print-kartu-disposisi.html',
			controller: 'PrintDisposisiController',
			resolve: {
				idsurat: function () { return row.entity.idsurat; }
			}
		});
	}
	
	$scope.refreshRow=function(){
		clearAllFilter();
		populateData();
	}
	
	function clearAllFilter(){
		var columns = $scope.gridApi.grid.columns;
		for (var i = 0; i < columns.length; i++) {
			if (columns[i].enableFiltering) {
				columns[i].filters[0].term='';
			}
		}
	}
	
	$scope.searchDate=function(){
		$modal.open({
			templateUrl: 'app/templates/search-date.html',
			controller: 'SearchDateController',
			scope: $scope
		});
	}
	  
	populateData();
	
	function populateData(){
		Restangular.all('surat-masuk').getList().then(function(suratmasuk){
			$scope.gridOptions.data = suratmasuk;
		});
	}
	
	//$rootScope.$on('suratmasuk',function(event,suratmasuk){
	$scope.$on('suratmasuk',function(event,suratmasuk){
		var status=suratmasuk[0];
		var msg=suratmasuk[1];
		if(status=='success'){
			populateData();
		}
		var getWidth=document.getElementById('ng-view').offsetWidth+"px";
		$(".alert").css('max-width',getWidth);
		Flash.create(status,msg);
	});
	
	//$rootScope.$on('searchDate',function(event,tgl){
	$scope.$on('searchDate',function(event,tgl){
		var tgl_from = tgl[0] || null;
		var tgl_to = tgl[1] || null;
		if(tgl_from){
			tgl_from=$rootScope.getProperDate(tgl_from);
		}
		if(tgl_to){
			tgl_to=$rootScope.getProperDate(tgl_to);
		}
		var filters={'tgl_from':tgl_from,'tgl_to':tgl_to};

		Restangular.all('surat-masuk/searchdate').getList(filters).then(function(suratmasuk){
			$scope.gridOptions.data = suratmasuk;
		});
	});
	
    $rootScope.logout=function(){
		Restangular.all('logout').getList().then(function(){
			$location.path('login');
			document.getElementById('bg').className='';
			$rootScope.isMain=false;
		});
	}
});
app.controller('EditSuratMasukController', function (Restangular,$rootScope,$scope,$location,$modalInstance,$timeout,Upload,idsurat) {
	$scope.data_suratmasuk={};
	$scope.data_found=0;
	var file_removed=[];
	
	$scope.jenissurat=Restangular.all('jenis-surat').getList().$object;
	$scope.bagian=Restangular.all('bagian-check').getList().$object;

	$scope.idsurat=idsurat;
	$scope.idjenissurat=null;
	if($scope.idsurat==0){
		$scope.title_surat="Tambah";
		$scope.data_suratmasuk={tgl_surat:new Date(),tgl_terima:new Date()};
	}else{
		$scope.title_surat="Edit";
	}
	var editData=Restangular.one('surat-masuk',idsurat);
	editData.getList().then(function(suratmasuk){
		if(suratmasuk[0]){
			$scope.data_found=1;
			var disposisi={};
			if(suratmasuk[0].idbagian){
				var checkit=suratmasuk[0].idbagian.split(',');
				for(i=0;i<checkit.length;i++){
					var val=checkit[i];
					disposisi[val]={isChecked:true};
				}
			}
			var file_doc="";
			if(suratmasuk[0].file_document)
				file_doc=suratmasuk[0].file_document.split(',');
			$scope.data_suratmasuk={
				'idsurat':suratmasuk[0].idsurat,
				'idjenissurat':suratmasuk[0].idjenissurat,
				'no_index':suratmasuk[0].no_index,
				'no_surat':suratmasuk[0].no_surat,
				'tgl_surat':suratmasuk[0].tgl_surat=="0000-00-00"?"":new Date(suratmasuk[0].tgl_surat),
				'tgl_terima':suratmasuk[0].tgl_terima=="0000-00-00"?"":new Date(suratmasuk[0].tgl_terima),
				'asal_surat':suratmasuk[0].asal_surat,
				'perihal':suratmasuk[0].perihal,
				'instruksi':suratmasuk[0].instruksi,
				'lampiran':suratmasuk[0].lampiran,
				'file_document_edit':file_doc, 
				'file_prefix':suratmasuk[0].file_prefix, 
				'disposisi':disposisi
			};
			$scope.idjenissurat=suratmasuk[0].idjenissurat;
			$scope.current_idjenissurat=suratmasuk[0].idjenissurat;
			$scope.current_no_index=suratmasuk[0].no_index;
		}else{
			console.log("Data tidak ditemukan atau Data baru!");
		}
	});
	
	$scope.getLastNo=function(idjenissurat){
		if(idjenissurat){
			if($scope.idsurat==0){
				Restangular.one('surat-masuk').one('lastno',idjenissurat).getList().then(function(lastno){
					var getlastno=1;
					if(lastno[0]!==undefined){
						getlastno=parseInt(lastno[0].no_index);
						getlastno++;
					}
					$scope.data_suratmasuk.no_index=getlastno;
				});
			}else{
				var current_idjenissurat=$scope.current_idjenissurat;
				var current_no_index=$scope.current_no_index;
				if(idjenissurat==current_idjenissurat){
					$scope.data_suratmasuk.no_index=current_no_index;
				}else{
					Restangular.one('surat-masuk').one('lastno',idjenissurat).getList().then(function(lastno){
						var getlastno=1;
						if(lastno[0]!==undefined){
							getlastno=parseInt(lastno[0].no_index);
							getlastno++;
						}
						$scope.data_suratmasuk.no_index=getlastno;
					});
				}
			}
		}
	}
	
	$scope.save=function(){
		var err=0;
		if(!$scope.data_suratmasuk.idjenissurat){
			$scope.formSuratMasuk.idjenissurat.$error.required=true;
			$("#jenissurat_error").toggleClass('has-error');
			$("#show_err_jenissurat").toggleClass('show_err');
			err++;
		}
		if(!$scope.data_suratmasuk.no_index){
			$scope.formSuratMasuk.no_index.$error.required=true;
			$("#no_index_error").toggleClass('has-error');
			$("#show_err_no_index").toggleClass('show_err');
			err++;
		}

		if(err)
			return;

		if($scope.data_suratmasuk.no_index=="0"){
			$scope.formSuratMasuk.no_index.$error.zero=false;
			$("#no_urut").toggleClass('has-error',false);
			
			$scope.formSuratMasuk.no_index.$error.zero=true;
			$("#no_urut").toggleClass('has-error');
			return;
		}
		
		//check the no urut if it already exist in the db
		var check_no_index=Restangular.all('surat-masuk').customGET('check',{idsurat:$scope.idsurat,idjenissurat:$scope.data_suratmasuk.idjenissurat,no_index:$scope.data_suratmasuk.no_index});
		check_no_index.then(function(check){
			$scope.formSuratMasuk.no_index.$error.wrong=false;
			$("#no_urut").toggleClass('has-error',false);
			
			if(check[0]!==undefined){
				//console.log(check[0].idsurat);
				$scope.formSuratMasuk.no_index.$error.wrong=true;
				$("#no_urut").toggleClass('has-error');
				return;
			}
		});

		var js=_.filter($scope.jenissurat,{idjenissurat:$scope.data_suratmasuk.idjenissurat})[0];
		var no_idx_full=js.singkatan + "-" + $scope.data_suratmasuk.no_index;
		
		//upload
		editData.file_document="";
		var file_prefix="";
		if($scope.data_suratmasuk.file_document){
			file_prefix=Math.floor(Date.now() / 1000);
			if($scope.data_suratmasuk.file_prefix)
				file_prefix=$scope.data_suratmasuk.file_prefix;
			var file=$scope.data_suratmasuk.file_document;
			file.upload = Upload.upload({
				url: 'http://persuratan/app/api/index.php/uploads',
				method: 'POST',
				/*file: file,*/
				data: {
					file: file,
					'file_prefix': file_prefix
				},
				sendFieldsAs: 'form',
				/*data: {file: file},*/
			});
			
			file.upload.then(function (response) {
				//console.log(response);
				
				$timeout(function () {
					file.result = response.data;
				});
			}, function (response) {
				if (response.status > 0)
					$scope.errorMsg = response.status + ': ' + response.data;
				
			}, function (evt) {
				// Math.min is to fix IE which reports 200% sometimes
				file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
			});
			//console.log(file);
			var file_num=file.length;
			var filename="";
			if(file_num>0){
				for(i=0;i<file_num;i++){
					filename+=file[i].name+",";
				}
				filename = filename.replace(/,\s*$/, "");
			}else{
				$scope.errorMsg="Dokumen tidak bisa diupload. Dokumen harus berupa gambar atau pdf saja.";
				return
			}
			editData.file_document=filename;
		}
		
		if($scope.data_suratmasuk.file_document_edit){
			file_prefix=$scope.data_suratmasuk.file_prefix;
			var filename_len=$scope.data_suratmasuk.file_document_edit.length;
			if(filename_len){
				var filename_edit="";
				for(i=0;i<filename_len;i++){
					filename_edit+=$scope.data_suratmasuk.file_document_edit[i]+",";
				}
				filename_edit = filename_edit.replace(/,\s*$/, "");
				if(editData.file_document){
					editData.file_document=filename_edit+","+editData.file_document;
				}else{
					editData.file_document=filename_edit;
				}
			}
		}
		
		editData.no_idx_full=no_idx_full;
		editData.no_index=$scope.data_suratmasuk.no_index;
		editData.idjenissurat=$scope.data_suratmasuk.idjenissurat;
		if($scope.data_suratmasuk.tgl_surat){
			tgl_surat=$rootScope.getProperDate($scope.data_suratmasuk.tgl_surat);
			editData.tgl_surat=tgl_surat;
		}else
			editData.tgl_surat="";
		if($scope.data_suratmasuk.tgl_terima){
			tgl_terima=$rootScope.getProperDate($scope.data_suratmasuk.tgl_terima);
			editData.tgl_terima=tgl_terima;
		}else
			editData.tgl_terima="";
		if($scope.data_suratmasuk.no_surat)
			editData.no_surat=$scope.data_suratmasuk.no_surat;
		else
			editData.no_surat="";
		if($scope.data_suratmasuk.asal_surat)
			editData.asal_surat=$scope.data_suratmasuk.asal_surat;
		else
			editData.asal_surat="";
		if($scope.data_suratmasuk.perihal)
			editData.perihal=$scope.data_suratmasuk.perihal;
		else
			editData.perihal="";
		if($scope.data_suratmasuk.instruksi)
			editData.instruksi=$scope.data_suratmasuk.instruksi;
		else
			editData.instruksi="";
		if($scope.data_suratmasuk.disposisi)
			editData.disposisi=$scope.data_suratmasuk.disposisi;
		else
			editData.disposisi="";
		if($scope.data_suratmasuk.lampiran)
			editData.lampiran=$scope.data_suratmasuk.lampiran;
		else
			editData.lampiran="";
		
		editData.file_prefix=file_prefix;
		editData.file_removed=file_removed;
		
		if($scope.idsurat==0){
			editData.post().then(function(suratmasuk){
				$scope.$parent.$emit('suratmasuk',suratmasuk);
			});
		}else{
			editData.put().then(function(suratmasuk){
				$scope.$parent.$emit('suratmasuk',suratmasuk);
			});
		}

		$modalInstance.dismiss('cancel');
	};
	
	$scope.removeFile=function(filename){
		var len=$scope.data_suratmasuk.file_document_edit.length;
		var file_document_mod=[];
		if(len){
			for(i=0;i<len;i++){
				if($scope.data_suratmasuk.file_document_edit[i]!=filename){
					file_document_mod.push($scope.data_suratmasuk.file_document_edit[i]);
				}else{
					file_removed.push(filename);
				}
			}
		}
		$scope.data_suratmasuk.file_document_edit=file_document_mod;
	};
});
app.controller('ViewFilesController', function ($scope,files,file_prefix) {
	$scope.files=files;
	$scope.file_prefix=file_prefix;
});

app.controller('PrintDisposisiController', function (Restangular,$scope,$modalInstance,$timeout,idsurat) {
	$scope.idsurat=idsurat;
	var editData=Restangular.one('surat-masuk',idsurat);
	editData.getList().then(function(suratmasuk){
		if(suratmasuk[0]){
			if(suratmasuk[0].idbagian){
				var arr_disposisi=[];
				var arr_bagian=suratmasuk[0].idbagian.split(',');
				if(arr_bagian.length){
					Restangular.all('bagian-check').getList().then(function(bagian){
						if(bagian.length){
							for(i=0;i<arr_bagian.length;i++){
								var id=arr_bagian[i];
								for(j=0;j<bagian.length;j++){
									if(bagian[j].idbagian==id){
										arr_disposisi.push(bagian[j].singkatan);
										break;
									}
								}
							}
							$scope.disposisi=arr_disposisi.join(", ");
						}
					});
				}
			}
			$scope.no_index=suratmasuk[0].no_index;
			$scope.no_idx_full=suratmasuk[0].no_idx_full;
			$scope.perihal=suratmasuk[0].perihal;
			$scope.no_surat=suratmasuk[0].no_surat;
			$scope.tgl_surat=suratmasuk[0].tgl_surat=="0000-00-00"?"":new Date(suratmasuk[0].tgl_surat);
			$scope.asal_surat=suratmasuk[0].asal_surat;
			$scope.instruksi=suratmasuk[0].instruksi;
			//$scope.disposisi=disposisi;
			
			$modalInstance.opened.then(
				$timeout(function() {
						window.print();
					}, 1000));
		}else{
			console.log("Data tidak ditemukan atau Data baru!");
		}
	});
	
	$scope.printDisposisi=function(){
		$modalInstance.opened.then(
			$timeout(function() {
				window.print();
			}, 0)
		);
	};
});

app.controller('SearchDateController', function ($scope,$location,$modalInstance) {
	$scope.searchDate=function(){
		var tgl=[$scope.tgl_from,$scope.tgl_to];
		$scope.$parent.$emit('searchDate',tgl);

		$modalInstance.dismiss('cancel');
	};
});
