	var obSidebar = {data:[
		{n:'Thông dụng',i:['Thông tin của tôi','DS học viên trong đội của tôi','DS học viên toàn trung tâm'],c:['mine','mygroup','NAOC']},
		{n:'Đơn vị',i:['Đội Thiết bị thông tin dẫn đường','Đội Thiết bị cơ điện đèn sân bay','Đội Bảo trì sân đường','Đội Môi trường khu bay','Văn phòng','Đội Quản lý Cảng hàng không Nà Sản'],c:['TBTTDD','CDD','BTSD','MTKB','VPKB','CHKNS']},
		{n:'Bổ sung',i:['Quản lý Khóa học'],c:['Courses']}],active:{g:0,i:0}};

	const domKList=['idSidebar','idSidebarSearch','idSidebarUserPanel','idSidebarContent','idUserName','idUserSubName',
									'idSignedInEmail','idDonvi','idUserImg'];
	const objKList=['e','search','userEl','c','userName','userSubName','userSignedInEmail','userDonvi','userImg'];
	initSideBar=()=>{
		initElm(obSidebar,objKList,domKList);obSidebar.initData=obSidebar.data;
		obSidebar.gr=obSidebar.e.getElementsByClassName('sidebarGroup');sidebarPopulateContent();
		setUserInf();sidebarItemClick(obSidebar.active);
	};

    backupSidebarData=()=>{obSidebar.origin=JSON.parse(JSON.stringify(obSidebar.data))}
    restoreSidebarData=()=>{obSidebar.data=JSON.parse(JSON.stringify(obSidebar.origin))}
    getInitSidebarData=()=>JSON.parse(JSON.stringify(obSidebar.initData));
        
	const userObjKlist=['userName','userSubName','userSignedInEmail','userDonvi'];
	const userDataKlist=['hoten','tenkhac','email','donvi'];
	setUserInf=()=>{userObjKlist.map((k,ind)=>{obSidebar[k].innerHTML=mainData.user[userDataKlist[ind]]});setUserImg();}
	setUserImg=()=>{obSidebar.userImg.src=(mainData.user.img==undefined||mainData.user.img=='')?'https://www.w3schools.com/w3css/img_avatar1.png':mainData.user.img};

	getSidebarSize=()=>{var vw=obView.vw();return vw>1267?'25%':(vw<431?'80%':vw<636?'70%':vw<800?'50%':vw<1065?'40%':'30%');}
	setSidebarcontentHeight=()=>{obSidebar.cs.maxHeight=(obView.vh()-(obSidebar.search.offsetHeight+obSidebar.userEl.offsetHeight))+'px'};

	const NoLegend=1;
    sidebarOpen=()=>{obMain.es.marginLeft=getSidebarSize();obSidebar.es.display="block";setSidebarcontentHeight();mainElmsHideOnSmall();obSidebar.state=1;}
    sidebarClose=()=>{obMain.es.marginLeft = "0%";obSidebar.es.display="none";mainElmsUnhideOnSmall();obSidebar.state=0;}
    sidebarToggle=()=>{obSidebar.state==1?sidebarClose():sidebarOpen();}
    sidebarResize=()=>{obSidebar.state==1?sidebarOpen():null;}

    getSbArrBtn=(gIndex)=>{return obSidebar.gr[gIndex].children[0].children[0].classList;}
    getSbGroupElm=(gIndex)=>{return obSidebar.gr[gIndex].nextElementSibling}
    getSbItem=(gIndex,iIndex)=>{return getSbGroupElm(gIndex).children[iIndex]}

    const aDown='fa-angle-down', aRight='fa-angle-right';
    sidebarGroupOpen=(p)=>{getSbGroupElm(p.g).style.display='block';var arrCl=getSbArrBtn(p.g);arrCl.remove(aRight);arrCl.add(aDown);}
    sidebarGroupClose=(p)=>{getSbGroupElm(p.g).style.display='none';var arrCl=getSbArrBtn(p.g);arrCl.remove(aDown);arrCl.add(aRight);}
    sidebarGroupToggle=(p)=>{(getSbGroupElm(p.g).style.display=='block')?sidebarGroupClose(p):sidebarGroupOpen(p);}

    const itSelectedCl='w3-panel w3-leftbar w3-border-theme w3-grey w3-text-white';
    const itNormalCl='w3-hover-theme';
    isParamEqual=(p1,p2)=>(p1.g==p2.g&&p1.i==p2.i);

    setSidebarItemClicked=(param)=>{
    	var selectedElmCl = (!obSidebar.active||isParamEqual(obSidebar.active,param))?null:getSbItem(obSidebar.active.g,obSidebar.active.i).classList;
    	obSidebar.active = param;sidebarGroupOpen(param);var newElmCl=getSbItem(param.g,param.i).classList;
    	itSelectedCl.split(' ').map((cl)=>{newElmCl.add(cl);selectedElmCl?selectedElmCl.remove(cl):''});
    	itNormalCl.split(' ').map((cl)=>{newElmCl.remove(cl);selectedElmCl?selectedElmCl.add(cl):''});
    }

    sidebarItemClick=(param)=>{setSidebarItemClicked(param);logF(mainPopulateContent,param);logF(initAutoList);logF(initAutoQuyenxemcongviec);logF(switchPlusButtonFunction);
    	logF(onInitUploadEvent,'.fileUpload');};

    sidebarSearch=(p)=>{
    	var searchVal=p.elm.value.toUpperCase();
    	if(searchVal.length==0) {logF(restoreSidebarData);sidebarPopulateContent();setSidebarItemClicked(obSidebar.active);}
    	else{obSidebar.data=obSidebar.origin.map(gr=>{var out={n:gr.n,i:[],c:[]};
    		gr.i.map((item,idx)=>{if(item.toUpperCase().search(searchVal)>-1){out.i.push(item);out.c.push(gr.c[idx])}}); return out;});sidebarPopulateContent();
    		obSidebar.data.forEach((gr,grIdx)=>{if(gr.i.length>0) sidebarGroupOpen({g:grIdx})});
    	}
    }
    sidebarPopulateContent=()=>{
    	var gName='';
    	obSidebar.data.map((group,gIndex)=>{
    		gName+=`<div class="w3-bar-item sidebarGroup txBold" style="padding: 5px 8px;color:#656768" onclick="logF(sidebarGroupToggle,{g:${gIndex}})" ><div class="w3-col" style="width:15px"><i class="fa fa-angle-right w3-large"></i></div> ${group.n}</div><div class="${group.show?'':'hidden'}">`;
    		group.i.map((item,iIndex)=>{
    			gName+=`<b class="w3-bar-item w3-container w3-hover-theme idSidebarItem" style="margin: 2px 0px;padding:4px 10px;padding-left: 40px;color: #929495" onclick="logF(sidebarItemClick,{g:${gIndex},i:${iIndex}})">${item}</b>`;
    		});
    		gName+='</div>';
    	});
    	obSidebar.c.innerHTML=gName;
    }

