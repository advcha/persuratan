app.controller('SuratKeluarController', function (Restangular,$scope,$location,$rootScope,$modal,Flash,uiGridConstants,LoginSetting,ScreenSetting) {
	console.log(Math.floor(Date.now() / 1000));
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
				document.getElementById('suratkeluar').style.maxWidth = getWidth;
				$(".title_grid").css('max-width',getWidth);
				$(".ui-grid-viewport").css('max-width',getWidth);

				$(".nav li.active").removeClass("active");
				$('#nav_suratkeluar').addClass('active');
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
			//gridApi.selection.on.dblClick($scope, function(row) {
				/*if (selectedRow) {
					$scope.open(selectedRow.entity);
				}*/
				//alert("ok");
			//});
		},
		enablePaginationControls: true,
		paginationPageSizes: [10, 25, 50, 75, 100],
		paginationPageSize: ScreenSetting.state.grid_row_counter_per_page,
		enableRowSelection: true,
		enableRowHeaderSelection: false,
		/*rowTemplate:'<div ng-dblclick="grid.appScope.rowDblClick(row)"><div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }" ui-grid-cell></div></div>'*/
		/*appScopeProvider: { 
			onDblClick : function(row) {
				alert("ok");
			 }
		}*/
	}; 
	//,cellTemplate:'app/templates/edit-button.html'
	$scope.gridOptions.columnDefs=[
		{name:'ID',field:'idsurat',visible:false},
		{name:'No.',field:'num',cellTemplate:'<div style="float:right;padding:5px;">{{row.entity.num}}</div>',width:'5%'},
		{name:'No Surat',field:'no_idx_full',width:'17%',cellTooltip:function (row, col) {
           return row.entity.no_idx_full;
        }},
		/*{name:'No Surat',field:'no_surat',width:'15%'},*/
		{name:'Tanggal Surat',field:'tgl_surat',width:'10%',cellFilter:'date',filterHeaderTemplate: '<div class="ui-grid-filter-container"><button ng-click="grid.appScope.searchDate()"><i class="fa fa-search"></i></button</div>'},
		{name:'Dari',field:'dari',width:'15%',cellTooltip:function (row, col) {
           return row.entity.dari;
        }},
		{name:'Tujuan',field:'tujuan',width:'15%',cellTooltip:function (row, col) {
           return row.entity.tujuan;
        }},
		{name:'Perihal',field:'perihal',width:'15%',cellTooltip:function (row, col) {
           return row.entity.perihal;
        }},
		{name:'Penandatangan',field:'penandatangan',width:'15%',cellTooltip:function (row, col) {
           return row.entity.penandatangan;
        }},
		{name:'File',field:'file_document',width:'7%',cellTemplate:'app/templates/image-button.html',enableFiltering:false},
		{name:' ',field:'',width:'15%',cellTemplate:'app/templates/edit-button.html',enableFiltering:false},
		{name:'file_prefix',field:'file_prefix',visible:false},
	];        
	$scope.gridOptions.minRowsToShow = ScreenSetting.state.grid_rows_counter;
	$scope.gridOptions.enableHorizontalScrollbar = uiGridConstants.scrollbars.ALWAYS;
	$scope.gridOptions.multiSelect = false;
	//$scope.gridOptions.modifierKeysToMultiSelect = false;	
	
	$scope.editRow=function(grid,row){
		$modal.open({
			templateUrl: 'app/templates/edit-surat-keluar.html',
			controller: 'EditSuratKeluarController',
			scope: $scope,
			resolve: {
				idsurat: function () { return row.entity.idsurat; }
			}
		});
	}
	
	$scope.addRow=function(){
		$modal.open({
			templateUrl: 'app/templates/edit-surat-keluar.html',
			controller: 'EditSuratKeluarController',
			scope: $scope,
			resolve: {
				idsurat: function () { return 0; }
			}
		});
	}
	
	$scope.deleteRow=function(grid,row){
		if(confirm("Apakah data ini ingin dihapus?")){
			Restangular.one('surat-keluar',row.entity.idsurat).remove().then(function(suratkeluar){
				var status=suratkeluar[0];
				var msg=suratkeluar[1];
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
		Restangular.all('surat-keluar').getList().then(function(suratkeluar){
			$scope.gridOptions.data = suratkeluar;
		});
	}
	
	$scope.$on('suratkeluar',function(event,suratkeluar){
		var status=suratkeluar[0];
		var msg=suratkeluar[1];
		if(status=='success'){
			populateData();
		}
		var getWidth=document.getElementById('ng-view').offsetWidth+"px";
		$(".alert").css('max-width',getWidth);
		Flash.create(status,msg);
	});
	
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
		Restangular.all('surat-keluar/searchdate').getList(filters).then(function(suratkeluar){
			$scope.gridOptions.data = suratkeluar;
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
app.controller('EditSuratKeluarController', function (Restangular,$rootScope,$scope,$location,$modalInstance,$timeout,Upload,idsurat) {
	$scope.data_suratkeluar={};
	$scope.data_found=0;
	$scope.idsurat=idsurat;
	var file_removed=[];

	$scope.jenissurat=Restangular.all('jenis-surat').getList().$object;
	$scope.bagian=Restangular.all('bagian').getList().$object;
	$scope.kodemasalah=Restangular.all('kode-masalah').getList().$object;
	$scope.penandatangan=Restangular.all('bagian').getList().$object;

	var date_now=new Date();
	$scope.bulan=["01","02","03","04","05","06","07","08","09","10","11","12"];
	$scope.tahun=[date_now.getFullYear(),date_now.getFullYear()-1];

	if($scope.idsurat==0){
		$scope.title_surat="Tambah";
		$scope.data_suratkeluar={tgl_surat:new Date()};
	}else{
		$scope.title_surat="Edit";
	}
		
	var editData=Restangular.one('surat-keluar',idsurat);
	editData.getList().then(function(suratkeluar){
		if(suratkeluar[0]){
			$scope.data_found=1;
			var file_doc="";
			if(suratkeluar[0].file_document)
				file_doc=suratkeluar[0].file_document.split(',');
			$scope.data_suratkeluar={
				'idsurat':suratkeluar[0].idsurat,
				'no_index':suratkeluar[0].no_index,
				'idjenissurat':suratkeluar[0].idjenissurat,
				'idbagian':suratkeluar[0].idbagian,
				'idkode':suratkeluar[0].idkodemasalah,
				'idbulan':suratkeluar[0].bulan,
				'idtahun':suratkeluar[0].tahun,
				/*'no_surat':suratkeluar[0].no_surat,*/
				'tgl_surat':suratkeluar[0].tgl_surat=="0000-00-00"?"":new Date(suratkeluar[0].tgl_surat),
				'dari':suratkeluar[0].dari,
				'tujuan':suratkeluar[0].tujuan,
				'perihal':suratkeluar[0].perihal,
				'idpenandatangan':suratkeluar[0].penandatangan,
				'lampiran':suratkeluar[0].lampiran,
				'file_document_edit':file_doc,
				'file_prefix':suratkeluar[0].file_prefix
			};
			$scope.idjenissurat=suratkeluar[0].idjenissurat;
			$scope.idbagian=suratkeluar[0].idbagian;
			$scope.idkode=suratkeluar[0].idkodemasalah;
			$scope.idbulan=suratkeluar[0].bulan;
			$scope.idtahun=suratkeluar[0].tahun;
			$scope.idpenandatangan=suratkeluar[0].penandatangan;
		}else{
			$scope.data_suratkeluar={
				idbulan:("0" + (date_now.getMonth() + 1)).slice(-2),
				idtahun:("0" + (date_now.getFullYear())).slice(-4)
			};
			//console.log("Data tidak ditemukan atau Data baru!");
		}
	});
	
	$scope.getLastNo=function(idjenissurat){
		if(idjenissurat){
			var sel_year=$scope.data_suratkeluar.idtahun;
			var sel_lastno=idjenissurat+'_'+sel_year;
			if($scope.idsurat==0){
				Restangular.one('surat-keluar').one('lastno',sel_lastno).getList().then(function(lastno){
					var getlastno=1;
					if(lastno[0]!==undefined){
						getlastno=parseInt(lastno[0].no_index);
						getlastno++;
					}
					$scope.data_suratkeluar.no_index=getlastno;
				});
			}else{
				var current_idjenissurat=$scope.current_idjenissurat;
				var current_no_index=$scope.current_no_index;
				if(idjenissurat==current_idjenissurat){
					$scope.data_suratkeluar.no_index=current_no_index;
				}else{
					Restangular.one('surat-keluar').one('lastno',sel_lastno).getList().then(function(lastno){
						var getlastno=1;
						if(lastno[0]!==undefined){
							getlastno=parseInt(lastno[0].no_index);
							getlastno++;
						}
						$scope.data_suratkeluar.no_index=getlastno;
					});
				}
			}
		}
	}
	
	$scope.save=function(){
		var err=0;
		if(!$scope.data_suratkeluar.idjenissurat){
			$scope.formSuratKeluar.idjenissurat.$error.required=true;
			$("#jenissurat_error").toggleClass('has-error');
			$("#show_err_jenissurat").toggleClass('show_err');
			err++;
		}
		if(!$scope.data_suratkeluar.no_index){
			$scope.formSuratKeluar.no_index.$error.required=true;
			$("#no_index_error").toggleClass('has-error');
			$("#show_err_no_index").toggleClass('show_err');
			err++;
		}
		if(!$scope.data_suratkeluar.idbagian){
			$scope.formSuratKeluar.idbagian.$error.required=true;
			$("#bagian_error").toggleClass('has-error');
			$("#show_err_bagian").toggleClass('show_err');
			err++;
		}
		if(!$scope.data_suratkeluar.idkode){
			$scope.formSuratKeluar.idkode.$error.required=true;
			$("#kode_error").toggleClass('has-error');
			$("#show_err_kode").toggleClass('show_err');
			err++;
		}
		if(!$scope.data_suratkeluar.idbulan){
			$scope.formSuratKeluar.idbulan.$error.required=true;
			$("#bulan_error").toggleClass('has-error');
			$("#show_err_bulan").toggleClass('show_err');
			err++;
		}
		if(!$scope.data_suratkeluar.idtahun){
			$scope.formSuratKeluar.idtahun.$error.required=true;
			$("#tahun_error").toggleClass('has-error');
			$("#show_err_tahun").toggleClass('show_err');
			err++;
		}

		if(err)
			return;

		if($scope.data_suratkeluar.no_index=="0"){
			$scope.formSuratKeluar.no_index.$error.zero=false;
			$("#no_urut").toggleClass('has-error',false);
			
			$scope.formSuratKeluar.no_index.$error.zero=true;
			$("#no_urut").toggleClass('has-error');
			return;
		}
		
		//check the no urut if it already exist in the db
		var check_no_index=Restangular.all('surat-keluar').customGET('check',{idsurat:$scope.idsurat,idjenissurat:$scope.data_suratkeluar.idjenissurat,no_index:$scope.data_suratkeluar.no_index});
		check_no_index.then(function(check){
			$scope.formSuratKeluar.no_index.$error.wrong=false;
			$("#no_urut").toggleClass('has-error',false);
			
			if(check[0]!==undefined){
				$scope.formSuratKeluar.no_index.$error.wrong=true;
				$("#no_urut").toggleClass('has-error');
				return;
			}
		});
		
		var js=_.filter($scope.jenissurat,{idjenissurat:$scope.data_suratkeluar.idjenissurat})[0];
		var b=_.filter($scope.bagian,{idbagian:$scope.data_suratkeluar.idbagian})[0];
		var k=_.filter($scope.kodemasalah,{idkode:$scope.data_suratkeluar.idkode})[0];
		var bln=$scope.data_suratkeluar.idbulan;
		var thn=$scope.data_suratkeluar.idtahun;
		var no_idx_full=js.singkatan + "-" + $scope.data_suratkeluar.no_index + "/" + b.kodettd + "/" + k.kodemasalah + "/" + bln + "/" + thn;
		
		
		//upload
		editData.file_document="";
		var file_prefix="";
		if($scope.data_suratkeluar.file_document){
			file_prefix=Math.floor(Date.now() / 1000);
			if($scope.data_suratkeluar.file_prefix)
				file_prefix=$scope.data_suratkeluar.file_prefix;
			var file=$scope.data_suratkeluar.file_document;
			file.upload = Upload.upload({
				url: 'http://persuratan/app/api/index.php/uploads',
				method: 'POST',
				data: {
					file: file,
					'file_prefix': file_prefix
				},
				sendFieldsAs: 'form',
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
		
		if($scope.data_suratkeluar.file_document_edit){
			file_prefix=$scope.data_suratkeluar.file_prefix;
			var filename_len=$scope.data_suratkeluar.file_document_edit.length;
			if(filename_len){
				var filename_edit="";
				for(i=0;i<filename_len;i++){
					filename_edit+=$scope.data_suratkeluar.file_document_edit[i]+",";
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
		editData.no_index=$scope.data_suratkeluar.no_index;
		editData.idjenissurat=$scope.data_suratkeluar.idjenissurat;
		editData.idbagian=$scope.data_suratkeluar.idbagian;
		editData.idkodemasalah=$scope.data_suratkeluar.idkode;
		editData.bulan=bln;
		editData.tahun=thn;
		editData.penandatangan=$scope.data_suratkeluar.idpenandatangan;
		if($scope.data_suratkeluar.tgl_surat){
			tgl_surat=$rootScope.getProperDate($scope.data_suratkeluar.tgl_surat);
			editData.tgl_surat=tgl_surat;
		}else
			editData.tgl_surat="";
		if($scope.data_suratkeluar.dari)
			editData.dari=$scope.data_suratkeluar.dari;
		else
			editData.dari="";
		if($scope.data_suratkeluar.tujuan)
			editData.tujuan=$scope.data_suratkeluar.tujuan;
		else
			editData.tujuan="";
		if($scope.data_suratkeluar.perihal)
			editData.perihal=$scope.data_suratkeluar.perihal;
		else
			editData.perihal="";
		if($scope.data_suratkeluar.lampiran)
			editData.lampiran=$scope.data_suratkeluar.lampiran;
		else
			editData.lampiran="";
		//return;
		editData.file_prefix=file_prefix;
		editData.file_removed=file_removed;
		
		if($scope.idsurat==0){
			editData.post().then(function(suratkeluar){
				//$scope.$emit('suratkeluar',suratkeluar);
				$scope.$parent.$emit('suratkeluar',suratkeluar);
			});
		}else{
			editData.put().then(function(suratkeluar){
				//$scope.$emit('suratkeluar',suratkeluar);
				$scope.$parent.$emit('suratkeluar',suratkeluar);
			});
		}
		//return;
		$modalInstance.dismiss('cancel');
	};
	
	$scope.removeFile=function(filename){
		var len=$scope.data_suratkeluar.file_document_edit.length;
		var file_document_mod=[];
		if(len){
			for(i=0;i<len;i++){
				if($scope.data_suratkeluar.file_document_edit[i]!=filename){
					file_document_mod.push($scope.data_suratkeluar.file_document_edit[i]);
				}else{
					file_removed.push(filename);
				}
			}
		}
		$scope.data_suratkeluar.file_document_edit=file_document_mod;
	};
});

