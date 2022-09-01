	var obDulieu={};


	const DEFAULT_AVATAR = 'https://www.w3schools.com/w3css/img_avatar1.png';
	const DEFAULT_NOTEBOOK = 'https://www.w3schools.com/w3images/notebook.jpg';

	initDulieuUI=()=>{initElm(obDulieu,['e','list','plus','plusCourse'],['idMainDulieu','idMainList','idAddDulieuList','idAddDulieuKhoahocList']);}

	updateListDulieu=()=>{emptyListDulieu();mainData.filter.sidebarSearchTerm=='Courses'?addListDulieuKhoahoc():addListDulieuHocvien();}
	emptyListDulieu=()=>{Array.from(obDulieu.list.getElementsByClassName('classMainListItem')).forEach((item)=>item.remove());mainData.view.list.length = 0};

	addListDulieuKhoahoc=()=>{mainData.courseList.forEach((item,itemIdx)=>{
		if(item && Object.keys(item).length === 0 && item.constructor === Object){
			logE(null, 'CourseItem is empty, idx= '+itemIdx); setTimeout(()=>{mainData.db.deleteDB({action:'delete',type:'course',id:mainData.courseListId[itemIdx]},{});},1000*itemIdx);
		}else
			dataFilterKhoahoc(item,mainData.filter)?addItemDulieuKhoahoc(item,itemIdx):''
	})}
	addItemDulieuKhoahoc=(item,index)=>{
		let elmTags='';//tagAnalysis(item);
		// var elmDonvinhanTags = item.giaoviec.donvi.madonvi;

		let elmMainContent = `<p class="pLR7px"><h4><b>Nội dung khóa học</b></h4></p>
		<table class="fullw table-no-border">
			<thead><tr><th>STT</th><th>Nội dung</th><th>Thời gian</th><th>Giáo viên/Huấn luyện viên</th></tr></thead>
			<tbody><tr>${item.chitiet?(item.chitiet.map((ct,ctIdx)=>`<td>${ct.stt?ct.stt:(ctIdx+1)}</td><td>${ct.noidung}</td><td>${ct.thoigian?ct.thoigian:''}</td><td>${ct.giaovien}</td>`).join('</tr><tr>')):''}</tr></tbody>
		</table>`;
		
		let elmItem=`<li class="classMainListItem">
			<div class="pLR15px collapsible-header" >
				<div class="w3-cell-row">
					<div class="w3-cell m0px width70">
						<p><label><input type="checkbox" onclick="fabFuncsBasedItemChecked(this,'Course',${index})"/><span></span></label><span class="pR4px txBlack">${item.thongtinchung.ten}</span>${elmTags}</p>
					</div>
					<div class="w3-cell w3-cell-middle width15 txCenter"><p>${item.id.docId}</p></div>
					<div class="w3-cell w3-cell-middle width15 txCenter"><img src=${DEFAULT_NOTEBOOK} class="show600px padAvatar width30"></div>
				</div>
			</div>
			<div class="pLR15px collapsible-body m0px">
				<div class="w3-cell-row">
					<div class="w3-cell width75 w3-hide-medium w3-hide-large">
						${elmMainContent}
					</div>
					<div class="w3-cell width85 w3-hide-small">
						${elmMainContent}
					</div>
					<div class="w3-cell w3-cell-middle width15 txCenter"><div class="w3-button w3-theme-l1 w3-hover-theme" onclick="openNav('Course',${index})">Chi tiết >></div>
					</div>
				</div>
				<br>
			</div>
		</li>`;
		obDulieu.plus.insertAdjacentHTML('afterend',elmItem);
	}

	dataFilterKhoahoc=(item, filter)=>{
		// var canhan = item.canhan, madonvi = item.donvi.madonvi;
		analyzeSidebarSearchTerm=()=>{switch(filter.sidebarSearchTerm){
			case 'NAOC': return true;
			case 'mygroup': 
				return madonvi.indexOf(mainData.user.madonvi)>-1;
			case 'mine': return canhan.hoten==mainData.user.hoten;
			case 'TBTTDD': case 'CDD': case 'BTSD': case 'MTKB': case'VPKB': case 'CHKNS':
				return madonvi.indexOf(filter.sidebarSearchTerm)>-1;
			default: return true;}}

		// return (analyzeSidebarSearchTerm()&&(filter.mainSearchTerm.length==0?true:analyzeMainSearchTerm(item,false)));
		return true;
	}

	addListDulieuHocvien=()=>{mainData.hocvienList.forEach((item,itemIdx)=>{
		if(item && Object.keys(item).length === 0 && item.constructor === Object){
			logE(null, 'HocvienItem is empty, idx= '+itemIdx); setTimeout(()=>{mainData.db.deleteDB({action:'delete',type:'student',id:mainData.hocvienListId[itemIdx]},{});},1000*itemIdx);
		}else
			dataFilterHocvien(item,mainData.filter)?addItemDulieuHocvien(item,itemIdx):'test';
	})}
	addItemDulieuHocvien=(item,index)=>{
		//loc nhung nguoi chua co nang dinh
		// let nd = item.nangdinh; if (!nd || nd.length == 0)
		// 	return;

		//""""""""""""""""""""""""""""""""""""
		var elmTags=tagAnalysis(item);
		// var elmDonvinhanTags = item.giaoviec.donvi.madonvi;

		var elmMainContent = `<p class="pLR7px"><h4><b>Lịch sử thi gần đây</b></h4></p>
		<table class="fullw table-no-border">
			<thead><tr><th>STT</th><th>Năng định</th><th>Ngày thi</th><th>Ngày hết hạn</th></tr></thead>
			<tbody><tr>${item.nangdinh?item.nangdinh.map((nd)=>`<td>${nd.stt}</td><td>${nd.ten}</td><td>${nd.ngaythi}</td><td>${nd.thoihan.den}</td>`).join('</tr><tr>'):''}</tr></tbody>
		</table>`;
		
		
		var elmItem=`<li class="classMainListItem">
			<div class="pLR15px collapsible-header" >
				<div class="w3-cell-row">
					<div class="w3-cell m0px width70">
						<p><label><input type="checkbox" onclick="fabFuncsBasedItemChecked(this,'student',${index})"/><span></span></label><span class="pR4px txBlack">${item.canhan.hoten}</span>${elmTags}</p>
					</div>
					<div class="w3-cell w3-cell-middle width15 txCenter"><p>${item.id.maAcv}</p></div>
					<div class="w3-cell w3-cell-middle width15 txCenter"><img src=${item.canhan.img?`https://drive.google.com/thumbnail?authuser=0&sz=w100&id=${item.canhan.img.split('?')[0]}`:DEFAULT_AVATAR} class="show600px padAvatar width30"></div>
				</div>
			</div>
			<div class="pLR15px collapsible-body m0px">
				<div class="w3-cell-row">
					<div class="w3-cell width75 w3-hide-medium w3-hide-large">
						${elmMainContent}
					</div>
					<div class="w3-cell width85 w3-hide-small">
						${elmMainContent}
					</div>
					<div class="w3-cell w3-cell-middle width15 txCenter"><div class="w3-button w3-theme-l1 w3-hover-theme" onclick="openNav('student',${index})">Chi tiết >></div>
					</div>
				</div>
				<br>
			</div>
		</li>`;
		obDulieu.plus.insertAdjacentHTML('afterend',elmItem);
		mainData.view.list.push(item);
	}

	dataFilterHocvien=(item, filter)=>{
		if(!item.donvi || !item.canhan) return false;
		var canhan = item.canhan, madonvi = item.donvi.madonvi;
		logE(filter.mainSearchTerm);
		loopInAllElements=(isolatedItem,lastResult,subFunc,parentKey,parentOb)=>{var t=typeof isolatedItem;
			return (t=='string')?(lastResult||subFunc(isolatedItem,filter.mainSearchTerm,parentKey,parentOb)):(t=='array')? isolatedItem.reduce((last,k1)=>loopInAllElements(isolatedItem[k1],last,subFunc),lastResult):Object.keys(isolatedItem).reduce((last,k1)=>loopInAllElements(isolatedItem[k1],last,subFunc,parentKey?parentKey+'.'+k1:k1,isolatedItem),lastResult);
		}
		analyzeMainSearchTerm=(isolatedItem,lastResult)=>loopInAllElements(isolatedItem,lastResult,(item,searchTx)=>{return item.search(new RegExp(searchTx, "i"))>-1});
		analyzeTarget=(isolatedItem,lastResult)=>{
			if(mainData.isQueried) return true;

			var andIdx = filter.mainSearchTerm.search('&'), andClause = andIdx>-1?new RegExp(filter.mainSearchTerm.substring(andIdx+1),'i'):null;
			var filterParams = filter.mainSearchTerm.substring(filter.mainSearchTerm.search(/_đến /i) + 5,andIdx>-1?andIdx:undefined).split('/');
			var limitedDate = str2Date(filterParams);logE(andClause);logE(limitedDate);
			
			return loopInAllElements(isolatedItem,lastResult,(item,searchTx,parentKey,parentOb)=>{ //logE(parentKey+'='+item+'-check:'+(!parentKey.includes('thoihan.den')));
				if (!parentKey.includes('ten')) return false;//đến 31/12/2021
				if(!parentOb.hasOwnProperty('thoihan')) return false;
				var convDate=str2Date(parentOb.thoihan.den.split('/')); if(!convDate) return false;
				
				if(!andClause) {logE('kq:'+(convDate<=limitedDate)+'-ten:'+item); return (convDate<=limitedDate);}
				if (item.search(andClause)==-1) { return false;} logE('kq:'+(convDate<=limitedDate)+'-thoihan:'+parentOb.thoihan.den+'-item:'+item);
				return (convDate<=limitedDate);
			});
		}
		analyzeSidebarSearchTerm=()=>{switch(filter.sidebarSearchTerm){
			case 'NAOC': return true;
			case 'mygroup': 
				return madonvi.indexOf(mainData.user.madonvi)>-1;
			case 'mine': return canhan.hoten==mainData.user.hoten;
			case 'TBTTDD': case 'CDD': case 'BTSD': case 'MTKB': case'VPKB': case 'CHKNS': 
				return madonvi.indexOf(filter.sidebarSearchTerm)>-1;
			default: return true;}}

		return (analyzeSidebarSearchTerm()&&(filter.mainSearchTerm.length==0?true:(filter.mainSearchTerm.search(/_đến /i)>-1?analyzeTarget(item,false):analyzeMainSearchTerm(item,false))));
	}
	str2Date=(strSplitted)=>Date.parse(strSplitted[1]+'/'+strSplitted[0]+'/'+strSplitted[2]);

	tagAnalysis=(item)=>{
		var tempTags={}, nd = item.nangdinh;
		if(!nd||nd.length == 0) tempTags.stTuchoiYeucau="Chưa có năng định";


		if(nd && nd.length > 0) {tempTags.stTen=nd[0].ten;tempTags.stBatdau="Từ "+nd[0].thoihan.tu;tempTags.stKetthuc="Đến "+nd[0].thoihan.den;}

		item.tempTags=tempTags; // bổ sung tempTags để lọc theo tags, các tags mới: Quá hạn/Hết hạn hôm nay/Mới sẽ ko có trong tình trạng
		// logE(tempTags);
		return (Object.keys(tempTags).map((k)=>{return`<a class="w3-tag ${k} w3-round">${tempTags[k]}</a>`;})).join('<a class="pR4px">');
	}
    
    switchPlusButtonFunction=()=>{if(!obDulieu.initiated){logE(null,'Du lieu Ob is not initiated!'); return;}
    	let state=(mainData.filter.sidebarSearchTerm=='Courses');obDulieu.plusc.toggle('hidden',state);obDulieu.plusCoursec.toggle('hidden',!state);
    }

	totalCachingThoihan=()=>{let batch=db.batch();['nangdinh','giayphep','ccNgoaingu','ccDthl','ccKhac'].forEach(type=>cachingThoihan(type,batch,()=>{})); batch.commit().then(()=>{logE('totalCachingThoihan:OK')})}
	//type:nangdinh
	cachingThoihan=(type,inBatch,inCallback)=>{let batch = inBatch?inBatch:db.batch();
		mainData.hocvienList.forEach(hv=>{hv[type]?hv[type].map((nd,idx)=>{batch.set(db.collection('due').doc(hv.id.docId+'+'+type+idx),   {ten:nd.ten,idx:idx,type:type,originalDocId:hv.id.docId,thoihan:str2Date(nd.thoihan.den.split('/'))}  );}):'';  });
		inCallback?inCallback():batch.commit().then(() => { logE('cachingThoihan-'+type+':OK') });
	}
	
	queryThoihanStudent=(parsedDate,nameFilter,queryCallback)=>{
		// Date.parse('2023/10/02')
		db.collection("due").where("thoihan","<=",parsedDate).get().then((dueSnap) => {
		    var idList = [], newRegex = (nameFilter&&nameFilter.length > 0)?new RegExp(nameFilter,'i'):null;

		    dueSnap.forEach((doc) => {var ob = doc.data();   if(newRegex && ob.ten.search(newRegex)==-1) return;    idList.reduce((last,id)=>(last||ob.originalDocId==id),false)?'':idList.push(ob.originalDocId);   });
		    if(idList.length==0){  logE('queryThoihan-Empty list');   queryCallback([],[]); return;  }logE(idList);

		    db.collection('student').where('id.docId','in',idList).get().then(snap=>{//snap.forEach(doc=> logE(doc.id+' => '+doc.data()));
		    	 var c=[],d=[];snap.forEach(doc=>{c.push(doc.data());d.push(doc.id)});queryCallback(c,d);
		    })
		});
	}
	const validDate = str2Date('01/01/1990'.split('/'));
	mainSearchTrigger=(callback)=>{
		//extract date and course
		var inputTerm = mainData.filter.mainSearchTerm;
		// init Cache for Query
		if(!mainData.hocvienListCache) {mainData.hocvienListCache = mainData.hocvienList;   mainData.hocvienListCacheId = mainData.hocvienListId;}
		// if no text in search bar
		if (inputTerm.length==0) { mainData.isQueried = false; mainData.hocvienList = mainData.hocvienListCache;  mainData.hocvienListId = mainData.hocvienListCacheId;  callback();  return;}

		var andIdx = inputTerm.search('&'), andClause = andIdx>-1?inputTerm.substring(andIdx+1):null;
		var toIdx = inputTerm.search(/_đến /i), filterParams = inputTerm.substring(toIdx + 5,andIdx>-1?andIdx:undefined).split('/');
		// if no special code is detected, run the code as usual
		if(toIdx == -1) {mainData.isQueried = false; callback(); return;}
		try{
			var limitedDate = str2Date(filterParams);//logE(andClause);logE(limitedDate);	
			if(limitedDate < validDate) { logE('invalide date: '+ inputTerm); return;}
		}catch(e){
			logE(null,e); return;
		}
		var type=(mainData.filter.sidebarSearchTerm=='Courses')?'course':'student';
		
		//query
		queryThoihanStudent(limitedDate,andClause,(list,idList)=>{// exchange main for cache
			logE(list);
			mainData.isQueried = true; mainData.hocvienList=list;mainData.hocvienListId=idList; callback();
		});
	}