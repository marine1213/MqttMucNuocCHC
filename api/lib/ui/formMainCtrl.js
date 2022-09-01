// mainData.view.countNangdinhItem = -1;

onAddNangDinh=(targetId)=>{
	var nangdinhElm = document.getElementById(targetId);
	var nextIdx = ++(mainData.view.countNangdinhItem);    
	 
	var newNangdinhHTML = `<div class="w3-col s12 m6 l4 mb20p"><div class="nangdinhItem w3-border w3-round-small w3-border-green frameThumbnail w95" id="nangdinhItem${nextIdx}" >
		<img src="./icons/svg/753/753345.svg" class="closeOnTopThumbnail lv4" onclick="this.parentElement.parentElement.remove(); return false" width="20px">
		<div class=" w3-container">
			<label for="idNagdinhTitle">Tên Năng định</label><input type="text" class="classNangdinh" name="idNagdinhTitle${nextIdx}">
		</div>
		<div class=" w3-container">
			<label for="idNgaythi">Ngày thi</label><input type="date" name="idNgaythi${nextIdx}">
		</div>
		<div class=" w3-container">
			<label for="idThoihanFrom">Thời hạn từ ngày</label><input type="date" name="idThoihanFrom${nextIdx}">
		</div>
		<div class=" w3-container">
			<label for="idThoihanTo">Thời hạn đến ngày</label><input type="date" name="idThoihanTo${nextIdx}">
		</div>
	</div></div>`;
	nangdinhElm.insertAdjacentHTML('beforeend',newNangdinhHTML);
	logF(initAutoNangdinh);
	return false;
}