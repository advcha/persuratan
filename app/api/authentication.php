<?php 
$app->get('/main', function() {
    $db = new DbHandler();
    $session = $db->getSession();
    if($session['iduser']){
		$response['status'] = "success";
		$response['message'] = "Selamat datang ".$session['iduser'];
	}else{
		$response['status'] = "error";
		$response['message'] = "Silahkan login terlebih dahulu!";
	}
    $result["result"]=array($response['status'],$response['message']);
	echo json_encode($result);
});
$app->get('/login/',function() use ($app){
	$response = array();
    $db = new DbHandler();
    
	$username = $app->request->get('username');
    $password = md5($app->request->get('password'));
    $query = "select u.*,l.userlevel from user u inner join userlevel l on u.iduserlevel=l.iduserlevel where user='$username' and password='$password'";
    $user = $db->getOneRecord($query);
    if ($user != NULL) {
        if($user['status']=="1"){
			$response['status'] = "success";
			//$response['message'] = "Selamat datang ".$user['nama_lengkap'];
			$response['message'] = array(
				'iduser'=>$user['iduser'],
				'nama_lengkap'=>$user['nama_lengkap'],
				'userlevel'=>$user['userlevel']
			);
			if (!isset($_SESSION)) {
				session_start();
			}
			$_SESSION['iduser'] = $user['iduser'];
			$_SESSION['nama_lengkap'] = $user['nama_lengkap'];
			$_SESSION['userlevel'] = $user['userlevel'];
		}else{
			$response['status'] = "error";
            $response['message'] = "Pengguna ini sudah di non-aktifkan!";
		}
    }else {
		$response['status'] = "error";
		$response['message'] = "Maaf, username dan password anda salah!";
	}
        
	$result["result"]=array($response['status'],$response['message']);
	echo json_encode($result);
});

/* BEGIN SURAT MASUK */
$app->get('/surat-masuk',function() use ($app){
	$response = array();
    $db = new DbHandler();
    
    $query = "select a.*,@rownum:=@rownum+1 as num from (select idsurat,no_idx_full,no_index,no_surat,if(tgl_surat='0000-00-00','',tgl_surat) as tgl_surat,asal_surat,perihal,file_document,file_prefix,GROUP_CONCAT(d.idbagian) idbagian,GROUP_CONCAT(b.singkatan) disposisi from surat_masuk m left join disposisi d ON m.idsurat=d.idsuratmasuk left join bagian b on d.idbagian=b.idbagian group by idsurat,no_idx_full,no_surat,tgl_surat,asal_surat,perihal,file_document,file_prefix) a, (select @rownum:=0) r order by a.tgl_surat desc, cast(a.no_index as unsigned) desc";
    $suratmasuk = $db->getRecords($query);
	$result["result"]=$suratmasuk;
	echo json_encode($result);
});

$app->get('/surat-masuk/:idsurat',function($idsurat) use ($app){
	$result=array();
    $db = new DbHandler();
    if($idsurat=='searchdate'){
		$tgl_from=$app->request->get('tgl_from');
		$tgl_to=$app->request->get('tgl_to');
		$searchdate="";
		if($tgl_from && $tgl_to){
			$searchdate="having tgl_surat between '".$tgl_from."' and '".$tgl_to."'";
		}else{
			if($tgl_from){
				$searchdate="having tgl_surat >= '".$tgl_from."'";
			}else if($tgl_to){
				$searchdate="having tgl_surat <= '".$tgl_to."'";
			}
		}
		$query = "select a.*,@rownum:=@rownum+1 as num from (select idsurat,no_idx_full,no_index,no_surat,if(tgl_surat='0000-00-00','',tgl_surat) as tgl_surat,asal_surat,perihal,file_document,file_prefix,GROUP_CONCAT(d.idbagian) idbagian,GROUP_CONCAT(b.singkatan) disposisi from surat_masuk m left join disposisi d ON m.idsurat=d.idsuratmasuk left join bagian b on d.idbagian=b.idbagian group by idsurat,no_idx_full,no_surat,tgl_surat,asal_surat,perihal,file_document,file_prefix ".$searchdate.") a, (select @rownum:=0) r order by a.tgl_surat desc, cast(a.no_index as unsigned) desc";
		$suratmasuk = $db->getRecords($query);
		$result["result"]=$suratmasuk;
	}else if($idsurat=='check'){
		$idsurat=$app->request->get('idsurat');
		$idjenissurat=$app->request->get('idjenissurat');
		$no_index=$app->request->get('no_index');
		$current_year=date('Y');

		$query="select idsurat from surat_masuk where idjenissurat=".$idjenissurat." and no_index='".$no_index."' and idsurat!=".$idsurat;
		if($idsurat==0){
			$query="select idsurat from surat_masuk where idjenissurat=".$idjenissurat." and no_index='".$no_index."'";
			$suratmasuk = $db->getOneRecord($query);
			
		}
		
		$suratmasuk = $db->getOneRecord($query);
		$result["result"]=array();
		if($suratmasuk){
			$result["result"]=array($suratmasuk);
		}
	}else if($idsurat=='laporan'){
		$periode=$app->request->get('periode');
		$bulan=$app->request->get('bulan');
		$tgl_from=$app->request->get('tgl_from');
		$tgl_to=$app->request->get('tgl_to');
		
		$searchdate="";
		if($periode=='bulanan'){
			$searchdate="having substring(tgl_surat,1,7)='".substr($bulan,0,7)."'";
		}else if($periode=='tanggal'){			
			$searchdate="having tgl_surat between '".$tgl_from."' and '".$tgl_to."'";
			if($tgl_from==$tgl_to)
				$searchdate="having tgl_surat='".$tgl_from."'";
		}
		
		if($searchdate){
			$query = "select a.*,@rownum:=@rownum+1 as num from (select idsurat,no_idx_full,no_index,no_surat,if(tgl_surat='0000-00-00','',tgl_surat) as tgl_surat,if(tgl_terima='0000-00-00','',tgl_terima) as tgl_terima,asal_surat,perihal,instruksi,lampiran,file_document,file_prefix,GROUP_CONCAT(d.idbagian) idbagian,GROUP_CONCAT(b.singkatan) disposisi from surat_masuk m left join disposisi d ON m.idsurat=d.idsuratmasuk left join bagian b on d.idbagian=b.idbagian group by idsurat,no_idx_full,no_surat,tgl_surat,asal_surat,perihal,file_document,file_prefix ".$searchdate.") a, (select @rownum:=0) r order by a.tgl_surat desc, cast(a.no_index as unsigned) desc";
			$suratmasuk = $db->getRecords($query);
			$result["result"]=$suratmasuk;
		}else{
			$result["result"]=array("result"=>"error");
		}
	}else{
		$query = "select idsurat,m.idjenissurat,jenissurat,no_idx_full,no_index,no_surat,if(tgl_surat='0000-00-00','',tgl_surat) as tgl_surat,if(tgl_surat='0000-00-00','',tgl_terima) as tgl_terima,asal_surat,perihal,instruksi,lampiran,file_document,file_prefix,GROUP_CONCAT(d.idbagian) idbagian from surat_masuk m inner join jenissurat j on m.idjenissurat=j.idjenissurat left join disposisi d ON m.idsurat=d.idsuratmasuk left join bagian b on d.idbagian=b.idbagian group by idsurat,no_idx_full,no_surat,tgl_surat,asal_surat,perihal,instruksi,file_document,file_prefix having m.idsurat=".$idsurat;
		
		$suratmasuk = $db->getOneRecord($query);
		$result["result"]=array();
		if($suratmasuk){
			$result["result"]=array($suratmasuk);
		}
	}
    
	echo json_encode($result);
});

$app->get('/surat-masuk/lastno/:idjenissurat',function($idjenissurat) use ($app){
	$result=array();
    $db = new DbHandler();
    if($idjenissurat){
		$current_year=date('Y');
		$query = "select no_index from surat_masuk where idjenissurat=".$idjenissurat." and YEAR(tgl_surat)=".$current_year." order by no_index desc";
		$lastno = $db->getOneRecord($query);
		$result["result"]=array();
		if($lastno){
			$result["result"]=array($lastno);
		}
	}else{
		$result["result"]=array("result"=>"error");
	}
    
	echo json_encode($result);
});

$app->put('/surat-masuk/:idsurat',function($idsurat) use ($app){
	$response = array();
    $db = new DbHandler();
    
    $r = json_decode($app->request->getBody());
    $no_idx_full=$r->no_idx_full;
    $no_index=$r->no_index;
    $idjenissurat=$r->idjenissurat;
    $tgl_surat=$r->tgl_surat;
    $tgl_terima=$r->tgl_terima;
    $no_surat=$r->no_surat;
    $asal_surat=$r->asal_surat;
    $perihal=$r->perihal;
    $instruksi=$r->instruksi;
    $disposisi=$r->disposisi;
    $lampiran=$r->lampiran;
    $file_document=$r->file_document;
    $file_prefix=$r->file_prefix;
    $file_removed=$r->file_removed;
    
    $query = "update surat_masuk set no_idx_full='".$no_idx_full."',no_index='".$no_index."',idjenissurat=".$idjenissurat.",tgl_surat='".$tgl_surat."',tgl_terima='".$tgl_terima."',no_surat='".$no_surat."',asal_surat='".$asal_surat."',perihal='".$perihal."',instruksi='".$instruksi."',lampiran='".$lampiran."',file_document='".$file_document."',file_prefix='".$file_prefix."' where idsurat=".$idsurat;
    $suratmasuk = $db->updateRecord($query);
    if($suratmasuk){
		if($disposisi){
			$add_edit_arr=array();
			$del_arr=array();
			foreach($disposisi as $d=>$v){
				if(json_decode(json_encode($v),true)['isChecked'])
					$add_edit_arr[]=$d;
				else
					$del_arr[]=$d;
			}
			if($add_edit_arr){
				//add new disposisi
				foreach($add_edit_arr as $n){
					$q="select * from disposisi where idsuratmasuk=".$idsurat." and idbagian=".$n;
					$found = $db->getOneRecord($q);
					if(!$found){
						$table_name = "disposisi";
						$data = array(
							'idsuratmasuk'=>$idsurat,
							'idbagian'=>$n
						);
						$disp = $db->insertRecord($table_name, $data);
					}
				}
			}
			
			if($del_arr){
				//delete the disposisi
				foreach($del_arr as $d){
					$q="delete from disposisi where idsuratmasuk=".$idsurat." and idbagian=".$d;
					$db->deleteRecord($q);
				}
			}
		}
		if($file_removed){
			foreach($file_removed as $f){
				$file_path='../../uploads/'.$file_prefix.'_'.$f;
				if(file_exists($file_path))
					unlink($file_path);
			}
		}
		$response['status'] = "success";
		$response['message'] = "Update data berhasil!";
	}else{
		$response['status'] = "error";
		$response['message'] = "Maaf, update data tidak berhasil!";
	}
	$result["result"]=array($response['status'],$response['message']);
	echo json_encode($result);
});

$app->post('/surat-masuk/0',function() use ($app){
	$response = array();
    $db = new DbHandler();
    
    $r = json_decode($app->request->getBody());
    $no_idx_full=$r->no_idx_full;
    $no_index=$r->no_index;
    $idjenissurat=$r->idjenissurat;    
    $tgl_surat=$r->tgl_surat;
    $tgl_terima=$r->tgl_terima;
    $no_surat=$r->no_surat;
    $asal_surat=$r->asal_surat;
    $perihal=$r->perihal;
    $instruksi=$r->instruksi;
    $disposisi=$r->disposisi;
    $lampiran=$r->lampiran;
    $file_document=$r->file_document;
    $file_prefix=$r->file_prefix;

	$table_name = "surat_masuk";
	$data = array(
		'no_idx_full'=>$no_idx_full,
		'no_index'=>$no_index,
		'idjenissurat'=>$idjenissurat,
		'tgl_surat'=>$tgl_surat,
		'tgl_terima'=>$tgl_terima,
		'no_surat'=>$no_surat,
		'asal_surat'=>$asal_surat,
		'perihal'=>$perihal,
		'instruksi'=>$instruksi,
		'lampiran'=>$lampiran,
		'file_document'=>$file_document,
		'file_prefix'=>$file_prefix
	);
	$suratmasuk = $db->insertRecord($table_name, $data);
	if ($suratmasuk != NULL) {
		if($disposisi){
			$table_name = "disposisi";
			foreach($disposisi as $key=>$value){
				if(json_decode(json_encode($value),true)['isChecked']){
					$d=array('idsuratmasuk'=>$suratmasuk,'idbagian'=>$key);
					$db->insertRecord($table_name, $d);
				}
			}
		}
		$response["status"] = "success";
		$response["message"] = "Tambah data berhasil";
	}else{
		$response['status'] = "error";
		$response['message'] = "Maaf, tambah data tidak berhasil!";
	}
	$result["result"]=array($response['status'],$response['message']);
	echo json_encode($result);
});

$app->delete('/surat-masuk/:idsurat',function($idsurat) use ($app){
	$response = array();
    $db = new DbHandler();
    
	//delete the disposisi first!
    $query_disposisi = "delete from disposisi where idsuratmasuk=".$idsurat;
    $db->deleteRecord($query_disposisi);
    //check the uploaded files and remove them if exist
    $query = "select file_document,file_prefix from surat_masuk where idsurat=".$idsurat;
	$suratmasuk = $db->getOneRecord($query);
	if($suratmasuk){
		if($suratmasuk['file_document']){
			$file_prefix=$suratmasuk['file_prefix'];
			$file_document=explode(",",$suratmasuk['file_document']);
			foreach($file_document as $f){
				$file_path='../../uploads/'.$file_prefix.'_'.$f;
				if(file_exists($file_path))
					unlink($file_path);
			}
		}
	}

    $query = "delete from surat_masuk where idsurat=".$idsurat;
    $suratmasuk = $db->deleteRecord($query);
    if($suratmasuk){
		$response['status'] = "success";
		$response['message'] = "Hapus data berhasil!";
	}else{
		$response['status'] = "error";
		$response['message'] = "Maaf, hapus data tidak berhasil!";
	}
	$result["result"]=array($response['status'],$response['message']);
	echo json_encode($result);
});
/* END SURAT MASUK */


/* BEGIN SURAT KELUAR */
$app->get('/surat-keluar',function() use ($app){
	$response = array();
    $db = new DbHandler();
    
    $query = "select a.*,@rownum:=@rownum+1 as num from (select idsurat,no_idx_full,no_index,if(tgl_surat='0000-00-00','',tgl_surat) as tgl_surat,dari,tujuan,perihal,b.bagian as penandatangan,file_document,file_prefix from surat_keluar k left join bagian b on k.penandatangan=b.idbagian) a, (select @rownum:=0) r order by a.tgl_surat desc, cast(a.no_index as unsigned) desc";
    $suratkeluar = $db->getRecords($query);
	$result["result"]=$suratkeluar;
	echo json_encode($result);
});

$app->get('/surat-keluar/:idsurat',function($idsurat) use ($app){
	$result=array();
    $db = new DbHandler();    
	
	if($idsurat=='searchdate'){
		$tgl_from=$app->request->get('tgl_from');
		$tgl_to=$app->request->get('tgl_to');
		$searchdate="";
		if($tgl_from && $tgl_to){
			$searchdate="where tgl_surat between '".$tgl_from."' and '".$tgl_to."'";
		}else{
			if($tgl_from){
				$searchdate="where tgl_surat >= '".$tgl_from."'";
			}else if($tgl_to){
				$searchdate="where tgl_surat <= '".$tgl_to."'";
			}
		}
		$query = "select a.*,@rownum:=@rownum+1 as num from (select idsurat,no_idx_full,no_index,if(tgl_surat='0000-00-00','',tgl_surat) as tgl_surat,dari,tujuan,perihal,b.bagian as penandatangan,file_document,file_prefix from surat_keluar k left join bagian b on k.penandatangan=b.idbagian ".$searchdate.") a, (select @rownum:=0) r order by a.tgl_surat desc, cast(a.no_index as unsigned) desc";
		$suratkeluar = $db->getRecords($query);
		$result["result"]=$suratkeluar;
	}else if($idsurat=='check'){
		$idsurat=$app->request->get('idsurat');
		$idjenissurat=$app->request->get('idjenissurat');
		$no_index=$app->request->get('no_index');
		$current_year=$app->request->get('year');

		$query="select idsurat from surat_keluar where idjenissurat=".$idjenissurat." and no_index='".$no_index."' and idsurat!=".$idsurat;
		if($idsurat==0){
			$query="select idsurat from surat_keluar where idjenissurat=".$idjenissurat." and no_index='".$no_index."'";
			$suratmasuk = $db->getOneRecord($query);
			
		}
		
		$suratmasuk = $db->getOneRecord($query);
		$result["result"]=array();
		if($suratmasuk){
			$result["result"]=array($suratmasuk);
		}
	}else if($idsurat=='laporan'){
		$periode=$app->request->get('periode');
		$bulan=$app->request->get('bulan');
		$tgl_from=$app->request->get('tgl_from');
		$tgl_to=$app->request->get('tgl_to');
		
		$searchdate="";
		if($periode=='bulanan'){
			$searchdate="where substring(tgl_surat,1,7)='".substr($bulan,0,7)."'";
		}else if($periode=='tanggal'){			
			$searchdate="where tgl_surat between '".$tgl_from."' and '".$tgl_to."'";
			if($tgl_from==$tgl_to)
				$searchdate="where tgl_surat='".$tgl_from."'";
		}
		
		if($searchdate){
			$query = "select a.*,@rownum:=@rownum+1 as num from (select idsurat,no_idx_full,no_index,if(tgl_surat='0000-00-00','',tgl_surat) as tgl_surat,dari,tujuan,perihal,b.bagian as penandatangan,file_document,file_prefix from surat_keluar k left join bagian b on k.penandatangan=b.idbagian ".$searchdate.") a, (select @rownum:=0) r order by a.tgl_surat desc, cast(a.no_index as unsigned) desc";
			$suratmasuk = $db->getRecords($query);
			$result["result"]=$suratmasuk;
		}else{
			$result["result"]=array("result"=>"error");
		}
	}else{
		$query = "select idsurat,no_index,idjenissurat,idbagian,idkodemasalah,bulan,tahun,if(tgl_surat='0000-00-00','',tgl_surat) as tgl_surat,dari,tujuan,perihal,penandatangan,lampiran,file_document,file_prefix from surat_keluar where idsurat=".$idsurat;
		$suratkeluar = $db->getOneRecord($query);
		$result["result"]=array();
		if($suratkeluar){
			$result["result"]=array($suratkeluar);
		}
	}
	
	echo json_encode($result);
});

$app->get('/surat-keluar/lastno/:idjenissurat',function($idjenissurat) use ($app){
	$result=array();
    $db = new DbHandler();
    if($idjenissurat){
		$arr_lastno=explode("_",$idjenissurat);
		$query = "select no_index from surat_keluar where idjenissurat=".$arr_lastno[0]." and YEAR(tgl_surat)=".$arr_lastno[1]." order by no_index desc";
		$lastno = $db->getOneRecord($query);
		$result["result"]=array();
		if($lastno){
			$result["result"]=array($lastno);
		}
	}else{
		$result["result"]=array("result"=>"error");
	}
    
	echo json_encode($result);
});

$app->put('/surat-keluar/:idsurat',function($idsurat) use ($app){
	$response = array();
    $db = new DbHandler();
    
    $r = json_decode($app->request->getBody());
    $no_idx_full=$r->no_idx_full;
    $no_index=$r->no_index;
    $idjenissurat=$r->idjenissurat;
    $idbagian=$r->idbagian;
    $idkodemasalah=$r->idkodemasalah;
    $bulan=$r->bulan;
    $tahun=$r->tahun;
    $tgl_surat=$r->tgl_surat;
    //$no_surat=$r->no_surat;
    $dari=$r->dari;
    $tujuan=$r->tujuan;
    $perihal=$r->perihal;
    $penandatangan=$r->penandatangan;
    $lampiran=$r->lampiran;
    $file_document=$r->file_document;
    $file_prefix=$r->file_prefix;
    $file_removed=$r->file_removed;
    
    $query = "update surat_keluar set no_idx_full='".$no_idx_full."',no_index='".$no_index."',idjenissurat=".$idjenissurat.",idbagian=".$idbagian.",idkodemasalah=".$idkodemasalah.",bulan='".$bulan."',tahun='".$tahun."',tgl_surat='".$tgl_surat."',dari='".$dari."',tujuan='".$tujuan."',perihal='".$perihal."',penandatangan=".$penandatangan.",lampiran='".$lampiran."',file_document='".$file_document."',file_prefix='".$file_prefix."' where idsurat=".$idsurat;
    $suratkeluar = $db->updateRecord($query);
    if($suratkeluar){
		if($file_removed){
			foreach($file_removed as $f){
				$file_path='../../uploads/'.$file_prefix.'_'.$f;
				if(file_exists($file_path))
					unlink($file_path);
			}
		}
		$response['status'] = "success";
		$response['message'] = "Update data berhasil!";
	}else{
		$response['status'] = "error";
		$response['message'] = "Maaf, update data tidak berhasil!";
	}
	$result["result"]=array($response['status'],$response['message']);
	echo json_encode($result);
});

$app->post('/surat-keluar/0',function() use ($app){
	$response = array();
    $db = new DbHandler();
    
    $r = json_decode($app->request->getBody());
    $no_idx_full=$r->no_idx_full;
    $no_index=$r->no_index;
    $idjenissurat=$r->idjenissurat;
    $idbagian=$r->idbagian;
    $idkodemasalah=$r->idkodemasalah;
    $bulan=$r->bulan;
    $tahun=$r->tahun;
    $tgl_surat=$r->tgl_surat;
    /*$no_surat=$r->no_surat;*/
    $dari=$r->dari;
    $tujuan=$r->tujuan;
    $perihal=$r->perihal;
    $penandatangan=$r->penandatangan;
    $lampiran=$r->lampiran;
    $file_document=$r->file_document;
    $file_prefix=$r->file_prefix;

	$table_name = "surat_keluar";
	$data = array(
		'no_idx_full'=>$no_idx_full,
		'no_index'=>$no_index,
		'idjenissurat'=>$idjenissurat,
		'idbagian'=>$idbagian,
		'idkodemasalah'=>$idkodemasalah,
		'bulan'=>$bulan,
		'tahun'=>$tahun,
		'tgl_surat'=>$tgl_surat,
		//'no_surat'=>$no_surat,
		'dari'=>$dari,
		'tujuan'=>$tujuan,
		'perihal'=>$perihal,
		'penandatangan'=>$penandatangan,
		'lampiran'=>$lampiran,
		'file_document'=>$file_document,
		'file_prefix'=>$file_prefix
	);
	$suratkeluar = $db->insertRecord($table_name, $data);
	if ($suratkeluar != NULL) {
		$response["status"] = "success";
		$response["message"] = "Tambah data berhasil";
	}else{
		$response['status'] = "error";
		$response['message'] = "Maaf, tambah data tidak berhasil!";
	}
	$result["result"]=array($response['status'],$response['message']);
	echo json_encode($result);
});

$app->delete('/surat-keluar/:idsurat',function($idsurat) use ($app){
	$response = array();
    $db = new DbHandler();
    //check the uploaded files and remove them if exist
    $query = "select file_document,file_prefix from surat_keluar where idsurat=".$idsurat;
	$suratkeluar = $db->getOneRecord($query);
	if($suratkeluar){
		if($suratkeluar['file_document']){
			$file_prefix=$suratkeluar['file_prefix'];
			$file_document=explode(",",$suratkeluar['file_document']);
			foreach($file_document as $f){
				$file_path='../../uploads/'.$file_prefix.'_'.$f;
				if(file_exists($file_path))
					unlink($file_path);
			}
		}
	}
    $query = "delete from surat_keluar where idsurat=".$idsurat;
    $suratkeluar = $db->deleteRecord($query);
    if($suratkeluar){
		$response['status'] = "success";
		$response['message'] = "Hapus data berhasil!";
	}else{
		$response['status'] = "error";
		$response['message'] = "Maaf, hapus data tidak berhasil!";
	}
	$result["result"]=array($response['status'],$response['message']);
	echo json_encode($result);
});
/* END SURAT KELUAR */

/* BEGIN BAGIAN */
$app->get('/bagian',function() use ($app){
	$response = array();
    $db = new DbHandler();
    
    $query = "select idbagian,bagian,singkatan,kodettd,aktif,@rownum:=@rownum+1 as num from bagian, (select @rownum:=0) r order by idbagian";
    $bagian = $db->getRecords($query);
	$result["result"]=$bagian;
	echo json_encode($result);
});

$app->get('/bagian-check',function() use ($app){
	$response = array();
    $db = new DbHandler();
    
    $query = "select idbagian,singkatan,false as isChecked from bagian order by idbagian";
    $bagian = $db->getRecords($query);
	$result["result"]=$bagian;
	echo json_encode($result);
});

$app->get('/bagian/:idbagian',function($idbagian) use ($app){
    $db = new DbHandler();
    $query = "select * from bagian where idbagian=".$idbagian;
    $bagian = $db->getOneRecord($query);
	$result["result"]=array();
    if($bagian){
		$result["result"]=array($bagian);
	}
	echo json_encode($result);
});

$app->put('/bagian/:idbagian',function($idbagian) use ($app){
	$response = array();
    $db = new DbHandler();
    
    $r = json_decode($app->request->getBody());
    $bagian=$r->bagian;
    $singkatan=$r->singkatan;
    $kodettd=$r->kodettd;

    $query = "update bagian set bagian='".$bagian."',singkatan='".$singkatan."',kodettd='".$kodettd."' where idbagian=".$idbagian;
    $bagian = $db->updateRecord($query);
    if($bagian){
		$response['status'] = "success";
		$response['message'] = "Update data berhasil!";
	}else{
		$response['status'] = "error";
		$response['message'] = "Maaf, update data tidak berhasil!";
	}
	$result["result"]=array($response['status'],$response['message']);
	echo json_encode($result);
});

$app->post('/bagian/0',function() use ($app){
	$response = array();
    $db = new DbHandler();
    
    $r = json_decode($app->request->getBody());
	$bagian=$r->bagian;
    $singkatan=$r->singkatan;
    $kodettd=$r->kodettd;

	$table_name = "bagian";
	$column_names = array('bagian', 'singkatan', 'kodettd');
	$bagian = $db->insertIntoTable($r, $column_names, $table_name);
    if ($bagian != NULL) {
		$response["status"] = "success";
		$response["message"] = "Tambah data berhasil";
    }else{
		$response['status'] = "error";
		$response['message'] = "Maaf, tambah data tidak berhasil!";
	}
	$result["result"]=array($response['status'],$response['message']);
	echo json_encode($result);
});

$app->delete('/bagian/:idbagian',function($idbagian) use ($app){
	$response = array();
    $db = new DbHandler();
    
    $query = "delete from bagian where idbagian=".$idbagian;
    $bagian = $db->deleteRecord($query);
    if($bagian){
		$response['status'] = "success";
		$response['message'] = "Hapus data berhasil!";
	}else{
		$response['status'] = "error";
		$response['message'] = "Maaf, hapus data tidak berhasil!";
	}
	$result["result"]=array($response['status'],$response['message']);
	echo json_encode($result);
});
/* END BAGIAN */

/* BEGIN JENIS SURAT */
$app->get('/jenis-surat',function() use ($app){
	$response = array();
    $db = new DbHandler();
    
    $query = "select idjenissurat,jenissurat,singkatan,aktif,@rownum:=@rownum+1 as num from jenissurat, (select @rownum:=0) r order by idjenissurat";
    $bagian = $db->getRecords($query);
	$result["result"]=$bagian;
	echo json_encode($result);
});

$app->get('/jenis-surat/:idjenissurat',function($idjenissurat) use ($app){
    $db = new DbHandler();
    $query = "select * from jenissurat where idjenissurat=".$idjenissurat;
    $jenissurat = $db->getOneRecord($query);
	$result["result"]=array();
    if($jenissurat){
		$result["result"]=array($jenissurat);
	}
	echo json_encode($result);
});

$app->put('/jenis-surat/:idjenissurat',function($idjenissurat) use ($app){
	$response = array();
    $db = new DbHandler();
    
    $r = json_decode($app->request->getBody());
    $jenissurat=$r->jenissurat;
    $singkatan=$r->singkatan;

    $query = "update jenissurat set jenissurat='".$jenissurat."',singkatan='".$singkatan."' where idbagian=".$idbagian;
    $jenissurat = $db->updateRecord($query);
    if($jenissurat){
		$response['status'] = "success";
		$response['message'] = "Update data berhasil!";
	}else{
		$response['status'] = "error";
		$response['message'] = "Maaf, update data tidak berhasil!";
	}
	$result["result"]=array($response['status'],$response['message']);
	echo json_encode($result);
});

$app->post('/jenis-surat/0',function() use ($app){
	$response = array();
    $db = new DbHandler();
    
    $r = json_decode($app->request->getBody());
	$jenissurat=$r->jenissurat;
    $singkatan=$r->singkatan;

	$table_name = "jenissurat";
	$column_names = array('jenissurat', 'singkatan');
	$jenissurat = $db->insertIntoTable($r, $column_names, $table_name);
    if ($jenissurat != NULL) {
		$response["status"] = "success";
		$response["message"] = "Tambah data berhasil";
    }else{
		$response['status'] = "error";
		$response['message'] = "Maaf, tambah data tidak berhasil!";
	}
	$result["result"]=array($response['status'],$response['message']);
	echo json_encode($result);
});

$app->delete('/jenis-surat/:idjenissurat',function($idjenissurat) use ($app){
	$response = array();
    $db = new DbHandler();
    
    $query = "delete from jenissurat where idjenissurat=".$idjenissurat;
    $jenissurat = $db->deleteRecord($query);
    if($jenissurat){
		$response['status'] = "success";
		$response['message'] = "Hapus data berhasil!";
	}else{
		$response['status'] = "error";
		$response['message'] = "Maaf, hapus data tidak berhasil!";
	}
	$result["result"]=array($response['status'],$response['message']);
	echo json_encode($result);
});
/* END JENIS SURAT */


/* BEGIN KODE MASALAH */
$app->get('/kode-masalah',function() use ($app){
	$response = array();
    $db = new DbHandler();
    
    $query = "select idkode,kodemasalah,keterangan,aktif,@rownum:=@rownum+1 as num from kodemasalah, (select @rownum:=0) r order by kodemasalah";
    $kodemasalah = $db->getRecords($query);
	$result["result"]=$kodemasalah;
	echo json_encode($result);
});

$app->get('/kode-masalah/:idkode',function($idkode) use ($app){
    $db = new DbHandler();
    $query = "select * from kodemasalah where idkode=".$idkode;
    $kodemasalah = $db->getOneRecord($query);
	$result["result"]=array();
    if($kodemasalah){
		$result["result"]=array($kodemasalah);
	}
	echo json_encode($result);
});

$app->put('/kode-masalah/:idkode',function($idkode) use ($app){
	$response = array();
    $db = new DbHandler();
    
    $r = json_decode($app->request->getBody());
    $kodemasalah=$r->kodemasalah;
    $keterangan=$r->keterangan;

    $query = "update kodemasalah set kodemasalah='".$kodemasalah."',keterangan='".$keterangan."' where idkode=".$idkode;
    $kodemasalah = $db->updateRecord($query);
    if($kodemasalah){
		$response['status'] = "success";
		$response['message'] = "Update data berhasil!";
	}else{
		$response['status'] = "error";
		$response['message'] = "Maaf, update data tidak berhasil!";
	}
	$result["result"]=array($response['status'],$response['message']);
	echo json_encode($result);
});

$app->post('/kode-masalah/0',function() use ($app){
	$response = array();
    $db = new DbHandler();
    
    $r = json_decode($app->request->getBody());
	$kodemasalah=$r->kodemasalah;
    $keterangan=$r->keterangan;

	$table_name = "kodemasalah";
	$column_names = array('kodemasalah', 'keterangan');
	$kodemasalah = $db->insertIntoTable($r, $column_names, $table_name);
    if ($kodemasalah != NULL) {
		$response["status"] = "success";
		$response["message"] = "Tambah data berhasil";
    }else{
		$response['status'] = "error";
		$response['message'] = "Maaf, tambah data tidak berhasil!";
	}
	$result["result"]=array($response['status'],$response['message']);
	echo json_encode($result);
});

$app->delete('/kode-masalah/:idkode',function($idkode) use ($app){
	$response = array();
    $db = new DbHandler();
    
    $query = "delete from kodemasalah where idkode=".$idkode;
    $kodemasalah = $db->deleteRecord($query);
    if($kodemasalah){
		$response['status'] = "success";
		$response['message'] = "Hapus data berhasil!";
	}else{
		$response['status'] = "error";
		$response['message'] = "Maaf, hapus data tidak berhasil!";
	}
	$result["result"]=array($response['status'],$response['message']);
	echo json_encode($result);
});
/* END KODE MASALAH */


/* BEGIN TINGKATAN */
$app->get('/tingkatan',function() use ($app){
	$response = array();
    $db = new DbHandler();
    
    $query = "select iduserlevel,userlevel,@rownum:=@rownum+1 as num from userlevel, (select @rownum:=0) r order by iduserlevel";
    $tingkatan = $db->getRecords($query);
	$result["result"]=$tingkatan;
	echo json_encode($result);
});

$app->get('/tingkatan/:iduserlevel',function($iduserlevel) use ($app){
    $db = new DbHandler();
    $query = "select * from userlevel where iduserlevel=".$iduserlevel;
    $tingkatan = $db->getOneRecord($query);
	$result["result"]=array();
    if($tingkatan){
		$result["result"]=array($tingkatan);
	}
	echo json_encode($result);
});

$app->put('/tingkatan/:iduserlevel',function($iduserlevel) use ($app){
	$response = array();
    $db = new DbHandler();
    
    $r = json_decode($app->request->getBody());
    $userlevel=$r->userlevel;

    $query = "update userlevel set userlevel='".$userlevel."' where iduserlevel=".$iduserlevel;
    $tingkatan = $db->updateRecord($query);
    if($tingkatan){
		$response['status'] = "success";
		$response['message'] = "Update data berhasil!";
	}else{
		$response['status'] = "error";
		$response['message'] = "Maaf, update data tidak berhasil!";
	}
	$result["result"]=array($response['status'],$response['message']);
	echo json_encode($result);
});

$app->post('/tingkatan/0',function() use ($app){
	$response = array();
    $db = new DbHandler();
    
    $r = json_decode($app->request->getBody());
	$userlevel=$r->userlevel;

	$table_name = "userlevel";
	$column_names = array('userlevel');
	$tingkatan = $db->insertIntoTable($r, $column_names, $table_name);
    if ($tingkatan != NULL) {
		$response["status"] = "success";
		$response["message"] = "Tambah data berhasil";
    }else{
		$response['status'] = "error";
		$response['message'] = "Maaf, tambah data tidak berhasil!";
	}
	$result["result"]=array($response['status'],$response['message']);
	echo json_encode($result);
});

$app->delete('/tingkatan/:iduserlevel',function($iduserlevel) use ($app){
	$response = array();
    $db = new DbHandler();
    
    $query = "delete from userlevel where iduserlevel=".$iduserlevel;
    $tingkatan = $db->deleteRecord($query);
    if($tingkatan){
		$response['status'] = "success";
		$response['message'] = "Hapus data berhasil!";
	}else{
		$response['status'] = "error";
		$response['message'] = "Maaf, hapus data tidak berhasil!";
	}
	$result["result"]=array($response['status'],$response['message']);
	echo json_encode($result);
});
/* END TINGKATAN */


/* BEGIN PENGGUNA */
$app->get('/pengguna',function() use ($app){
	$response = array();
    $db = new DbHandler();
    
    $query = "select a.*,@rownum:=@rownum+1 as num from (select u.iduser,u.user,u.nama_lengkap,ul.userlevel from user u inner join userlevel ul on u.iduserlevel=ul.iduserlevel) a, (select @rownum:=0) r order by a.iduser";
    $pengguna = $db->getRecords($query);
	$result["result"]=$pengguna;
	echo json_encode($result);
});

$app->get('/pengguna/:iduser',function($iduser) use ($app){
    $db = new DbHandler();
    $query = "select * from user where iduser=".$iduser;
    $pengguna = $db->getOneRecord($query);
	$result["result"]=array();
    if($pengguna){
		$result["result"]=array($pengguna);
	}
	echo json_encode($result);
});

$app->put('/pengguna/:iduser',function($iduser) use ($app){
	$response = array();
    $db = new DbHandler();
    
    $r = json_decode($app->request->getBody());
    $user=$r->user;
    $password=$r->password;
    $password2=$r->password2;
    $nama_lengkap=$r->nama_lengkap;
    $iduserlevel=$r->iduserlevel;

	$query = "select * from user where iduser=".$iduser." AND password='".md5($password)."'";
    $pengguna = $db->getOneRecord($query);
	$result["result"]=array();
    if($pengguna){
		$query = "update user set user='".$user."',nama_lengkap='".$nama_lengkap."',password='".md5($password2)."',iduserlevel=".$iduserlevel." where iduser=".$iduser;
		$pengguna = $db->updateRecord($query);
		if($pengguna){
			$response['status'] = "success";
			$response['message'] = "Update data berhasil!";
		}else{
			$response['status'] = "error";
			$response['message'] = "Maaf, update data tidak berhasil!";
		}
	}else{
		$response['status'] = "error";
		$response['message'] = "Maaf, update data tidak berhasil! Password lama salah!";
	}
    
	$result["result"]=array($response['status'],$response['message']);
	echo json_encode($result);
});

$app->post('/pengguna/0',function() use ($app){
	$response = array();
    $db = new DbHandler();
    
    $r = json_decode($app->request->getBody());
	$user=$r->user;
    $password=$r->password;
    $password2=$r->password2;
	$nama_lengkap=$r->nama_lengkap;
	$iduserlevel=$r->iduserlevel;

	if($password=="" || $password2==""){
		$response['status'] = "error";
		$response['message'] = "Password harus diisi!";
	}else{
		if($password != $password2){
			$response['status'] = "error";
			$response['message'] = "Password dan Password (Lagi) harus sama!";
		}else{
			$table_name = "user";
			$data = array(
				'user'=>$user,
				'nama_lengkap'=>$nama_lengkap,
				'password'=>md5($password),
				'iduserlevel'=>$iduserlevel,
				'status'=>1
			);
			//$pengguna = $db->insertIntoTable($r, $column_names, $table_name);
			$pengguna = $db->insertRecord($table_name, $data);
			if ($pengguna != NULL) {
				$response["status"] = "success";
				$response["message"] = "Tambah data berhasil";
			}else{
				$response['status'] = "error";
				$response['message'] = "Maaf, tambah data tidak berhasil!";
			}
		}
	}
		
	$result["result"]=array($response['status'],$response['message']);
	echo json_encode($result);
});

$app->delete('/pengguna/:iduser',function($iduser) use ($app){
	$response = array();
    $db = new DbHandler();
    
    $query = "delete from user where iduser=".$iduser;
    $pengguna = $db->deleteRecord($query);
    if($pengguna){
		$response['status'] = "success";
		$response['message'] = "Hapus data berhasil!";
	}else{
		$response['status'] = "error";
		$response['message'] = "Maaf, hapus data tidak berhasil!";
	}
	$result["result"]=array($response['status'],$response['message']);
	echo json_encode($result);
});
/* END PENGGUNA */

$app->get('/logout', function() {
    $db = new DbHandler();
    $session = $db->destroySession();
    $response["status"] = "info";
    $response["message"] = "Logout berhasil!";
    $result["result"]=array($response['status'],$response['message']);
	echo json_encode($result);
});

$app->post('/uploads', function() use ($app) {
	//print_r($_FILES);
    if (!isset($_FILES['file'])) {
        echo "No files uploaded!!";
        return;
    }
    $imgs = array();

    $files = $_FILES['file'];
    $cnt = count($files['name']);
    //$r = json_decode($app->request->getBody());
	//$file_prefix=$r->file_prefix;
	$file_prefix=$_POST['file_prefix'];

    for($i = 0 ; $i < $cnt ; $i++) {
        if ($files['error'][$i] === 0) {
            $name = $file_prefix."_".$files['name'][$i];//uniqid('img-'.date('Ymd').'-');
            if (move_uploaded_file($files['tmp_name'][$i], '../../uploads/' . $name) === true) {
                $imgs[] = array('url' => '../../uploads/' . $name, 'name' => $files['name'][$i]);
            }

        }
    }

    $imageCount = count($imgs);

    if ($imageCount == 0) {
       echo 'No files uploaded!!  <p><a href="/">Try again</a>';
       return;
    }

    /*$plural = ($imageCount == 1) ? '' : 's';

    foreach($imgs as $img) {
        printf('%s <img src="%s" width="50" height="50" /><br/>', $img['name'], $img['url']);
    }*/
});
?>
