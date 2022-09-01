const FOR_LARGE_SCR = 1;
const FOR_SMALL_N_MEDIUM_SCR = 0;

var holdingStudent, holdingCourse, holdingType;
var holdingDetailWindow;
var changeFlag = false;

setContent=(itemType,item)=>{
	(holdingType=itemType)=='Course'?(holdingCourse = item):((holdingStudent = item)&&(item.canhan.vitriCongtac = 'ANS/ALS')&&(item.canhan.soHoso = item.id.maAcv));
	
	document.getElementById('idDetailPanel').children[1].innerHTML = itemType=='Course'?(courseDetailPanelForming(item,FOR_LARGE_SCR)+courseDetailPanelForming(item,FOR_SMALL_N_MEDIUM_SCR)):(studentDetailPanelForming(item,FOR_LARGE_SCR) + studentDetailPanelForming(item,FOR_SMALL_N_MEDIUM_SCR));
	editSwitchInput(obFab.m=='edit');
	changeFlag = false;
	onInitUploadEvent('.fileUploadInitOnceDetail',(fileValue)=>{mainData.db.updateDB({id:holdingStudent.id.docId,type:'student',action:'edit'},{'canhan.img':fileValue}); mainData.db.getDB({id:holdingStudent.id.docId,type:'student'}).then(snap=>{holdingStudent[elm.form.name] = snap.data()[elm.form.name];})});
}

release=()=>{holdingStudent = null;holdingCourse = null;if(changeFlag) updateListDulieu(); changeFlag = false;}

courseDetailPanelForming=(item,isForLargeScr)=>`
<div class="w3-card-2 divCenter  pb80p ${isForLargeScr>0?'width80 w3-hide-small w3-hide-medium':'w95 w3-hide-large'}">
	${courseHeaderForming()}
	<div class="w3-container pad10p">
		<div class="w3-col ${isForLargeScr>0?'l3':'s12'} txCenter"><img ${item.img?`src="https://drive.google.com/thumbnail?authuser=0&sz=w100&id=${item.img.split('?')[0]}" onclick="window.open('https://drive.google.com/open?id=${item.img.split('?')[0]}')"`:`src="${DEFAULT_NOTEBOOK}"`} class=" padAvatar width${isForLargeScr>0?'80':'150px'}"></div>
		<div class="w3-${isForLargeScr>0?'rest':'row'}">
		${courseInfoForming(item)}
		</div>
	</div>
	${courseContentForming(item,isForLargeScr,obFab.m!='edit')}
</div>
`;

courseHeaderForming=()=>`<div class="txCenter fullw w3-cyan pad10p cyanBg"><h1>Sổ theo dõi Các khóa Huấn luyện Nhân viên ANS</h1></div>`;

courseInfoForming=(course)=>`
	<form onsubmit="return false;"name="thongtinchung" class="w3-row pad10p">
		<h3>A. Thông tin chung về khóa học</h3>
		<table class="table-no-border inf-table">
			<tbody>
				<tr><td class="w40"><b>1. Tên khóa huấn luyện:</b></td><td>${course.thongtinchung.ten}</td></tr>
				<tr><td><b>2. Ngày/tháng/năm huấn luyện:</b></td><td class="editSwitchingInput"><div onclick="elmEdit(this)">${course.thongtinchung.thoigian}</div><input name="thoigian" class="hidden" onblur="elmUneditCourse(this)" value="${course.thongtinchung.thoigian}"></td></tr>
				<tr><td><b>3. Vị trí huấn luyện lý thuyết và thực hành:</b></td></tr>
				<tr><td><b>- Lý thuyết:</b></td><td class="editSwitchingInput"><div onclick="elmEdit(this)">${course.thongtinchung.vitriLythuyet}</div><input name="vitriLythuyet" class="hidden" onblur="elmUneditCourse(this)" value="${course.thongtinchung.vitriLythuyet}"></td></tr>
				<tr><td><b>- Thực hành:</b></td><td class="editSwitchingInput"><div onclick="elmEdit(this)">${course.thongtinchung.vitriThuchanh}</div><input name="vitriThuchanh" class="hidden" onblur="elmUneditCourse(this)" value="${course.thongtinchung.vitriThuchanh}"></td></tr>
			</tbody>
		</table>
	</form>`;

courseContentForming=(item,	isForLargeScr,notEditMode)=>`
	<form onsubmit="return false;"name="chitiet" class="w3-row pad10p">
		<h3>B. Nội dung khóa học</h3>
		<p> Chương trình học gồm các nội dung như dưới đây: </p>
		<div class=" w3-card-2 mT40p mb10p overXAuto">
			<table class="fullw w3-table w3-striped w3-bordered w3-container">
				<thead><tr class="w3-cyan w3-grayscale-min cyanBg"><th class="w3-col s1">STT</th><th>Nội dung huấn luyện</th><th>Thời gian</th><th>Huấn luyện viên/giáo viên</th></tr></thead>
				<tbody><tr>${item.chitiet.map((kq,kqIdx)=>`<td><p>${kqIdx+1}</p></td><td>${notEditMode?`<p>${kq.noidung}</p>`:`<input name="noidung" onblur="elmUneditArrCourse(this,${kqIdx})" value="${kq.noidung}">`}</td><td>${notEditMode?`<p>${kq.thoigian}</p>`:`<input name="thoigian" onblur="elmUneditArrCourse(this,${kqIdx})" value="${kq.thoigian}">`}</td><td>${notEditMode?`<p>${kq.giaovien.split('\n').join('<br>')}</p>`:`<textarea class="materialize-textarea" name="giaovien" onblur="elmUneditArrCourse(this,${kqIdx})">${kq.giaovien}</textarea>`}</td>`).join('</tr><tr>')}</tr></tbody>
			</table>
		</div>
		<button class="w3-button w3-blue mT10p w3-card-2 editSwitchingInputBtn" onclick="return tblCourseAdd(this)">Thêm</button>
	</form>`;


studentDetailPanelForming=(item,isForLargeScr)=>
`<div class="w3-card-2 divCenter  pb80p ${isForLargeScr>0?'width80 w3-hide-small w3-hide-medium':'w95 w3-hide-large'}">
	${headerForming()}
	<div class="w3-container pad10p">
		<div class="w3-col ${isForLargeScr>0?'l2':'s12'} editSwitchingInput">
			<div class="w3-row txCenter">
				<label class="fullw"><img ${item.canhan.img?`src="https://drive.google.com/thumbnail?authuser=0&sz=w100&id=${item.canhan.img.split('?')[0]}" onclick="window.open('https://drive.google.com/open?id=${item.canhan.img.split('?')[0]}')"`:`src="${DEFAULT_AVATAR}"`} class=" padAvatar width${isForLargeScr>0?'80':'150px'}"></label>
			</div>
			<div class="hidden">
				<div class="w3-row flexThumbnailContainer txCenter">
					<label class="fullw"><img ${item.canhan.img?`src="https://drive.google.com/thumbnail?authuser=0&sz=w100&id=${item.canhan.img.split('?')[0]}" onclick="window.open('https://drive.google.com/open?id=${item.canhan.img.split('?')[0]}')"`:`src="${DEFAULT_AVATAR}"`} class=" padAvatar width${isForLargeScr>0?'80':'150px'}"></label>
				</div>
				<div class="w3-row fileUploadUI flexFileUploadContainer">
					<label for="fileUploadDetailCharImg" class="customFileUpload"><img src="./icons/svg/3143/3143360.svg" width="20px" class="m5p">Thay ảnh Thẻ </label> 
					<input type="file" id="fileUploadDetailCharImg" class="fileUploadInitOnceDetail oneFileOnly" accept="image/*" rename="'${holdingStudent.id.docId}-avatar'"/> 
				</div>
			</div>
		</div>
		<div class="w3-${isForLargeScr>0?'rest':'row'}">
			${contentForming1(item)}
		</div>
	</div>
	${contentForming2to7(item)}
</div>
`;

headerForming=()=>`<div class="txCenter fullw w3-cyan pad10p cyanBg"><h1>Sổ theo dõi Huấn luyện Nhân viên ANS</h1></div>`;

unhideNxtElm=(elm)=>{var tempElm=elm.nextElementSibling;tempElm.classList.toggle('hidden',false);elm.classList.toggle('hidden',true);tempElm.focus();}
hideNxtElm=(elm)=>{var tempElm=elm.previousElementSibling;tempElm.classList.toggle('hidden',false);elm.classList.toggle('hidden',true); tempElm.focus();}
setTxNxtElm=(elm,tx)=>{tx=(tx.indexOf('\n')>-1)?tx.split('\n').join('<br>'):tx;elm.previousElementSibling.innerHTML=tx}

sendUpdateObHocvien=(elm)=>{var data={};data[elm.form.name+'.'+elm.name]=elm.value;mainData.db.updateDB({id:holdingStudent.id.docId,type:'student',action:'edit'},data); mainData.db.getDB({id:holdingStudent.id.docId,type:'student'}).then(snap=>{holdingStudent[elm.form.name] = snap.data()[elm.form.name];})}
sendUpdateObCourse=(elm)=>{changeFlag = true;var data={};data[elm.form.name+'.'+elm.name]=elm.value;mainData.db.updateDB({id:holdingCourse.id.docId,type:'course',action:'edit'},data); mainData.db.getDB({id:holdingCourse.id.docId,type:'course'}).then(snap=>{holdingCourse[elm.form.name] = snap.data()[elm.form.name];})}
sendUpdateArrHocvien=(elm,arr)=>{var data={};data[elm.form.name]=arr;mainData.db.updateDB({id:holdingStudent.id.docId,type:'student',action:'edit'},data);}
sendUpdateArrCourse=(elm,arr)=>{changeFlag = true;var data={};data[elm.form.name]=arr;mainData.db.updateDB({id:holdingCourse.id.docId,type:'course',action:'edit'},data);}
sendUpdateQueryIdxHocvien=(item,key,idxOb)=>{var data={};data[key]=idxOb;logE(data);mainData.db.updateDB({id:item.id.docId,type:'student',action:'edit'},data); mainData.db.getDB({id:item.id.docId,type:'student'}).then(snap=>{item[key] = snap.data()[key];})}

elmEdit=(elm)=>{if(obFab.m=='view') unhideNxtElm(elm)}
elmUneditHocvien=(elm)=>{sendUpdateObHocvien(elm); if(obFab.m=='view'){hideNxtElm(elm)} setTxNxtElm(elm,elm.value)}//alert(elm.form.name);
elmUneditArrHocvien=(elm,rowIdx,parentKeys,parentIdx)=>{
	var item=holdingStudent[elm.form.name],
		arr=parentKeys?parentKeys.split('.').reduce((ob,key)=>ob[key],parentIdx?item[parentIdx]:parentIdx==0?item[0]:item):item;
		if(elm.value != undefined) {
			if(elm.name.indexOf('.')==-1) arr[rowIdx][elm.name]=elm.value; 
			else elm.name.split('.').reduce((ob,key,kIdx,kArr)=>{if(kIdx<(kArr.length-1)) return ob[key];else ob[key] = elm.value;},arr[rowIdx]);
			sendUpdateArrHocvien(elm,item);
		}
		if(obFab.m=='view'){hideNxtElm(elm);setTxNxtElm(elm,elm.value);}
	}
elmUneditCourse=(elm)=>{sendUpdateObCourse(elm); if(obFab.m=='view'){hideNxtElm(elm)} setTxNxtElm(elm,elm.value)}//alert(elm.form.name);
elmUneditArrCourse=(elm,rowIdx,parentKeys,parentIdx)=>{var item=holdingCourse[elm.form.name],arr=parentKeys?parentKeys.split('.').reduce((ob,key)=>ob[key],parentIdx?item[parentIdx]:parentIdx==0?item[0]:item):item;if(elm.name.indexOf('.')==-1) arr[rowIdx][elm.name]=elm.value; else elm.name.split('.').reduce((ob,key,kIdx,kArr)=>{if(kIdx<(kArr.length-1)) return ob[key];else ob[key] = elm.value;},arr[rowIdx]);sendUpdateArrCourse(elm,item);if(obFab.m=='view'){hideNxtElm(elm);setTxNxtElm(elm,elm.value);}}

elmEditLinked=(elm)=>{alert('editlinked')}
elmUneditLinked=(elm)=>{alert('uneditlinked')}

contentForming1=(item)=>
`<form onsubmit="return false;"name="canhan">
	<h3>1. Thông tin cá nhân</h3>
	<table class="fullw table-no-border inf-table">
		<tbody>
			<tr><td><b>Họ và tên:</b></td><td><p onclick="elmEdit(this)">${item.canhan.hoten}</p><input name="hoten" class="fullw hidden" onblur="elmUneditHocvien(this)" value="${item.canhan.hoten}"></td></tr>
			<tr><td><b>Chức danh:</b></td><td class="editSwitchingInput"><p onclick="elmEdit(this)">${item.canhan.chucdanh}</p><input name="chucdanh" class="fullw hidden" onblur="elmUneditHocvien(this)" value="${item.canhan.chucdanh}"></td></tr>
			<tr><td><b>Giới tính:</b></td><td class="editSwitchingInput"><p onclick="elmEdit(this)">${item.canhan.gioitinh}</p><input name="gioitinh" class="fullw hidden" onblur="elmUneditHocvien(this)" value="${item.canhan.gioitinh}"></td></tr>
			<tr><td><b>Ngày sinh:</b></td><td class="editSwitchingInput"><p onclick="elmEdit(this)">${item.canhan.dob}</p><input name="dob" class="fullw hidden" onblur="elmUneditHocvien(this)" value="${item.canhan.dob}"></td></tr>
			<tr><td><b>Số điện thoại:</b></td><td class="editSwitchingInput"><p onclick="elmEdit(this)">${item.canhan.sdt}</p><input name="sdt" class="fullw hidden" onblur="elmUneditHocvien(this)" value="${item.canhan.sdt}"></td></tr>
			<tr><td><b>Email:</b></td><td class="editSwitchingInput"><p onclick="elmEdit(this)">${item.canhan.email}</p><input name="email" class="fullw hidden" onblur="elmUneditHocvien(this)" value="${item.canhan.email}"></td></tr>
			<br>
			<tr><td><b>Nơi sinh:</b></td><td class="editSwitchingInput"><p onclick="elmEdit(this)">${item.canhan.pob}</p><input name="pob" class="fullw hidden" onblur="elmUneditHocvien(this)" value="${item.canhan.pob}"></td></tr>
			<tr><td><b>Quê quán:</b></td><td class="editSwitchingInput"><p onclick="elmEdit(this)">${item.canhan.quequan}</p><input name="quequan" class="fullw hidden" onblur="elmUneditHocvien(this)" value="${item.canhan.quequan}"></td></tr>
			<tr><td><b>Đơn vị công tác:</b></td><td class="editSwitchingInput"><p onclick="elmEdit(this)">${item.canhan.donviCongtac}</p><input name="donviCongtac" class="fullw hidden" onblur="elmUneditHocvien(this)" value="${item.canhan.donviCongtac}"></td></tr>
			<tr><td><b>Trình độ đào tạo:</b></td><td class="editSwitchingInput"><p onclick="elmEdit(this)">${item.canhan.trinhdoDaotao}</p><input name="trinhdoDaotao" class="fullw hidden" onblur="elmUneditHocvien(this)" value="${item.canhan.trinhdoDaotao}"></td></tr>
			<tr><td><b>Địa chỉ hiện tại:</b></td><td class="editSwitchingInput"><p onclick="elmEdit(this)">${item.canhan.diachiHientai}</p><input name="diachiHientai" class="fullw hidden" onblur="elmUneditHocvien(this)" value="${item.canhan.diachiHientai}"></td></tr>
			<br>
			<tr><td><b>Vị trí công việc:</b></td><td class="editSwitchingInput"><p onclick="elmEdit(this)">${item.canhan.vitriCongtac}</p><input name="vitriCongtac" class="fullw hidden" onblur="elmUneditHocvien(this)" value="${item.canhan.vitriCongtac}"></td></tr>
			<tr><td><b>Số hồ sơ:</b></td><td class="editSwitchingInput"><p onclick="elmEdit(this)">${item.canhan.soHoso}</p><input name="soHoso" class="fullw hidden" onblur="elmUneditHocvien(this)" value="${item.canhan.soHoso}"></td></tr>
		</tbody>
	</table>
</form>`;
;

contentForming2to7=(item)=>
`
<form onsubmit="return false;"name="congviec" class="w3-row pad10p">
	<h3>2. Các vị trí đã và đang làm việc</h3>
	<p>(tiếp tục từ năm 2001 đối với Sổ đã được lập và tính từ năm bắt đầu được cấp giấy phép, năng định nhân viên ANS đối với sổ mới)</p>
	<table class="fullw w3-table w3-striped w3-bordered w3-card-2 w3-container mT10p">
		<thead><tr class="w3-cyan cyanBg"><th>STT</th><th>Thời gian</th><th>Làm việc gì, ở đâu</th><th>Ghi chú</th></tr></thead>
		<tbody><tr>${tbl2(item.congviec)}</tr></tbody>
	</table>
	<button class="w3-button w3-blue mT10p w3-card-2 editSwitchingInputBtn printHidden" onclick="return tbl2Add(this)">Thêm</button>
</form>

<form onsubmit="return false;"name="coban" class="w3-row pad10p">
	<h3>3. Các khóa đào tạo và huấn luyện chuyên ngành ANS</h3>
	<p>(ghi rõ tên gọi, thời gian bắt đầu và kết thúc; địa điểm đào tạo, huấn luyện; loại văn bằng, chứng chỉ được cấp)</p>
	<div class="overXAuto">
		<table class="fullw w3-table w3-striped w3-bordered w3-card-2 w3-container mT10p">
			<thead><tr class="w3-cyan cyanBg"><th>STT</th><th>Tên khóa học</th><th>Thời gian</th><th>Cơ sở/Địa điểm đào tạo</th><th>Văn bằng/Chứng chỉ</th><th>Ghi chú</th><th style="text-align: center;">Ảnh</th></tr></thead>
			<tbody><tr>${tbl3(item.coban)}</tr></tbody>
		</table>
		<button class="w3-button w3-blue mT10p w3-card-2 editSwitchingInputBtn printHidden" onclick="return tbl3Add(this)">Thêm</button>
	</div>
</form>

<form onsubmit="return false;"name="taicho" class="w3-row pad10p">
	<h3>4. Các khóa huấn luyện tại chỗ</h3>
	<p>(tiếp tục tính từ năm 2005 đối với Sổ đã được lập và tính từ năm 2017 đối với Sổ mới)</p>
	<div class="overXAuto">
		<table class="fullw w3-table w3-striped w3-bordered w3-card-2 w3-container mT10p">
			<thead><tr class="w3-cyan cyanBg"><th>STT</th><th>Tên khóa học</th><th>Thời gian</th><th>Cơ sở/Địa điểm đào tạo</th><th>Kết quả</th><th>Ghi chú</th></tr></thead>
			<tbody><tr>${tbl4(item.taicho)}</tr></tbody>
		</table>
		<button class="w3-button w3-blue mT10p w3-card-2 editSwitchingInputBtn printHidden" onclick="return externalLinkingCourse(this); ">Thêm</button>
	</div>
</form>

<form onsubmit="return false;"name="suco" class="w3-row pad10p">
	<h3>5. Các vụ việc liên quan an toàn hoạt động bay</h3>
	<p>(tiếp tục tính từ năm 2001 đối với Sổ đã được lập và tính từ năm 2017 đối với Sổ mới)</p>
	<div class="overXAuto">
		<table class="fullw w3-table w3-striped w3-bordered w3-card-2 w3-container mT10p">
			<thead><tr class="w3-cyan cyanBg"><th>STT</th><th>Thời gian</th><th>Nội dung</th><th>Hình thức xử lý</th><th>Ảnh</th></tr></thead>
			<tbody><tr>${tbl5(item.suco)}</tr></tbody>
		</table>
		<button class="w3-button w3-blue mT10p w3-card-2 editSwitchingInputBtn printHidden" onclick="return tbl5Add(this)">Thêm</button>
	</div>
</form>

<form onsubmit="return false;"name="nhanxet" class="w3-row pad10p">
	<h3>6. Những nhận xét, đánh giá khác</h3>
	<div class="editSwitchingInput"><div><p>${item.nhanxet?(item.nhanxet.noidung.split('\n').join('</p><p>')):''}</p></div><textarea name="noidung" placeholder="Hãy nhập nội dung nhận xét..." class="materialize-textarea hidden" onblur="elmUneditHocvien(this)">${item.nhanxet?item.nhanxet.noidung:''}</textarea></div>
</form>
<div class="pagebreak"> </div>
<form onsubmit="return false;"name="hlvien" class="w3-row pad10p">
	<h3>7. Kết quả, huấn luyện</h3>
	<p>(Dành cho Huấn luyện viên ANS)</p>
	<div class="overXAuto">
		<table class="fullw w3-table w3-striped w3-bordered w3-card-2 w3-container mT10p">
			<thead><tr class="w3-cyan cyanBg"><th>STT</th><th>Nội dung đã được huấn luyện</th><th>Thời gian</th><th>Cơ sở/Địa điểm đào tạo</th><th>Ghi chú</th></tr></thead>
			<tbody><tr>${tbl7(item.hlvien)}</tr></tbody>
		</table>
		<button class="w3-button w3-blue mT10p w3-card-2 editSwitchingInputBtn printHidden" onclick="return tbl7Add(this)">Thêm</button>
	</div>
</form>

<form onsubmit="return false;"name="nangdinh" class="w3-row pad10p">
	<h3>8. Năng định được cấp</h3>
	<p></p>
	<div class="overXAuto">
		<table class="fullw w3-table w3-striped w3-bordered w3-card-2 w3-container mT10p">
			<thead><tr class="w3-cyan cyanBg"><th>STT</th><th>Năng định</th><th>Thời gian thi</th><th>Ngày cấp</th><th>Hiệu lực đến</th><th>Số hiệu</th><th>Ghi chú</th><th>Ảnh</th></tr></thead>
			<tbody><tr>${tbl8(item.nangdinh)}</tr></tbody>
		</table>
		<button class="w3-button w3-blue mT10p w3-card-2 editSwitchingInputBtn printHidden" onclick="return tbl8Add(this)">Thêm</button>
	</div>
</form>

<form onsubmit="return false;"name="giayphep" class="w3-row pad10p">
	<h3>9. Giấy phép được cấp (Giấy phép vận hành/lái xe)</h3>
	<p></p>
	<div class="overXAuto">
		<table class="fullw w3-table w3-striped w3-bordered w3-card-2 w3-container mT10p">
			<thead><tr class="w3-cyan cyanBg"><th>STT</th><th>Giấy phép</th><th>Thời gian thi</th><th>Ngày cấp</th><th>Hiệu lực đến</th><th>Số hiệu</th><th>Ghi chú</th><th>Ảnh</th></tr></thead>
			<tbody><tr>${tbl9(item.giayphep)}</tr></tbody>
		</table>
		<button class="w3-button w3-blue mT10p w3-card-2 editSwitchingInputBtn printHidden" onclick="return tbl9Add(this)">Thêm</button>
	</div>
</form>

<form onsubmit="return false;"name="ccNgoaingu" class="w3-row pad10p">
	<h3>10. Chứng chỉ ngoại ngữ</h3>
	<p></p>
	<div class="overXAuto">
		<table class="fullw w3-table w3-striped w3-bordered w3-card-2 w3-container mT10p">
			<thead><tr class="w3-cyan cyanBg"><th>STT</th><th>Tên chứng chỉ</th><th>Thời hạn bắt đầu</th><th>Thời hạn kết thúc</th><th>Điểm</th><th>Kết quả (Đạt/ko)</th><th>Ghi chú</th><th>Ảnh</th></tr></thead>
			<tbody><tr>${tbl10(item.ccNgoaingu)}</tr></tbody>
		</table>
		<button class="w3-button w3-blue mT10p w3-card-2 editSwitchingInputBtn printHidden" onclick="return tbl10Add(this)">Thêm</button>
	</div>
</form>

<form onsubmit="return false;"name="ccDthl" class="w3-row pad10p">
	<h3>11. Chứng chỉ khác (do Trung tâm Đào Tạo Huấn Luyện Nội Bài cấp)</h3>
	<p></p>
	<div class="overXAuto">
		<table class="fullw w3-table w3-striped w3-bordered w3-card-2 w3-container mT10p">
			<thead><tr class="w3-cyan cyanBg"><th>STT</th><th>Tên chứng chỉ</th><th>Thời gian thi</th><th>Thời hạn bắt đầu</th><th>Thời hạn kết thúc</th><th>Kết quả</th><th>Ghi chú</th><th>Ảnh</th></tr></thead>
			<tbody><tr>${tbl11(item.ccDthl)}</tr></tbody>
		</table>
		<button class="w3-button w3-blue mT10p w3-card-2 editSwitchingInputBtn printHidden" onclick="return tbl11Add(this)">Thêm</button>
	</div>
</form>

<form onsubmit="return false;"name="ccKhac" class="w3-row pad10p">
	<h3>12. Chứng chỉ khác (do đơn vị ngoài cấp)</h3>
	<p></p>
	<div class="overXAuto">
		<table class="fullw w3-table w3-striped w3-bordered w3-card-2 w3-container mT10p">
			<thead><tr class="w3-cyan cyanBg"><th>STT</th><th>Tên chứng chỉ</th><th>Thời gian học</th><th>Thời hạn bắt đầu (Nếu có)</th><th>Thời hạn kết thúc (Nếu có)</th><th>Ghi chú</th><th>Ảnh</th></tr></thead>
			<tbody><tr>${tbl12(item.ccKhac)}</tr></tbody>
		</table>
		<button class="w3-button w3-blue mT10p w3-card-2 editSwitchingInputBtn printHidden" onclick="return tbl12Add(this)">Thêm</button>
	</div>
</form>`;

externalDetailForm4=(rIdx,hoten,notEditMode)=>{r=holdingStudent.taicho[rIdx]; var course = searchForCourse(r.linked), kqChitiet=r.ketqua.chitiet, kqKey='ketqua.chitiet'; [fileId, fileName] = r.ketqua.img?r.ketqua.img.split('?'):[undefined,undefined];kqChitiet.forEach(kq=>kq.danhgia="Đạt");
	getDetaiElements=(isForLargeScr)=>`<div class="w3-card-2 divCenter  pb250p ${isForLargeScr>0?'width80 w3-hide-small w3-hide-medium':'w95 w3-hide-large'}">
		<div class="mT40p mb40p pad10p">
			<div class="fullw txCenter"><h4><b>KẾT QUẢ HUẤN LUYỆN TẠI CHỖ</b></h4></div>
			<table class="fullw table-no-border inf-table">
				<tbody>
					<tr><td><b>1. Họ và tên:</b></td><td>${hoten}</td></tr>
					<tr><td><b>2. Tên khóa huấn luyện:</b></td><td>${course.thongtinchung.ten}</td></tr>
					<tr><td><b>3. Ngày/tháng/năm huấn luyện:</b></td><td>${course.thongtinchung.thoigian}</td></tr>
					<tr><td><b>4. Vị trí huấn luyện lý thuyết và thực hành:</b></td></tr>
					<tr><td><b>- Lý thuyết:</b></td><td>${course.thongtinchung.vitriLythuyet}</td></tr>
					<tr><td><b>- Thực hành:</b></td><td>${course.thongtinchung.vitriThuchanh}</td></tr>
				</tbody>
			</table>
			<div class="overXAuto">
				<table class="fullw w3-table w3-striped w3-bordered w3-card-2 w3-container mT10p">
					<thead><tr class="w3-cyan w3-grayscale-min cyanBg"><th>STT</th><th>Nội dung huấn luyện</th><th>Thời gian</th><th>Nhận xét/Đánh giá</th><th>Huấn luyện viên/giáo viên</th></tr></thead>
					<tbody><tr>${kqChitiet.map((kq,kqIdx)=>`<td><p>${kqIdx+1}</p></td><td>${notEditMode?`<p>${kq.noidung}</p>`:`<input name="noidung" onblur="elmUneditArrHocvien(this,${kqIdx},'${kqKey}',${rIdx})" value="${kq.noidung}">`}</td><td>${notEditMode?`<p>${kq.thoigian}</p>`:`<input name="thoigian" onblur="elmUneditArrHocvien(this,${kqIdx},'${kqKey}',${rIdx})" value="${kq.thoigian}">`}</td><td>${notEditMode?`<p>${kq.danhgia}</p>`:`<input name="danhgia" onblur="elmUneditArrHocvien(this,${kqIdx},'${kqKey}',${rIdx})" value="${kq.danhgia}">`}</td><td>${notEditMode?`<p>${kq.giaovien.split('\n').join('<br>')}</p>`:`<textarea class="materialize-textarea" name="giaovien" onblur="elmUneditArrHocvien(this,${kqIdx},'${kqKey}',${rIdx})">${kq.giaovien}</textarea>`}</td>`).join('</tr><tr>')}</tr></tbody>
				</table>
			</div>
			<div class="txCenter">
				${notEditMode?
					`<div>${r.ketqua.img?`<img src="https://drive.google.com/thumbnail?authuser=0&sz=w680&id=${fileId}" class="width80 mT20p ptr" onclick="window.open('https://drive.google.com/open?id=${fileId}')">`:''}</div>`
				:`<div class="w3-col s12 w3-container mb4p mT10p" >
					<div class="w3-col s12 flexThumbnailContainer">
						<div class="customFileItem">
							<div class="frameThumbnail">
								${fileId?`<img src="./icons/svg/753/753345.svg" class="closeOnTopThumbnail" onclick="window.opener.onRemoveFilePreview(this.parentElement.parentElement,'${fileId}')" width="20px">
																<img width="80px" src="${getThumbnailUrl(fileId)}" onclick="window.open('${getDriveUrl(fileId)}')" alt="Lỗi Ảnh" >`:''	}
							</div>
						</div>
					</div>
					<div class="w3-col s12 fileUploadUI flexFileUploadContainer">
						<div class="w3-col s12 ${(!r.ketqua.img)?'':'hidden'}">
							<!-- Credit to:https://www.flaticon.com/free-icon/file_3143360 -->
							<label for="fileUploadCertImg${rIdx}" class="customFileUpload fullw txWhite">
								<img src="./icons/svg/3143/3143360.svg" width="20px" class="m5p">Đính kèm ảnh Chứng chỉ
							</label>
							<input type="file" id="fileUploadCertImg${rIdx}" name="ketqua.img" class="fileUploadInitDetailControl oneFileOnly" accept="image/*,.pdf" onchange="window.opener.handleFileUploadRemotely(event)" rename="let rc=holdingStudent.taicho[${rIdx}]; \`${holdingStudent.id.docId}.CC.\${rc.linked}\`;" callback="elmUneditArrHocvien(this,${rIdx})"/>
						</div>
					</div>
				</div>`}
			</div>
		</div></div>`;
//Credit to: https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy#inherited_origins
	holdingDetailWindow=window.open('./panel.html','Detail'); holdingDetailWindow.document.write((!course)?'Không có thông tin về khóa học này!!':`
${HTML_HEAD}
<body class="fullh page-overlay">
	<a href="javascript:void(0)" class="closebtn" onclick="window.close()">&times;</a>
	<form name="taicho">
	${getDetaiElements(FOR_LARGE_SCR)+getDetaiElements(FOR_SMALL_N_MEDIUM_SCR)}
	</form>
  	${HTML_SCRIPT_INIT}
</body>`);
}

externalLinkingCourse=(elm)=>{
	// r=holdingStudent.taicho[rIdx]; , kqChitiet=r.ketqua.chitiet, kqKey='ketqua.chitiet'; [fileId, fileName] = r.ketqua.img.split('?');
		getCourseElements=(isForLargeScr)=>`<div class="w3-card-2 divCenter  pb250p ${isForLargeScr>0?'width80 w3-hide-small w3-hide-medium':'w95 w3-hide-large'}">
		<div class="mT40p mb40p pad10p">
			<div class="fullw txCenter"><h4><b>DANH SÁNH LỚP HỌC</b></h4></div>
			<div class="w3-right w3-col s12 m8 l3 w3-container bot12p idSubSearchBar>
				<div class="w3-card-2 w3-container ">
					<div class="w3-col s12 w3-row w3-large">
						<div class="w3-col" style="width:30px;margin-top: 10px"><i class="fa fa-search"></i></div>
						<div class="w3-rest"><input type="text"  placeholder="Tìm kiếm.." onkeyup="logF(searchInit,{elm:this})" onfocus="" class="w3-input w3-border-0"></div>
					</div>
				</div>
			</div>
			<div class="idSubCourseList"></div>
		</div></div>`;
		holdingDetailWindow=window.open('./panel.html','Detail');holdingDetailWindow.elm=elm;holdingDetailWindow.courseList = mainData.courseList; holdingDetailWindow.document.write(`
${HTML_HEAD}
<body class="fullh page-overlay">
	<a href="javascript:void(0)" class="closebtn" onclick="onCloseCourseListPanel();window.close()">&times;</a>
	<form name="linkingCourse">
	
	${getCourseElements(FOR_LARGE_SCR)+getCourseElements(FOR_SMALL_N_MEDIUM_SCR)}
	</form>
	${HTML_SCRIPT_INIT}
</body>`);
	return false;
}

tbl2Add=(elm)=>tblAdd(elm,{thoigian:'',vitrilamviec:'',ghichu:''},tbl2);
tbl2=(congviec)=>congviec?(congviec.map((r,rIdx)=>`<td><p onclick="elmEdit(this)">${rIdx+1}</p><input name="stt" class="hidden" onblur="elmUneditArrHocvien(this,${rIdx})" value="${rIdx+1}"></td><td class="editSwitchingInput"><p onclick="elmEdit(this)">${r.thoigian}</p><input name="thoigian" class="hidden" onblur="elmUneditArrHocvien(this,${rIdx})" value="${r.thoigian}"></td><td class="editSwitchingInput"><p onclick="elmEdit(this)">${r.vitrilamviec}</p><input name="vitrilamviec" class="hidden" onblur="elmUneditArrHocvien(this,${rIdx})" value="${r.vitrilamviec}"></td><td class="editSwitchingInput"><p onclick="elmEdit(this)">${r.ghichu}</p><input name="ghichu" class="hidden" onblur="elmUneditArrHocvien(this,${rIdx})" value="${r.ghichu}"></td>${obFab.m=='delete'?`<td class="leastWidth"><button class="w3-button w3-red" onclick="return tblDel(this,${rIdx},tbl2)">Xóa</button></td>`:''}`).join('</tr><tr>')):'';

tbl3Add=(elm)=>tblAdd(elm,{ten:'',thoigian:'',diadiem:'',vanbang:{ten:'',img:''},ghichu:''},tbl3);
tbl3=(coban)=>coban?(coban.map((r,rIdx)=>`<td><p onclick="elmEdit(this)">${rIdx+1}</p><input name="stt" class="hidden" onblur="elmUneditArrHocvien(this,${rIdx})" value="${rIdx+1}"></td><td class="editSwitchingInput"><p onclick="elmEdit(this)">${r.ten}</p><input name="ten" class="hidden" onblur="elmUneditArrHocvien(this,${rIdx})" value="${r.ten}"></td><td class="editSwitchingInput"><p onclick="elmEdit(this)">${r.thoigian}</p><input name="thoigian" class="hidden" onblur="elmUneditArrHocvien(this,${rIdx})" value="${r.thoigian}"></td><td class="editSwitchingInput"><p onclick="elmEdit(this)">${r.diadiem}</p><input name="diadiem" class="hidden" onblur="elmUneditArrHocvien(this,${rIdx})" value="${r.diadiem}"></td><td class="editSwitchingInput"><p onclick="elmEdit(this)">${r.vanbang.ten}</p><input name="vanbang.ten" class="hidden" onblur="elmUneditArrHocvien(this,${rIdx})" value="${r.vanbang.ten}"></td><td class="editSwitchingInput"><p onclick="elmEdit(this)">${r.ghichu}</p><input name="ghichu" class="hidden" onblur="elmUneditArrHocvien(this,${rIdx})" value="${r.ghichu}"></td>
	${tblImgHolder(r.vanbang.img,rIdx,'vanbang.img',`let rc=holdingStudent.coban[${rIdx}]; \`${holdingStudent.id.docId} - \${rc.diadiem} - \${rc.vanbang.ten} - \${rc.ten}\`;`)}
	${obFab.m=='delete'?`<td class="leastWidth"><button class="w3-button w3-red" onclick="return tblDel(this,${rIdx},tbl3)">Xóa</button></td>`:''}`).join('</tr><tr>')):'';

tbl4Add=(elm,course)=>{tblAdd(elm,{linked:course.id.docId,ghichu:'',ketqua:{tomtat:'',img:null,chitiet:course.chitiet.map(item=>({noidung:item.noidung,thoigian:(item.thoigian?item.thoigian:''),danhgia:'',giaovien:item.giaovien}))}},tbl4);}
tbl4=(taicho)=>taicho?(taicho.map((r,rIdx)=>{var course=searchForCourse(r.linked);notEditMode=obFab.m!='edit';return course==null?'<td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td>':`<td><p onclick="elmEdit(this)">${r.stt}</p><input name="stt" class="hidden" onblur="elmUneditHocvien(this)" value="${r.stt}"></td><td><p onclick="externalDetailForm4(${rIdx},'${holdingStudent.canhan.hoten}',${notEditMode});">${course.thongtinchung.ten}</p></td><td><p onclick="externalDetailForm4(${rIdx},'${holdingStudent.canhan.hoten}',${notEditMode});">${course.thongtinchung.thoigian}</p></td><td><p onclick="externalDetailForm4(${rIdx},'${holdingStudent.canhan.hoten}',${notEditMode});">${course.thongtinchung.coso}</p></td><td class="editSwitchingInput"><p onclick="elmEdit(this)">${r.ketqua.tomtat}</p><input name="ketqua.tomtat" class="hidden" onblur="elmUneditArrHocvien(this,${rIdx})" value="${r.ketqua.tomtat}"></td><td class="editSwitchingInput"><p onclick="elmEdit(this)">${r.ghichu}</p><input name="ghichu" class="hidden" onblur="elmUneditArrHocvien(this,${rIdx})" value="${r.ghichu}">${obFab.m=='delete'?`<td class="leastWidth"><button class="w3-button w3-red" onclick="return tblDel(this,${rIdx},tbl5)">Xóa</button></td>`:''}</td>`;}).join('</tr><tr>')):'';
tbl4Query=(item)=>tblQuery(item,'taicho','linked','taichoLinked');

tbl5Add=(elm)=>tblAdd(elm,{thoigian:'',noidung:'',hinhthucXuly:'',img:''},tbl5);
tbl5=(suco)=>suco?(suco.map((r,rIdx)=>`<td><p onclick="elmEdit(this)">${rIdx+1}</p><input name="stt" class="hidden" onblur="elmUneditArrHocvien(this,${rIdx})" value="${rIdx+1}"></td><td class="editSwitchingInput"><p onclick="elmEdit(this)">${r.thoigian}</p><input name="thoigian" class="hidden" onblur="elmUneditArrHocvien(this,${rIdx})" value="${r.thoigian}"></td><td class="editSwitchingInput"><p onclick="elmEdit(this)">${r.noidung}</p><input name="noidung" class="hidden" onblur="elmUneditArrHocvien(this,${rIdx})" value="${r.noidung}"></td><td class="editSwitchingInput"><p onclick="elmEdit(this)">${r.hinhthucXuly}</p><input name="hinhthucXuly" class="hidden" onblur="elmUneditArrHocvien(this,${rIdx})" value="${r.hinhthucXuly}"></td>${tblImgHolder(r.img,rIdx,'img',`let rc=holdingStudent.suco[${rIdx}]; \`${holdingStudent.id.docId} - \${rc.thoigian}\`;`)}${obFab.m=='delete'?`<td class="leastWidth"><button class="w3-button w3-red" onclick="return tblDel(this,${rIdx},tbl5)">Xóa</button></td>`:''}`).join('</tr><tr>')):'';

tbl7Add=(elm)=>tblAdd(elm,{noidung:'',thoigian:'',coso:'',ghichu:''},tbl7);
tbl7=(hlvien)=>hlvien?(hlvien.map((r,rIdx)=>`<td><p onclick="elmEdit(this)">${rIdx+1}</p><input name="stt" class="hidden" onblur="elmUneditArrHocvien(this,${rIdx})" value="${rIdx+1}"></td><td class="editSwitchingInput"><p onclick="elmEdit(this)">${r.noidung}</p><input name="noidung" class="hidden" onblur="elmUneditArrHocvien(this,${rIdx})" value="${r.noidung}"></td><td class="editSwitchingInput"><p onclick="elmEdit(this)">${r.thoigian}</p><input name="thoigian" class="hidden" onblur="elmUneditArrHocvien(this,${rIdx})" value="${r.thoigian}"></td><td class="editSwitchingInput"><p onclick="elmEdit(this)">${r.coso}</p><input name="coso" class="hidden" onblur="elmUneditArrHocvien(this,${rIdx})" value="${r.coso}"></td><td class="editSwitchingInput"><p onclick="elmEdit(this)">${r.ghichu}</p><input name="ghichu" class="hidden" onblur="elmUneditArrHocvien(this,${rIdx})" value="${r.ghichu}"></td>${obFab.m=='delete'?`<td class="leastWidth"><button class="w3-button w3-red" onclick="return tblDel(this,${rIdx},tbl7)">Xóa</button></td>`:''}`).join('</tr><tr>')):'';

tbl8Add=(elm)=>tblAdd(elm,{ten:'',ngaythi:'',thoihan:{tu:'',den:''},sohieu:'',ghichu:'',img:''},tbl8);
tbl8=(nangdinh)=>nangdinh?(nangdinh.map((r,rIdx)=>`<td><p onclick="elmEdit(this)">${rIdx+1}</p><input name="stt" class="hidden" onblur="elmUneditArrHocvien(this,${rIdx})" value="${rIdx+1}"></td><td class="editSwitchingInput"><p onclick="elmEdit(this)">${r.ten}</p><input name="ten" class="hidden" onblur="elmUneditArrHocvien(this,${rIdx})" value="${r.ten}"></td><td class="editSwitchingInput"><p onclick="elmEdit(this)">${r.ngaythi}</p><input name="ngaythi" class="hidden" onblur="elmUneditArrHocvien(this,${rIdx})" value="${r.ngaythi}"></td><td class="editSwitchingInput"><p onclick="elmEdit(this)">${r.thoihan.tu}</p><input name="thoihan.tu" class="hidden" onblur="elmUneditArrHocvien(this,${rIdx})" value="${r.thoihan.tu}"></td><td class="editSwitchingInput"><p onclick="elmEdit(this)">${r.thoihan.den}</p><input name="thoihan.den" class="hidden" onblur="elmUneditArrHocvien(this,${rIdx})" value="${r.thoihan.den}"></td><td class="editSwitchingInput"><p onclick="elmEdit(this)">${chkVal(r.sohieu)}</p><input name="sohieu" class="hidden" onblur="elmUneditArrHocvien(this,${rIdx})" value="${chkVal(r.sohieu)}"></td><td class="editSwitchingInput"><p onclick="elmEdit(this)">${chkVal(r.ghichu)}</p><input name="ghichu" class="hidden" onblur="elmUneditArrHocvien(this,${rIdx})" value="${chkVal(r.ghichu)}"></td>${tblImgHolder(r.img,rIdx,'img',`let rc=holdingStudent.nangdinh[${rIdx}]; \`${holdingStudent.id.docId} - \${rc.ten} - \${rc.sohieu} - \${rc.thoihan.tu}\`;`)}${obFab.m=='delete'?`<td class="leastWidth"><button class="w3-button w3-red" onclick="return tblDel(this,${rIdx},tbl8)">Xóa</button></td>`:''}`).join('</tr><tr>')):'';
tbl8QueryTen=(item)=>tblQuery(item,'nangdinh','ten','nangdinhTen');
tbl8QueryThoihan=(item)=>tblQueryThoihanDate(item,'nangdinh','nangdinhThoihan');

//TODO content tbl9-1200ll
tbl9Add=(elm)=>tblAdd(elm,{ten:'',ngaythi:'',thoihan:{tu:'',den:''},sohieu:'',ghichu:'',img:''},tbl9);
tbl9=(giayphep)=>giayphep?(giayphep.map((r,rIdx)=>`<td><p onclick="elmEdit(this)">${rIdx+1}</p><input name="stt" class="hidden" onblur="elmUneditArrHocvien(this,${rIdx})" value="${rIdx+1}"></td><td class="editSwitchingInput"><p onclick="elmEdit(this)">${r.ten}</p><input name="ten" class="hidden" onblur="elmUneditArrHocvien(this,${rIdx})" value="${r.ten}"></td><td class="editSwitchingInput"><p onclick="elmEdit(this)">${r.ngaythi}</p><input name="ngaythi" class="hidden" onblur="elmUneditArrHocvien(this,${rIdx})" value="${r.ngaythi}"></td><td class="editSwitchingInput"><p onclick="elmEdit(this)">${r.thoihan.tu}</p><input name="thoihan.tu" class="hidden" onblur="elmUneditArrHocvien(this,${rIdx})" value="${r.thoihan.tu}"></td><td class="editSwitchingInput"><p onclick="elmEdit(this)">${r.thoihan.den}</p><input name="thoihan.den" class="hidden" onblur="elmUneditArrHocvien(this,${rIdx})" value="${r.thoihan.den}"></td><td class="editSwitchingInput"><p onclick="elmEdit(this)">${chkVal(r.sohieu)}</p><input name="sohieu" class="hidden" onblur="elmUneditArrHocvien(this,${rIdx})" value="${chkVal(r.sohieu)}"><td class="editSwitchingInput"><p onclick="elmEdit(this)">${r.ghichu}</p><input name="ghichu" class="hidden" onblur="elmUneditArrHocvien(this,${rIdx})" value="${r.ghichu}"></td>${tblImgHolder(r.img,rIdx,'img',`let rc=holdingStudent.giayphep[${rIdx}]; \`${holdingStudent.id.docId} - \${rc.ten} - \${rc.sohieu} - \${rc.thoihan.tu}\`;`)}${obFab.m=='delete'?`<td class="leastWidth"><button class="w3-button w3-red" onclick="return tblDel(this,${rIdx},tbl9)">Xóa</button></td>`:''}`).join('</tr><tr>')):'';

tbl10Add=(elm)=>tblAdd(elm,{ten:'',thoihan:{tu:'',den:''},diem:'',ketqua:'',ghichu:'',img:''},tbl10);
tbl10=(ccNgoaingu)=>ccNgoaingu?(ccNgoaingu.map((r,rIdx)=>`<td><p onclick="elmEdit(this)">${rIdx+1}</p><input name="stt" class="hidden" onblur="elmUneditArrHocvien(this,${rIdx})" value="${rIdx+1}"></td><td class="editSwitchingInput"><p onclick="elmEdit(this)">${r.ten}</p><input name="ten" class="hidden" onblur="elmUneditArrHocvien(this,${rIdx})" value="${r.ten}"></td><td class="editSwitchingInput"><p onclick="elmEdit(this)">${r.thoihan.tu}</p><input name="thoihan.tu" class="hidden" onblur="elmUneditArrHocvien(this,${rIdx})" value="${r.thoihan.tu}"></td><td class="editSwitchingInput"><p onclick="elmEdit(this)">${r.thoihan.den}</p><input name="thoihan.den" class="hidden" onblur="elmUneditArrHocvien(this,${rIdx})" value="${r.thoihan.den}"></td><td class="editSwitchingInput"><p onclick="elmEdit(this)">${r.diem}</p><input name="diem" class="hidden" onblur="elmUneditArrHocvien(this,${rIdx})" value="${r.diem}"></td><td class="editSwitchingInput"><p onclick="elmEdit(this)">${r.ketqua}</p><input name="ketqua" class="hidden" onblur="elmUneditArrHocvien(this,${rIdx})" value="${r.ketqua}"></td><td class="editSwitchingInput"><p onclick="elmEdit(this)">${r.ghichu}</p><input name="ghichu" class="hidden" onblur="elmUneditArrHocvien(this,${rIdx})" value="${r.ghichu}"></td>${tblImgHolder(r.img,rIdx,'img',`let rc=holdingStudent.ccNgoaingu[${rIdx}]; \`${holdingStudent.id.docId} - \${rc.ten} - \${rc.diem}\`;`)}${obFab.m=='delete'?`<td class="leastWidth"><button class="w3-button w3-red" onclick="return tblDel(this,${rIdx},tbl10)">Xóa</button></td>`:''}`).join('</tr><tr>')):'';

tbl11Add=(elm)=>tblAdd(elm,{ten:'',ngaythi:'',thoihan:{tu:'',den:''},ketqua:'',ghichu:'',img:''},tbl11);
tbl11=(ccDthl)=>ccDthl?(ccDthl.map((r,rIdx)=>`<td><p onclick="elmEdit(this)">${rIdx+1}</p><input name="stt" class="hidden" onblur="elmUneditArrHocvien(this,${rIdx})" value="${rIdx+1}"></td><td class="editSwitchingInput"><p onclick="elmEdit(this)">${r.ten}</p><input name="ten" class="hidden" onblur="elmUneditArrHocvien(this,${rIdx})" value="${r.ten}"></td><td class="editSwitchingInput"><p onclick="elmEdit(this)">${r.ngaythi}</p><input name="ngaythi" class="hidden" onblur="elmUneditArrHocvien(this,${rIdx})" value="${r.ngaythi}"></td><td class="editSwitchingInput"><p onclick="elmEdit(this)">${r.thoihan.tu}</p><input name="thoihan.tu" class="hidden" onblur="elmUneditArrHocvien(this,${rIdx})" value="${r.thoihan.tu}"></td><td class="editSwitchingInput"><p onclick="elmEdit(this)">${r.thoihan.den}</p><input name="thoihan.den" class="hidden" onblur="elmUneditArrHocvien(this,${rIdx})" value="${r.thoihan.den}"></td><td class="editSwitchingInput"><p onclick="elmEdit(this)">${r.ketqua}</p><input name="ketqua" class="hidden" onblur="elmUneditArrHocvien(this,${rIdx})" value="${r.ketqua}"></td><td class="editSwitchingInput"><p onclick="elmEdit(this)">${r.ghichu}</p><input name="ghichu" class="hidden" onblur="elmUneditArrHocvien(this,${rIdx})" value="${r.ghichu}"></td>${tblImgHolder(r.img,rIdx,'img',`let rc=holdingStudent.ccDthl[${rIdx}]; \`${holdingStudent.id.docId} - \${rc.ten}\`;`)}${obFab.m=='delete'?`<td class="leastWidth"><button class="w3-button w3-red" onclick="return tblDel(this,${rIdx},tbl11)">Xóa</button></td>`:''}`).join('</tr><tr>')):'';

tbl12Add=(elm)=>tblAdd(elm,{ten:'',ngayhoc:'',thoihan:{tu:'',den:''},ghichu:'',img:''},tbl12);
tbl12=(ccKhac)=>ccKhac?(ccKhac.map((r,rIdx)=>`<td><p onclick="elmEdit(this)">${rIdx+1}</p><input name="stt" class="hidden" onblur="elmUneditArrHocvien(this,${rIdx})" value="${rIdx+1}"></td><td class="editSwitchingInput"><p onclick="elmEdit(this)">${r.ten}</p><input name="ten" class="hidden" onblur="elmUneditArrHocvien(this,${rIdx})" value="${r.ten}"></td><td class="editSwitchingInput"><p onclick="elmEdit(this)">${r.ngayhoc}</p><input name="ngayhoc" class="hidden" onblur="elmUneditArrHocvien(this,${rIdx})" value="${r.ngayhoc}"></td><td class="editSwitchingInput"><p onclick="elmEdit(this)">${r.thoihan.tu}</p><input name="thoihan.tu" class="hidden" onblur="elmUneditArrHocvien(this,${rIdx})" value="${r.thoihan.tu}"></td><td class="editSwitchingInput"><p onclick="elmEdit(this)">${r.thoihan.den}</p><input name="thoihan.den" class="hidden" onblur="elmUneditArrHocvien(this,${rIdx})" value="${r.thoihan.den}"></td><td class="editSwitchingInput"><p onclick="elmEdit(this)">${r.ghichu}</p><input name="ghichu" class="hidden" onblur="elmUneditArrHocvien(this,${rIdx})" value="${r.ghichu}"></td>${tblImgHolder(r.img,rIdx,'img',`let rc=holdingStudent.ccKhac[${rIdx}]; \`${holdingStudent.id.docId} - \${rc.ten}\`;`)}${obFab.m=='delete'?`<td class="leastWidth"><button class="w3-button w3-red" onclick="return tblDel(this,${rIdx},tbl12)">Xóa</button></td>`:''}`).join('</tr><tr>')):'';

tblCourseAdd=(elm)=>tblAdd(elm,{noidung:'',thoigian:'',giaovien:''},tblCourse);
tblCourse=(chitiet)=>chitiet?(chitiet.map((kq,kqIdx)=>`<td><p>${kqIdx+1}</p></td><td class="editSwitchingInput"><p>${kq.noidung}</p><input name="noidung" onblur="elmUneditArrCourse(this,${kqIdx})" value="${kq.noidung}"></td><td class="editSwitchingInput"><p>${kq.thoigian}</p><input name="thoigian" onblur="elmUneditArrCourse(this,${kqIdx})" value="${kq.thoigian}"></td><td class="editSwitchingInput"><p>${kq.giaovien.split('\n').join('<br>')}</p><textarea class="materialize-textarea" name="giaovien" onblur="elmUneditArrCourse(this,${kqIdx})">${kq.giaovien}</textarea></td>${obFab.m=='delete'?`<td class="leastWidth"><button class="w3-button w3-red" onclick="return tblDel(this,${kqIdx},tblCourse)">Xóa</button></td>`:''}`).join('</tr><tr>')):'';

tblDel=(elm,idx,func)=>{let holdingList=(holdingType=='Course'?holdingCourse[elm.form.name]:holdingStudent[elm.form.name]);let item=holdingList.filter((r,rIdx)=>idx!=rIdx);if(holdingType=='Course'){holdingCourse[elm.form.name]=item;sendUpdateArrCourse(elm,item)}else{holdingStudent[elm.form.name]=item;sendUpdateArrHocvien(elm,item)} tblRefreshRow(elm,item,func); return false;}
tblAdd=(elm,newObj,func)=>{let item=(holdingType=='Course'?holdingCourse[elm.form.name]:holdingStudent[elm.form.name]);newObj.stt=item.length+1; item.push(newObj);tblRefreshRow(elm,item,func); return false;}
tblRefreshRow=(elm,tbl,func)=>{elm.form.querySelector('table tbody').innerHTML=`<tr>${func(tbl)}</tr>`;editSwitchInput(obFab.m=='edit');}

tblQuery=(item,mainKey,subKey,newKey)=>{item[newKey]=item[mainKey].map(r=>r[subKey]);sendUpdateQueryIdxHocvien(item,newKey,item[newKey])}
tblQueryThoihan=(item,mainKey,newKey)=>{item[newKey]=item[mainKey].map(r=>r.thoihan.den);sendUpdateQueryIdxHocvien(item,newKey,item[newKey])}
tblQueryThoihanDate=(item,mainKey,newKey)=>{item[newKey]=item[mainKey].map(r=>str2Date(r.thoihan.den.split('/')));sendUpdateQueryIdxHocvien(item,newKey,item[newKey])}

str2Date=(strSplitted)=>Date.parse(strSplitted[1]+'/'+strSplitted[0]+'/'+strSplitted[2]);

chkVal=(val)=>val==undefined?'(Không)':val;

var timesCount = 0;
tblImgHolder=(imgLink,rIdx,attribName,renameJScode)=>`<td class="txCenter editSwitchingInput">
	${(!imgLink)?`<div>(Không)</div>`:`<img width="80px" src="${getThumbnailUrl(imgLink.split('?')[0])}" onclick="window.open('${getDriveUrl(imgLink.split('?')[0])}')" alt="Lỗi Ảnh" >`	}
		<div class="hidden">
			<div class="flexThumbnailContainerSmall">
					${(!imgLink)?'':`<div class="frameThumbnail ptr">
									<img src="./icons/svg/753/753345.svg" class="closeOnTopThumbnail" onclick="onRemoveFilePreview(this.parentElement,'${imgLink.split('?')[0]}')" width="20px">
									<img width="80px" src="${getThumbnailUrl(imgLink.split('?')[0])}" onclick="window.open('${getDriveUrl(imgLink.split('?')[0])}')" alt="Lỗi Ảnh" >
								</div>`}
			</div>
			<div class="fileUploadUI flexFileUploadContainerSmall ">
				<div class="${(!imgLink)?'':'hidden'}">
					<!-- Credit to:https://www.flaticon.com/free-icon/file_3143360 -->
					<label for="fileUploadCobanImg${rIdx}-${timesCount}" class="customFileUploadSmall fullw txWhite">
						<img src="./icons/svg/3143/3143360.svg" width="20px" class="m5p">Thêm ảnh
					</label>
					<input type="file" id="fileUploadCobanImg${rIdx}-${timesCount++}" name="${attribName}" class="fileUploadInitDetailControl oneFileOnly" accept="image/*,.pdf" onchange="handleFileUploadForSmall(event)" rename="${renameJScode}" callback="elmUneditArrHocvien(this,${rIdx})"/>
				</div>
			</div>
		</div>
	</td>`;

editSwitchInput=(inputOn)=>{
	Array.from(document.getElementsByClassName('editSwitchingInput')).forEach((parent)=>{parent.children[0].classList.toggle('hidden',inputOn);parent.children[1].classList.toggle('hidden',!inputOn)});
	Array.from(document.getElementsByClassName('editSwitchingInputBtn')).forEach((elm)=>{elm.classList.toggle('hidden',!inputOn)});
	
}

const funcsMap = {congviec:tbl2,coban:tbl3,taicho:tbl4,suco:tbl5,hlvien:tbl7,nangdinh:tbl8,chitiet:tblCourse,giayphep:tbl9,ccNgoaingu:tbl10,ccDthl:tbl11,ccKhac:tbl12};
tblReloadState=()=>{//For reload "Xóa" Buttons
	Array.from(document.getElementsByClassName('editSwitchingInputBtn')).forEach(elm=>{if(holdingStudent) tblRefreshRow(elm,holdingStudent[elm.form.name],funcsMap[elm.form.name]);if(holdingCourse) tblRefreshRow(elm,holdingCourse[elm.form.name],funcsMap[elm.form.name]); })
	Array.from(document.getElementsByClassName('materialize-textarea')).forEach(elm=>M.textareaAutoResize(elm)); // resize the text-area 
}

const HTML_HEAD=`
<head>
	<title></title>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width,initial-scale=1">
	
	<script src="lib/common/logScript.js"></script>
	<!-------- Fonts go here ---------->
	<!--Import Google Icon Font-->
	<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
	<!-- Awesome Font -->
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
	<!-------------------------------------------------->
	<!-------- CSS goes here ---------->
	<!-- Compiled and minified MaterializeCSS -->
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">
	<!-- W3 CSS -->
	<!-- <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">  -->
	<!-- <link rel="stylesheet" href="https://www.w3schools.com/lib/w3-theme-green.css"> -->


  <link rel="stylesheet" type="text/css" href="lib/ui/w3.css">
  <link rel="stylesheet" type="text/css" href="lib/ui/w3-theme-green.css">
  <link rel="stylesheet" type="text/css" href="lib/ui/lds-spinner.css">
  <link rel="stylesheet" type="text/css" href="lib/ui/page-overlay.css">
  <link rel="stylesheet" type="text/css" href="lib/ui/custom.css">
	
	<style type="text/css" description="specific-custom">

		@media screen and (max-width: 600px) {.show600px {display: none;}}
		@media screen and (min-width: 1000px) {.show600px {max-width: 100px}}

		@media screen and (max-width: 1000px) {.txLarge{font-size: 18px}.txSmall{font-size: 11px}.txxLarge{font-size: 22px}}
		@media screen and (max-width: 800px) {.txLarge{font-size: 15px}.txSmall{font-size: 10px}.txxLarge{font-size: 20px}}
		@media screen and (max-width: 700px) {.txLarge{font-size: 12px}.txSmall{font-size: 9px}.txxLarge{font-size: 20px}}
		@media screen and (max-width: 600px) {.txLarge{font-size: 18px}.txSmall{font-size: 12px}.txxLarge{font-size: 18px}}
		@media screen and (max-width: 440px) {.txLarge{font-size: 15px}.txSmall{font-size: 10px}.txxLarge{font-size: 16px}}
		@media screen and (max-width: 350px) {.txLarge{font-size: 12px}.txSmall{font-size: 9px}}
		@media screen and (max-width: 280px) {.txxLarge{font-size: 14px}}

		input.searchDark{color: #fff;}

		.sthoanthanh{background-color: #109618; color: #fff; opacity: 0.75}
		.stTen{background-color: #109618; color: #fff; opacity: 0.75}
		.stChoduyetHoanthanh{background-color: #02a99a; color: #fff; opacity: 0.9}
		.stChoduyetTamdung{background-color: #f5c043; color: #000; opacity: 0.9}
		.stTuchoiYeucau{background-color: #e91b86; color: #fff; opacity: 0.75}
		.stHoanthanh{background-color: #3366cc; color: #fff; opacity: 0.75}
		.stQuahan{background-color: #dc3912; color: #fff; opacity: 0.75}
		.stKetthuc{background-color: #855e58; color: #fff; opacity: 0.75}
		.stHethan{background-color: #dc3912; color: #fff; opacity: 0.75}
		.stTamdung{background-color: #ff9900; color: #000; opacity: 0.75}
		.stMoi{background-color: #0099c6; color: #fff; opacity: 0.75}
		.stBatdau{background-color: #6e8a42; color: #fff; opacity: 0.75}
	
		#idSidebar{background-color: #252a2d; color: #797a7b; width: 25%}
		#idSidebarSearch{background-color: #202527; color: #fff; width: 100%}
		#idSidebarUserPanel{background-color: #202527; width: 100%}
		@media screen and (max-width: 1267px) {#idSidebar {width: 30%}}
		@media screen and (max-width: 1065px) {#idSidebar {width: 40%}}
		@media screen and (max-width: 800px) {#idSidebar {width: 50%}}
		@media screen and (max-width: 636px) {#idSidebar {width: 70%}}
		@media screen and (max-width: 431px) {#idSidebar {width: 80%}}
		
		.cyanBg h1{color: white}
		.cyanBg th{color: white}
		.cyanBg button{color: white}

		.inf-table tbody tr td{padding: 4px 2px;}

		p{margin: 2px 0px}
		h3{font-weight: bold;}
		hr{margin: 5px}

		label{color: black}
		label.txWhite{color: white}

		input[type="file"] {
		    display: none;
		}
		.customFileUpload{border: 1px solid #ccc;display: inline-block;padding: 6px 12px;cursor: pointer;}
		.flexFileUploadContainer{display: flex;flex-wrap: wrap; background-color: #e9d8f4;justify-content: space-evenly; align-items: baseline;}
		.flexFileUploadContainer > div {  background-color: #58257b; margin: 10px;text-align: center;line-height: 15px;}

		/*Credit to: https://stackoverflow.com/questions/40400094/set-a-close-icon-in-the-top-right-corner-of-an-image*/
		.frameThumbnail{display: inline-block;position: relative;}
		.closeOnTopThumbnail{position: absolute;top: -8px;right: -10px;}

		.customFileItem{cursor: pointer;}
		.flexThumbnailContainer{display: flex;flex-wrap: wrap;background-color: #e9d8f4;justify-content: flex-start;align-items: baseline;}
		.flexThumbnailContainer > div {  background-color: #e9d8f4;width:80px;margin: 20px; text-align: center; }
		/*background-color: #e9d8f4;*/

		.flexPreviewContainer{display: flex;flex-wrap: wrap;justify-content: flex-start;align-items: baseline;}
		.flexPreviewContainer > div {  width:80px;margin: 20px; text-align: center; }
	</style>
	<style>
		[type="radio"]:checked + span:after,
		[type="radio"].with-gap:checked + span:before,
		[type="radio"].with-gap:checked + span:after {border: 2px solid #5ebdd4;}

		[type="radio"]:checked + span:after,
		[type="radio"].with-gap:checked + span:after {background-color: #5ebdd4;}//ef5350
		 
	</style>
	<style>
		.f16pt    	{font-size:16pt;}
		.f16ptCap	{font-size:16pt;text-transform:uppercase;}
	</style>
</head>`;

const HTML_SCRIPT_INIT = `
  	<script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script><!-- Compiled and minified Material -->
	<script>
		Array.from(document.getElementsByClassName('materialize-textarea')).forEach(elm=>M.textareaAutoResize(elm)); // resize the text-area 
		elmUneditArrHocvien=(elm,rowIdx,parentKeys,parentIdx)=>{window.opener.elmUneditArrHocvien(elm,rowIdx,parentKeys,parentIdx)}
		searchInit=(p)=>{lockSearch=true;if((subData.filter=p.elm.value).length<10) setTimeout(()=>{updateSubCourseList();lockSearch=false},2000);else{updateSubCourseList();lockSearch=false;}}
		var subData = {filter:''}, lockSearch = false;
		updateSubCourseList=()=>{
			analyzeTerms=(inItem,lastVal)=>{var t=typeof inItem;return (t=='string')?(lastVal||inItem.search(subData.filter)>-1):(t=='array')? false:Object.keys(inItem).reduce((last,k1)=>analyzeTerms(inItem[k1],last),lastVal);}
			courseListFilter=(item)=>(!subData.filter||subData.filter.length==0)?true:analyzeTerms(item,false);
			let courseListContent = courseList.reduce((last,item,idx)=>last+(courseListFilter(item)?\`<div class="w3-bar w3-hover-light-grey" onclick="this.getElementsByTagName('input')[0].checked=true"><label class="w3-bar-item" style="padding: 20px 10px;"><input type="radio" id="idxCourse\${idx}" name="courseItems" value="\${idx}" class="with-gap"><span></span></label><div class="w3-bar-item" style="padding:10px 0px;" ><h4><b>\${item.id.docId}</b></h4><p>\${item.ten}</p><p>Thời gian: \${item.thoigian}</p></div></div><hr>\`:''),'')
			Array.from(document.getElementsByClassName('idSubCourseList')).forEach(elm=>elm.innerHTML = courseListContent);
		}
		updateSubCourseList();
		onCloseCourseListPanel=()=>{//todo
			window.opener.tbl4Add(elm,courseList[document.linkingCourse.courseItems.value]); 
		}
	</script>
`

//===================================



externalPrintingHocvien=()=>{
	if(!holdingStudent) {logE(null,'Sai trạng thái cho Thông tin học viên!'); return;}
//Credit to: https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy#inherited_origins
	holdingDetailWindow=window.open('./panel.html','Print'); holdingDetailWindow.document.write(`
${HTML_HEAD}
<body>
	<div class="printHidden">
		<button onclick="window.print()">In Thông tin học viên</button>
	</div>
	<div class="w3-hide-large w3-hide-medium">
  	${studentDetailPanelFormingForPrint(holdingStudent)}
  	</div>
  	<script>
  		setTimeout(()=>{window.print()},1500);
  	</script>
</body>`);
}

studentDetailPanelFormingForPrint=(item)=>
`<div class="divCenter">
	<div style=""><div class="pageDoubleBlueSubBorder m0px"><div class="pageDoubleBlueBorder m2p">
	${labelForming(item)}
	</div></div></div>
	<div class="pagebreak"> </div>
	${contentForming1ForPrint(item)}
	<div class="pagebreak"> </div>
	${contentForming2to7ForPrint(item)}
</div>
`;

labelForming=(item)=>`
	<div class="m0px">
		<h4 class="txCenter timesFont" style="margin-top: 20px;">TỔNG CÔNG TY CẢNG HÀNG KHÔNG VIỆT NAM - CTCP</h4>
		<h4 class="txCenter timesFont"><b>CẢNG HÀNG KHÔNG QUỐC TẾ NỘI BÀI</b></h4>
		<div class="width30" style="margin: 0 auto;border: 1px solid grey"></div>
	</div>
	<div class="fullw mT180p txCenter">
		<img src="../img/acv-logo.png">
	</div>
	<div class="mT180p">
		<h1 class="txCenter" style="font-weight: 900;">SỔ THEO DÕI</h1>
		<h1 class="txCenter" style="font-weight: 900;">HUẤN LUYỆN NHÂN VIÊN ANS</h1>
	</div>
	<div class="w3-row mT240p mb80p">
		<div class="w3-col s4 txRight">${item.canhan.img?`<img src="https://drive.google.com/thumbnail?authuser=0&sz=w100&id=${item.canhan.img.split('?')[0]}" class=" padAvatar">`:''}</div>
		<div class="w3-col s3 txLeft line3 mT20p pLR15px">
			<h5 class="f16pt"><b>Số hồ sơ:</b></h5>
			<h5 class="f16pt">Họ và tên:</h5>
			<h5 class="f16pt">Vị trí công tác:</h5>
		</div>
		<div class="w3-col s5 txLeft line3 mT20p pT5px">
			<h5 class="f16pt"><b>${item.canhan.soHoso}</b></h5>
			<h5 class="f16ptCap">${item.canhan.hoten}</h5>
			<h5 class="f16ptCap">${item.canhan.vitriCongtac}</h5>
		</div>
	</div>
`;

contentForming1ForPrint=(item)=>
`<form onsubmit="return false;"name="canhan">
	<h3 class="mT40p">1. Thông tin cá nhân</h3>
	<table class="fullw table-border-all padding-table">
		<tbody>
			<tr><td class="w40"><b>Họ và tên:</b></td><td><p onclick="elmEdit(this)">${item.canhan.hoten}</p><input name="hoten" class="fullw hidden" onblur="elmUneditHocvien(this)" value="${item.canhan.hoten}"></td></tr>
			<tr><td><b>Giới tính:</b></td><td class="editSwitchingInput"><p onclick="elmEdit(this)">${item.canhan.gioitinh}</p><input name="gioitinh" class="fullw hidden" onblur="elmUneditHocvien(this)" value="${item.canhan.gioitinh}"></td></tr>
			<tr><td><b>Ngày tháng năm sinh:</b></td><td class="editSwitchingInput"><p onclick="elmEdit(this)">${item.canhan.dob}</p><input name="dob" class="fullw hidden" onblur="elmUneditHocvien(this)" value="${item.canhan.dob}"></td></tr>
			
			<tr><td><b>Nơi sinh:</b></td><td class="editSwitchingInput"><p onclick="elmEdit(this)">${item.canhan.pob}</p><input name="pob" class="fullw hidden" onblur="elmUneditHocvien(this)" value="${item.canhan.pob}"></td></tr>
			<tr><td><b>Quê quán:</b></td><td class="editSwitchingInput"><p onclick="elmEdit(this)">${item.canhan.quequan}</p><input name="quequan" class="fullw hidden" onblur="elmUneditHocvien(this)" value="${item.canhan.quequan}"></td></tr>
			<tr><td><b>Đơn vị công tác:</b></td><td class="editSwitchingInput"><p onclick="elmEdit(this)">${item.canhan.donviCongtac}</p><input name="donviCongtac" class="fullw hidden" onblur="elmUneditHocvien(this)" value="${item.canhan.donviCongtac}"></td></tr>
			<tr><td><b>Trình độ đào tạo:</b></td><td class="editSwitchingInput"><p onclick="elmEdit(this)">${item.canhan.trinhdoDaotao}</p><input name="trinhdoDaotao" class="fullw hidden" onblur="elmUneditHocvien(this)" value="${item.canhan.trinhdoDaotao}"></td></tr>
			<tr><td><b>Địa chỉ hiện tại:</b></td><td class="editSwitchingInput"><p onclick="elmEdit(this)">${item.canhan.diachiHientai}</p><input name="diachiHientai" class="fullw hidden" onblur="elmUneditHocvien(this)" value="${item.canhan.diachiHientai}"></td></tr>
			<tr><td><b>Số điện thoại:</b></td><td class="editSwitchingInput"><p onclick="elmEdit(this)">${item.canhan.sdt}</p><input name="sdt" class="fullw hidden" onblur="elmUneditHocvien(this)" value="${item.canhan.sdt}"></td></tr>
			<tr><td><b>Email:</b></td><td class="editSwitchingInput"><p onclick="elmEdit(this)">${item.canhan.email}</p><input name="email" class="fullw hidden" onblur="elmUneditHocvien(this)" value="${item.canhan.email}"></td></tr>
			<br>
		</tbody>
	</table>
	<div class="w3-row fullw mT40p"><div class="txCenter  w3-right"> <i>Hà Nội, ngày ...... tháng ...... năm 20......</i><br><p>ĐẠI DIỆN LÃNH ĐẢO CẢNG HKQT NỘI BÀI</p></div></div>
</form>`;
;

contentForming2to7ForPrint=(item)=>
`<div class="pagebreak"> </div>
<form onsubmit="return false;"name="congviec" class="w3-row pad10p">
	<h3 class="mT40p">2. Các vị trí đã và đang làm việc</h3>
	<p>(tiếp tục từ năm 2001 đối với Sổ đã được lập và tính từ năm bắt đầu được cấp giấy phép, năng định nhân viên ANS đối với sổ mới)</p>
	<table class="fullw table-border-all padding-table mT10p">
		<thead><tr><th>STT</th><th>Thời gian</th><th>Làm việc gì, ở đâu</th><th>Ghi chú</th></tr></thead>
		<tbody><tr>${tbl2(item.congviec)}</tr></tbody>
	</table>
</form>
<div class="pagebreak"> </div>
<form onsubmit="return false;"name="coban" class="w3-row pad10p">
	<h3 class="mT40p">3. Các khóa đào tạo và huấn luyện chuyên ngành ANS</h3>
	<p>(ghi rõ tên gọi, thời gian bắt đầu và kết thúc; địa điểm đào tạo, huấn luyện; loại văn bằng, chứng chỉ được cấp)</p>
	<div class="overXAuto">
		<table class="fullw table-border-all padding-table mT10p">
			<thead><tr><th>STT</th><th>Tên khóa học</th><th>Thời gian</th><th>Cơ sở/Địa điểm đào tạo</th><th>Văn bằng/Chứng chỉ</th><th>Ghi chú</th></tr></thead>
			<tbody><tr>${tbl3print(item.coban)}</tr></tbody>
		</table>
	</div>
	<div class="txCenter">
	${tbl3Img(item.coban)}
	</div>
</form>
<div class="pagebreak"> </div>
<form onsubmit="return false;"name="taicho" class="w3-row pad10p">
	<h3 class="mT40p">4. Các khóa huấn luyện tại chỗ</h3>
	<p>(tiếp tục tính từ năm 2005 đối với Sổ đã được lập và tính từ năm 2017 đối với Sổ mới)</p>
	<div class="overXAuto">
		<table class="fullw table-border-all padding-table mT10p">
			<thead><tr><th>STT</th><th>Tên khóa học</th><th>Thời gian</th><th>Cơ sở/Địa điểm đào tạo</th><th>Kết quả</th><th>Ghi chú</th></tr></thead>
			<tbody><tr>${tbl4(item.taicho)}</tr></tbody>
		</table>
	</div>
</form>
<div class="pagebreak"> </div>
${item.taicho.length>0?detailForm4ForPrint(item.taicho,item.canhan.hoten):''}
<div class="pagebreak"> </div>
<form onsubmit="return false;"name="suco" class="w3-row pad10p">
	<h3 class="mT40p">5. Các vụ việc liên quan an toàn hoạt động bay</h3>
	<p>(tiếp tục tính từ năm 2001 đối với Sổ đã được lập và tính từ năm 2017 đối với Sổ mới)</p>
	<div class="overXAuto">
		<table class="fullw table-border-all padding-table mT10p">
			<thead><tr><th>STT</th><th>Thời gian</th><th>Nội dung</th><th>Hình thức xử lý</th></tr></thead>
			<tbody><tr>${tbl5print(item.suco)}</tr></tbody>
		</table>
	</div>
</form>
<div class="pagebreak"> </div>
<form onsubmit="return false;"name="nhanxet" class="w3-row pad10p">
	<h3 class="mT40p">6. Những nhận xét, đánh giá khác</h3>
	<div class="editSwitchingInput"><div><p>${item.nhanxet?(item.nhanxet.noidung.split('\n').join('</p><p>')):''}</p></div><textarea name="noidung" placeholder="Hãy nhập nội dung nhận xét..." class="materialize-textarea hidden" onblur="elmUneditHocvien(this)">${item.nhanxet?item.nhanxet.noidung:''}</textarea></div>
</form>
<div class="pagebreak"> </div>
<form onsubmit="return false;"name="hlvien" class="w3-row pad10p">
	<h3 class="mT40p">7. Kết quả, huấn luyện</h3>
	<p>(Dành cho Huấn luyện viên ANS)</p>
	<div class="overXAuto">
		<table class="fullw table-border-all padding-table mT10p">
			<thead><tr><th>STT</th><th>Nội dung đã được huấn luyện</th><th>Thời gian</th><th>Cơ sở/Địa điểm đào tạo</th><th>Ghi chú</th></tr></thead>
			<tbody><tr>${tbl7print(item.hlvien)}</tr></tbody>
		</table>
	</div>
</form>
<div class="pagebreak"> </div>
<form onsubmit="return false;"name="nangdinh" class="w3-row pad10p">
	<h3 class="mT40p">8. Năng định được cấp</h3>
	<div class="overXAuto">
		<table class="fullw table-border-all padding-table mT10p">
			<thead><tr><th>STT</th><th>Năng định</th><th>Thời gian thi</th><th>Ngày cấp</th><th>Hiệu lực đến</th><th>Số hiệu</th><th>Ghi chú</th></tr></thead>
			<tbody><tr>${tbl8print(item.nangdinh)}</tr></tbody>
		</table>
	</div>
	<div class="txCenter">
		${tbl8Img(item.nangdinh)}
	</div>
</form>
`;

detailForm4ForPrint=(taicho,hoten)=>{let kqKey='ketqua.chitiet';
	getDetaiElements=(r)=>{
		var course = searchForCourse(r.linked), kqChitiet=r.ketqua.chitiet; [fileId, fileName] = r.ketqua.img?r.ketqua.img.split('?'):[undefined,undefined];	
		return `<div class="pagebreak"> </div><div class="divCenter">
		<div class="mT40p mb40p pad10p">
			<div class="fullw txCenter"><h4><b>KẾT QUẢ HUẤN LUYỆN TẠI CHỖ</b></h4></div>
			<table class="fullw table-no-border inf-table">
				<tbody>
					<tr><td><b>1. Họ và tên:</b></td><td>${hoten}</td></tr>
					<tr><td><b>2. Tên khóa huấn luyện:</b></td><td>${course.thongtinchung.ten}</td></tr>
					<tr><td><b>3. Ngày/tháng/năm huấn luyện:</b></td><td>${course.thongtinchung.thoigian}</td></tr>
					<tr><td><b>4. Vị trí huấn luyện lý thuyết và thực hành:</b></td></tr>
					<tr><td><b>- Lý thuyết:</b></td><td>${course.thongtinchung.vitriLythuyet}</td></tr>
					<tr><td><b>- Thực hành:</b></td><td>${course.thongtinchung.vitriThuchanh}</td></tr>
				</tbody>
			</table>
			<div class="overXAuto">
				<table class="fullw table-border-all padding-table mT10p">
					<thead><tr><th>STT</th><th class="width30">Nội dung huấn luyện</th><th class="width25">Thời gian</th><th class="width5">Nhận xét/Đánh giá</th><th>Huấn luyện viên/giáo viên</th></tr></thead>
					<tbody><tr>${kqChitiet.map((kq,kqIdx)=>`<td><p>${kqIdx+1}</p></td><td><p>${kq.noidung}</p></td><td><p>${kq.thoigian.replace(' ','')}</p></td><td><p>${kq.danhgia}</p></td><td><p>${kq.giaovien.split('\n').join('<br>')}</p></td>`).join('</tr><tr>')}</tr></tbody>
				</table>
			</div>
			${(r.ketqua.img&&fileId)?`<div class="pagebreak"> </div><div class="txCenter">
				<div>${`<img src="https://drive.google.com/thumbnail?authuser=0&sz=w680&id=${fileId}" class="width80 mT20p">`}</div>  
			</div>`:''}
		</div></div>`};
	return taicho.map(taichoItem=>getDetaiElements(taichoItem)).join('');
}

tbl3print=(coban)=>coban.map((r,rIdx)=>`<td><p>${rIdx+1}</p></td><td><p>${r.ten}</p></td><td><p>${r.thoigian}</p></td><td><p>${r.diadiem}</p></td><td><p>${r.vanbang.ten}</p></td><td><p>${r.ghichu}</p></td>`).join('</tr><tr>')
tbl3Img=(coban)=>coban.map((r,rIdx)=>r.vanbang.img?`<div class="pagebreak"> </div><img style="max-width:800px"  src="${getViewUrl(r.vanbang.img.split('?')[0])}">`:'').join('');

tbl5print=(suco)=>suco.length?(suco.map((r,rIdx)=>`<td><p>${rIdx+1}</p></td><td><p>${r.thoigian}</p></td><td><p>${r.noidung}</p></td><td><p>${r.hinhthucXuly}</p></td>`).join('</tr><tr>')):'<td><p> </p></td><td><p>(Không có)</p></td><td><p>(Không có)</p></td><td><p>(Không có)</p></td>';

tbl7print=(hlvien)=>hlvien.length?(hlvien.map((r,rIdx)=>`<td><p>${rIdx+1}</p></td><td><p>${r.noidung}</p></td><td><p>${r.thoigian}</p></td><td><p>${r.coso}</p></td><td><p>${r.ghichu}</p></td>`).join('</tr><tr>')):'<td><p> </p></td><td><p>(Không có)</p></td><td><p>(Không có)</p></td><td><p>(Không có)</p></td><td><p>(Không có)</p></td>';

tbl8print=(nangdinh)=>nangdinh?(nangdinh.map((r,rIdx)=>`<td><p>${rIdx+1}</p></td><td><p>${r.ten}</p></td><td><p>${r.ngaythi}</p></td><td><p>${r.thoihan.tu}</p></td><td><p>${r.thoihan.den}</p></td><td><p>${r.sohieu}</p></td><td><p>${r.ghichu}</p></td>`).join('</tr><tr>')):'<td><p> </p></td><td><p>(Không có)</p></td><td><p>(Không có)</p></td><td><p>(Không có)</p></td><td><p>(Không có)</p></td><td><p>(Không có)</p></td>';
tbl8Img=(nangdinh)=>nangdinh.map((r,rIdx)=>r.img?`<div class="pagebreak"> </div><img style="max-width:800px"  src="${getViewUrl(r.img.split('?')[0])}">`:'').join('');


//todo: add detail ketqua hoc tap (done)
// todo: add ngay thang nam phe duyet (done)
// todo: add delete button cho form4 & form8 (done)


